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
  Button,
} from '@react-email/components';
import { formatCustom } from '@/lib/date';
import { supportContact } from '@/consts';

interface CustomTrainingRegistrationEmailProps {
  firstName: string;
  training: any;
  registrationDetails: {
    about: string;
    experience: string[];
    expectations: string;
  };
}

const experienceLabels: Record<string, string> = {
  'no-programming': 'No knowledge about programming',
  'little-programming': 'Little knowledge about programming',
  'no-webdev': 'No knowledge about web development',
  'little-webdev': 'Little knowledge about web development',
  'html-basics': 'Familiar with HTML basics',
  'css-basics': 'Familiar with CSS basics',
  'javascript-basics': 'Familiar with JavaScript basics',
  'website-builders': 'Used website builders (WordPress, Wix, etc.)',
  'self-taught': 'Self-taught through online tutorials',
  'online-courses': 'Completed online coding courses',
  'academic-background': 'Academic background in computer science',
  'professional-experience': 'Professional experience in related fields',
};

export const CustomTrainingRegistrationEmail = ({
  firstName,
  training,
  registrationDetails,
}: CustomTrainingRegistrationEmailProps) => {
  const formattedDate = training.startDate
    ? formatCustom(training.startDate, 'EEEE, MMMM d, yyyy h:mm a')
    : 'To be announced';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fmtsoftware.com';
  const trainingUrl = `${baseUrl}/training/${training.slug.current}`;

  // Google Calendar link generation
  const generateCalendarLink = () => {
    if (!training.startDate) return null;

    const startDate = new Date(training.startDate);
    const endDate = training.endDate
      ? new Date(training.endDate)
      : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

    const formatDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    // Build event links section for calendar details
    let eventLinksText = '';
    if (training.eventLinks && training.eventLinks.length > 0) {
      eventLinksText = '\n\nEvent Links:\n';
      training.eventLinks.forEach((eventLink: any) => {
        eventLinksText += `${eventLink.trainingType?.name}: ${eventLink.link}\n`;
      });
    }

    const details = `Training: ${training.title}

Duration: ${training.duration}

Location: ${training.location || 'TBA'}${eventLinksText}

More info: ${trainingUrl}`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: training.title,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: details,
      location: training.location || '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const calendarLink = generateCalendarLink();

  return (
    <Html>
      <Head />
      <Preview>Welcome to {training.title} - Registration Confirmed!</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>🎉 Registration Confirmed!</Heading>
          <Section style={sectionStyle}>
            <Text style={textStyle}>Hello {firstName},</Text>
            <Text style={textStyle}>
              Welcome to our <strong>"{training.title}"</strong> training
              program! We're excited to have you join us on this learning
              journey.
            </Text>

            <Text style={highlightTextStyle}>
              Your registration has been confirmed and you're all set for this
              FREE training program! 🚀
            </Text>

            <Hr style={hrStyle} />

            <Heading as="h2" style={subheadingStyle}>
              📚 Training Details
            </Heading>

            <div style={detailsCardStyle}>
              <Text style={labelStyle}>Training Program:</Text>
              <Text style={valueStyle}>{training.title}</Text>

              <Text style={labelStyle}>📅 Date and Time:</Text>
              <Text style={valueStyle}>{formattedDate}</Text>

              <Text style={labelStyle}>⏱️ Duration:</Text>
              <Text style={valueStyle}>{training.duration}</Text>

              <Text style={labelStyle}>📍 Location:</Text>
              <Text style={valueStyle}>
                {training.location || 'To be announced'}
              </Text>

              {training.price === 0 && (
                <>
                  <Text style={labelStyle}>💰 Price:</Text>
                  <Text style={freeTagStyle}>FREE</Text>
                </>
              )}
            </div>

            <Hr style={hrStyle} />

            <Heading as="h2" style={subheadingStyle}>
              👤 Your Registration Summary
            </Heading>

            <div style={detailsCardStyle}>
              <Text style={labelStyle}>Your Background:</Text>
              <Text style={registrationValueStyle}>
                {registrationDetails.about}
              </Text>

              <Text style={labelStyle}>Your Experience Level:</Text>
              <ul style={listStyle}>
                {registrationDetails.experience.map((exp, index) => (
                  <li key={index} style={listItemStyle}>
                    ✓ {experienceLabels[exp] || exp}
                  </li>
                ))}
              </ul>

              <Text style={labelStyle}>Your Expectations:</Text>
              <Text style={registrationValueStyle}>
                {registrationDetails.expectations}
              </Text>
            </div>

            <Hr style={hrStyle} />

            <Heading as="h2" style={subheadingStyle}>
              🚀 Quick Actions
            </Heading>

            <div style={buttonContainerStyle}>
              <Button href={trainingUrl} style={primaryButtonStyle}>
                View Training Details
              </Button>

              {calendarLink && (
                <Button href={calendarLink} style={secondaryButtonStyle}>
                  📅 Add to Google Calendar
                </Button>
              )}

              {training.eventLinks && training.eventLinks.length > 0 && (
                <>
                  {training.eventLinks.map((eventLink: any, index: number) => (
                    <Button
                      key={index}
                      href={eventLink.link}
                      style={primaryButtonStyle}
                    >
                      {eventLink.linkText}
                    </Button>
                  ))}
                </>
              )}
            </div>

            <Hr style={hrStyle} />

            <Text style={textStyle}>
              <strong>What's Next?</strong>
            </Text>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                You'll receive a reminder email closer to the training date
              </li>
              <li style={listItemStyle}>
                Course materials will be shared before the session begins
              </li>
              <li style={listItemStyle}>
                Feel free to prepare any questions you'd like to ask
              </li>
            </ul>

            <Text style={textStyle}>
              If you have any questions or need to make changes to your
              registration, please contact us at{' '}
              <Link href="mailto:training@fmtsoftware.com" style={linkStyle}>
                training@fmtsoftware.com
              </Link>{' '}
              or call us at {supportContact}.
            </Text>

            <Text style={textStyle}>
              We can't wait to see you in the training! 🎯
            </Text>
          </Section>

          <Text style={footerStyle}>
            © {new Date().getFullYear()} FMT Software Solutions. All rights
            reserved.
            <br />
            Building Ghana's tech future, one developer at a time.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Enhanced Styles
const bodyStyle = {
  backgroundColor: '#f8fafc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const containerStyle = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
};

const headingStyle = {
  color: '#1e293b',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const subheadingStyle = {
  color: '#334155',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '25px 0 15px',
};

const sectionStyle = {
  backgroundColor: '#ffffff',
  padding: '40px 30px',
  borderRadius: '12px',
  boxShadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const detailsCardStyle = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  marginBottom: '20px',
};

const labelStyle = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  marginBottom: '5px',
  marginTop: '15px',
};

const valueStyle = {
  color: '#1e293b',
  fontSize: '16px',
  marginBottom: '15px',
  fontWeight: '500' as const,
};

const registrationValueStyle = {
  color: '#475569',
  fontSize: '15px',
  marginBottom: '15px',
  lineHeight: '1.6',
  fontStyle: 'italic',
};

const textStyle = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '20px',
};

const highlightTextStyle = {
  color: '#059669',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: '#ecfdf5',
  borderRadius: '8px',
  border: '1px solid #a7f3d0',
  marginBottom: '20px',
};

const freeTagStyle = {
  color: '#065f46',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  backgroundColor: '#d1fae5',
  padding: '4px 12px',
  borderRadius: '20px',
  display: 'inline-block',
  marginBottom: '15px',
};

const buttonContainerStyle = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const primaryButtonStyle = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold' as const,
  fontSize: '16px',
  display: 'inline-block',
  margin: '8px',
  border: 'none',
  cursor: 'pointer',
};

const secondaryButtonStyle = {
  backgroundColor: '#8b5cf6',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold' as const,
  fontSize: '16px',
  display: 'inline-block',
  margin: '8px',
  border: 'none',
  cursor: 'pointer',
};

const linkStyle = {
  color: '#3b82f6',
  textDecoration: 'underline',
  fontWeight: '500' as const,
};

const listStyle = {
  margin: '10px 0',
  paddingLeft: '0',
  listStyle: 'none',
};

const listItemStyle = {
  color: '#475569',
  fontSize: '15px',
  marginBottom: '8px',
  paddingLeft: '0',
};

const hrStyle = {
  margin: '30px 0',
  borderColor: '#e2e8f0',
  borderWidth: '1px',
};

const footerStyle = {
  color: '#94a3b8',
  fontSize: '12px',
  marginTop: '30px',
  textAlign: 'center' as const,
  lineHeight: '1.5',
};

export default CustomTrainingRegistrationEmail;
