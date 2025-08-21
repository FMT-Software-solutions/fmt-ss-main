import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface AppProvisioningConfirmationEmailProps {
  organizationName: string;
  organizationEmail: string;
  appName: string;
  userEmail: string;
  temporaryPassword: string;
  webAppUrl?: string;
  platforms?: {
    desktop?: {
      windows?: string;
      macos?: string;
      linux?: string;
    };
    mobile?: {
      android?: string;
      ios?: string;
    };
    web?: {
      url?: string;
    };
  };
}

export const AppProvisioningConfirmationEmail = ({
  organizationName,
  organizationEmail,
  appName,
  userEmail,
  temporaryPassword,
  webAppUrl,
  platforms,
}: AppProvisioningConfirmationEmailProps) => {
  const previewText = `Your ${appName} app has been successfully provisioned`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>App Provisioning Complete</Heading>
          <Text style={text}>Dear {organizationName},</Text>
          <Text style={text}>
            Great news! Your <strong>{appName}</strong> application has been
            successfully provisioned and is ready for use.
          </Text>

          <Section style={section}>
            <Heading style={h2}>Your Login Credentials</Heading>
            <div style={credentialsBox}>
              <Text style={credentialItem}>
                <strong>Email:</strong> {userEmail}
              </Text>
              <Text style={credentialItem}>
                <strong>Temporary Password:</strong> {temporaryPassword}
              </Text>
            </div>
            <Text style={warningText}>
              <strong>Important:</strong> Please change your password after your
              first login for security purposes.
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>Access Your Application</Heading>
            {webAppUrl && (
              <Text style={linkText}>
                <Link href={webAppUrl} style={link}>
                  Access {appName} Web Application
                </Link>
              </Text>
            )}
            
            {platforms?.web?.url && (
              <Text style={linkText}>
                <Link href={platforms.web.url} style={link}>
                  Open Web App
                </Link>
              </Text>
            )}
            
            {/* Desktop Downloads */}
            {(platforms?.desktop?.windows || platforms?.desktop?.macos || platforms?.desktop?.linux) && (
              <div>
                <Text style={text}><strong>Desktop Downloads:</strong></Text>
                
                {platforms?.desktop?.windows && (
                  <Text style={linkText}>
                    <Link href={platforms.desktop.windows} style={link}>
                      Download for Windows
                    </Link>
                  </Text>
                )}
                
                {platforms?.desktop?.macos && (
                  <Text style={linkText}>
                    <Link href={platforms.desktop.macos} style={link}>
                      Download for macOS
                    </Link>
                  </Text>
                )}
                
                {platforms?.desktop?.linux && (
                  <Text style={linkText}>
                    <Link href={platforms.desktop.linux} style={link}>
                      Download for Linux
                    </Link>
                  </Text>
                )}
              </div>
            )}
            
            {/* Mobile Downloads */}
            {(platforms?.mobile?.android || platforms?.mobile?.ios) && (
              <div>
                <Text style={text}><strong>Mobile Downloads:</strong></Text>
                
                {platforms?.mobile?.android && (
                  <Text style={linkText}>
                    <Link href={platforms.mobile.android} style={link}>
                      Download for Android
                    </Link>
                  </Text>
                )}
                
                {platforms?.mobile?.ios && (
                  <Text style={linkText}>
                    <Link href={platforms.mobile.ios} style={link}>
                      Download for iOS
                    </Link>
                  </Text>
                )}
              </div>
            )}
          </Section>

          <Section style={section}>
            <Heading style={h2}>Next Steps</Heading>
            <Text style={text}>
              1. Click on the access link above to open your application
              <br />
              2. Log in using the credentials provided
              <br />
              3. Change your temporary password immediately
              <br />
              4. Complete your organization profile setup
              <br />
              5. Start using your new {appName} application!
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>Need Help?</Heading>
            <Text style={text}>
              If you encounter any issues during setup or have questions about
              using {appName}, our support team is here to help:
            </Text>
            <Text style={text}>
              Email: support@fmtsoftware.com
              <br />
              Phone: +233 (0) 530 516 908
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            FMT Software Solutions
            <br />
            Ghana's Leading Software Solutions Provider
            <br />
            This email was sent to {organizationEmail}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '16px',
};

const text = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '16px',
};

const section = {
  marginBottom: '32px',
};

const credentialsBox = {
  backgroundColor: '#f8f9fa',
  border: '2px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
};

const credentialItem = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '8px 0',
  fontFamily: 'monospace',
};

const warningText = {
  color: '#d63384',
  fontSize: '14px',
  lineHeight: '1.5',
  marginBottom: '16px',
  padding: '12px',
  backgroundColor: '#f8d7da',
  border: '1px solid #f5c2c7',
  borderRadius: '4px',
};

const linkText = {
  margin: '12px 0',
  fontSize: '16px',
};

const link = {
  color: '#0070f3',
  textDecoration: 'underline',
  fontWeight: '500',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  marginTop: '32px',
};
