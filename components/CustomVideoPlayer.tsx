'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

interface CustomVideoPlayerProps {
  videoUrl?: string;
  title?: string;
}

function formatTime(t: number) {
  const total = Math.floor(t || 0);
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = Math.floor(total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CustomVideoPlayer({ videoUrl, title }: CustomVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.6);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    v.volume = volume;
  }, [muted, volume]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
  }, []);

  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime || 0);
  }, []);

  const onProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const value = Number(e.target.value);
    v.currentTime = value;
    setCurrentTime(value);
  }, []);

  const onVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const value = Number(e.target.value);
    setVolume(value);
    if (value > 0 && muted) setMuted(false);
    v.volume = value;
  }, [muted]);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current as any;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden rounded-lg border bg-black">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-full aspect-video"
          src={videoUrl || 'https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4'}
          title={title}
          preload="metadata"
          muted={muted}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
        />
        {!playing && (
          <button
            onClick={togglePlay}
            aria-label="Play"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm p-6 text-white hover:bg-white/30">
              <Play className="h-8 w-8" />
            </span>
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 px-4 py-3 bg-black/70 text-white">
        <button
          onClick={togglePlay}
          className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <div className="text-xs tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</div>
        <input
          type="range"
          min={0}
          max={Math.max(duration, 0)}
          step={0.1}
          value={Math.min(currentTime, duration)}
          onChange={onProgressChange}
          className="flex-1 h-1 rounded-lg appearance-none bg-white/20 [::-webkit-slider-thumb]:appearance-none [::-webkit-slider-thumb]:h-3 [::-webkit-slider-thumb]:w-3 [::-webkit-slider-thumb]:rounded-full [::-webkit-slider-thumb]:bg-white"
        />
        <button
          onClick={toggleMute}
          className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={onVolumeChange}
          className="w-24 h-1 rounded-lg appearance-none bg-white/20 [::-webkit-slider-thumb]:appearance-none [::-webkit-slider-thumb]:h-3 [::-webkit-slider-thumb]:w-3 [::-webkit-slider-thumb]:rounded-full [::-webkit-slider-thumb]:bg-white"
        />
        <button
          onClick={toggleFullscreen}
          className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
