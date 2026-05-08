interface MeshGradientBgProps {
  className?: string;
  variant?: 'hero' | 'page' | 'subtle';
}

const MeshGradientBg = ({ className = '', variant = 'page' }: MeshGradientBgProps) => {
  if (variant === 'hero') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Main mesh */}
        <div className="absolute inset-0 mesh-bg opacity-100" />

        {/* Animated orbs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full
          bg-indigo-600/20 blur-[120px] animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full
          bg-purple-600/15 blur-[100px] animate-float"
          style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full
          bg-blue-600/10 blur-[80px] animate-float"
          style={{ animationDelay: '-5s' }} />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-primary)]" />
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute -top-60 -right-60 w-[400px] h-[400px] rounded-full
          bg-indigo-600/10 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[300px] h-[300px] rounded-full
          bg-purple-600/8 blur-[80px]" />
      </div>
    );
  }

  // page variant
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full
        bg-indigo-600/15 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full
        bg-purple-600/10 blur-[80px]" />
    </div>
  );
};

export default MeshGradientBg;
