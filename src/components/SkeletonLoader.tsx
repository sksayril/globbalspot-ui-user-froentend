import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  height = 'h-4', 
  width = 'w-full', 
  rounded = 'rounded' 
}) => (
  <div className={`animate-pulse bg-gray-200 ${height} ${width} ${rounded} ${className}`}></div>
);

// Card skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-6 w-full mb-3" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

// Stats card skeleton
export const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/50">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-5 w-24 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="w-16 h-8 rounded" />
    </div>
  </div>
);

// Profile header skeleton
export const ProfileHeaderSkeleton: React.FC = () => (
  <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-6 py-12 text-white overflow-hidden">
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/5 to-transparent"></div>
    
    <div className="relative z-10 flex items-start">
      <div className="flex items-center space-x-4 max-w-md">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// Grid skeleton
export const GridSkeleton: React.FC<{ cols?: number; rows?: number }> = ({ cols = 2, rows = 2 }) => (
  <div className={`grid grid-cols-${cols} gap-4`}>
    {Array.from({ length: cols * rows }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// List skeleton
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/50">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-16 h-6 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton; 