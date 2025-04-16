import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Hr,
} from '@react-email/components';
import { formatCustom } from '@/lib/date';
import { supportContact } from '@/consts';

interface TrainingRegistrationEmailProps {
  firstName: string;
  training: any;
  registrationData: any;
}

export const TrainingRegistrationEmail = ({
  firstName,
  training,
  registrationData,
}: TrainingRegistrationEmailProps) => {
  const formattedDate = training.startDate
    ? formatCustom(training.startDate, 'EEEE, MMMM d, yyyy h:mm a')
    : 'To be announced';

  return (
    <Html>
      <Head />
      <Preview>Registration Confirmation: {training.title}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>Registration Confirmation</Heading>
          <Section style={sectionStyle}>
            <Text style={textStyle}>Hello {firstName},</Text>
            <Text style={textStyle}>
              Thank you for registering for our "{training.title}" training
              program. Your registration has been received and is being
              processed.
            </Text>

            <Hr style={hrStyle} />

            <Heading as="h2" style={subheadingStyle}>
              Training Details
            </Heading>
            <Text style={labelStyle}>Training Program:</Text>
            <Text style={valueStyle}>{training.title}</Text>

            <Text style={labelStyle}>Date and Time:</Text>
            <Text style={valueStyle}>{formattedDate}</Text>

            <Text style={labelStyle}>Duration:</Text>
            <Text style={valueStyle}>{training.duration}</Text>

            <Text style={labelStyle}>Location:</Text>
            <Text style={valueStyle}>
              {training.location || 'To be announced'}
            </Text>

            {training.joiningLink && (
              <>
                <Text style={labelStyle}>Joining Link:</Text>
                <Link href={training.joiningLink} style={linkStyle}>
                  {training.location?.toLowerCase() === 'online'
                    ? 'Click here to join the session'
                    : 'View location details'}
                </Link>
              </>
            )}

            <Hr style={hrStyle} />

            {!training.isFree && (
              <Text style={textStyle}>
                Please complete the payment process to secure your spot. If you
                haven't completed the payment yet, you can do so by following
                the instructions on our website.
              </Text>
            )}

            <Text style={textStyle}>
              If you have any questions or need to make changes to your
              registration, please contact us at training@fmtsoftware.com or
              call us at {supportContact}.
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

const linkStyle = {
  color: '#5c6ac4',
  fontSize: '16px',
  textDecoration: 'underline',
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

export default TrainingRegistrationEmail;
