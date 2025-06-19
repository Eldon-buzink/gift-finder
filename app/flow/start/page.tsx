'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import { ProgressBar } from '@/components/ui/ProgressBar';
import PreviewCard from '@/components/ui/PreviewCard';
import { useGiftBuilder } from '@/context/GiftBuilderContext';
import { OCCASIONS, OccasionItem } from '@/lib/constants';

interface FormData {
  occasion: string;
}

export default function StartGiftFlow() {
  const router = useRouter();
  const { data, setData } = useGiftBuilder();
  const [customLabel, setCustomLabel] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setError(null);
    
    if (value !== 'Other') {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
      setData({ occasion: value });
      router.push('/flow/name');
    } else {
      setData({ occasion: value });
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
    setData({ occasion: customLabel });
    router.push('/flow/name');
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white"
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center px-4">
        <div className="w-full">
          <ProgressBar currentStep={1} totalSteps={4} />
        </div>
        <div className="mt-2 w-full flex flex-col items-center">
          <PreviewCard />

          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-center mb-6 text-black"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            What&apos;s the occasion?
          </motion.h1>

          <p className="text-center text-black/80 max-w-sm mb-8">
            Choose one, or make it your own. We&apos;ll keep it anonymous either way.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md w-full mb-6">
            {OCCASIONS.map((item: OccasionItem) => (
              <motion.button
                key={item.value}
                onClick={() => handleSelect(item.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                  'py-4 px-5 text-sm rounded-lg transition-all shadow-lg text-center',
                  'hover:shadow-xl hover:bg-white/95',
                  data.occasion === item.value
                    ? 'bg-white text-black ring-4 ring-black'
                    : 'bg-white/80 text-black/80'
                )}
              >
                <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <span>{item.label}</span>
                  {item.emoji && <span>{item.emoji}</span>}
                </span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-500 mb-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {data.occasion === 'Other' && (
              <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-black mb-2">
                  What should we call this occasion?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Sophie&apos;s puppy shower 🐶"
                    value={customLabel}
                    onChange={(e) => {
                      setCustomLabel(e.target.value);
                      setError(null);
                    }}
                    className="flex-1 p-3 border border-black/20 rounded-lg shadow-sm bg-white
                             focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
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
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full
                             font-semibold shadow-lg transition hover:shadow-xl"
                  >
                    Next
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.main>
  );
}