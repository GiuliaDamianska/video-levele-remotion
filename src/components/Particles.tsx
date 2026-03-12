import { useCurrentFrame } from "remotion";

const PARTICLE_COUNT = 80;
const COLORS = ["#E8613C", "#58A6FF", "#FFFFFF"];

interface Particle {
  seed: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  driftAmt: number;
  colorIndex: number;
  baseOpacity: number;
}

const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const seed = i * 137.508;
  return {
    seed,
    x: (Math.sin(seed) * 0.5 + 0.5) * 1080,
    y: (Math.cos(seed * 1.3) * 0.5 + 0.5) * 1920,
    size: 2 + (Math.abs(Math.sin(seed * 2.7)) * 2),
    speed: 0.003 + Math.abs(Math.sin(seed * 0.5)) * 0.007,
    driftAmt: 15 + Math.abs(Math.cos(seed * 0.8)) * 25,
    colorIndex: i % COLORS.length,
    baseOpacity: 0.05 + Math.abs(Math.sin(seed * 1.7)) * 0.10,
  };
});

export const Particles: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {particles.map((p, i) => {
        const dx = Math.sin(frame * p.speed + p.seed) * p.driftAmt;
        const dy = Math.cos(frame * p.speed * 0.7 + p.seed) * p.driftAmt;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + dx,
              top: p.y + dy,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: COLORS[p.colorIndex],
              opacity: p.baseOpacity,
            }}
          />
        );
      })}
    </div>
  );
};
