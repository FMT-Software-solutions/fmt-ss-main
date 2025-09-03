import { Metadata } from 'next';
import ContactHero from './components/ContactHero';
import ContactInfo from './components/ContactInfo';
import ContactForm from './components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Contact FMT Software Solutions for software development inquiries, support, partnerships, or training programs. We\'re here to help with your business software needs.',
  keywords: [
    'contact FMT Software Solutions',
    'software development inquiry',
    'Ghana software company contact',
    'business software consultation',
    'software support',
    'custom software quote',
    'software training inquiry',
    'tech support Ghana'
  ],
  openGraph: {
    title: 'Contact FMT Software Solutions - Get in Touch',
    description: 'Ready to discuss your software needs? Contact our team for development inquiries, support, or training programs.',
    url: 'https://fmtsoftware.com/contact',
    images: [
      {
        url: '/fmt-logo.png',
        width: 1200,
        height: 630,
        alt: 'Contact FMT Software Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact FMT Software Solutions - Get in Touch',
    description: 'Ready to discuss your software needs? Contact our team for development inquiries and support.',
    images: ['/fmt-logo.png'],
  },
  alternates: {
    canonical: 'https://fmtsoftware.com/contact',
  },
};

// This is now a Server Component in React 19
export default function Contact() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-5xl">
        <ContactHero />
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  );
}
