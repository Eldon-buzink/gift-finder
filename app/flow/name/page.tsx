'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';

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
  const searchParams = useSearchParams();
  const occasion = searchParams.get('occasion');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!occasion) router.push('/flow/start');
  }, [occasion, router]);

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
    router.push(`/flow/style?occasion=${encodeURIComponent(occasion!)}&name=${encodeURIComponent(name)}`);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 bg-400 animate-gradient-move"
    >
      <ProgressBar currentStep={2} totalSteps={5} />

      <button
        onClick={() => router.back()}
        className="absolute top-8 left-8 text-white hover:text-white/80 transition"
      >
        ← Back
      </button>

      {occasion && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/80 mb-2"
        >
          Occasion: {occasion}
        </motion.p>
      )}

      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-center mb-6 text-white drop-shadow-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Who's this for?
      </motion.h1>

      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder={placeholder}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          className="mb-6 w-full p-3 border border-white/20 rounded-lg shadow-sm bg-white/90
                   focus:outline-none focus:ring-2 focus:ring-white focus:bg-white
                   transition-all duration-300"
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
            className="text-sm text-red-200 mb-4"
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
        className="bg-white text-black px-8 py-3 rounded-full font-semibold 
                   disabled:opacity-50 shadow-lg transition hover:shadow-xl"
      >
        Next
      </motion.button>
    </motion.main>
  );
} 