import React from "react";

interface Stars {
  rating: number;
}

export default function Stars({ rating }: Stars) {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <p className="flex">
      {stars.map((star) => {
        const fillPercentage =
          Math.min(Math.max(rating - (star - 1), 0), 1) * 100;
        return (
          <span key={star} className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-black text-yellow-500"
            >
              <defs>
                <linearGradient id={`grad-${star}`}>
                  <stop
                    offset={`${fillPercentage}%`}
                    stopColor="currentColor"
                  />
                  <stop offset={`${fillPercentage}%`} stopColor="#fff" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#grad-${star})`}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17.27l5.18 3.73-1.64-5.81L21 10.24l-5.9-.51L12 4.5 8.9 9.73 3 10.24l4.46 4.95L5.82 21z"
              />
            </svg>
          </span>
        );
      })}
    </p>
  );
}
