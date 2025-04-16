import { createClient } from 'next-sanity';
import { projectDetails } from './api';

export const client = createClient({
  projectId: projectDetails.projectId,
  dataset: projectDetails.dataset,
  apiVersion: projectDetails.apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
  token: process.env.SANITY_API_TOKEN,
});

export const previewClient = createClient({
  projectId: projectDetails.projectId,
  dataset: projectDetails.dataset,
  apiVersion: projectDetails.apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN,
});
