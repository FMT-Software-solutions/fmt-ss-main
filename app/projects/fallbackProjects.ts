// Fallback projects if no projects are found
export const fallbackProjects = [
  {
    _id: 'place-finder',
    title: 'Place Finder',
    shortDescription:
      'Locate nearby services like restaurants, banks, and shops based on your current location',
    status: 'upcoming',
    sectors: ['Location'],
    slug: { current: 'place-finder' },
    mainImage: null,
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
  },
  {
    _id: 'rentease',
    title: 'RentEase',
    shortDescription:
      'Connect directly with landlords through verified listings without intermediaries',
    status: 'ongoing',
    sectors: ['Housing'],
    slug: { current: 'rentease' },
    mainImage: null,
    features: [
      'Direct landlord-tenant communication',
      'Verified property listings',
      'In-app document signing',
      'Rental payment processing',
      'Maintenance request tracking',
    ],
    platforms: [{ name: 'Web', slug: { current: 'web' }, icon: 'globe' }],
    tags: ['Housing', 'Rental', 'Property'],
  },
  {
    _id: 'safenet',
    title: 'SafeNet',
    shortDescription:
      'Report crimes, access emergency services, and receive safety alerts',
    status: 'upcoming',
    sectors: ['Safety'],
    slug: { current: 'safenet' },
    mainImage: null,
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
  },
  {
    _id: 'learnmate',
    title: 'LearnMate',
    shortDescription:
      'Access educational materials, interactive courses, and tutorials for students',
    status: 'completed',
    sectors: ['Education'],
    slug: { current: 'learnmate' },
    mainImage: null,
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
  },
];
