import { groq } from 'next-sanity';

// Query to get all projects with basic information
export const allProjectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    shortDescription,
    "sectors": sectors[]->name,
    "rawSectors": sectors,
    status,
    tags,
    publishedAt
  }
`;

// Query to get featured projects
export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    mainImage,
    shortDescription,
    "sectors": sectors[]->name,
    status,
    tags,
    publishedAt
  }
`;

// Query to get a single project by slug
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    screenshots,
    description,
    shortDescription,
    "sectors": sectors[]->name,
    status,
    tags,
    projectUrl,
    features,
    platforms[]->{
      name,
      slug,
      icon
    },
    publishedAt
  }
`;

// Query to get projects by sector
export const projectsBySectorQuery = groq`
  *[_type == "project" && $sector in sectors[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    shortDescription,
    "sectors": sectors[]->name,
    status,
    tags,
    publishedAt
  }
`;

// Query to get projects by status
export const projectsByStatusQuery = groq`
  *[_type == "project" && status == $status] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    shortDescription,
    "sectors": sectors[]->name,
    status,
    tags,
    publishedAt
  }
`;

// Query to get all premium apps
export const allPremiumAppsQuery = groq`
  *[_type == "premiumApp"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    shortDescription,
    "sectors": sectors[]->name,
    price,
    features,
    tags,
    publishedAt
  }
`;

// Query to get a single premium app by slug
export const premiumAppBySlugQuery = groq`
  *[_type == "premiumApp" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    screenshots,
    description,
    shortDescription,
    "sectors": sectors[]->name,
    price,
    features,
    systemRequirements,
    platforms[]->{
      name,
      slug,
      icon
    },
    downloadUrl,
    webAppUrl,
    tags,
    publishedAt
  }
`;

// Query to get all free apps
export const allFreeAppsQuery = groq`
  *[_type == "freeApp"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    shortDescription,
    "sectors": sectors[]->name,
    features,
    tags,
    publishedAt
  }
`;

// Query to get a single free app by slug
export const freeAppBySlugQuery = groq`
  *[_type == "freeApp" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    screenshots,
    description,
    shortDescription,
    "sectors": sectors[]->name,
    features,
    systemRequirements,
    platforms[]->{
      name,
      slug,
      icon
    },
    downloadUrl,
    webAppUrl,
    tags,
    publishedAt
  }
`;

// Query to get all training programs
export const allTrainingsQuery = groq`
  *[_type == "training"] | order(startDate asc, publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    shortDescription,
    duration,
    price,
    isFree,
    trainingType->{
      name,
      slug,
      icon
    },
    startDate,
    location,
    tags,
    featured,
    publishedAt
  }
`;

// Query to get featured training programs
export const featuredTrainingsQuery = groq`
  *[_type == "training" && featured == true] | order(startDate asc, publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    mainImage,
    shortDescription,
    duration,
    price,
    isFree,
    trainingType->{
      name,
      slug,
      icon
    },
    startDate,
    location,
    tags,
    featured,
    publishedAt
  }
`;

// Query to get a single training program by slug
export const trainingBySlugQuery = groq`
  *[_type == "training" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    description,
    shortDescription,
    duration,
    price,
    isFree,
    trainingType->{
      name,
      slug,
      icon
    },
    startDate,
    endDate,
    location,
    instructor,
    prerequisites,
    syllabus,
    maxParticipants,
    registeredParticipants,
    tags,
    featured,
    publishedAt
  }
`;

// Query to get all training types
export const allTrainingTypesQuery = groq`
  *[_type == "trainingType"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    icon
  }
`;
