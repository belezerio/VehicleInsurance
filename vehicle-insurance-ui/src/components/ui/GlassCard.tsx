import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
  hoverScale?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ children, className = '', tilt = false, glow = false, hoverScale = true, onClick }: GlassCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`
        relative overflow-hidden rounded-2xl
        bg-[var(--bg-glass)] backdrop-blur-xl
        border border-[var(--border-glass)]
        shadow-glass transition-colors duration-300
        ${glow ? 'hover:shadow-glow' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      whileHover={hoverScale ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Gradient border overlay on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.05), transparent)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
