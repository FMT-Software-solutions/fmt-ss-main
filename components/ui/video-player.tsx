'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    // Extract YouTube video ID from various possible YouTube URL formats
    if (!videoUrl) return;

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);

    if (match && match[2].length === 11) {
      setVideoId(match[2]);
    }
  }, [videoUrl]);

  if (!videoId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 w-full rounded-lg overflow-hidden shadow-lg"
    >
      <div className="relative pb-[56.25%] h-0">
        <iframe
          title={title || 'YouTube video player'}
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>
    </motion.div>
  );
}
