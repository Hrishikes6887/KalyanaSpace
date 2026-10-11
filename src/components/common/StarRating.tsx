import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
  };

  if (rating === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-stone-400 text-xs font-normal">
        <Star className={`${iconSizes[size]} text-stone-300`} />
        <span>New Venue</span>
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-700 text-white font-medium text-xs">
        <span>{rating.toFixed(1)}</span>
        <Star className="w-3 h-3 fill-current" />
      </div>
      {showCount && reviewCount !== undefined && (
        <span className={`text-stone-500 font-normal ${textSizes[size]}`}>
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
};
