import { interpolate, useCurrentFrame } from "remotion";
import { Particles } from "./Particles";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Orb positions
  const orb1X = 540 + Math.sin(frame * 0.008) * 120;
  const orb1Y = 600 + Math.cos(frame * 0.006) * 80;
  const orb2X = 540 + Math.cos(frame * 0.009) * 150;
  const orb2Y = 1000 + Math.sin(frame * 0.007) * 100;
  const orb3X = 540 + Math.sin(frame * 0.01) * 100;
  const orb3Y = 800 + Math.cos(frame * 0.01) * 100;

  // Film grain base frequency shifts slightly each frame for animation
  const grainFreq = 0.65 + (frame % 7) * 0.01;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Base radial gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, #0D1525 0%, #080810 100%)",
        }}
      />

      {/* Orbs */}
      <div style={{ position: "absolute", inset: 0, opacity: fadeIn }}>
        {/* Orb 1 — orange */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "#E8613C",
            opacity: 0.35,
            filter: "blur(80px)",
            transform: `translate(${orb1X - 300}px, ${orb1Y - 300}px)`,
          }}
        />
        {/* Orb 2 — blue */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "#58A6FF",
            opacity: 0.10,
            filter: "blur(80px)",
            transform: `translate(${orb2X - 250}px, ${orb2Y - 250}px)`,
          }}
        />
        {/* Orb 3 — purple */}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "#BC8CFF",
            opacity: 0.08,
            filter: "blur(80px)",
            transform: `translate(${orb3X - 200}px, ${orb3Y - 200}px)`,
          }}
        />
      </div>

      {/* Subtle grid */}
      <svg
        style={{ position: "absolute", inset: 0, opacity: 0.04 }}
        width={1080}
        height={1920}
      >
        <defs>
          <pattern id="grid" width={60} height={60} patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth={1} />
          </pattern>
        </defs>
        <rect width={1080} height={1920} fill="url(#grid)" />
      </svg>

      {/* Particles */}
      <div style={{ opacity: fadeIn }}>
        <Particles />
      </div>

      {/* Film grain */}
      <svg
        style={{ position: "absolute", inset: 0, opacity: 0.03, mixBlendMode: "overlay" }}
        width={1080}
        height={1920}
      >
        <defs>
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={grainFreq}
              numOctaves={4}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width={1080} height={1920} filter="url(#grain)" />
      </svg>
    </div>
  );
};
