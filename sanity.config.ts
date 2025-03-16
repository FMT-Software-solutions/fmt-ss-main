import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { projectDetails } from './sanity/lib/api';

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: 'FMT Software Solutions',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool(),
    visionTool({
      defaultApiVersion: projectDetails.apiVersion,
    }),
  ],
});
