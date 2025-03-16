# Sanity Integration Setup

This project uses Sanity as a headless CMS to manage project content. Follow these steps to set up Sanity in your development environment.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup Steps

### 1. Install Dependencies

The project already has the necessary Sanity dependencies installed. If you need to install them manually, run:

```bash
npm install sanity @sanity/client @sanity/image-url @sanity/vision @portabletext/react
```

### 2. Create a Sanity Project

1. Sign up or log in to [Sanity.io](https://www.sanity.io/)
2. Create a new project from the Sanity dashboard
3. Note your project ID and dataset name (usually "production")

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
SANITY_PREVIEW_SECRET=your-preview-secret
```

To get your API token:
1. Go to your Sanity project dashboard
2. Navigate to API > Tokens
3. Create a new token with Editor or higher permissions

### 4. Access Sanity Studio

Once configured, you can access the Sanity Studio at:

```
http://localhost:3000/studio
```

### 5. Create Content

Use the Sanity Studio to create project content:

1. Create new projects with titles, descriptions, images, etc.
2. Set the status (completed, ongoing, upcoming)
3. Add tags and sector information
4. Mark featured projects to display on the homepage

### 6. Deploy

When deploying to production, make sure to:

1. Add the environment variables to your hosting platform
2. Deploy the Sanity Studio by running `npx sanity deploy` (optional)

## Project Structure

- `/sanity/schemas`: Contains the content schemas
- `/sanity/lib`: Contains Sanity client configuration
- `/app/studio`: Contains the embedded Sanity Studio
- `/app/projects`: Contains the project listing and detail pages

## Troubleshooting

If you encounter issues:

1. Verify your environment variables are correct
2. Check that your Sanity project ID and dataset name match
3. Ensure your API token has the correct permissions
4. Clear your browser cache and restart the development server 