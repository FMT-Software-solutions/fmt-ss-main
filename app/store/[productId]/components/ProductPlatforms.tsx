'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IPlatformAvailability } from '@/types/premium-app';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Globe, Apple, Chrome, Zap } from 'lucide-react';

interface ProductPlatformsProps {
  platforms: IPlatformAvailability;
}

// Platform configuration with icons and labels
const platformConfig = {
  desktop: {
    windows: {
      icon: <Monitor className="h-5 w-5" />,
      label: 'Windows',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    macos: {
      icon: <Apple className="h-5 w-5" />,
      label: 'macOS',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      borderColor: 'border-gray-200 dark:border-gray-800',
      textColor: 'text-gray-700 dark:text-gray-300',
    },
    linux: {
      icon: <Zap className="h-5 w-5" />,
      label: 'Linux',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      borderColor: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-700 dark:text-orange-300',
    },
  },
  mobile: {
    android: {
      icon: <Smartphone className="h-5 w-5" />,
      label: 'Android',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-700 dark:text-green-300',
    },
    ios: {
      icon: <Apple className="h-5 w-5" />,
      label: 'iOS',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      borderColor: 'border-gray-200 dark:border-gray-800',
      textColor: 'text-gray-700 dark:text-gray-300',
    },
  },
  web: {
    icon: <Globe className="h-5 w-5" />,
    label: 'Web App',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
  },
};

export default function ProductPlatforms({ platforms }: ProductPlatformsProps) {
  const availablePlatforms: Array<{
    icon: React.ReactNode;
    label: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }> = [];

  // Check desktop platforms
  if (platforms.desktop) {
    Object.entries(platforms.desktop).forEach(([key, platform]) => {
      if (platform?.available) {
        const config =
          platformConfig.desktop[key as keyof typeof platformConfig.desktop];
        if (config) {
          availablePlatforms.push(config);
        }
      }
    });
  }

  // Check mobile platforms
  if (platforms.mobile) {
    Object.entries(platforms.mobile).forEach(([key, platform]) => {
      if (platform?.available) {
        const config =
          platformConfig.mobile[key as keyof typeof platformConfig.mobile];
        if (config) {
          availablePlatforms.push(config);
        }
      }
    });
  }

  // Check web platform
  if (platforms.web?.available) {
    availablePlatforms.push(platformConfig.web);
  }

  if (availablePlatforms.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mb-12"
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Available Platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {availablePlatforms.map((platform, index) => (
              <motion.div
                key={`${platform.label}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200
                  ${platform.bgColor} ${platform.borderColor} ${platform.textColor}
                  hover:shadow-md hover:scale-105
                `}
              >
                <div className="flex-shrink-0">{platform.icon}</div>
                <span className="font-medium text-sm">{platform.label}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
