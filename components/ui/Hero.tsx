// components/Hero.tsx
'use client';

import Link from 'next/link';
import confetti from 'canvas-confetti';

export function Hero() {
  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF1A1A', '#FF4D4D', '#FF8080', '#FFB3B3', '#FFE6E6']
    });
  };

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient bg-400 opacity-20" />
      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Stop Gifting Crap They Don't Want
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Ask what makes them happy (without revealing yourself). Give better gifts, faster. 🎁
        </p>
        <Link href="/login">
          <button 
            onClick={handleConfetti}
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
          >
            Create a Gift
          </button>
        </Link>
      </div>
    </section>
  );
}