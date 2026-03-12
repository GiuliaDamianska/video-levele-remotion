import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface PyramidLayerProps {
  label: string;
  text: string;
  width: number;
  top: number;
  enterFrame: number;
  flyFrom: "top" | "left" | "right";
  pulseStart: number;
}

export const PyramidLayer: React.FC<PyramidLayerProps> = ({
  label,
  text,
  width,
  top,
  enterFrame,
  flyFrom,
  pulseStart,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const LAYER_HEIGHT = 80;
  const left = 540 - width / 2;

  const enterSpring = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  let translateX = 0;
  let translateY = 0;
  const OFFSCREEN = 1300;

  if (flyFrom === "top") {
    translateY = interpolate(enterSpring, [0, 1], [-OFFSCREEN, 0]);
  } else if (flyFrom === "right") {
    translateX = interpolate(enterSpring, [0, 1], [OFFSCREEN, 0]);
  } else {
    translateX = interpolate(enterSpring, [0, 1], [-OFFSCREEN, 0]);
  }

  const opacity = interpolate(enterSpring, [0, 0.15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Pulse glow when pyramid completes
  const pulseProgress = interpolate(frame, [pulseStart, pulseStart + 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowOpacity =
    pulseProgress > 0
      ? 0.3 + 0.5 * Math.sin(Math.PI * pulseProgress * 4) * (1 - pulseProgress * 0.6)
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height: LAYER_HEIGHT,
        transform: `translate(${translateX}px, ${translateY}px)`,
        opacity,
      }}
    >
      {/* Glow layer */}
      {glowOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: 10,
            boxShadow: `0 0 32px 12px rgba(232,97,60,${glowOpacity})`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Glass layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          background: "rgba(15,15,25,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Orange left accent bar */}
        <div
          style={{
            width: 6,
            alignSelf: "stretch",
            background: "#E8613C",
            flexShrink: 0,
          }}
        />

        {/* Label */}
        <span
          style={{
            color: "#E8613C",
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "Inter, system-ui, sans-serif",
            padding: "0 18px",
            flexShrink: 0,
            letterSpacing: "0.03em",
          }}
        >
          {label}
        </span>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 40,
            background: "rgba(255,255,255,0.15)",
            flexShrink: 0,
          }}
        />

        {/* Text — single line, no wrap */}
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 22,
            fontWeight: 500,
            fontFamily: "Inter, system-ui, sans-serif",
            padding: "0 20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
