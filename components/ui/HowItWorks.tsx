'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    title: "Ask what makes them happy",
    description: "Send an anonymous message asking about their preferences and interests.",
    mockup: (
      <div className="relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-4">
        {/* Gradient header with name, question, and gif */}
        <div className="relative rounded-xl p-6 pb-10 bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] flex flex-col items-center justify-center min-h-[120px]">
          <div className="absolute top-3 right-3 w-16 h-16 rounded-lg overflow-hidden shadow-md">
            <img
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2J6d3F2b2J2d3F2b2J2d3F2b2J2d3F2b2J2d3F2b2J2d3F2/g9582DNuQppxC/giphy.gif"
              alt="Thank you cat gif"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-lg font-medium text-black mb-1">Hey [Name]! 👋</div>
          <div className="text-2xl font-bold text-black text-center leading-tight">
            What do you want for your <span className="text-pink-500">[Occasion] 🙏</span>?
          </div>
        </div>
        {/* Disabled response box */}
        <div className="mt-2">
          <input
            type="text"
            disabled
            value="Their response goes here..."
            className="w-full rounded-lg border border-gray-300 bg-gray-100 text-gray-400 px-4 py-3 text-center cursor-not-allowed"
          />
          <div className="text-center text-gray-500 text-sm mt-2">
            Let your gift ninja know what makes you happy
          </div>
        </div>
      </div>
    )
  },
  {
    title: "They receive an email",
    description: "They get a personalized message asking about their preferences.",
    mockup: (
      <div className="relative w-full max-w-xl mx-auto bg-gray-50 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
        <div className="text-2xl font-bold text-black text-center mb-2">
          <span className="font-bold">[Name], what would make you happy?</span> <span className="align-middle">😊</span>
        </div>
        <div className="text-gray-600 text-center text-lg mb-4">
          For your <span className="font-semibold">[occasion]</span>, a secret gift ninja wants to make sure you get something you'll love.
        </div>
        <button
          className="rounded-full px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-md flex items-center gap-2 mb-2"
          disabled
        >
          <span role="img" aria-label="gift">🎁</span> Open your card
        </button>
        <div className="text-gray-500 text-center text-base mb-1">
          Click the button above to share what would make you happy!
        </div>
        <div className="text-gray-700 text-center text-base font-medium">
          Your gift ninja will figure it out! <span role="img" aria-label="ninja">🥷</span>
        </div>
      </div>
    )
  },
  {
    title: "Get their reply and suggestions",
    description: "Receive their preferences along with personalized gift recommendations.",
    mockup: (
      <div className="relative w-full max-w-sm mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="h-2 w-2 rounded-full bg-white/50" />
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="h-6 w-3/4 bg-gray-100 rounded" />
            <div className="space-y-2">
              {['Books 📚', 'Tech gadgets 🎮', 'Art supplies 🎨', 'Cooking tools 👨‍🍳'].map((item, i) => (
                <div key={i} className="h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center px-4 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how" className="py-16 px-4 max-w-4xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-12 text-black"
      >
        How it works
      </motion.h2>

      <div ref={ref} className="space-y-16">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="text-center max-w-xl">
              <h3 className="text-2xl font-semibold mb-3 text-black">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
            <div className="w-full">
              {step.mockup}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 