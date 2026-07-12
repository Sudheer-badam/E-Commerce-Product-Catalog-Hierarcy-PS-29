'use client';
import React, { useEffect, useState } from 'react';

const PLAYLIST = [
  "5889465-uhd_3840_2160_25fps.mp4",
  "5662337-hd_1080_1920_25fps.mp4",
  "5836561-uhd_2160_3840_30fps.mp4",
  "5889747-uhd_2160_3840_25fps.mp4",
  "5890235-uhd_2160_3840_25fps.mp4",
  "6342197-uhd_2160_3840_24fps.mp4",
  "6956686-hd_1080_1920_25fps.mp4",
  "7287926-uhd_3840_2160_25fps.mp4",
  "7288127-uhd_2160_3840_25fps.mp4",
  "7308102-hd_1920_1080_24fps.mp4",
  "7669660-hd_1080_1920_25fps.mp4",
  "7680430-uhd_4096_2160_25fps.mp4",
  "7855462-uhd_3840_2160_25fps.mp4",
  "8626759-hd_1920_1080_25fps.mp4",
  "8628061-hd_1080_1920_25fps.mp4",
  "8938174-hd_1080_1920_30fps.mp4",
  "istockphoto-1208403780-640_adpp_is.mp4",
  "istockphoto-884005050-640_adpp_is.mp4",
  "13441356-uhd_2160_3840_24fps.mp4",
  "5836561-uhd_2160_3840_30fps (1).mp4",
];

export interface VideoGlobeProps {
  size?: number;   // diameter of the whole sphere in px
  speed?: number;  // rotation duration in seconds
}

export default function VideoGlobe({ size = 500, speed = 40 }: VideoGlobeProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const numVideos = 6;
  const itemSize  = Math.round(size * 0.32);   // SQUARE tile — larger
  const R         = Math.round(size * 0.56);   // bigger orbit radius

  const nodes = PLAYLIST.slice(0, numVideos).map((vid, i) => {
    const phi   = Math.acos(1 - (2 * (i + 0.5)) / numVideos);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return {
      vid,
      rotY: (theta * 180) / Math.PI,
      rotX: (phi   * 180) / Math.PI - 90,
    };
  });

  return (
    /*
     * IMPORTANT: This wrapper must have an EXPLICIT width & height so that
     * child absolute positions work. We use size × size.
     */
    <div
      style={{
        width:  size,
        height: size,
        position: 'relative',
        perspective: `${size * 2.4}px`,
        flexShrink: 0,
      }}
    >
      <style>{`
        @keyframes vg-spin {
          from { transform: rotateX(-22deg) rotateY(0deg); }
          to   { transform: rotateX(-22deg) rotateY(360deg); }
        }
      `}</style>

      {/* Spinning rig — centred inside the box */}
      <div
        style={{
          position:  'absolute',
          top:  '50%',
          left: '50%',
          width:  0,
          height: 0,
          transformStyle: 'preserve-3d',
          animation: `vg-spin ${speed}s linear infinite`,
        }}
      >
        {nodes.map(({ vid, rotY, rotX }, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width:     itemSize,
              height:    itemSize,
              marginLeft: -itemSize / 2,
              marginTop:  -itemSize / 2,
              borderRadius: 14,          // SQUARE with rounded corners
              overflow: 'hidden',
              border: '2px solid rgba(197,160,89,0.75)',
              boxShadow: '0 0 20px rgba(197,160,89,0.5), 0 4px 24px rgba(0,0,0,0.6)',
              transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${R}px)`,
              backfaceVisibility: 'visible',
              background: '#000',
            }}
          >
            {/* 3-D sphere shading */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%', zIndex: 2,
              background: 'radial-gradient(circle at 33% 28%, rgba(255,255,255,0.22) 0%, rgba(0,0,0,0.6) 100%)',
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }} />
            <video
              src={`/videos/${vid}`}
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
