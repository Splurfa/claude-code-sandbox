import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

// --- Physics Engine Utilities ---

type Vector = { x: number; y: number };
type Particle = {
  id: number;
  pos: Vector;
  vel: Vector;
  acc: Vector;
  radius: number;
  life: number;
  color: string;
  mass: number;
  data?: any; // Custom data for specific visuals
};

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const useRelativeMouse = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const touch = e.touches[0];
    mouseRef.current = {
      x: (touch.clientX - rect.left) / rect.width,
      y: (touch.clientY - rect.top) / rect.height
    };
  }, []);

  return { ref, mouseRef, handleMouseMove, handleTouchMove };
};

// --- 01: State of Mind (Neural Swarm) ---
export const VisualHero: React.FC = () => {
  const { ref, mouseRef, handleMouseMove, handleTouchMove } = useRelativeMouse();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    particles.current = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      pos: { x: Math.random() * 100, y: Math.random() * 100 },
      vel: { x: randomRange(-0.2, 0.2), y: randomRange(-0.2, 0.2) },
      acc: { x: 0, y: 0 },
      radius: randomRange(0.5, 2),
      life: 1,
      color: 'rgba(255, 255, 255, 0.6)',
      mass: 1
    }));
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    const mx = mouseRef.current.x * 100;
    const my = mouseRef.current.y * 100;

    particles.current.forEach(p => {
      const dx = p.pos.x - mx;
      const dy = p.pos.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
      const force = 20 / dist;
      p.vel.x += (dx / dist) * force;
      p.vel.y += (dy / dist) * force;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;

    const render = () => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const scaleX = width / 100;
      const scaleY = height / 100;
      const mx = mouseRef.current.x * 100;
      const my = mouseRef.current.y * 100;

      particles.current.forEach(p => {
        const dx = mx - p.pos.x;
        const dy = my - p.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
          p.acc.x += dx * 0.0005;
          p.acc.y += dy * 0.0005;
        }

        p.acc.x += randomRange(-0.05, 0.05);
        p.acc.y += randomRange(-0.05, 0.05);

        p.vel.x += p.acc.x;
        p.vel.y += p.acc.y;
        p.vel.x *= 0.96;
        p.vel.y *= 0.96;

        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        p.acc = { x: 0, y: 0 };

        if (p.pos.x < 0) p.pos.x = 100;
        if (p.pos.x > 100) p.pos.x = 0;
        if (p.pos.y < 0) p.pos.y = 100;
        if (p.pos.y > 100) p.pos.y = 0;

        ctx.beginPath();
        ctx.arc(p.pos.x * scaleX, p.pos.y * scaleY, p.radius * (width / 100 * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, 50 / dist)})`;
        ctx.fill();

        particles.current.forEach(p2 => {
          if (p === p2) return;
          const dx2 = p.pos.x - p2.pos.x;
          const dy2 = p.pos.y - p2.pos.y;
          const d2 = dx2 * dx2 + dy2 * dy2;
          if (d2 < 50) {
            ctx.beginPath();
            ctx.moveTo(p.pos.x * scaleX, p.pos.y * scaleY);
            ctx.lineTo(p2.pos.x * scaleX, p2.pos.y * scaleY);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - d2 / 50)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animationId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
      onClick={handleClick}
      className="w-full h-full cursor-pointer"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

// --- 02: Vision (Canvas-based Equalizer) ---
export const VisualPhilosophy: React.FC = () => {
  const { ref, mouseRef, handleMouseMove, handleTouchMove } = useRelativeMouse();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveOffsetRef = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    waveOffsetRef.current += Math.PI;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const render = () => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = 20;
      const barWidth = width / (barCount * 1.5);
      const spacing = width / barCount;
      const time = Date.now() / 1000;

      // Cap max height to 40% of container to keep it horizontal/strip-like
      const maxBarHeight = height * 0.4;

      for (let i = 0; i < barCount; i++) {
        const normalizedIndex = i / barCount;
        const distFromMouse = Math.abs(normalizedIndex - mouseRef.current.x);
        // Swelling effect based on mouse proximity
        const mouseInfluence = Math.max(0, 1 - distFromMouse * 4);

        // Wave calculation
        const baseHeightPercent = 20 + (mouseInfluence * 60) + (Math.sin(i * 0.5 + waveOffsetRef.current + time) * 10);
        const h = (Math.min(100, Math.max(5, baseHeightPercent)) / 100) * maxBarHeight;

        const x = i * spacing + (spacing - barWidth) / 2;
        // Center vertically
        const y = (height - h) / 2;

        // Draw Bar
        const gradient = ctx.createLinearGradient(0, y + h, 0, y);
        gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0.4)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, h, 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onClick={handleClick} className="w-full h-full cursor-pointer">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

// --- 03: Mechanism (Square + Peg + Axis Physics) ---
export const VisualArchitecture: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const balls = useRef<Particle[]>([]);

  // Constants
  // We will map 0-100 coordinates to a centered square in the canvas
  const BOUNDS = { x: 25, y: 25, w: 50, h: 50 }; // Square 25,25 to 75,75 in logical coords
  const CENTER = { x: 50, y: 50 };
  const PEG_RADIUS = 8;
  const BALL_R = 2;

  const spawnBall = (x?: number, y?: number) => {
    // Spawn from edges outside
    const side = Math.floor(Math.random() * 4);
    let sx = 50, sy = 50;
    const offset = 60;

    if (x === undefined) {
      switch (side) {
        case 0: sx = 50; sy = -offset; break;
        case 1: sx = 100 + offset; sy = 50; break;
        case 2: sx = 50; sy = 100 + offset; break;
        case 3: sx = -offset; sy = 50; break;
      }
    } else {
      sx = x; sy = y;
    }

    const angle = Math.atan2(50 - sy, 50 - sx) + (Math.random() - 0.5) * 0.5;
    const speed = 0.8 + Math.random() * 0.5;

    balls.current.push({
      id: Date.now() + Math.random(),
      pos: { x: sx, y: sy },
      vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      acc: { x: 0, y: 0 },
      radius: BALL_R,
      life: 1,
      color: '#fff',
      mass: 1,
      data: { captured: false }
    });
  };

  useEffect(() => {
    if (balls.current.length === 0) spawnBall();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    spawnBall();
    // Jolt captured balls
    balls.current.forEach(b => {
      if (b.data.captured) {
        b.vel.x += (Math.random() - 0.5) * 2;
        b.vel.y += (Math.random() - 0.5) * 2;
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const update = () => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      const width = canvas.width;
      const height = canvas.height;

      // Enforce Square Aspect Ratio Logic
      // We want the logical 100x100 space to fit inside the canvas as a centered square
      const size = Math.min(width, height);
      const scale = size / 100;
      const offsetX = (width - size) / 2;
      const offsetY = (height - size) / 2;

      // Helper transform function
      const tx = (val: number) => offsetX + val * scale;
      const ty = (val: number) => offsetY + val * scale;
      const ts = (val: number) => val * scale; // Transform Scale

      ctx.clearRect(0, 0, width, height);

      // Draw Environment
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;

      // 1. Square Boundary
      ctx.beginPath();
      ctx.rect(tx(BOUNDS.x), ty(BOUNDS.y), ts(BOUNDS.w), ts(BOUNDS.h));
      ctx.stroke();

      // 2. Center Peg
      ctx.beginPath();
      ctx.arc(tx(CENTER.x), ty(CENTER.y), ts(PEG_RADIUS), 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fill();

      // 3. Axis Lines (Visual + Physics)
      ctx.beginPath();
      // Horizontal
      ctx.moveTo(tx(BOUNDS.x), ty(CENTER.y));
      ctx.lineTo(tx(BOUNDS.x + BOUNDS.w), ty(CENTER.y));
      // Vertical
      ctx.moveTo(tx(CENTER.x), ty(BOUNDS.y));
      ctx.lineTo(tx(CENTER.x), ty(BOUNDS.y + BOUNDS.h));
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.stroke();

      // Physics Loop
      for (let i = 0; i < balls.current.length; i++) {
        const b = balls.current[i];
        b.pos.x += b.vel.x;
        b.pos.y += b.vel.y;

        // Check capture (Inside Square)
        if (!b.data.captured) {
          if (b.pos.x > BOUNDS.x + BALL_R && b.pos.x < BOUNDS.x + BOUNDS.w - BALL_R &&
            b.pos.y > BOUNDS.y + BALL_R && b.pos.y < BOUNDS.y + BOUNDS.h - BALL_R) {
            b.data.captured = true;
          }
        }

        if (b.data.captured) {
          // A. Wall Collisions (Keep Inside Square)
          if (b.pos.x < BOUNDS.x + BALL_R) { b.pos.x = BOUNDS.x + BALL_R; b.vel.x *= -0.8; }
          if (b.pos.x > BOUNDS.x + BOUNDS.w - BALL_R) { b.pos.x = BOUNDS.x + BOUNDS.w - BALL_R; b.vel.x *= -0.8; }
          if (b.pos.y < BOUNDS.y + BALL_R) { b.pos.y = BOUNDS.y + BALL_R; b.vel.y *= -0.8; }
          if (b.pos.y > BOUNDS.y + BOUNDS.h - BALL_R) { b.pos.y = BOUNDS.y + BOUNDS.h - BALL_R; b.vel.y *= -0.8; }

          // B. Peg Collision (Center Circle)
          const pdx = b.pos.x - CENTER.x;
          const pdy = b.pos.y - CENTER.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pdist < PEG_RADIUS + BALL_R) {
            const overlap = (PEG_RADIUS + BALL_R) - pdist;
            const nx = pdx / pdist;
            const ny = pdy / pdist;
            b.pos.x += nx * overlap;
            b.pos.y += ny * overlap;

            // Reflect velocity
            const dot = b.vel.x * nx + b.vel.y * ny;
            b.vel.x -= 2 * dot * nx;
            b.vel.y -= 2 * dot * ny;
            // Energy loss
            b.vel.x *= 0.9;
            b.vel.y *= 0.9;
          }

          // C. Axis Collision (Cross Lines)
          // Treat as thin rectangles. H-Axis (y=50), V-Axis (x=50).
          if (pdist > PEG_RADIUS) {
            const AXIS_THICKNESS = 0.5;

            // H-Axis
            if (Math.abs(b.pos.y - CENTER.y) < AXIS_THICKNESS + BALL_R) {
              // Check if strictly approaching axis
              if (Math.sign(b.vel.y) !== Math.sign(b.pos.y - CENTER.y)) {
                b.vel.y *= -0.8;
                b.pos.y = CENTER.y + (Math.sign(b.pos.y - CENTER.y) * (AXIS_THICKNESS + BALL_R + 0.1));
              }
            }

            // V-Axis
            if (Math.abs(b.pos.x - CENTER.x) < AXIS_THICKNESS + BALL_R) {
              if (Math.sign(b.vel.x) !== Math.sign(b.pos.x - CENTER.x)) {
                b.vel.x *= -0.8;
                b.pos.x = CENTER.x + (Math.sign(b.pos.x - CENTER.x) * (AXIS_THICKNESS + BALL_R + 0.1));
              }
            }
          }
        }

        // D. Ball-Ball Collision
        for (let j = i + 1; j < balls.current.length; j++) {
          const b2 = balls.current[j];
          const bdx = b2.pos.x - b.pos.x;
          const bdy = b2.pos.y - b.pos.y;
          const dist = Math.sqrt(bdx * bdx + bdy * bdy);
          if (dist < BALL_R * 2) {
            const overlap = BALL_R * 2 - dist;
            const ndx = bdx / dist;
            const ndy = bdy / dist;
            b.pos.x -= ndx * overlap * 0.5;
            b.pos.y -= ndy * overlap * 0.5;
            b2.pos.x += ndx * overlap * 0.5;
            b2.pos.y += ndy * overlap * 0.5;

            const dvx = b2.vel.x - b.vel.x;
            const dvy = b2.vel.y - b.vel.y;
            const velAlongNormal = dvx * ndx + dvy * ndy;
            if (velAlongNormal > 0) continue;

            const imp = -(1.9) * velAlongNormal / 2;
            b.vel.x -= imp * ndx;
            b.vel.y -= imp * ndy;
            b2.vel.x += imp * ndx;
            b2.vel.y += imp * ndy;
          }
        }

        // Draw Ball
        ctx.beginPath();
        ctx.arc(tx(b.pos.x), ty(b.pos.y), ts(b.radius), 0, Math.PI * 2);
        ctx.fillStyle = b.data.captured ? '#fff' : 'rgba(255,255,255,0.5)';
        ctx.shadowBlur = b.data.captured ? 10 : 0;
        ctx.shadowColor = 'white';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div ref={containerRef} onClick={handleClick} className="w-full h-full flex items-center justify-center cursor-pointer">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

// --- 04: Value (Fluid Flow) ---
export const VisualValue: React.FC = () => {
  const { ref, mouseRef, handleMouseMove, handleTouchMove } = useRelativeMouse();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const spawnRate = 1; // Reduced from 2 for slower accumulation

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const update = () => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      const width = canvas.width;
      const height = canvas.height;
      const scaleX = width / 100;
      const scaleY = height / 100;
      const mx = mouseRef.current.x * 100;
      const my = mouseRef.current.y * 100;

      // Spawn new particles (Slower speed)
      if (Math.random() > 0.5) { // Only spawn sometimes to reduce density buildup if needed
        for (let k = 0; k < spawnRate; k++) {
          particles.current.push({
            id: Math.random(),
            pos: { x: 50 + (Math.random() - 0.5) * 10, y: 0 },
            vel: { x: (Math.random() - 0.5) * 0.1, y: 0.2 + Math.random() * 0.2 }, // Slower initial velocity
            acc: { x: 0, y: 0 },
            radius: Math.random() > 0.9 ? 1.5 : 0.8,
            life: 100,
            color: 'rgba(255,255,255,0.5)',
            mass: 1
          });
        }
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.acc.y += 0.008; // Reduced gravity (was 0.02)

        const dx = p.pos.x - mx;
        const dy = p.pos.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 20) {
          const force = (20 - dist) * 0.05;
          p.acc.x += (dx / dist) * force;
          p.acc.y += (dy / dist) * force;
        }

        const centerDist = p.pos.x - 50;
        p.acc.x -= centerDist * 0.001;

        p.vel.x += p.acc.x;
        p.vel.y += p.acc.y;
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        p.acc = { x: 0, y: 0 };

        ctx.beginPath();
        ctx.arc(p.pos.x * scaleX, p.pos.y * scaleY, p.radius * (width / 100 * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255, ${Math.max(0, (1 - p.pos.y / 110) + 0.2)})`;
        ctx.fill();

        if (p.pos.y > 120) particles.current.splice(i, 1); // Kill boundary extended
      }

      animId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
      onClick={(e) => e.stopPropagation()}
      className="w-full h-full cursor-pointer"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

// --- 05: Leadership (Binary Systems) ---
export const VisualStewards: React.FC = () => {
  const { ref, mouseRef, handleMouseMove, handleTouchMove } = useRelativeMouse();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    particles.current = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      pos: { x: Math.random() * 100, y: Math.random() * 100 },
      vel: { x: (Math.random() - 0.5), y: (Math.random() - 0.5) },
      acc: { x: 0, y: 0 },
      radius: Math.random() * 1.5,
      life: 1,
      color: '#fff',
      mass: 1
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const update = () => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      const width = canvas.width;
      const height = canvas.height;
      const scaleX = width / 100;
      const scaleY = height / 100;
      const mx = mouseRef.current.x * 100;
      const my = mouseRef.current.y * 100;

      ctx.clearRect(0, 0, width, height);

      const att1 = { x: 30, y: 50 };
      const att2 = { x: 70, y: 50 };

      ctx.beginPath();
      ctx.arc(att1.x * scaleX, att1.y * scaleY, 15 * scaleX, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(att2.x * scaleX - 10 * scaleX, att2.y * scaleY - 10 * scaleY, 20 * scaleX, 20 * scaleY);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.stroke();

      particles.current.forEach(p => {
        [att1, att2].forEach(att => {
          const dx = att.x - p.pos.x;
          const dy = att.y - p.pos.y;
          const d2 = dx * dx + dy * dy;
          const dist = Math.sqrt(d2);
          if (dist > 1) {
            const force = 20 / d2;
            p.acc.x += (dx / dist) * force;
            p.acc.y += (dy / dist) * force;
          }
        });

        const mdx = mx - p.pos.x;
        const mdy = my - p.pos.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 400) {
          const mdist = Math.sqrt(md2);
          const force = -50 / md2;
          p.acc.x += (mdx / mdist) * force;
          p.acc.y += (mdy / mdist) * force;
        }

        p.vel.x += p.acc.x;
        p.vel.y += p.acc.y;
        p.vel.x *= 0.98;
        p.vel.y *= 0.98;
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        p.acc = { x: 0, y: 0 };

        ctx.beginPath();
        ctx.arc(p.pos.x * scaleX, p.pos.y * scaleY, p.radius * scaleX * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();
      });

      ctx.beginPath();
      ctx.moveTo(att1.x * scaleX, att1.y * scaleY);
      ctx.lineTo(mx * scaleX, my * scaleY);
      ctx.lineTo(att2.x * scaleX, att2.y * scaleY);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.stroke();

      animId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onClick={(e) => e.stopPropagation()} className="w-full h-full cursor-pointer">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

// --- 06: Gateway ---
export const VisualGateway: React.FC = () => {
  const { ref, mouseRef, handleMouseMove, handleTouchMove } = useRelativeMouse();
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'done'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setButtonState('loading');
    setTimeout(() => {
      setButtonState('done');
      setTimeout(() => {
        window.location.href = 'https://common-thread.io';
      }, 800);
    }, 1500);
  };

  // Particle Swirl Effect
  useEffect(() => {
    particles.current = Array.from({ length: 50 }).map(() => ({
      id: Math.random(),
      pos: { x: Math.random() * 100, y: Math.random() * 100 },
      vel: { x: 0, y: 0 },
      acc: { x: 0, y: 0 },
      radius: Math.random(),
      life: 1,
      color: '#fff',
      mass: 1
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const update = () => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      const width = canvas.width;
      const height = canvas.height;
      const scaleX = width / 100;
      const scaleY = height / 100;

      ctx.clearRect(0, 0, width, height);

      particles.current.forEach(p => {
        // Spiral towards center (50,50)
        const dx = 50 - p.pos.x;
        const dy = 50 - p.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const tangentX = -dy;
        const tangentY = dx;

        p.vel.x += (dx / dist) * 0.05 + (tangentX / dist) * 0.1;
        p.vel.y += (dy / dist) * 0.05 + (tangentY / dist) * 0.1;

        p.vel.x *= 0.92;
        p.vel.y *= 0.92;
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;

        // Reset if too close or out of bounds
        if (dist < 5 || p.pos.x < 0 || p.pos.x > 100 || p.pos.y < 0 || p.pos.y > 100) {
          const angle = Math.random() * Math.PI * 2;
          p.pos.x = 50 + Math.cos(angle) * 60;
          p.pos.y = 50 + Math.sin(angle) * 60;
          p.vel.x = 0; p.vel.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.pos.x * scaleX, p.pos.y * scaleY, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fill();
      });

      animId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
      onClick={(e) => e.stopPropagation()}
      className="w-full h-full flex flex-col items-center justify-center relative cursor-pointer"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="absolute w-[300px] h-[300px] border border-white/10 rounded-full animate-spin-slow" />
        <div className="absolute w-[200px] h-[200px] border border-white/20 rounded-full border-dashed animate-spin-reverse-slow" />
      </div>
      <button
        type="button"
        onClick={handleConnect}
        disabled={buttonState !== 'idle'}
        className="group relative px-10 py-5 min-w-[240px] bg-transparent border border-white/20 text-white overflow-hidden transition-all hover:border-white/50 z-20"
      >
        <div className={`absolute inset-0 bg-white transition-transform duration-[2000ms] ease-in-out origin-left ${buttonState === 'loading' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-hover:duration-300'}`} />
        <span className={`relative z-10 font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-4 font-semibold transition-colors duration-300 ${buttonState === 'loading' ? 'text-black' : 'group-hover:text-black'}`}>
          {buttonState === 'idle' && <>Join the movement <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
          {buttonState === 'loading' && <>Initializing...</>}
          {buttonState === 'done' && <>Redirecting <ExternalLink className="w-4 h-4" /></>}
        </span>
      </button>
    </div>
  );
};