"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {Play,Pause,RotateCcw,RotateCw,Volume2,VolumeX,Volume1,Maximize,Minimize,Loader2,Settings,Check,
} from "lucide-react";

interface SecureVideoPlayerProps {
  videoId: string;
  title?: string;
  onEnded?: () => void;
  className?: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function SecureVideoPlayer({
  videoId,
  title = "Video Lesson",
  onEnded,
  className = "",
}: SecureVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const playerContainerId = useRef<string>(
    `yt-secure-player-${Math.random().toString(36).substring(2, 9)}`
  );

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls during playback
  const triggerShowControls = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    if (isPlaying && !showSpeedMenu) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, showSpeedMenu]);

  // Load YouTube IFrame API
  useEffect(() => {
    let isSubscribed = true;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
      }

      playerRef.current = new window.YT.Player(playerContainerId.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,          // Hides ALL YouTube controls, "More videos", logos, share buttons
          disablekb: 1,         // Disables YouTube keyboard hooks
          fs: 0,                // Disables YouTube fullscreen button
          modestbranding: 1,
          rel: 0,               // No related videos outside channel
          showinfo: 0,
          iv_load_policy: 3,    // Disables annotations
          playsinline: 1,
          enablejsapi: 1,
          origin: typeof window !== "undefined" ? window.location.origin : "",
        },
        events: {
          onReady: (event: any) => {
            if (!isSubscribed) return;
            setIsReady(true);
            const totalDuration = event.target.getDuration() || 0;
            setDuration(totalDuration);
            event.target.setVolume(volume);
          },
          onStateChange: (event: any) => {
            if (!isSubscribed) return;
            // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 video cued
            if (event.data === 1) {
              setIsPlaying(true);
              setIsBuffering(false);
            } else if (event.data === 2) {
              setIsPlaying(false);
              setIsBuffering(false);
            } else if (event.data === 3) {
              setIsBuffering(true);
            } else if (event.data === 0) {
              setIsPlaying(false);
              setIsBuffering(false);
              if (onEnded) onEnded();
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        if (isSubscribed) initPlayer();
      };
    } else if (window.YT.loaded) {
      initPlayer();
    } else {
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          if (isSubscribed) initPlayer();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      isSubscribed = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [videoId]);

  // When videoId changes after ready
  useEffect(() => {
    if (playerRef.current && isReady && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById(videoId);
      setIsPlaying(true);
    }
  }, [videoId, isReady]);

  // Progress update timer
  useEffect(() => {
    if (isPlaying && isReady) {
      timeUpdateIntervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime && !isDraggingSeek) {
          const current = playerRef.current.getCurrentTime() || 0;
          const total = playerRef.current.getDuration() || duration;
          const loaded = playerRef.current.getVideoLoadedFraction() || 0;
          setCurrentTime(current);
          if (total > 0 && total !== duration) setDuration(total);
          setBuffered(loaded * 100);
        }
      }, 300);
    } else {
      if (timeUpdateIntervalRef.current) clearInterval(timeUpdateIntervalRef.current);
    }

    return () => {
      if (timeUpdateIntervalRef.current) clearInterval(timeUpdateIntervalRef.current);
    };
  }, [isPlaying, isReady, duration, isDraggingSeek]);

  // Handle Fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Controls actions
  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    triggerShowControls();
  };

  const handleSeek = (seconds: number) => {
    if (!playerRef.current || !isReady) return;
    const clampedTime = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(clampedTime);
    playerRef.current.seekTo(clampedTime, true);
    triggerShowControls();
  };

  const handleSkip = (delta: number) => {
    handleSeek(currentTime + delta);
  };

  const handleVolumeChange = (newVol: number) => {
    if (!playerRef.current || !isReady) return;
    setVolume(newVol);
    playerRef.current.setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
      playerRef.current.unMute();
    }
    triggerShowControls();
  };

  const toggleMute = () => {
    if (!playerRef.current || !isReady) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
      playerRef.current.setVolume(volume || 80);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
    triggerShowControls();
  };

  const handleRateChange = (rate: number) => {
    if (!playerRef.current || !isReady) return;
    playerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    triggerShowControls();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen error:", err);
      });
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowLeft" || e.key === "j") {
      e.preventDefault();
      handleSkip(-10);
    } else if (e.key === "ArrowRight" || e.key === "l") {
      e.preventDefault();
      handleSkip(10);
    } else if (e.key === "m") {
      e.preventDefault();
      toggleMute();
    } else if (e.key === "f") {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const formattedSeconds = String(s % 60).padStart(2, "0");
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const formattedMinutes = String(m % 60).padStart(2, "0");
      return `${h}:${formattedMinutes}:${formattedSeconds}`;
    }
    return `${m}:${formattedSeconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseMove={triggerShowControls}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full h-full bg-black select-none overflow-hidden group outline-none font-sans ${className}`}
    >
      {/* 1. YouTube Iframe Mount (Pointer events disabled to prevent any YouTube UI / clickthroughs) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
        <div id={playerContainerId.current} className="w-full h-full" />
      </div>

      {/* 2. Central Click Area (Toggles Play/Pause on click, intercepts all clicks) */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center"
      >
        {/* Buffering Spinner */}
        {isBuffering && (
          <div className="p-4 rounded-full bg-black/60 backdrop-blur-md text-white">
            <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
          </div>
        )}

        {/* Big Center Play Button when Paused */}
        {!isPlaying && !isBuffering && isReady && (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transform transition-transform hover:scale-110 active:scale-95">
            <Play className="h-8 w-8 md:h-10 md:w-10 fill-white translate-x-0.5" />
          </div>
        )}
      </div>

      {/* 3. Top Gradient with Lesson Title */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-white text-sm md:text-base font-semibold truncate drop-shadow-md">
          {title}
        </p>
      </div>

      {/* 4. Bottom Custom LMS Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 px-4 pt-8 pb-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Seekbar / Progress Bar */}
        <div className="relative mb-3 group/seek flex items-center cursor-pointer">
          <div className="w-full h-1.5 group-hover/seek:h-2.5 bg-white/20 rounded-full overflow-hidden transition-all relative">
            {/* Buffered Progress */}
            <div
              className="absolute top-0 left-0 bottom-0 bg-white/30 transition-all duration-200"
              style={{ width: `${buffered}%` }}
            />
            {/* Played Progress */}
            <div
              className="absolute top-0 left-0 bottom-0 bg-brand-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Interactive Range Input */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => {
              setIsDraggingSeek(true);
              const val = parseFloat(e.target.value);
              setCurrentTime(val);
            }}
            onMouseUp={(e) => {
              setIsDraggingSeek(false);
              handleSeek(parseFloat((e.target as HTMLInputElement).value));
            }}
            onTouchEnd={(e) => {
              setIsDraggingSeek(false);
              handleSeek(parseFloat((e.target as HTMLInputElement).value));
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Control Buttons & Indicators */}
        <div className="flex items-center justify-between text-white text-xs md:text-sm">
          {/* Left Controls: Play, Skips, Time */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:bg-white/15 rounded-lg transition text-white hover:text-brand-400 cursor-pointer"
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              onClick={() => handleSkip(-10)}
              className="p-1.5 hover:bg-white/15 rounded-lg transition text-slate-300 hover:text-white cursor-pointer"
              title="Rewind 10s (Left Arrow)"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleSkip(10)}
              className="p-1.5 hover:bg-white/15 rounded-lg transition text-slate-300 hover:text-white cursor-pointer"
              title="Forward 10s (Right Arrow)"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            {/* Time Stamp */}
            <div className="text-slate-300 text-xs font-mono ml-1 select-none">
              <span className="text-white font-medium">{formatTime(currentTime)}</span> /{" "}
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Volume, Speed, Fullscreen */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:bg-white/15 rounded-lg transition text-slate-300 hover:text-white cursor-pointer"
                title={isMuted ? "Unmute (M)" : "Mute (M)"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5 text-red-400" />
                ) : volume < 50 ? (
                  <Volume1 className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="w-16 md:w-20 h-1 bg-white/30 rounded-lg accent-brand-500 cursor-pointer hidden sm:block"
                title="Volume"
              />
            </div>

            {/* Playback Speed Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 hover:bg-white/15 rounded-md transition text-slate-300 hover:text-white font-semibold text-xs cursor-pointer flex items-center gap-1"
                title="Playback Speed"
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-lg shadow-2xl py-1 w-24 text-xs z-30">
                  <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    Speed
                  </div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-brand-600/30 transition ${
                        playbackRate === rate ? "text-brand-400 font-bold" : "text-slate-200"
                      }`}
                    >
                      <span>{rate}x</span>
                      {playbackRate === rate && <Check className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-white/15 rounded-lg transition text-slate-300 hover:text-white cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
