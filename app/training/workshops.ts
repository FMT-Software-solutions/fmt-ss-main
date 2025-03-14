export const workshops = [
  {
    id: "web-dev-masterclass",
    title: "Web Development Masterclass",
    description: "Master modern web development with React, Next.js, and TypeScript",
    date: "April 15, 2024",
    duration: "4 weeks",
    price: 499,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    instructor: "Sarah Johnson",
    type: "Live Online",
    spots: 20,
    curriculum: [
      "Modern JavaScript & TypeScript",
      "React Fundamentals & Hooks",
      "Next.js 13+ Features",
      "State Management & API Integration",
      "Testing & Deployment"
    ]
  },
  {
    id: "data-science-basics",
    title: "Data Science Fundamentals",
    description: "Introduction to data analysis, visualization, and machine learning",
    date: "April 22, 2024",
    duration: "6 weeks",
    price: 699,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    instructor: "Dr. Michael Chen",
    type: "Live Online",
    spots: 15,
    curriculum: [
      "Python for Data Science",
      "Data Analysis with Pandas",
      "Data Visualization",
      "Introduction to Machine Learning",
      "Statistical Analysis"
    ]
  },
  {
    id: "git-basics",
    title: "Git Essentials",
    description: "Learn the fundamentals of version control with Git",
    date: "April 10, 2024",
    duration: "2 hours",
    price: 0,
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60",
    instructor: "Tom Wilson",
    type: "Live Online",
    spots: 50,
    curriculum: [
      "Git Basics & Setup",
      "Working with Repositories",
      "Branching & Merging",
      "Collaboration Workflows"
    ]
  }
];

export type Workshop = typeof workshops[0];