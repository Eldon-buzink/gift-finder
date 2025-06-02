'use client';

import { motion } from 'framer-motion';

const floatingElements = [
  { emoji: '🎁', positions: { x: [10, 40, 10], y: [20, 60, 20] } },
  { emoji: '✨', positions: { x: [70, 30, 70], y: [15, 45, 15] } },
  { emoji: '🎈', positions: { x: [25, 65, 25], y: [70, 20, 70] } },
  { emoji: '🎊', positions: { x: [85, 45, 85], y: [35, 85, 35] } },
  { emoji: '🌟', positions: { x: [15, 75, 15], y: [80, 30, 80] } },
  { emoji: '💝', positions: { x: [60, 20, 60], y: [25, 75, 25] } },
  { emoji: '🎉', positions: { x: [35, 85, 35], y: [50, 10, 50] } },
];

export function FloatingElements() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none">
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl sm:text-3xl opacity-[0.15]"
          style={{
            left: `${element.positions.x[0]}vw`,
            top: `${element.positions.y[0]}vh`,
          }}
          animate={{
            x: element.positions.x.map(x => `${x - element.positions.x[0]}vw`),
            y: element.positions.y.map(y => `${y - element.positions.y[0]}vh`),
          }}
          transition={{
            duration: 20 + (index * 3),
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse"
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  );
} 