'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGiftBuilder } from '@/context/GiftBuilderContext';
import { BACKGROUNDS, OCCASIONS } from '@/lib/constants';

const PreviewCard = () => {
  const { data } = useGiftBuilder();
  const { occasion, name, background, gif } = data;

  const hasContent = Boolean(occasion || name || background || gif);

  return (
    <AnimatePresence>
      {hasContent && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`w-full max-w-md mx-auto mt-16 mb-8 p-6 rounded-xl shadow-xl 
                     ${background ? BACKGROUNDS.find(bg => bg.value === background)?.color : 'bg-white'}`}
        >
          <div className="relative">
            {gif && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-16 right-0 w-24 h-24 rounded-lg overflow-hidden shadow-lg bg-white"
              >
                <img src={gif} alt="Selected GIF" className="w-full h-full object-cover" />
              </motion.div>
            )}

            <motion.div
              layout
              className="text-center"
            >
              {occasion && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg font-medium mb-2 text-black"
                >
                  {name ? `Hey ${name}! 👋` : 'Select who this is for...'}
                </motion.p>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold text-black"
              >
                {occasion ? (
                  <>
                    What do you want for your{' '}
                    <span className="text-pink-600">
                      {occasion} {OCCASIONS.find(o => o.value === occasion)?.emoji}
                    </span>
                    {name ? '?' : '...'}
                  </>
                ) : (
                  'Select an occasion...'
                )}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreviewCard; 