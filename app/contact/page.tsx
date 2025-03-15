import { Metadata } from 'next';
import ContactHero from './components/ContactHero';
import ContactInfo from './components/ContactInfo';
import ContactForm from './components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact FMT Software Solutions',
  description: 'Get in touch with our team for support, inquiries, or feedback',
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
