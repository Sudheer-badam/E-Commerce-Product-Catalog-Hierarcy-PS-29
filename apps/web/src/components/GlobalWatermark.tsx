'use client';
import React, { useState, useEffect, useRef } from 'react';

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

export default function GlobalWatermark() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -10,
      opacity: 0.55,
      pointerEvents: 'none',
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gridTemplateRows: 'repeat(4, 1fr)',
      overflow: 'hidden'
    }}>
      {PLAYLIST.map((vid, i) => (
        <video 
          key={i}
          autoPlay 
          muted 
          loop
          playsInline 
          src={`/videos/${vid}`} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover'
          }}
        />
      ))}
    </div>
  );
}
