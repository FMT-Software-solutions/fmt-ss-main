'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supportContact } from '@/consts';
import { Mail, MessageSquare, Phone } from 'lucide-react';
import Image from 'next/image';

// Contact info data with enhanced functionality
const contactInfo = [
  {
    title: 'Email',
    icon: <Mail className="mr-2 h-5 w-5" />,
    content: 'fmtsoftwaresolutions@gmail.com',
    action: () => window.open('mailto:fmtsoftwaresolutions@gmail.com', '_blank'),
    buttonText: 'Send Email',
    description: 'Get in touch via email for detailed inquiries',
  },
  {
    title: 'Phone',
    icon: <Phone className="mr-2 h-5 w-5" />,
    content: supportContact,
    action: () => window.open(`tel:${supportContact.replace(/\s/g, '')}`, '_blank'),
    buttonText: 'Call Now',
    description: 'Speak directly with our team',
  },
  {
    title: 'WhatsApp',
    icon: <Image src="/images/whatsapp.svg" alt="WhatsApp" width={20} height={20} className="mr-2 brightness-0 dark:invert" />,
    content: '+233 55 961 7959',
    action: () => {
      const phoneNumber = '+233559617959';
      const message = encodeURIComponent('Hello! I would like to inquire about your services.');
      window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
    },
    buttonText: 'Chat on WhatsApp',
    description: 'Quick responses via WhatsApp',
  },
];

export default function ContactInfo() {
  return (
    <div className="grid gap-8 md:grid-cols-3 mb-12">
      {contactInfo.map((info) => (
        <Card key={info.title} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              {info.icon}
              {info.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-foreground mb-1">{info.content}</p>
              <p className="text-sm text-muted-foreground">{info.description}</p>
            </div>
            <Button 
              onClick={info.action}
              className="w-full group-hover:scale-105 transition-transform duration-200"
              variant="outline"
            >
              {info.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
