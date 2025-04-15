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
import { CartItem, OrganizationDetails } from '../types/cart';

interface PurchaseConfirmationEmailProps {
  organizationDetails: OrganizationDetails;
  items: CartItem[];
  total: number;
  temporaryPassword?: string;
}

export const PurchaseConfirmationEmail = ({
  organizationDetails,
  items,
  total,
  temporaryPassword,
}: PurchaseConfirmationEmailProps) => {
  const previewText = `Thank you for your purchase at FMT Software Solutions`;
  const isNewOrganization = !!temporaryPassword;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Purchase Confirmation</Heading>
          <Text style={text}>Dear {organizationDetails.organizationName},</Text>
          <Text style={text}>
            Thank you for your purchase at FMT Software Solutions. Below are
            your order details
            {isNewOrganization ? ' and login credentials' : ''}.
          </Text>

          <Section style={section}>
            <Heading style={h2}>Order Summary</Heading>
            {items.map((item) => (
              <div key={item.productId} style={orderItemStyle}>
                <Text style={orderItem}>
                  {item.product.title} x {item.quantity} - GHS{' '}
                  {(item.product.price * item.quantity).toFixed(2)}
                </Text>
                {item.product.downloadUrl && (
                  <Text style={linkText}>
                    <Link href={item.product.downloadUrl} style={link}>
                      Download App
                    </Link>
                  </Text>
                )}
                {item.product.webAppUrl && (
                  <Text style={linkText}>
                    <Link href={item.product.webAppUrl} style={link}>
                      Access Web App
                    </Link>
                  </Text>
                )}
              </div>
            ))}
            <Hr style={hr} />
            <Text style={total as any}>Total: GHS {total.toFixed(2)}</Text>
          </Section>

          {isNewOrganization && (
            <Section style={section}>
              <Heading style={h2}>Your Login Credentials</Heading>
              <Text style={text}>
                Email: {organizationDetails.organizationEmail}
                <br />
                Temporary Password: {temporaryPassword}
              </Text>
              <Text style={text}>
                Please change your password after your first login for security
                purposes.
              </Text>
            </Section>
          )}

          <Section style={section}>
            <Heading style={h2}>Next Steps</Heading>
            <Text style={text}>
              {isNewOrganization ? (
                <>
                  1. Check the app access links above for each product
                  <br />
                  2. Log in with your credentials
                  <br />
                  3. Change your temporary password for security
                </>
              ) : (
                <>
                  1. Check the app access links above for each product
                  <br />
                  2. Log in with your existing account credentials
                </>
              )}
            </Text>
          </Section>

          <Text style={text}>
            If you have any questions or need assistance, please don't hesitate
            to contact our support team.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            FMT Software Solutions
            <br />
            Ghana's Leading Software Solutions Provider
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

const orderItemStyle = {
  marginBottom: '16px',
  padding: '12px',
  backgroundColor: '#f9f9f9',
  borderRadius: '4px',
};

const orderItem = {
  color: '#4a4a4a',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
};

const linkText = {
  margin: '4px 0',
  fontSize: '14px',
};

const total = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '16px 0',
};

const link = {
  color: '#0070f3',
  textDecoration: 'underline',
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
