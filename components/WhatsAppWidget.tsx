'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const phoneNumber = '+233559617959';

  const handleSendMessage = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(
        '+',
        ''
      )}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      setMessage('');
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center"
          size="icon"
        >
          <Image
            src="/images/whatsapp.svg"
            alt="WhatsApp"
            width={28}
            height={28}
            className="brightness-0 invert"
          />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/whatsapp.svg"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
                <span className="font-medium">Chat with us on WhatsApp!</span>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-green-700 p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Content */}
            <div className="p-4 bg-green-50 min-h-[200px]">
              {/* Welcome Message */}
              <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/images/whatsapp.svg"
                      alt="WhatsApp"
                      width={16}
                      height={16}
                      className="brightness-0 invert"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 mb-1">
                      Hi! I'd like to inquire about your services 👋
                    </p>
                    <p className="text-xs text-gray-500">
                      FMT Software solutions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-green-500 hover:bg-green-600 px-3"
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppWidget;
