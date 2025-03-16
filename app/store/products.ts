export const products = [
  {
    id: 'project-manager-pro',
    title: 'Project Manager Pro',
    description:
      'Streamline your project management with our powerful solution',
    price: 299,
    category: 'Business',
    image:
      'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=60',
    tags: ['Project Management', 'Team Collaboration', 'Business'],
    features: [
      'Task Management & Organization',
      'Team Collaboration Tools',
      'Project Timeline Views',
      'Resource Management',
      'Custom Workflows',
      'Real-time Updates',
      'File Sharing & Storage',
      'Reporting & Analytics',
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Linux'],
      processor: '1.6 GHz or faster processor',
      memory: '4 GB RAM minimum',
      storage: '1 GB available space',
    },
    platforms: [
      { name: 'Web', slug: { current: 'web' }, icon: 'globe' },
      { name: 'Desktop', slug: { current: 'desktop' }, icon: 'monitor' },
    ],
    downloadUrl: 'https://example.com/download/project-manager-pro',
    webAppUrl: 'https://example.com/app/project-manager-pro',
  },
  {
    id: 'data-analyzer',
    title: 'Data Analyzer',
    description:
      'Transform your data into actionable insights with advanced analytics',
    price: 199,
    category: 'Analytics',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    tags: ['Analytics', 'Business Intelligence', 'Data'],
    features: [
      'Data Import & Export',
      'Advanced Analytics',
      'Custom Dashboards',
      'Automated Reports',
      'Data Visualization',
      'Machine Learning Integration',
      'API Access',
      'Secure Data Storage',
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Linux'],
      processor: '2.0 GHz or faster processor',
      memory: '8 GB RAM minimum',
      storage: '2 GB available space',
    },
    platforms: [
      { name: 'Desktop', slug: { current: 'desktop' }, icon: 'monitor' },
    ],
    downloadUrl: 'https://example.com/download/data-analyzer',
    webAppUrl: null,
  },
  {
    id: 'secure-vault',
    title: 'Secure Vault',
    description:
      'Enterprise-grade security for your sensitive data and documents',
    price: 249,
    category: 'Security',
    image:
      'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&auto=format&fit=crop&q=60',
    tags: ['Security', 'Enterprise', 'Data Protection'],
    features: [
      'End-to-end Encryption',
      'Secure File Storage',
      'Access Control',
      'Audit Trails',
      'Two-factor Authentication',
      'Automated Backups',
      'Compliance Tools',
      'Secure Sharing',
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Linux'],
      processor: '1.8 GHz or faster processor',
      memory: '4 GB RAM minimum',
      storage: '5 GB available space',
    },
    platforms: [
      { name: 'Web', slug: { current: 'web' }, icon: 'globe' },
      { name: 'Desktop', slug: { current: 'desktop' }, icon: 'monitor' },
      { name: 'Mobile', slug: { current: 'mobile' }, icon: 'smartphone' },
    ],
    downloadUrl: 'https://example.com/download/secure-vault',
    webAppUrl: 'https://example.com/app/secure-vault',
  },
];

export type Product = (typeof products)[0];
