import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface NewsletterWelcomeEmailProps {
  email: string;
  unsubscribeUrl: string;
}

export const NewsletterWelcomeEmail = ({
  email,
  unsubscribeUrl,
}: NewsletterWelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the FMT Software Solutions Newsletter!</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>Welcome to Our Newsletter!</Heading>
          <Section style={sectionStyle}>
            <Text style={textStyle}>
              Thank you for subscribing to the FMT Software Solutions
              newsletter. We're excited to keep you updated on our latest
              projects, custom software solutions, and upcoming training
              programs and events.
            </Text>
            <Text style={textStyle}>
              You'll receive updates directly to {email}.
            </Text>
            <Text style={textStyle}>
              If you ever want to unsubscribe, you can do so by clicking the
              link below:
            </Text>
            <Link href={unsubscribeUrl} style={linkStyle}>
              Unsubscribe from newsletter
            </Link>
          </Section>
          <Text style={footerStyle}>
            © {new Date().getFullYear()} FMT Software Solutions. All rights
            reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const bodyStyle = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const containerStyle = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const headingStyle = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const sectionStyle = {
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
};

const textStyle = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '20px',
};

const linkStyle = {
  color: '#5c6ac4',
  textDecoration: 'underline',
  display: 'block',
  marginTop: '20px',
  marginBottom: '20px',
};

const footerStyle = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '20px',
  textAlign: 'center' as const,
};

export default NewsletterWelcomeEmail;
