'use client';
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from '@/components/ui/kibo-ui/video-player';

interface CustomVideoPlayerProps {
  videoUrl?: string;
  title?: string;
}

const CustomVideoPlayer = ({ videoUrl, title }: CustomVideoPlayerProps) => (
  <VideoPlayer className="overflow-hidden rounded-lg border">
    <VideoPlayerContent
      crossOrigin=""
      muted
      preload="auto"
      slot="media"
      src={videoUrl || "https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"}
      title={title}
    />
    <VideoPlayerControlBar>
      <VideoPlayerPlayButton key="play-button" />
      <VideoPlayerSeekBackwardButton key="seek-backward" />
      <VideoPlayerSeekForwardButton key="seek-forward" />
      <VideoPlayerTimeRange key="time-range" />
      <VideoPlayerTimeDisplay key="time-display" showDuration />
      <VideoPlayerMuteButton key="mute-button" />
      <VideoPlayerVolumeRange key="volume-range" />
    </VideoPlayerControlBar>
  </VideoPlayer>
);

export default CustomVideoPlayer;
