'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import { ProgressBar } from '@/components/ui/ProgressBar';

const OCCASIONS = [
  { label: 'Birthday 🎉', value: 'Birthday' },
  { label: 'New Job 💼', value: 'New Job' },
  { label: 'Housewarming 🏡', value: 'Housewarming' },
  { label: 'Graduation 🎓', value: 'Graduation' },
  { label: 'Thank You 🙏', value: 'Thank You' },
  { label: 'Other ✍️', value: 'Other' },
];

export default function StartGiftFlow() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [customLabel, setCustomLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    setError(null);
    
    if (value !== 'Other') {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
      router.push(`/flow/name?occasion=${encodeURIComponent(value)}`);
    }
  };

  const handleCustomSubmit = () => {
    if (!customLabel.trim()) {
      setError('Please enter a custom occasion');
      return;
    }
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 }
    });
    router.push(`/flow/name?occasion=${encodeURIComponent(customLabel)}`);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 
                 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 
                 bg-400 animate-gradient-move"
    >
      <ProgressBar currentStep={1} totalSteps={5} />

      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold text-center mb-4 text-white drop-shadow-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        What's the occasion?
      </motion.h1>

      <p className="text-center text-sm text-white/90 max-w-sm mb-8">
        Choose one, or make it your own. We'll keep it anonymous either way.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md w-full mb-6">
        {OCCASIONS.map((item) => (
          <motion.button
            key={item.value}
            onClick={() => handleSelect(item.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              'py-4 px-5 text-sm rounded-full transition-all shadow-lg text-center',
              'hover:shadow-xl hover:bg-white/95',
              selected === item.value
                ? 'bg-white text-black scale-105'
                : 'bg-white/80 text-black/80'
            )}
          >
            {item.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-200 mb-4"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected === 'Other' && (
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="block text-sm font-medium text-white mb-2">
              What should we call this occasion?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Sophie's puppy shower 🐶"
                value={customLabel}
                onChange={(e) => {
                  setCustomLabel(e.target.value);
                  setError(null);
                }}
                className="flex-1 p-3 border border-white/20 rounded-lg shadow-sm bg-white/90
                         focus:outline-none focus:ring-2 focus:ring-white focus:bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomSubmit();
                  }
                }}
              />
              <motion.button
                onClick={handleCustomSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-6 py-3 rounded-full font-semibold 
                         shadow-lg transition hover:shadow-xl"
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}