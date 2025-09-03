'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageCircle } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData(formRef.current);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const message = formData.get('message') as string;

      // Validate form data
      if (!name || !email || !message) {
        throw new Error('Please fill in all fields');
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Reset form using the ref
      formRef.current.reset();

      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to send message'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="border-2 hover:border-primary/20 transition-colors duration-300">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">Send us a message</CardTitle>
          <p className="text-muted-foreground">
            Fill out the form below and we'll get back to you within 24 hours
          </p>
          <div className="flex justify-center mt-4">
            <Badge variant="secondary" className="px-3 py-1">
              Your information is secure
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4 text-primary" />
                Name
              </label>
              <Input
                id="name"
                name="name"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your full name"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label
                htmlFor="email"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-primary" />
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your email address"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label
                htmlFor="message"
                className="text-sm font-medium flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-primary" />
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                required
                rows={5}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Tell us about your project or inquiry..."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button
                type="submit"
                className="w-full h-12 text-lg font-medium transition-all duration-200 hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
