# Levele — Instagram Reel built with Remotion

A 30-second vertical video (1080×1920) for Instagram Reels, built entirely in React + TypeScript. No video editing software — just code.

## What it is

**"Levele"** is an animated educational Reel walking through 5 levels of Claude AI usage, from beginner to advanced. Each level gets a full-screen kinetic reveal with spring physics and scan line effects.

## Preview

- 900 frames @ 30fps = 30 seconds
- Format: 1080×1920 (Instagram Reels / TikTok)
- Language: Polish

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Remotion](https://remotion.dev) | 4.0.434 | React-based video framework |
| React | 19 | UI |
| TypeScript | 5.9 | Type safety |
| `@remotion/google-fonts` | 4.0.434 | Caveat font loading |
| Tailwind CSS v4 | 4.0 | Utility styles |

## Animation techniques

- `spring()` + `interpolate()` for all motion — no CSS transitions
- SVG `stroke-dashoffset` for draw-on line animations
- Kinetic typography with full-screen number reveals
- Scan line sweep effect per level
- Flash transitions between levels
- Animated progress bar (gamification)
- SVG `feTurbulence` grain texture overlay

## Getting started

```bash
npm install
npm run dev        # opens Remotion Studio at localhost:3000
```

Select **Levele** from the composition list.

## Render to video

```bash
npx remotion render Levele out/levele.mp4
```

## Project structure

```
src/
  Levele.tsx          # Main composition (all animation logic)
  Root.tsx            # Composition registry
  components/
    Background.tsx    # Animated orbs, particles, grid, grain
    GlassCard.tsx     # Frosted glass card (earlier version)
    Particles.tsx     # 80-dot particle field
    PyramidLayer.tsx  # Pyramid layer component (earlier version)
```

## License

Personal/educational use. For commercial use see [Remotion license](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
