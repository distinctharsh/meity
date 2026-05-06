export default function Skeleton({ variant = 'line', width, height, className = '', count = 1 }) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const variants = {
    line: `${baseClasses} ${height || 'h-4'}`,
    title: `${baseClasses} ${height || 'h-6'} w-3/4`,
    subtitle: `${baseClasses} ${height || 'h-5'} w-1/2`,
    text: `${baseClasses} ${height || 'h-4'} w-full`,
    card: `${baseClasses} ${height || 'h-32'} w-full`,
    circle: `${baseClasses} rounded-full ${height || 'h-12 w-12'}`,
    avatar: `${baseClasses} rounded-full h-16 w-16`,
    image: `${baseClasses} ${height || 'h-48'} w-full`,
    button: `${baseClasses} ${height || 'h-9'} w-24`,
    tableRow: `${baseClasses} h-10 w-full`,
    badge: `${baseClasses} h-6 w-20 rounded-full`,
  };

  const classes = variants[variant] || variants.line;
  const style = width ? { width } : {};

  if (count === 1) {
    return <div className={`${classes} ${className}`} style={style} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`${classes} ${className}`} style={style} />
      ))}
    </div>
  );
}

// Pre-built skeleton blocks for common layouts
export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} variant="text" className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg p-4 space-y-3">
      <Skeleton variant="title" />
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b">
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton key={i} variant="line" className="h-5 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }, (_, j) => (
            <Skeleton key={j} variant="line" className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonSection() {
  return (
    <div className="space-y-3">
      <Skeleton variant="title" />
      <SkeletonText lines={4} />
    </div>
  );
}

export function SkeletonDownloadCard() {
  return (
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
      <div className="flex items-center gap-2">
        <Skeleton variant="circle" className="h-6 w-6" />
        <Skeleton variant="line" className="h-4 w-40" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton variant="line" className="h-3 w-12" />
        <Skeleton variant="button" className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}
