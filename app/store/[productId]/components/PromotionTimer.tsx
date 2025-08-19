'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap } from 'lucide-react';
import { IPromotion } from '@/types/premium-app';

interface PromotionTimerProps {
  promotion: IPromotion;
  originalPrice: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PromotionTimer({ promotion, originalPrice }: PromotionTimerProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isPromotionStarted, setIsPromotionStarted] = useState(false);

  useEffect(() => {
    if (!promotion.hasPromotion || !promotion.isActive || !promotion.startDate || !promotion.endDate) {
      return;
    }

    const calculateTimeLeft = () => {
      const startDate = new Date(promotion.startDate!);
      const endDate = new Date(promotion.endDate!);
      const now = new Date();
      
      // Security check: if end date is in the past, promotion is expired
      if (now > endDate) {
        setIsExpired(true);
        return null;
      }
      
      // Security check: if start date is greater than end date, promotion is invalid
      if (startDate >= endDate) {
        setIsExpired(true);
        return null;
      }
      
      // Check if promotion has started
      const hasStarted = now >= startDate;
      setIsPromotionStarted(hasStarted);
      
      let targetDate: Date;
      
      if (!hasStarted) {
        // Promotion hasn't started yet, countdown to start date
        targetDate = startDate;
      } else {
        // Promotion has started, countdown to end date
        targetDate = endDate;
      }

      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        if (hasStarted) {
          setIsExpired(true);
        }
        // Refresh the page when timer hits zero to update promotion status
        setTimeout(() => {
          router.refresh();
        }, 1000);
        return null;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    // Initial calculation
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);

    // Set up interval to update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [promotion]);

  // Don't render if promotion is not configured or expired
  if (!promotion.hasPromotion || !promotion.isActive || isExpired || !timeLeft) {
    return null;
  }

  const discountPercentage = promotion.discountPrice 
    ? Math.round(((originalPrice - promotion.discountPrice) / originalPrice) * 100)
    : 0;

  return (
    <Card className="mb-6 border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              <Badge variant={isPromotionStarted ? "destructive" : "secondary"} className="text-sm font-semibold">
                {isPromotionStarted ? "LIMITED TIME OFFER" : "UPCOMING PROMOTION"}
              </Badge>
            </div>
            {isPromotionStarted && discountPercentage > 0 && (
              <Badge variant="secondary" className="text-lg font-bold">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{isPromotionStarted ? "Ends in:" : "Starts in:"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {timeLeft.days > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {timeLeft.days}
                  </div>
                  <div className="text-xs text-muted-foreground">DAYS</div>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-muted-foreground">HRS</div>
              </div>
              
              <div className="text-red-600 dark:text-red-400 text-xl font-bold">:</div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-muted-foreground">MIN</div>
              </div>
              
              <div className="text-red-600 dark:text-red-400 text-xl font-bold">:</div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-muted-foreground">SEC</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}