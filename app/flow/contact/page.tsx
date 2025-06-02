'use client';

import { useGiftBuilder } from '@/context/GiftBuilderContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PreviewCard } from '@/components/ui/PreviewCard';

export default function ContactStep() {
  const router = useRouter();
  const { data } = useGiftBuilder();
  const [contactMethod, setContactMethod] = useState<'email' | 'whatsapp' | ''>('');
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data.occasion || !data.name || !data.background || !data.gif) {
      router.push('/flow/start');
    }
  }, [data, router]);

  const handleSubmit = () => {
    if (!recipient) {
      setError('Please enter a recipient');
      return;
    }
    if (!contactMethod) {
      setError('Please select a contact method');
      return;
    }
    // send logic here...
    alert(`Sending message to ${recipient} via ${contactMethod}`);
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
          <ProgressBar currentStep={4} totalSteps={4} />
        </div>

        <div className="mt-8 w-full flex flex-col items-center max-w-2xl">
          <p className="text-lg text-black/80 text-center mb-4">
            This is what your friend will see — and where they'll share what makes them happy ✨
          </p>

          <div className="w-full max-w-md mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <PreviewCard />
              <input
                type="text"
                disabled
                placeholder="Their response goes here..."
                className="w-full p-4 mt-2 rounded-lg border border-black/20 bg-black/5 text-black/40 text-center"
              />
              <p className="text-sm text-black/60 text-center mt-2">
                Let your gift ninja know what makes you happy
              </p>
            </div>
          </div>

          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-center mb-8 text-black"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Let's send this thing 🚀
          </motion.h1>

          <p className="text-sm text-black/60 text-center mb-8">
            Don't worry, your identity stays anonymous 😎
          </p>

          <div className="w-full max-w-md">
            <h2 className="text-lg font-medium mb-3 text-black">Send via:</h2>
            <div className="flex gap-4 mb-4">
              <motion.button
                onClick={() => {
                  setContactMethod('email');
                  setError(null);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-4 py-3 rounded-xl font-medium shadow-md transition-all ${
                  contactMethod === 'email' 
                    ? 'bg-black text-white ring-2 ring-black' 
                    : 'bg-white text-black border border-black/20 hover:shadow-lg'
                }`}
              >
                Email
              </motion.button>
              <motion.button
                onClick={() => {
                  setContactMethod('whatsapp');
                  setError(null);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-4 py-3 rounded-xl font-medium shadow-md transition-all ${
                  contactMethod === 'whatsapp' 
                    ? 'bg-black text-white ring-2 ring-black' 
                    : 'bg-white text-black border border-black/20 hover:shadow-lg'
                }`}
              >
                WhatsApp
              </motion.button>
            </div>

            <input
              type={contactMethod === 'email' ? 'email' : 'tel'}
              placeholder={contactMethod === 'email' ? 'their@email.com' : '+31612345678'}
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                setError(null);
              }}
              className="w-full p-4 rounded-xl border border-black/20 shadow-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                       transition-all duration-300"
            />

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
              onClick={handleSubmit}
              disabled={!recipient || !contactMethod}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full 
                       font-semibold disabled:opacity-50 shadow-lg transition hover:shadow-xl"
            >
              Send it 💌
            </motion.button>
          </div>
        </div>
      </div>
    </motion.main>
  );
} 