'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ProgressBar } from '@/components/ui/ProgressBar';
import PreviewCard from '@/components/ui/PreviewCard';
import { useGiftBuilder } from '@/context/GiftBuilderContext';

const FUNNY_PLACEHOLDERS = [
  "e.g. The Coffee Whisperer ☕️",
  "e.g. Queen of Random Facts 👑",
  "e.g. Professional Nap Architect 😴",
  "e.g. Chief Snack Officer 🍪",
  "e.g. Master of Dad Jokes 🎭",
  "e.g. Professional Plant Parent 🌿",
];

const DEFAULT_PLACEHOLDER = "Enter their name or nickname";

export default function NameStep() {
  const router = useRouter();
  const { data, setData } = useGiftBuilder();
  const [name, setName] = useState(data.name);
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!data.occasion) router.push('/flow/start');
  }, [data.occasion, router]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % FUNNY_PLACEHOLDERS.length;
      setPlaceholder(FUNNY_PLACEHOLDERS[currentIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsValid(name.trim().length >= 2);
  }, [name]);

  const handleNext = () => {
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    if (name.trim().length < 2) {
      setError('Name should be at least 2 characters');
      return;
    }
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 }
    });
    setData({ name: name.trim() });
    router.push('/flow/style');
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white"
    >
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-8 bg-white text-black px-6 py-3 rounded-full font-semibold 
                   shadow-lg transition hover:shadow-xl hover:scale-105"
      >
        ← Back
      </button>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <ProgressBar currentStep={2} totalSteps={4} />
        </div>
        
        <div className="mt-8 w-full flex flex-col items-center max-w-2xl">
          <PreviewCard />

          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-center mb-6 text-black"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Who's this for?
          </motion.h1>

          <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder={placeholder}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                className="w-full p-3 border border-black/20 rounded-lg shadow-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-black focus:bg-white
                         transition-all duration-300"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isValid) {
                    handleNext();
                  }
                }}
              />
              <AnimatePresence>
                {isValid && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute right-3 top-3 text-green-500"
                  >
                    ✓
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-500 mt-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleNext}
              disabled={!name.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 
                       rounded-full font-semibold disabled:opacity-50 shadow-lg transition hover:shadow-xl"
            >
              Next
            </motion.button>
          </div>
        </div>
      </div>
    </motion.main>
  );
} 