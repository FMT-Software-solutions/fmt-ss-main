'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supportContact } from '@/consts';
import { Mail, MessageSquare, Phone } from 'lucide-react';

// Contact info data moved outside component to avoid recreation on each render
const contactInfo = [
  {
    title: 'Email',
    icon: <Mail className="mr-2 h-5 w-5" />,
    content: 'fmtsoftwaresolutions@gmail.com',
  },
  {
    title: 'Phone',
    icon: <Phone className="mr-2 h-5 w-5" />,
    content: supportContact,
  },
  {
    title: 'Live Chat',
    icon: <MessageSquare className="mr-2 h-5 w-5" />,
    content: 'Available 8AM - 6PM GMT',
  },
];

export default function ContactInfo() {
  return (
    <div className="grid gap-8 md:grid-cols-3 mb-8">
      {contactInfo.map((info) => (
        <Card key={info.title}>
          <CardHeader>
            <CardTitle className="flex items-center">
              {info.icon}
              {info.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{info.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
