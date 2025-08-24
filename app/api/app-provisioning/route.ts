import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AppProvisioningConfirmationEmail } from '@/app/store/emails/AppProvisioningConfirmation';
import { issuesServer } from '@/services/issues/server';
import { IPlatformAvailability } from '@/types/premium-app';

const resend = new Resend(process.env.RESEND_API_KEY);


interface ProvisionDetails {
  id: string;
  name: string;
  userEmail: string;
  useSameEmailAsAdmin: boolean;
  edgeFunctionName: string;
  supabaseAnonKey: string;
  supabaseUrl: string;
  webAppUrl?: string;
  downloadUrl?: string;
  platforms?: IPlatformAvailability;
}

interface AppProvisioningDetails {
  [key: string]: ProvisionDetails;
}

interface ProvisioningResult {
  productId: string;
  success: boolean;
  data?: any;
  error?: string;
  emailSent?: boolean;
  emailError?: string;
  userPassword?: string;
  date?: string;
}

interface EmailConfirmationDetails {
  appId: string;
  appName: string;
  emailSent: boolean;
  emailSentAt?: string;
  emailError?: string;
}

const generateTemporalPassword = () => {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  
  // Ensure at least one number and one letter
  password += charset.substring(52, 62).charAt(Math.floor(Math.random() * 10)); // Add a number
  password += charset.substring(0, 52).charAt(Math.floor(Math.random() * 52)); // Add a letter
  
  // Fill the rest randomly
  for (let i = 2; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Helper function to send provisioning confirmation email
async function sendProvisioningEmail(
  organizationName: string,
  organizationEmail: string,
  appName: string,
  userEmail: string,
  temporaryPassword: string,
  platforms?: ProvisionDetails['platforms']
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: 'FMT Software Solutions <provisioning@fmtsoftware.com>',
      to: organizationEmail,
      subject: `${appName} - Purchase Complete`,
      react: AppProvisioningConfirmationEmail({
        organizationName,
        organizationEmail,
        appName,
        userEmail,
        temporaryPassword,
        platforms,
      }),
    });
    return { success: true };
  } catch (error) {
    console.error(`Email sending error for ${appName}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown email error';
    // Log email error
    await issuesServer.logEmailError(
      errorMessage,
      'sendProvisioningEmail',
      organizationEmail,
      undefined, // organizationId
      undefined, // purchaseId
      { appName, userEmail, error: errorMessage }
    );
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Helper function to update purchases table with email confirmation details
async function updatePurchaseEmailDetails(
  organizationId: string,
  emailDetails: EmailConfirmationDetails[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('purchases')
      .update({
        confirmation_email_details: emailDetails,
        updated_at: new Date().toISOString()
      })
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Database update error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Database update exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}

// Helper function to validate provisioning details
function validateProvisioningDetails(
  organizationId: string,
  billingDetails: any,
  appProvisioningDetails: any
): { isValid: boolean; error?: string } {
  if (!organizationId || typeof organizationId !== 'string') {
    return { isValid: false, error: 'Invalid or missing organizationId' };
  }

  if (!billingDetails) {
    return { isValid: false, error: 'Missing billingDetails' };
  }

  const requiredBillingFields = ['organizationName', 'organizationEmail', 'phoneNumber', 'address'];
  for (const field of requiredBillingFields) {
    if (!billingDetails[field]) {
      return { isValid: false, error: `Missing required billing field: ${field}` };
    }
  }

  if (!billingDetails.address.street || !billingDetails.address.city || 
      !billingDetails.address.state || !billingDetails.address.country) {
    return { isValid: false, error: 'Incomplete billing address information' };
  }

  if (!appProvisioningDetails || typeof appProvisioningDetails !== 'object') {
    return { isValid: false, error: 'Invalid or missing appProvisioningDetails' };
  }

  if (Object.keys(appProvisioningDetails).length === 0) {
    return { isValid: false, error: 'No apps to provision' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(billingDetails.organizationEmail)) {
    return { isValid: false, error: 'Invalid organization email format' };
  }

  return { isValid: true };
}

// Helper function to validate individual app details
function validateAppDetails(productId: string, appDetails: ProvisionDetails): { isValid: boolean; error?: string } {
  const requiredFields = ['id', 'name', 'edgeFunctionName', 'supabaseUrl', 'supabaseAnonKey'];
  
  for (const field of requiredFields) {
    if (!appDetails[field as keyof ProvisionDetails]) {
      return { isValid: false, error: `Missing required field '${field}' for app ${productId}` };
    }
  }

  // Validate Supabase URL format
  try {
    const url = new URL(appDetails.supabaseUrl);
    if (!url.hostname.includes('supabase.co')) {
      return { isValid: false, error: `Invalid Supabase URL format for app ${productId}` };
    }
  } catch {
    return { isValid: false, error: `Invalid Supabase URL for app ${productId}` };
  }

  // Validate user email if provided and not using admin email
  if (!appDetails.useSameEmailAsAdmin && appDetails.userEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(appDetails.userEmail)) {
      return { isValid: false, error: `Invalid user email format for app ${productId}` };
    }
  }

  return { isValid: true };
}

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      // Log JSON parsing error
      await issuesServer.logApiError(
        'Invalid JSON in request body',
        'app-provisioning',
        'POST',
        { parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error' }
      );
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JSON in request body',
          details: 'Please ensure the request body contains valid JSON'
        },
        { status: 400 }
      );
    }

    const { organizationId, billingDetails, appProvisioningDetails } = requestBody;
    
    // Comprehensive input validation
    const validation = validateProvisioningDetails(organizationId, billingDetails, appProvisioningDetails);
    if (!validation.isValid) {
      // Log validation error
      await issuesServer.logApiError(
        'Request validation failed',
        'app-provisioning',
        'POST',
        { validationError: validation.error, organizationId, requestBody }
      );
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed',
          details: validation.error
        },
        { status: 400 }
      );
    }

    // Create promises for parallel processing
    const provisioningPromises = Object.entries(appProvisioningDetails as AppProvisioningDetails)
      .map(async ([productId, appDetails]): Promise<ProvisioningResult> => {
        try {
          // Validate individual app details
          const appValidation = validateAppDetails(productId, appDetails);
          if (!appValidation.isValid) {
            // Log app validation error
            await issuesServer.logApiError(
              'App validation failed',
              'app-provisioning',
              'POST',
              { productId, appValidation: appValidation.error, appDetails }
            );
            return {
              productId,
              success: false,
              error: appValidation.error!,
              emailSent: false
            };
          }


          // Generate temporal password for user
          const userPassword = generateTemporalPassword();
          const userEmail = appDetails.useSameEmailAsAdmin || (!appDetails.useSameEmailAsAdmin && !appDetails.userEmail) || (!appDetails.useSameEmailAsAdmin && appDetails.userEmail?.trim() === '') ? billingDetails.organizationEmail : appDetails.userEmail;

          // Validate final user email
          if (!userEmail) {
            return {
              productId,
              success: false,
              error: 'No user email specified and useSameEmailAsAdmin is false',
              emailSent: false
            };
          }

          // Prepare data for edge function
          const provisioningData = {
            organizationDetails: {
              id: organizationId,
              name: billingDetails.organizationName,
              email: billingDetails.organizationEmail,
              phone: billingDetails.phoneNumber,
              address: `${billingDetails.address.street}, ${billingDetails.address.city}, ${billingDetails.address.state}, ${billingDetails.address.country}`
            },
            userDetails: {
              firstName: 'Admin',
              lastName: 'User',
              email: userEmail,
              password: userPassword,
            },
            productId,
            appName: appDetails.name,
            provisioningSecret: process.env.PROVISIONING_SECRET,
          };

          // Call the edge function for this app using direct HTTP request
          let edgeFunctionResult;
          try {
            const response = await fetch(`${appDetails.supabaseUrl}/functions/v1/${appDetails.edgeFunctionName}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${appDetails.supabaseAnonKey}`,
                'apikey': appDetails.supabaseAnonKey
              },
              body: JSON.stringify(provisioningData)
            });

            const responseText = await response.text();
            let responseData;
            
            try {
              responseData = JSON.parse(responseText);
            } catch {
              responseData = responseText;
            }

            if (!response.ok) {
              console.error(`Edge function HTTP error for ${productId}:`, {
                status: response.status,
                statusText: response.statusText,
                responseData
              });
              // Log edge function HTTP error
              await issuesServer.logApiError(
                'Edge function HTTP request failed',
                'app-provisioning',
                'POST',
                { 
                  productId, 
                  edgeFunctionName: appDetails.edgeFunctionName, 
                  httpStatus: response.status,
                  httpStatusText: response.statusText,
                  responseData,
                  provisioningData 
                }
              );
              return {
                productId,
                success: false,
                error: `Edge function HTTP request failed: ${response.status} ${response.statusText} - ${JSON.stringify(responseData)}`,
                emailSent: false
              };
            }

            edgeFunctionResult = { data: responseData, error: null };
          } catch (invokeError) {
            console.error(`Edge function invocation error for ${productId}:`, invokeError);
            // Log edge function invocation error
            await issuesServer.logApiError(
              'Edge function invocation failed',
              'app-provisioning',
              'POST',
              { productId, edgeFunctionName: appDetails.edgeFunctionName, invokeError: invokeError instanceof Error ? invokeError.message : 'Unknown error', provisioningData }
            );
            return {
              productId,
              success: false,
              error: `Edge function invocation failed: ${invokeError instanceof Error ? invokeError.message : 'Unknown error'}`,
              emailSent: false
            };
          }

          // Send confirmation email
          const emailResult = await sendProvisioningEmail(
            billingDetails.organizationName,
            billingDetails.organizationEmail,
            appDetails.name,
            userEmail,
            userPassword,
            appDetails.platforms
          );

          return {
            productId,
            success: true,
            data: edgeFunctionResult.data,
            emailSent: emailResult.success,
            emailError: emailResult.error,
            userPassword, // Include for database logging
            date: new Date().toISOString(),
          };

        } catch (appError) {
          console.error(`App provisioning error for ${productId}:`, appError);
          // Log unexpected app provisioning error
          await issuesServer.logApiError(
            'Unexpected app provisioning error',
            'app-provisioning',
            'POST',
            { productId, appError: appError instanceof Error ? appError.message : 'Unknown error', appDetails }
          );
          return {
            productId,
            success: false,
            error: `Unexpected error during app provisioning: ${appError instanceof Error ? appError.message : 'Unknown error'}`,
            emailSent: false
          };
        }
      });

    // Execute all provisioning operations in parallel
    let results: ProvisioningResult[];
    try {
      results = await Promise.all(provisioningPromises);
    } catch (parallelError) {
      console.error('Parallel processing error:', parallelError);
      // Log parallel processing error
      await issuesServer.logApiError(
        'Parallel processing failed',
        'app-provisioning',
        'POST',
        { parallelError: parallelError instanceof Error ? parallelError.message : 'Unknown parallel processing error', organizationId, appCount: Object.keys(appProvisioningDetails).length }
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process app provisioning requests',
          details: parallelError instanceof Error ? parallelError.message : 'Unknown parallel processing error'
        },
        { status: 500 }
      );
    }

    // Prepare email confirmation details for database update
    const emailConfirmationDetails: EmailConfirmationDetails[] = results.map(result => ({
      appId: result.productId,
      appName: appProvisioningDetails[result.productId]?.name || 'Unknown App',
      emailSent: result.emailSent || false,
      emailSentAt: result.emailSent ? new Date().toISOString() : undefined,
      emailError: result.emailError
    }));

    // Update purchases table with email confirmation details
    const dbUpdateResult = await updatePurchaseEmailDetails(organizationId, emailConfirmationDetails);
    if (!dbUpdateResult.success) {
      console.error('Failed to update purchase email details:', dbUpdateResult.error);
      // Log database update error
      await issuesServer.logDatabaseError(
        'Failed to update purchase email details',
        'app-provisioning POST',
        'purchases', // table
        undefined, // query
        { organizationId, emailConfirmationDetails, dbUpdateError: dbUpdateResult.error }
      );
      // Don't fail the entire request for database update issues, but log it
    }

    // Separate successful and failed results
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    // Prepare response
    const response = {
      success: failed.length === 0,
      results: successful.map(r => ({
        productId: r.productId,
        success: r.success,
        data: r.data,
        emailSent: r.emailSent
      })),
      errors: failed.map(r => ({
        productId: r.productId,
        error: r.error!,
        emailSent: r.emailSent
      })),
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
        emailsSent: results.filter(r => r.emailSent).length,
        emailsFailed: results.filter(r => r.emailSent === false).length
      },
      databaseUpdate: {
        success: dbUpdateResult.success,
        error: dbUpdateResult.error
      }
    };

    // Determine appropriate status code
    let statusCode = 200;
    if (failed.length > 0 && successful.length > 0) {
      statusCode = 207; // Multi-Status for partial success
    } else if (failed.length > 0) {
      statusCode = 422; // Unprocessable Entity for complete failure
    }

    return NextResponse.json(response, { status: statusCode });
    
  } catch (error) {
    console.error('App provisioning API error:', error);
    // Log general API error
    await issuesServer.logApiError(
      'Internal server error during app provisioning',
      'app-provisioning',
      'POST',
      { error: error instanceof Error ? error.message : 'Unknown server error', stack: error instanceof Error ? error.stack : undefined }
    );
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error during app provisioning',
        details: error instanceof Error ? error.message : 'Unknown server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}