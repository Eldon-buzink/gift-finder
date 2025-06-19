'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    // Trigger confetti animation on page load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF1A1A', '#FF4D4D', '#FF8080', '#FFB3B3', '#FFE6E6']
    });
  }, []);

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-16"
    >
      <div className="text-center space-y-6 max-w-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-8"
        >
          🎉
        </motion.div>
        
        <h1 className="text-4xl font-bold text-black">Mission Accomplished!</h1>
        
        <p className="text-xl text-black/80">
          Your gift ninja request is on its way! We&apos;ll let you know when they respond.
        </p>
        
        <p className="text-sm text-black/60">
          Remember: your identity is safe with us. They won&apos;t know it&apos;s you unless you tell them! 🥷
        </p>

        <div className="pt-8">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full 
                       font-semibold shadow-lg transition hover:shadow-xl"
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.main>
  );
} 