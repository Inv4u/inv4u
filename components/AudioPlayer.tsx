'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Minimal audio player for the Hebrew AI-call demo. Play/pause + a seekable
 * progress bar. The parent decides whether to render this at all (only when the
 * mp3 exists), so there is no broken/empty state here.
 */
export default function AudioPlayer({
  src,
  label = 'האזינו לשיחה',
}: {
  src: string;
  label?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    const t = Number(e.target.value);
    a.currentTime = t;
    setCurrent(t);
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
      dir="rtl"
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'עצור' : 'נגן'}
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy text-white transition-colors hover:bg-[#0a1538]"
      >
        {playing ? (
          <Pause className="h-5 w-5" fill="currentColor" />
        ) : (
          <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-brand-navy">{label}</span>
          <span dir="ltr" className="text-xs tabular-nums text-gray-400">
            {formatTime(current)} / {formatTime(duration)}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={onSeek}
          aria-label="מיקום בשיחה"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-brand-blue"
          style={{
            background: `linear-gradient(to left, #1A56DB ${pct}%, #E5E7EB ${pct}%)`,
          }}
        />
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  );
}
