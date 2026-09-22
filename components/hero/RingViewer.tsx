"use client";

export default function RingViewer() {
  return (
    <div style={{ width: "100%", aspectRatio: "1/1", position: "relative" }}>
      <video
        data-testid="hero-ring-video"
        src="/ring-360-transparent.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
