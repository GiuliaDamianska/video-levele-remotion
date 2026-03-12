import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface GlassCardProps {
  text: string;
  level: string;
  enterFrame: number;
  exitFrame: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  text,
  level,
  enterFrame,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Only render when relevant
  if (frame < enterFrame - 5 || frame > exitFrame + 30) return null;

  // Spring entrance
  const enterSpring = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const enterY = interpolate(enterSpring, [0, 1], [200, 0]);
  const enterOpacity = interpolate(enterSpring, [0, 1], [0, 1]);

  // Exit slide down
  const exitProgress = interpolate(frame, [exitFrame, exitFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(exitProgress, [0, 1], [0, 200]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  const translateY = enterY + exitY;
  const opacity = enterOpacity * exitOpacity;

  // Progress bar
  const progress = interpolate(frame, [enterFrame, exitFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 180,
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        width: "85%",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 20,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)",
        padding: "28px 32px 24px",
      }}
    >
      {/* Level badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "rgba(232,97,60,0.15)",
          border: "1px solid rgba(232,97,60,0.4)",
          borderRadius: 8,
          padding: "4px 10px",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            color: "#E8613C",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "Inter, system-ui, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          {level}
        </span>
      </div>

      {/* Main text */}
      <p
        style={{
          color: "#FFFFFF",
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "Inter, system-ui, sans-serif",
          lineHeight: 1.35,
          margin: 0,
          marginBottom: 22,
        }}
      >
        {text}
      </p>

      {/* Progress bar track */}
      <div
        style={{
          width: "100%",
          height: 2,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, #E8613C, #FF8C5A)",
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
};
