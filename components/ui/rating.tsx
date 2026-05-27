// components/ui/rating.tsx
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  readonly?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({
  value = 0,
  onChange,
  max = 5,
  readonly = false,
  disabled = false,
  size = 'md',
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (rating: number) => {
    if (readonly || disabled) return;
    onChange?.(rating);
  };

  const handleMouseEnter = (rating: number) => {
    if (readonly || disabled) return;
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    if (readonly || disabled) return;
    setHoverValue(0);
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleClick(rating)}
          onMouseEnter={() => handleMouseEnter(rating)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly || disabled}
          className={cn(
            "focus:outline-none transition-colors",
            (readonly || disabled) && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "fill-current transition-colors",
              (hoverValue >= rating || value >= rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600"
            )}
          />
        </button>
      ))}
    </div>
  );
}