'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import PreviewCard from '@/components/ui/PreviewCard';
import { useGiftBuilder } from '@/context/GiftBuilderContext';
import { BACKGROUNDS, GIFS, Background, GifItem } from '@/lib/constants';

interface StyleData {
  occasion: string;
  name: string;
  background?: string;
  gif?: string;
}

export default function StyleStep() {
  const router = useRouter();
  const { data, setData } = useGiftBuilder();
  const { occasion, name } = data as StyleData;

  const gifs: GifItem[] = GIFS[occasion as keyof typeof GIFS] || GIFS['Birthday'];

  useEffect(() => {
    if (!occasion || !name) router.push('/flow/name');
  }, [occasion, name, router]);

  const handleNext = () => {
    if (!data.background || !data.gif) return;
    router.push('/flow/contact');
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-white"
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center px-4 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-0 left-0 bg-white text-black px-6 py-3 rounded-full font-semibold shadow-lg transition hover:shadow-xl hover:scale-105 z-10"
        >
          ← Back
        </button>
        <div className="w-full pt-20">
          <ProgressBar currentStep={3} totalSteps={4} />
        </div>
        <div className="mt-4 w-full flex flex-col items-center">
          <PreviewCard />
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-center mb-6 text-black"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Pick a vibe 🎨
          </motion.h1>
          <div className="w-full mb-8">
            <h2 className="text-lg font-medium mb-2 text-black">Background Style</h2>
            <div className="grid grid-cols-3 gap-3">
              {BACKGROUNDS.map((bg) => (
                <motion.button
                  key={bg.value}
                  onClick={() => setData({ background: bg.value })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`h-20 rounded-lg shadow-lg transition-all duration-200 overflow-hidden
                             ${bg.color} 
                             ${data.background === bg.value ? 'ring-4 ring-black' : 'hover:ring-2 hover:ring-black/50'}`}
                >
                  <span className="sr-only">{bg.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
          <div className="w-full mb-8">
            <h2 className="text-lg font-medium mb-2 text-black">Choose a GIF</h2>
            <div className="grid grid-cols-3 gap-3">
              {gifs.map((gif) => (
                <motion.button
                  key={gif.url}
                  onClick={() => setData({ gif: gif.url })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative border rounded-lg overflow-hidden shadow-lg transition-all duration-200
                             ${data.gif === gif.url ? 'ring-4 ring-black' : 'hover:ring-2 hover:ring-black/50'}`}
                >
                  <img src={gif.url} alt={gif.label} className="w-full h-20 object-cover" />
                  <span className="sr-only">{gif.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
          <motion.button
            onClick={handleNext}
            disabled={!data.background || !data.gif}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full 
                     font-semibold disabled:opacity-50 shadow-lg transition hover:shadow-xl"
          >
            Next
          </motion.button>
        </div>
      </div>
    </motion.main>
  );
} 