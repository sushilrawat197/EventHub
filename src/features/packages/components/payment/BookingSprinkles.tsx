import { useEffect, useRef } from "react";

const COLORS = ["#059669", "#fbbf24", "#38bdf8", "#f472b6", "#f8fafc", "#a78bfa", "#fb7185"];

type Sprinkle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  spin: number;
  color: string;
  circle: boolean;
};

function burst(width: number, originY: number, count: number): Sprinkle[] {
  return Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.1;
    const speed = 3.2 + Math.random() * 6.4;
    return {
      x: width * (0.18 + Math.random() * 0.64),
      y: originY + Math.random() * 24,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2.4,
      vy: Math.sin(angle) * speed,
      w: 5 + Math.random() * 7,
      h: 2.2 + Math.random() * 3.4,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.28,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      circle: Math.random() > 0.55,
    };
  });
}

/** One-shot canvas sprinkle burst for a confirmed booking. */
export default function BookingSprinkles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { width, height };
    };

    const { width } = paint();
    const pieces = [...burst(width, 72, 78), ...burst(width, 120, 36)];
    const started = performance.now();
    const duration = 2800;

    const tick = (now: number) => {
      const elapsed = now - started;
      const { width: w, height: h } = paint();
      ctx.clearRect(0, 0, w, h);
      const life = Math.max(0, 1 - elapsed / duration);
      for (const piece of pieces) {
        piece.vy += 0.11;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vx *= 0.992;
        piece.rot += piece.spin;
        ctx.save();
        ctx.globalAlpha = life;
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rot);
        ctx.fillStyle = piece.color;
        if (piece.circle) {
          ctx.beginPath();
          ctx.arc(0, 0, piece.w * 0.38, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
        }
        ctx.restore();
      }
      if (elapsed < duration) frame = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-40 h-full w-full" />;
}
