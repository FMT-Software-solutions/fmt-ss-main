import { IPublicProject } from '@/types/public-project';

export const fallbackProjects: Record<string, IPublicProject> = {
  'place-finder': {
    _id: 'place-finder',
    title: 'Place Finder App',
    slug: { current: 'place-finder' },
    mainImage: { url: '/placeholders/place-finder.jpg' },
    screenshots: [
      { url: '/placeholders/place-finder-1.jpg' },
      { url: '/placeholders/place-finder-2.jpg' },
    ],
    videoUrl: undefined,
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            text: 'The Place Finder App is designed to help users locate services and places near their current location in Ghana. It provides a simple, intuitive interface for finding essential services like banks, hospitals, restaurants, and more.',
            _type: 'span',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    shortDescription:
      'An app to help you locate places and services near your current location in Ghana.',
    sectors: ['Public Services', 'Navigation'],
    status: 'ongoing',
    tags: ['Mobile App', 'Location Services', 'Navigation', 'Public Service'],
    features: [
      'Real-time location tracking',
      'Search for nearby services',
      'Filter by service type',
      'Get directions to selected places',
      'Save favorite locations',
      'User ratings and reviews',
    ],
    platforms: [
      {
        name: 'iOS',
        slug: { current: 'ios' },
        icon: 'smartphone',
      },
      {
        name: 'Android',
        slug: { current: 'android' },
        icon: 'smartphone',
      },
      {
        name: 'Web',
        slug: { current: 'web' },
        icon: 'globe',
      },
    ],
    projectUrl: null,
    publishedAt: '2023-06-15',
  },
  'rent-ease-gh': {
    _id: 'rent-ease-gh',
    title: 'RentEase GH',
    slug: { current: 'rent-ease-gh' },
    mainImage: { url: '/placeholders/rent-ease.jpg' },
    screenshots: [
      { url: '/placeholders/rent-ease-1.jpg' },
      { url: '/placeholders/rent-ease-2.jpg' },
    ],
    videoUrl: undefined,
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            text: 'RentEase GH connects landlords directly with potential tenants, offering verified listings and eliminating intermediaries. Finding rental accommodation can be challenging due to unreliable listings and high agent fees. This app streamlines the process and reduces costs for all parties.',
            _type: 'span',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    shortDescription:
      'A platform connecting landlords directly with tenants, eliminating intermediaries and reducing costs.',
    sectors: ['Real Estate', 'Housing'],
    status: 'upcoming',
    tags: ['Web App', 'Mobile App', 'Housing', 'Real Estate'],
    features: [
      'Verified property listings',
      'Direct landlord-tenant communication',
      'Virtual property tours',
      'Secure payment processing',
      'Rental agreement templates',
      'Tenant verification services',
    ],
    platforms: [
      {
        name: 'Web',
        slug: { current: 'web' },
        icon: 'globe',
      },
      {
        name: 'Android',
        slug: { current: 'android' },
        icon: 'smartphone',
      },
    ],
    projectUrl: null,
    publishedAt: '2023-08-20',
  },
  safenet: {
    _id: 'safenet',
    title: 'SafeNet',
    slug: { current: 'safenet' },
    shortDescription:
      'Report crimes, access emergency services, and receive safety alerts',
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'SafeNet is a public safety app that enables users to report crimes, access emergency services, and receive safety alerts. The app aims to enhance public safety through community engagement and timely information sharing.',
          },
        ],
      },
    ],
    status: 'upcoming',
    sectors: ['Safety'],
    mainImage: null,
    screenshots: [],
    features: [
      'One-touch emergency services access',
      'Crime reporting with photo/video evidence',
      'Real-time safety alerts',
      'Community safety forums',
      'Location sharing with trusted contacts',
    ],
    platforms: [
      { name: 'Mobile', slug: { current: 'mobile' }, icon: 'smartphone' },
    ],
    tags: ['Safety', 'Emergency', 'Security'],
    projectUrl: null,
    publishedAt: new Date().toISOString(),
  },
  learnmate: {
    _id: 'learnmate',
    title: 'LearnMate',
    slug: { current: 'learnmate' },
    shortDescription:
      'Access educational materials, interactive courses, and tutorials for students',
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'LearnMate is an educational platform that provides access to learning materials, interactive courses, and tutorials for students of all ages. The app aims to bridge educational disparities by making quality learning resources accessible to everyone.',
          },
        ],
      },
    ],
    status: 'completed',
    sectors: ['Education'],
    mainImage: null,
    screenshots: [],
    features: [
      'Interactive learning modules',
      'Progress tracking',
      'Personalized learning paths',
      'Offline content access',
      'Peer collaboration tools',
    ],
    platforms: [
      { name: 'Web', slug: { current: 'web' }, icon: 'globe' },
      { name: 'Desktop', slug: { current: 'desktop' }, icon: 'monitor' },
      { name: 'Mobile', slug: { current: 'mobile' }, icon: 'smartphone' },
    ],
    tags: ['Education', 'Learning', 'Courses'],
    projectUrl: 'https://example.com/learnmate',
    publishedAt: new Date().toISOString(),
  },
};
