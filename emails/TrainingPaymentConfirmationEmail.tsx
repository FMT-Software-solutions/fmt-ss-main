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

interface TrainingPaymentConfirmationEmailProps {
  firstName: string;
  paymentReference: string;
  amount: number;
  registrationData: any;
}

export const TrainingPaymentConfirmationEmail = ({
  firstName,
  paymentReference,
  amount,
  registrationData,
}: TrainingPaymentConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your training payment has been confirmed</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>Payment Confirmation</Heading>
          <Section style={sectionStyle}>
            <Text style={textStyle}>Hello {firstName},</Text>
            <Text style={textStyle}>
              Thank you for your payment. Your registration for the training
              program has been confirmed.
            </Text>

            <Hr style={hrStyle} />

            <Heading as="h2" style={subheadingStyle}>
              Payment Details
            </Heading>
            <Text style={labelStyle}>Payment Reference:</Text>
            <Text style={valueStyle}>{paymentReference}</Text>

            <Text style={labelStyle}>Amount Paid:</Text>
            <Text style={valueStyle}>GHS {amount.toFixed(2)}</Text>

            <Text style={labelStyle}>Status:</Text>
            <Text style={valueStyle}>Confirmed</Text>

            <Hr style={hrStyle} />

            <Text style={textStyle}>
              You will receive additional information about the training
              program, including any preparation materials and exact schedule
              details, closer to the training date.
            </Text>

            <Text style={textStyle}>
              If you have any questions or need to make changes to your
              registration, please contact us at training@fmtsoftware.com.
            </Text>
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

const subheadingStyle = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
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
  marginTop: '15px',
};

const valueStyle = {
  color: '#333',
  fontSize: '16px',
  marginBottom: '15px',
};

const textStyle = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '20px',
};

const hrStyle = {
  margin: '25px 0',
  borderColor: '#e9ecef',
};

const footerStyle = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '20px',
  textAlign: 'center' as const,
};

export default TrainingPaymentConfirmationEmail;
