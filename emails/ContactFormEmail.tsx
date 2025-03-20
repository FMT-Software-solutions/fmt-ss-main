import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

export const ContactFormEmail = ({
  name,
  email,
  message,
}: ContactFormEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission from {name}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>New Contact Form Submission</Heading>
          <Section style={sectionStyle}>
            <Text style={labelStyle}>From:</Text>
            <Text style={textStyle}>{name}</Text>

            <Text style={labelStyle}>Email:</Text>
            <Text style={textStyle}>{email}</Text>

            <Hr style={hrStyle} />

            <Text style={labelStyle}>Message:</Text>
            <Text style={messageStyle}>{message}</Text>
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

const labelStyle = {
  color: '#666',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  marginBottom: '5px',
};

const textStyle = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '20px',
};

const messageStyle = {
  ...textStyle,
  whiteSpace: 'pre-wrap' as const,
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '4px',
  border: '1px solid #e9ecef',
};

const hrStyle = {
  margin: '20px 0',
  borderColor: '#e9ecef',
};

const footerStyle = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '20px',
  textAlign: 'center' as const,
};

export default ContactFormEmail;
