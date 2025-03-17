# Newsletter Subscription Feature Setup

This document provides instructions on how to set up and configure the newsletter subscription feature in your Next.js application.

## Prerequisites

- Supabase account and project
- Resend account for sending emails

## Environment Variables

Ensure the following environment variables are set in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

## Database Setup

1. Run the SQL migration to create the `newsletter_subscribers` table:

```bash
npx supabase migration up
```

Alternatively, you can manually create the table in the Supabase dashboard using the SQL from `supabase/migrations/20240101000000_create_newsletter_subscribers.sql`.

## Features

The newsletter subscription system includes:

1. **Email Collection Form**: A form that collects email addresses from users.
2. **Email Validation**: Client and server-side validation of email addresses.
3. **Duplicate Prevention**: Checks for existing subscribers to prevent duplicates.
4. **Welcome Email**: Automatically sends a welcome email to new subscribers.
5. **Unsubscribe Functionality**: Allows users to unsubscribe via a unique token.
6. **Rate Limiting**: Prevents abuse by limiting subscription attempts.
7. **GDPR Compliance**: Includes unsubscribe links and privacy notices.

## Components

- `app/NewsletterSection.tsx`: The main newsletter subscription form component.
- `app/newsletter/unsubscribe/page.tsx`: Page for handling unsubscribe requests.
- `app/api/newsletter/subscribe/route.ts`: API route for handling subscriptions.
- `app/api/newsletter/unsubscribe/route.ts`: API route for handling unsubscribes.
- `emails/NewsletterWelcome.tsx`: React Email template for welcome emails.
- `lib/supabase/browser.ts`: Supabase browser client.
- `lib/supabase/server.ts`: Supabase server client.

## Security Considerations

1. **Rate Limiting**: The API includes basic rate limiting to prevent abuse.
2. **Data Validation**: All inputs are validated using Zod schemas.
3. **Row Level Security**: Supabase RLS policies restrict access to subscriber data.
4. **GDPR Compliance**: Unsubscribe links are included in all emails.

## Customization

- **Email Template**: Modify `emails/NewsletterWelcome.tsx` to customize the welcome email.
- **Form Styling**: Update the styling in `app/NewsletterSection.tsx` to match your design.
- **Unsubscribe Page**: Customize the unsubscribe page in `app/newsletter/unsubscribe/page.tsx`.

## Testing

To test the newsletter subscription:

1. Fill out the subscription form with a valid email.
2. Check your email for the welcome message.
3. Click the unsubscribe link to test the unsubscribe functionality.

## Troubleshooting

- **Emails Not Sending**: Verify your Resend API key and check the Resend dashboard for errors.
- **Database Errors**: Check Supabase logs for any database-related issues.
- **Rate Limiting Issues**: Adjust the rate limiting parameters in `app/api/newsletter/subscribe/route.ts` if needed. 