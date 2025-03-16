import { IPublicProject } from '@/types/public-project';

export const fallbackProjects: { [key: string]: IPublicProject } = {
  'place-finder': {
    _id: 'place-finder',
    title: 'Place Finder',
    slug: { current: 'place-finder' },
    shortDescription:
      'Locate nearby services like restaurants, banks, and shops based on your current location',
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "Place Finder is an innovative app designed to help users locate essential services near their current location. Whether you need to find a restaurant, bank, gas station, or any other service, Place Finder makes it easy to discover what's around you.",
          },
        ],
      },
    ],
    status: 'upcoming',
    sectors: ['Location'],
    mainImage: null,
    screenshots: [],
    features: [
      'Find nearby services based on your location',
      'Filter results by category',
      'Get directions to your destination',
      'Save favorite places',
      'Read reviews from other users',
    ],
    platforms: [
      { name: 'Web', slug: { current: 'web' }, icon: 'globe' },
      { name: 'Mobile', slug: { current: 'mobile' }, icon: 'smartphone' },
    ],
    tags: ['Location', 'Services', 'Maps'],
    projectUrl: null,
    publishedAt: new Date().toISOString(),
  },
  rentease: {
    _id: 'rentease',
    title: 'RentEase',
    slug: { current: 'rentease' },
    shortDescription:
      'Connect directly with landlords through verified listings without intermediaries',
    description: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'RentEase is a platform that connects landlords directly with potential tenants, eliminating the need for intermediaries. The app offers verified listings and streamlines the rental process, making it easier and more affordable for everyone involved.',
          },
        ],
      },
    ],
    status: 'ongoing',
    sectors: ['Housing'],
    mainImage: null,
    screenshots: [],
    features: [
      'Direct landlord-tenant communication',
      'Verified property listings',
      'In-app document signing',
      'Rental payment processing',
      'Maintenance request tracking',
    ],
    platforms: [{ name: 'Web', slug: { current: 'web' }, icon: 'globe' }],
    tags: ['Housing', 'Rental', 'Property'],
    projectUrl: 'https://example.com/rentease',
    publishedAt: new Date().toISOString(),
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
