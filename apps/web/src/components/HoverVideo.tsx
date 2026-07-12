'use client';
import React, { useRef } from 'react';

export function HoverVideo({ vid }: { vid: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  return (
    <video 
      ref={videoRef}
      src={`/videos/${vid}`} 
      muted 
      loop 
      playsInline 
      preload="none"
      onMouseEnter={(e) => { e.currentTarget.play().catch(()=>{}) }}
      onMouseLeave={(e) => { e.currentTarget.pause() }}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
    />
  );
}
