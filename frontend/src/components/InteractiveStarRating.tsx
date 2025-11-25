import React, { useState } from "react";
import { Star } from "lucide-react";

interface InteractiveStarRatingProps {
  initialRating: number;
  starSize?: string;
  onRatingChange: (newRating: number) => void;
}

const InteractiveStarRating: React.FC<InteractiveStarRatingProps> = ({
  initialRating,
  starSize = "w-6 h-6",
  onRatingChange,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((index) => {
        const currentRating = index;

        return (
          <Star
            key={index}
            className={`${starSize} cursor-pointer transition-colors ${
              (hover || rating) >= currentRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => {
              setRating(currentRating);
              onRatingChange(currentRating);
            }}
            onMouseEnter={() => setHover(currentRating)}
            onMouseLeave={() => setHover(0)}
          />
        );
      })}
    </div>
  );
};

export default InteractiveStarRating;
