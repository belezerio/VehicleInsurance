interface ShimmerLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'table-row';
  count?: number;
  className?: string;
}

const ShimmerLoader = ({ variant = 'card', count = 1, className = '' }: ShimmerLoaderProps) => {
  const items = Array.from({ length: count });

  const baseShimmer = `
    relative overflow-hidden rounded-2xl
    bg-[var(--bg-glass)] border border-[var(--border-glass)]
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent
    before:animate-shimmer before:bg-[length:200%_100%]
  `;

  if (variant === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className={`${baseShimmer} h-48`}>
            <div className="p-6 space-y-4">
              <div className="h-4 w-3/4 rounded-lg bg-white/5" />
              <div className="h-3 w-1/2 rounded-lg bg-white/5" />
              <div className="h-3 w-5/6 rounded-lg bg-white/5" />
              <div className="h-10 w-32 rounded-xl bg-white/5 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className={`${baseShimmer} h-4 rounded-lg`} style={{ width: `${75 + Math.random() * 25}%` }} />
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={`flex gap-3 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className={`${baseShimmer} w-12 h-12 !rounded-full`} />
        ))}
      </div>
    );
  }

  // table-row
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className={`${baseShimmer} h-16 flex items-center gap-4 px-6`}>
          <div className="h-3 w-24 rounded bg-white/5" />
          <div className="h-3 w-32 rounded bg-white/5" />
          <div className="h-3 w-20 rounded bg-white/5 ml-auto" />
        </div>
      ))}
    </div>
  );
};

export default ShimmerLoader;
