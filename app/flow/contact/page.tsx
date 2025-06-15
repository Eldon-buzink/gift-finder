'use client';

import { useGiftBuilder } from '@/context/GiftBuilderContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import PreviewCard from '@/components/ui/PreviewCard';
import { supabase } from '@/lib/supabase';
import { generateGiftEmail } from '@/lib/email/generateGiftEmail';

// Helper function for development logging
const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

interface ContactData {
  occasion: string;
  name: string;
  background: string;
  gif: string;
}

const relationshipMap: Record<string, string> = {
  'New Job': 'colleagues',
  'New Home': 'friends and family',
  'Birthday': 'loved ones',
  'Graduation': 'friends',
  'Wedding': 'loved ones',
  'Anniversary': 'loved ones',
  'Baby Shower': 'friends and family',
  'Christmas': 'loved ones',
  'Housewarming': 'friends and family',
  'Thank You': 'people who appreciate you',
  'Get Well Soon': 'people who care about you',
  'Other': 'people who care about you'
};

export default function ContactStep() {
  const router = useRouter();
  const { data, setData } = useGiftBuilder();
  const [recipient, setRecipient] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>(data.sender_email || '');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const typedData = data as ContactData;
    if (!typedData.occasion || !typedData.name || !typedData.background || !typedData.gif) {
      router.push('/flow/start');
    }
  }, [data, router]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendGiftEmail = async () => {
    const typedData = data as ContactData;

    try {
      if (!recipient || !typedData.name || !typedData.occasion || !typedData.gif) {
        console.error('Missing required data:', { recipient, ...typedData });
        throw new Error('Missing required data for email creation');
      }

      // Generate the initial email content without the card ID
      const emailContent = generateGiftEmail({
        receiver_name: typedData.name,
        occasion: typedData.occasion,
        gif: typedData.gif,
        background: typedData.background
      });

      const insertData = {
        recipient_email: recipient,
        recipient_name: '',  // Will be filled in later
        receiver_name: typedData.name,
        sender_email: senderEmail,
        message_subject: `Hey ${typedData.name}! Someone wants to get you something for your ${typedData.occasion.toLowerCase()} 🎁`,
        message_html: emailContent,
        status: 'pending',
        opened: false,
        replied: false,
        reply_message: null,
        resend_id: null,
        occasion: typedData.occasion,
        gif_url: typedData.gif,
        background: typedData.background
      };

      devLog('Attempting to insert record with data:', insertData);

      const insertResult = await supabase
        .from('emails')
        .insert(insertData)
        .select()
        .single();

      devLog('Insert result:', insertResult);

      if (insertResult.error) {
        console.error('Detailed insert error:', {
          error: insertResult.error,
          code: insertResult.error.code,
          message: insertResult.error.message,
          details: insertResult.error.details
        });
        throw new Error(`Failed to create card: ${insertResult.error.message || 'Unknown database error'}`);
      }

      if (!insertResult.data) {
        console.error('No data returned from insert');
        throw new Error('Failed to create card: No data returned');
      }

      devLog('Successfully inserted record:', insertResult.data);

      // Update the email content with the actual card ID
      const cardId = insertResult.data.id;
      const finalEmailContent = emailContent.replace(
        'Just reply to this email with your wishes.',
        `<div style="margin: 20px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/reply?id=${cardId}" 
             style="display: inline-block; padding: 12px 24px; 
                    background: linear-gradient(to right, #9333ea, #db2777); 
                    color: white; text-decoration: none; 
                    border-radius: 9999px; font-weight: 600;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            🎁 Open your card
          </a>
        </div>
        <p style="color: #666666; font-size: 14px; margin-top: 16px;">
          Click the button above to share what would make you happy!
        </p>`
      );

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          subject: `Hey ${typedData.name}! Someone wants to get you something for your ${typedData.occasion.toLowerCase()} 🎁`,
          htmlContent: finalEmailContent,
          senderName: typedData.name,
          occasion: typedData.occasion,
          recipientName: ''  // Initialize as empty, will be filled when they reply
        }),
      });

      let responseData;
      try {
        const textResponse = await response.text();
        devLog('Raw API response:', textResponse);
        
        try {
          responseData = JSON.parse(textResponse);
          devLog('Parsed API response:', responseData);
        } catch (parseError) {
          console.error('Failed to parse API response:', parseError);
          throw new Error(`Invalid API response: ${textResponse.substring(0, 100)}...`);
        }
      } catch (responseError) {
        console.error('Error reading API response:', responseError);
        throw new Error('Failed to read API response');
      }

      if (!response.ok || !responseData.success) {
        console.error('API Error:', responseData);
        const errorMessage = responseData?.error || 
                           responseData?.details?.message || 
                           `API error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      devLog('Email sent successfully:', responseData);
      router.push('/success');
      return true;
    } catch (error) {
      console.error('Full error details:', error);
      throw error; // Re-throw to be handled by handleSubmit
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSending(true);

    try {
      if (!recipient) {
        setError('Please enter their email address');
        setIsSending(false);
        return;
      }
      if (!validateEmail(recipient)) {
        setError('Please enter a valid recipient email address');
        setIsSending(false);
        return;
      }
      if (!senderEmail) {
        setError('Please enter your email address');
        setIsSending(false);
        return;
      }
      if (!validateEmail(senderEmail)) {
        setError('Please enter a valid email address for yourself');
        setIsSending(false);
        return;
      }
      setData({ sender_email: senderEmail.trim() });
      await sendGiftEmail();
    } catch (error) {
      console.error('Submit error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSending(false);
    }
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
          <ProgressBar currentStep={5} totalSteps={5} />
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

          <div className="w-full max-w-md text-center">
            <h2 className="text-lg font-medium mb-3 text-black">Who is the lucky person we should send this to?</h2>
            <input
              type="email"
              placeholder="their@email.com"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                setError(null);
              }}
              className="w-full p-4 rounded-xl border border-black/20 shadow-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                       transition-all duration-300 text-center"
            />
            <h2 className="text-lg font-medium mt-6 mb-3 text-black">Where should we send the reply?</h2>
            <input
              type="email"
              placeholder="you@example.com"
              value={senderEmail}
              onChange={(e) => {
                setSenderEmail(e.target.value);
                setError(null);
              }}
              className="w-full p-4 rounded-xl border border-black/20 shadow-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                       transition-all duration-300 text-center"
              autoComplete="email"
              inputMode="email"
            />
            <p className="text-xs text-gray-500 mt-2 mb-2 text-center">We'll only use this to send you the reply.</p>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-500 mt-2 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <motion.button
              onClick={handleSubmit}
              disabled={!recipient || !senderEmail || isSending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold disabled:opacity-50 shadow-lg transition hover:shadow-xl"
            >
              {isSending ? 'Sending... 🚀' : 'Send it 💌'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.main>
  );
} 