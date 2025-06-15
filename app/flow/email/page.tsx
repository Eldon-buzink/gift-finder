"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "@/components/ui/ProgressBar";
import PreviewCard from "@/components/ui/PreviewCard";
import { useGiftBuilder } from "@/context/GiftBuilderContext";

const EMAIL_PLACEHOLDER = "you@example.com";

function validateEmail(email: string) {
  // Basic email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EmailStep() {
  const router = useRouter();
  const { data, setData } = useGiftBuilder();
  const [email, setEmail] = useState(data.sender_email || "");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Require previous steps
    if (!data.occasion || !data.name || !data.background || !data.gif) {
      router.push("/flow/style");
    }
  }, [data, router]);

  useEffect(() => {
    setIsValid(validateEmail(email));
  }, [email]);

  const handleNext = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setData({ sender_email: email.trim() });
    router.push("/flow/contact");
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
        className="absolute top-8 left-8 bg-white text-black px-6 py-3 rounded-full font-semibold shadow-lg transition hover:shadow-xl hover:scale-105"
      >
        ← Back
      </button>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <ProgressBar currentStep={4} totalSteps={5} />
        </div>

        <div className="mt-8 w-full flex flex-col items-center max-w-2xl">
          <PreviewCard />

          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-center mb-6 text-black"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Where should we send the reply?
          </motion.h1>

          <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="email"
                placeholder={EMAIL_PLACEHOLDER}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="w-full p-3 border border-black/20 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-300"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValid) {
                    handleNext();
                  }
                }}
                autoComplete="email"
                inputMode="email"
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
            <p className="text-xs text-gray-500 mt-2">We'll only use this to send you the reply.</p>
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
              disabled={!isValid}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold disabled:opacity-50 shadow-lg transition hover:shadow-xl"
            >
              Continue
            </motion.button>
          </div>
        </div>
      </div>
    </motion.main>
  );
} 