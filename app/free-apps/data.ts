// Free apps data with detailed information
export const freeApps = [
  {
    id: 'task-tracker',
    title: 'Task Tracker',
    description:
      'Simple and effective task management tool for individuals and small teams',
    longDescription:
      'Task Tracker is a lightweight yet powerful task management application designed to help individuals and small teams organize their work efficiently. With an intuitive interface and essential features, it provides everything you need to stay on top of your tasks without the complexity of enterprise solutions.',
    image:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=60',
    screenshots: [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&auto=format&fit=crop&q=60',
    ],
    category: 'Productivity',
    features: [
      'Task organization with custom categories',
      'Due date tracking with reminders',
      'Priority levels for better focus',
      'Progress monitoring with visual indicators',
      'Simple reporting and statistics',
      'Data export to CSV',
      'Dark and light themes',
      'Offline functionality',
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Linux'],
      processor: '1.0 GHz or faster processor',
      memory: '2 GB RAM minimum',
      storage: '50 MB available space',
    },
    platforms: [
      { name: 'Web', slug: { current: 'web' }, icon: 'web' },
      { name: 'Desktop', slug: { current: 'desktop' }, icon: 'desktop' },
    ],
    downloadUrl: 'https://example.com/download/task-tracker',
    webAppUrl: 'https://example.com/app/task-tracker',
    tags: ['Productivity', 'Task Management', 'Organization'],
    price: 0,
  },
  {
    id: 'code-snippet-manager',
    title: 'Code Snippet Manager',
    description: 'Store and organize your frequently used code snippets',
    longDescription:
      'Code Snippet Manager is a developer-focused tool that helps you store, organize, and quickly access your frequently used code snippets. With support for multiple programming languages and powerful search capabilities, it streamlines your workflow and boosts productivity by eliminating the need to rewrite common code patterns.',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60',
    screenshots: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60',
    ],
    category: 'Development',
    features: [
      'Syntax highlighting for 40+ programming languages',
      'Tags and categories for organization',
      'Powerful search functionality',
      'Copy to clipboard with one click',
      'Code formatting options',
      'Import/export functionality',
      'Keyboard shortcuts',
      'Cloud sync (optional)',
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Linux'],
      processor: '1.2 GHz or faster processor',
      memory: '2 GB RAM minimum',
      storage: '100 MB available space',
    },
    platforms: [
      { name: 'Desktop', slug: { current: 'desktop' }, icon: 'desktop' },
    ],
    downloadUrl: 'https://example.com/download/code-snippet-manager',
    webAppUrl: null,
    tags: ['Development', 'Coding', 'Productivity'],
    price: 0,
  },
  {
    id: 'time-tracker',
    title: 'Time Tracker',
    description: 'Track time spent on projects and tasks',
    longDescription:
      "Time Tracker is a simple yet effective tool for monitoring how you spend your time on various projects and tasks. Whether you're a freelancer billing clients, a team tracking project hours, or just someone looking to improve personal productivity, Time Tracker provides the insights you need to make better use of your time.",
    image:
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&auto=format&fit=crop&q=60',
    screenshots: [
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&auto=format&fit=crop&q=60',
    ],
    category: 'Productivity',
    features: [
      'Project and task time tracking',
      'Detailed activity logs',
      'Basic reporting and analytics',
      'Export data to CSV or PDF',
      'Timer with start/stop/pause',
      'Manual time entry option',
      'Project categorization',
      'Weekly and monthly summaries',
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Linux'],
      processor: '1.0 GHz or faster processor',
      memory: '2 GB RAM minimum',
      storage: '75 MB available space',
    },
    platforms: [
      { name: 'Web', slug: { current: 'web' }, icon: 'web' },
      { name: 'Mobile', slug: { current: 'mobile' }, icon: 'mobile' },
    ],
    downloadUrl: 'https://example.com/download/time-tracker',
    webAppUrl: 'https://example.com/app/time-tracker',
    tags: ['Productivity', 'Time Management', 'Project Management'],
    price: 0,
  },
];

export type FreeApp = (typeof freeApps)[0];
