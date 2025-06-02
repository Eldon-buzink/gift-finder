'use client';

export default function LoadingSpinner() {
  return (
    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
} 