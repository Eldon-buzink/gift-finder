'use client';

import { useGiftBuilder } from '@/context/GiftBuilderContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import PreviewCard from '@/components/ui/PreviewCard';
import { supabase } from '@/lib/supabase';

interface ContactData {
  occasion: string;
  name: string;
  background: string;
  gif: string;
}

type ContactMethod = 'email' | 'whatsapp' | '';

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

const generateEmailContent = (data: ContactData) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; text-align: center;">Hey! Someone wants to get you a gift! 🎁</h1>
      
      <p style="color: #666; text-align: center; font-size: 16px;">
        For ${data.occasion}, a secret gift ninja wants to make sure you get something you'll love.
      </p>
      
      <div style="background-color: #f8f8f8; border-radius: 10px; padding: 20px; margin: 20px 0;">
        <p style="color: #333; text-align: center; font-size: 18px;">
          <strong>${data.name}</strong>, what would make you happy? 😊
        </p>
      </div>
      
      <p style="color: #666; text-align: center; font-size: 14px;">
        Just reply to this email with your wishes. Don't worry about being too specific or general.
        Your gift ninja will figure it out! 🥷
      </p>
      
      <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        Sent anonymously via Gift Ninja 🎁
      </div>
    </div>
  `;
};

export default function ContactStep() {
  const router = useRouter();
  const { data } = useGiftBuilder();
  const [contactMethod, setContactMethod] = useState<ContactMethod>('');
  const [recipient, setRecipient] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const typedData = data as ContactData;
    if (!typedData.occasion || !typedData.name || !typedData.background || !typedData.gif) {
      router.push('/flow/start');
    }
  }, [data, router]);

  const sendGiftEmail = async () => {
    const typedData = data as ContactData;
    const relationshipContext = relationshipMap[typedData.occasion] || 'people who care about you';

    try {
      if (!recipient || !typedData.name || !typedData.occasion || !typedData.gif) {
        console.error('Missing required data:', { recipient, ...typedData });
        throw new Error('Missing required data for email creation');
      }

      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; text-align: center; color: #333;">
          <h2>${typedData.occasion}</h2>
          <p style="font-size: 16px;">
            Your ${relationshipContext} wanted to surprise you with a little something. 🎁
          </p>
          <p style="margin: 20px 0; font-size: 14px; color: #555;">
            Someone sent you a message — open your card to read it and tell us what would make you smile.
          </p>
          <img src="${typedData.gif}" alt="Gift animation" style="max-width: 100%; border-radius: 8px; margin: 20px 0;" />
          <div style="margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reply?id=" style="display: inline-block; padding: 12px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px;">
              🎁 Open your card
            </a>
          </div>
        </div>
      `;

      const insertData = {
        recipient_email: recipient,
        recipient_name: '',  // This will be filled in when they reply
        message_subject: `Someone sent you a card! 🎉`,
        message_html: htmlContent,
        status: 'pending',
        opened: false,
        replied: false,
        reply_message: null,
        resend_id: null,
        occasion: typedData.occasion,
        gif_url: typedData.gif,
        background: typedData.background
      };

      console.log('Attempting to insert record with data:', insertData);

      // Now attempt the insert
      const insertResult = await supabase
        .from('emails')
        .insert(insertData)
        .select()
        .single();

      console.log('Insert result:', insertResult);

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

      console.log('Successfully inserted record:', insertResult.data);

      // Update the reply URL with the actual card ID
      const cardId = insertResult.data.id;
      const finalHtmlContent = htmlContent.replace('reply?id=', `reply?id=${cardId}`);

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          subject: `Someone sent you a card! 🎉`,
          htmlContent: finalHtmlContent,
          senderName: typedData.name,
          occasion: typedData.occasion,
          recipientName: ''  // Initialize as empty, will be filled when they reply
        }),
      });

      let responseData;
      try {
        const textResponse = await response.text();
        console.log('Raw API response:', textResponse);
        
        try {
          responseData = JSON.parse(textResponse);
          console.log('Parsed API response:', responseData);
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

      console.log('Email sent successfully:', responseData);
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
      if (!contactMethod || !recipient) {
        setError('Please fill in all fields');
        return;
      }

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
              disabled={!recipient || !contactMethod || isSending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full 
                       font-semibold disabled:opacity-50 shadow-lg transition hover:shadow-xl"
            >
              {isSending ? 'Sending... 🚀' : 'Send it 💌'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.main>
  );
} 