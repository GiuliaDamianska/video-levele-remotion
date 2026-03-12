import { loadFont } from "@remotion/google-fonts/Caveat";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const { fontFamily: caveat } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin", "latin-ext"],
});

// ─── Design tokens ─────────────────────────────────────────────────────────────
const ORANGE = "#E8613C";
const WHITE = "#FFFFFF";
const LEVEL_FRAMES = 140; // frames per level screen
const CTA_START = 700;    // 5 × 140 = 700, then 200 frames of CTA

// ─── Content ───────────────────────────────────────────────────────────────────
const LEVELS = [
  { num: "01", text: "Używasz Claude jak Google" },
  { num: "02", text: "Palisz tokeny w jeden dzień" },
  { num: "03", text: "VS Code. Budujesz pierwsze projekty." },
  { num: "04", text: "Myślisz w systemach. Skills." },
  { num: "05", text: "Claude to Twój zespół." },
];

// ─── Grain texture (SVG, no external assets) ──────────────────────────────────
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const freq = 0.65 + (frame % 8) * 0.008;
  return (
    <svg
      style={{ position: "absolute", inset: 0, opacity: 0.025, pointerEvents: "none", zIndex: 100 }}
      width={1080}
      height={1920}
    >
      <defs>
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={4} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width={1080} height={1920} filter="url(#g)" />
    </svg>
  );
};

// ─── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= CTA_START) return null;

  const levelIdx = Math.min(Math.floor(frame / LEVEL_FRAMES), 4);
  const relFrame = frame - levelIdx * LEVEL_FRAMES;
  const withinLevel = Math.min(relFrame / 90, 1);
  const progress = (levelIdx + withinLevel) / LEVELS.length;

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, zIndex: 90 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)" }} />
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, #c94e2e, ${ORANGE}, #ff8c5a)`,
          boxShadow: `0 0 16px 4px rgba(232,97,60,0.7)`,
          transition: "none",
        }}
      />
    </div>
  );
};

// ─── Level counter badge ───────────────────────────────────────────────────────
const LevelBadge: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= CTA_START) return null;

  const levelIdx = Math.min(Math.floor(frame / LEVEL_FRAMES), 4);
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 90,
        right: 64,
        opacity,
        color: "rgba(255,255,255,0.3)",
        fontSize: 40,
        fontFamily: caveat,
        fontWeight: 700,
        letterSpacing: "0.05em",
        zIndex: 50,
      }}
    >
      {levelIdx + 1}
      <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 30 }}>/5</span>
    </div>
  );
};

// ─── Flash transition between levels ─────────────────────────────────────────
const FlashTransition: React.FC = () => {
  const frame = useCurrentFrame();

  let opacity = 0;
  for (let i = 1; i < 5; i++) {
    const boundary = i * LEVEL_FRAMES;
    if (frame >= boundary - 5 && frame < boundary + 3) {
      const rel = frame - (boundary - 5);
      opacity = Math.max(opacity, interpolate(rel, [0, 3, 7], [0, 1, 0]));
    }
  }
  if (opacity === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: ORANGE,
        opacity,
        zIndex: 80,
        pointerEvents: "none",
      }}
    />
  );
};

// ─── Single level screen ──────────────────────────────────────────────────────
const LevelScreen: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = index * LEVEL_FRAMES;
  const rel = frame - startFrame;

  if (frame < startFrame || frame >= startFrame + LEVEL_FRAMES) return null;

  const { num, text } = LEVELS[index];

  // Number entrance — spring scale from overshooting large
  const numSpring = spring({ frame: rel, fps, config: { damping: 9, stiffness: 140 } });
  const numScale = interpolate(numSpring, [0, 1], [1.6, 1.0]);
  const numOpacity = interpolate(rel, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // "POZIOM" label slides down from above
  const labelSpring = spring({ frame: rel - 5, fps, config: { damping: 12, stiffness: 120 } });
  const labelY = interpolate(labelSpring, [0, 1], [-50, 0]);
  const labelOpacity = interpolate(rel, [5, 22], [0, 1], { extrapolateRight: "clamp" });

  // Divider line draws out
  const lineWidth = interpolate(rel, [28, 70], [0, 78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text chars type in
  const charCount = Math.floor(
    interpolate(rel, [45, 112], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Pulse glow at text completion
  const pulseProgress = interpolate(rel, [115, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulseScale = 1 + pulseProgress * 0.04;
  const pulseGlow = pulseProgress * 0.2;

  // Exit — slide up + fade
  const exitProgress = interpolate(rel, [120, 138], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const containerY = interpolate(exitProgress, [0, 1], [0, -120]);
  const containerOpacity = 1 - exitProgress;

  // Scan line sweeps full height during entrance
  const scanY = interpolate(rel, [0, 38], [-8, 1928], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanGlowOpacity = interpolate(rel, [0, 5, 35, 38], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: containerOpacity,
        transform: `translateY(${containerY}px)`,
        zIndex: 10,
      }}
    >
      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background: ORANGE,
          boxShadow: `0 0 40px 20px rgba(232,97,60,${scanGlowOpacity * 0.7})`,
          opacity: scanGlowOpacity,
          zIndex: 20,
          pointerEvents: "none",
        }}
      />

      {/* Orange background glow behind number */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `rgba(232,97,60,${0.04 + pulseGlow})`,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* POZIOM label */}
      <div
        style={{
          transform: `translateY(${labelY}px)`,
          opacity: labelOpacity,
          color: ORANGE,
          fontSize: 32,
          fontFamily: caveat,
          fontWeight: 700,
          letterSpacing: "0.35em",
          marginBottom: -10,
        }}
      >
        POZIOM
      </div>

      {/* Huge number */}
      <div
        style={{
          color: ORANGE,
          fontSize: 380,
          fontFamily: "'Impact', 'Arial Black', 'Helvetica Neue', sans-serif",
          fontWeight: 900,
          lineHeight: 0.82,
          letterSpacing: "-0.02em",
          transform: `scale(${numScale * pulseScale})`,
          opacity: numOpacity,
          textShadow: `0 0 60px rgba(232,97,60,0.4)`,
        }}
      >
        {num}
      </div>

      {/* Divider line */}
      <div
        style={{
          width: `${lineWidth}%`,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
          marginTop: 28,
          marginBottom: 36,
          borderRadius: 2,
        }}
      />

      {/* Polish insight text */}
      <div
        style={{
          color: WHITE,
          fontSize: 50,
          fontFamily: caveat,
          fontWeight: 700,
          textAlign: "center",
          paddingLeft: 72,
          paddingRight: 72,
          lineHeight: 1.25,
          minHeight: 70,
        }}
      >
        {text.slice(0, charCount)}
        {/* blinking cursor while typing */}
        {charCount < text.length && (
          <span
            style={{
              color: ORANGE,
              opacity: frame % 6 < 3 ? 1 : 0,
            }}
          >
            |
          </span>
        )}
      </div>
    </div>
  );
};

// ─── CTA ───────────────────────────────────────────────────────────────────────
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < CTA_START) return null;

  const rel = frame - CTA_START;

  // Fade in
  const fadeIn = interpolate(rel, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  // Top text spring in
  const text1Spring = spring({ frame: rel - 12, fps, config: { damping: 12, stiffness: 100 } });
  const text1Y = interpolate(text1Spring, [0, 1], [70, 0]);
  const text1Opacity = interpolate(text1Spring, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });

  // @handle bounces in
  const handleSpring = spring({ frame: rel - 55, fps, config: { damping: 8, stiffness: 120 } });
  const handleScale = interpolate(handleSpring, [0, 1], [0.3, 1.0]);
  const handleOpacity = interpolate(handleSpring, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });

  // Pulsing glow
  const glow = 0.12 + 0.08 * Math.sin(rel * 0.10);

  // Horizontal line under @handle
  const lineProgress = interpolate(rel, [80, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn,
        zIndex: 10,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 600,
          borderRadius: "50%",
          background: `rgba(232,97,60,${glow})`,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* Top line */}
      <div
        style={{
          transform: `translateY(${text1Y}px)`,
          opacity: text1Opacity,
          textAlign: "center",
          paddingLeft: 64,
          paddingRight: 64,
          position: "relative",
          zIndex: 1,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            color: WHITE,
            fontSize: 58,
            fontFamily: caveat,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          Przeprowadzę Cię
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 58,
            fontFamily: caveat,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          z{" "}
          <span style={{ color: ORANGE }}>L1</span>
          {" "}do{" "}
          <span style={{ color: ORANGE }}>L5</span>
        </div>
      </div>

      {/* @handle */}
      <div
        style={{
          transform: `scale(${handleScale})`,
          opacity: handleOpacity,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            color: ORANGE,
            fontSize: 92,
            fontFamily: caveat,
            fontWeight: 700,
            textShadow: `0 0 40px rgba(232,97,60,0.5)`,
            textAlign: "center",
          }}
        >
          @giulia__ai
        </div>
        {/* Underline that draws itself */}
        <div
          style={{
            height: 4,
            background: ORANGE,
            width: `${lineProgress * 100}%`,
            marginTop: 4,
            borderRadius: 2,
            boxShadow: `0 0 12px rgba(232,97,60,0.8)`,
          }}
        />
      </div>
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────────
export const Levele: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: "#000000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ProgressBar />
      {LEVELS.map((_, i) => (
        <LevelScreen key={i} index={i} />
      ))}
      <FlashTransition />
      <LevelBadge />
      <CTA />
      <Grain />
    </div>
  );
};
