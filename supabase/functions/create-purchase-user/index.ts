import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import * as Resend from 'https://esm.sh/resend@3.2.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Helper function to log errors
const logError = (phase: string, error: any) => {
  console.error(
    JSON.stringify({
      phase,
      error: error.message,
      details: error.details || error,
      timestamp: new Date().toISOString(),
    })
  );
};

// Helper function to generate a password
function generatePassword(length = 12): string {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const resend = new Resend.Resend(Deno.env.get('RESEND_API_KEY') ?? '');

    const body = await req.json();

    const { organizationId, organizationDetails, items, total } = body;

    // Validate required fields
    if (!organizationId || !organizationDetails?.organizationEmail) {
      throw new Error(
        `Missing required fields: ${JSON.stringify({
          hasOrgId: !!organizationId,
          hasOrgEmail: !!organizationDetails?.organizationEmail,
        })}`
      );
    }

    // Generate a secure temporary password
    const temporaryPassword = generatePassword(12);

    // 1. Create auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: organizationDetails.organizationEmail,
        password: temporaryPassword,
        email_confirm: true,
      });

    if (authError) {
      logError('auth_error', authError);
      throw new Error(`Auth error: ${authError.message}`);
    }

    if (!authData.user) {
      logError('auth_no_user', new Error('No user data returned'));
      throw new Error('Failed to create user: No user data returned');
    }

    try {
      // 2. Create user profile
      const { error: profileError } = await supabaseAdmin.from('users').insert({
        id: authData.user.id,
        email: organizationDetails.organizationEmail,
        isFirstLogin: true,
        passwordUpdated: false,
        emailVerified: true,
        status: 'active',
      });

      if (profileError) {
        logError('profile_error', profileError);
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Profile error: ${profileError.message}`);
      }

      // 3. Add organization admin with owner role
      const { error: adminError } = await supabaseAdmin
        .from('organization_admins')
        .insert({
          organization_id: organizationId,
          user_id: authData.user.id,
          role: 'owner',
          status: 'active',
          joinedAt: new Date().toISOString(),
        });

      if (adminError) {
        logError('admin_error', adminError);
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Organization admin error: ${adminError.message}`);
      }

      // 4. Send email with login details and app information
      try {
        // Send email with Resend
        const emailData = {
          from: 'FMT Software Solutions <noreply@fmtsoftware.com>',
          to: organizationDetails.organizationEmail,
          subject: 'Your FMT Software Purchase & Account Details',
          html: generateEmailHTML(
            organizationDetails,
            items,
            total,
            temporaryPassword
          ),
        };

        await resend.emails.send(emailData);
      } catch (emailError) {
        // Log email error but don't fail the function
        logError('email_error', emailError);
        console.error('Failed to send email but user was created successfully');
      }

      return new Response(
        JSON.stringify({
          success: true,
          user: {
            id: authData.user.id,
            email: authData.user.email,
          },
          temporaryPassword,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (error) {
      // Clean up auth user if any subsequent step fails
      console.error('Error in user creation process, cleaning up auth user');
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
  } catch (error: any) {
    logError('final_error', error);
    console.error(
      'Function failed with error:',
      error.message || 'Unknown error'
    );
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred',
        details: error.details || null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

// Generate email HTML since we can't use React email components in Deno
function generateEmailHTML(
  organizationDetails: any,
  items: any[],
  total: number,
  temporaryPassword: string
) {
  // Generate app list HTML
  const itemsHTML = items
    .map(
      (item) => `
    <div style="margin-bottom: 16px; padding: 12px; background-color: #f9f9f9; border-radius: 4px;">
      <p style="color: #4a4a4a; font-size: 14px; line-height: 1.5; margin: 0 0 8px 0;">${item.product.title} x ${item.quantity} - GHS ${(item.product.price * item.quantity).toFixed(2)}</p>
      ${item.product.downloadUrl ? `<p style="margin: 4px 0; font-size: 14px;"><a href="${item.product.downloadUrl}" style="color: #0070f3; text-decoration: underline;">Download App</a></p>` : ''}
      ${item.product.webAppUrl ? `<p style="margin: 4px 0; font-size: 14px;"><a href="${item.product.webAppUrl}" style="color: #0070f3; text-decoration: underline;">Access Web App</a></p>` : ''}
    </div>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Purchase Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; color: #333; background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; line-height: 1.25; margin-bottom: 24px;">Purchase Confirmation</h1>
        </div>
        
        <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">Dear ${organizationDetails.organizationName},</p>
        
        <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">Thank you for your purchase at FMT Software Solutions. Below are your order details and login credentials.</p>
        
        <div style="margin-bottom: 32px;">
          <h2 style="color: #1a1a1a; font-size: 20px; font-weight: 600; line-height: 1.25; margin-bottom: 16px;">Order Summary</h2>
          ${itemsHTML}
          <hr style="border: 0; border-top: 1px solid #e6e6e6; margin: 20px 0;">
          <p style="color: #1a1a1a; font-size: 18px; font-weight: 600; margin: 16px 0;">Total: GHS ${total.toFixed(2)}</p>
        </div>
        
        <div style="margin-bottom: 32px;">
          <h2 style="color: #1a1a1a; font-size: 20px; font-weight: 600; line-height: 1.25; margin-bottom: 16px;">Your Login Credentials</h2>
          <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
            Email: ${organizationDetails.organizationEmail}<br>
            Temporary Password: ${temporaryPassword}
          </p>
          <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
            Please change your password after your first login for security purposes.
          </p>
        </div>
        
        <div style="margin-bottom: 32px;">
          <h2 style="color: #1a1a1a; font-size: 20px; font-weight: 600; line-height: 1.25; margin-bottom: 16px;">Next Steps</h2>
          <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
            1. Check the app access links above for each product<br>
            2. Log in with your credentials<br>
            3. Change your temporary password for security
          </p>
        </div>
        
        <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <hr style="border: 0; border-top: 1px solid #e6e6e6; margin: 20px 0;">
        
        <p style="color: #666666; font-size: 14px; line-height: 1.5; text-align: center; margin-top: 32px;">
          FMT Software Solutions<br>
          Ghana's Leading Software Solutions Provider
        </p>
      </body>
    </html>
  `;
}
