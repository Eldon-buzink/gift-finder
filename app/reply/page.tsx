'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BACKGROUNDS, Background } from '@/lib/constants';
import { motion } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

const occasionSuggestions: Record<string, string[]> = {
  'Birthday': [
    "I'd love a new pair of AirPods! 🎧",
    "A spa day would be amazing 💆‍♀️",
    "That book I mentioned would be perfect 📚",
    "Maybe those shoes I showed you? 👟",
    "A nice dinner at my favorite restaurant 🍝",
    "Concert tickets would be incredible! 🎵",
    "A weekend getaway would be dreamy ✈️",
    "That cozy sweater I've been eyeing 🧥",
  ],
  'Wedding': [
    "Something for our new home would be lovely 🏠",
    "A romantic dinner experience 🍷",
    "Matching coffee mugs for morning coffee ☕️",
    "A couples spa day would be perfect 💆‍♀️",
    "That beautiful vase we saw together 🏺",
    "A cooking class for two would be fun! 👩‍🍳",
    "A cozy throw blanket for movie nights 🛋️",
    "A gift card for home decor shopping 🏡",
  ],
  'New Job': [
    "A nice laptop bag would be perfect! 💼",
    "A sleek water bottle for the office 🚰",
    "That professional watch I showed you ⌚️",
    "A nice notebook and pen set 📝",
    "Coffee shop gift cards for my new commute ☕️",
    "A desk plant to brighten my workspace 🪴",
    "Noise-canceling headphones would be amazing 🎧",
    "A comfy office chair cushion 💺",
  ],
  'Graduation': [
    "A new laptop for my next chapter! 💻",
    "That professional camera I mentioned 📸",
    "A nice suit/outfit for interviews 👔",
    "Some travel gear for my gap year ✈️",
    "A kindle for all my future reading 📚",
    "A nice portfolio or briefcase 💼",
    "Gift cards for professional clothes 👔",
    "That watch we saw would be perfect ⌚️",
  ],
  'New Home': [
    "A coffee maker would be perfect! ☕️",
    "Some cozy throw pillows 🛋️",
    "That cool art piece we discussed 🎨",
    "A nice set of wine glasses 🍷",
    "Plants to bring some life inside 🪴",
    "A robot vacuum would be amazing! 🤖",
    "Some nice bed linens 🛏️",
    "Kitchen gadgets for cooking 👩‍🍳",
  ],
  'Baby Shower': [
    "That cute diaper bag we saw 👶",
    "Some cozy baby blankets would be nice 🧸",
    "A white noise machine for bedtime 💤",
    "That baby carrier I showed you 👶",
    "Some children's books to read together 📚",
    "A nice rocking chair would be perfect 💺",
    "That baby monitor we talked about 👶",
    "Some cute nursery decor 🎨",
  ],
  'Christmas': [
    "Those cozy pajamas would be perfect! 🎄",
    "That new game console I mentioned 🎮",
    "A nice winter coat would be amazing ❄️",
    "Some festive home decorations 🎄",
    "That coffee machine we saw ☕️",
    "A cozy weighted blanket 🛋️",
    "Those winter boots I showed you ⛄️",
    "A gift card for holiday shopping 🎁",
  ],
  'Thank You': [
    "A nice journal would be lovely 📝",
    "That book I mentioned would be perfect 📚",
    "A small plant for my desk 🪴",
    "Some nice tea or coffee ☕️",
    "A scented candle would be nice 🕯️",
    "A gift card to my favorite store 🛍️",
    "That cute mug we saw together ☕️",
    "Some self-care items would be lovely 💆‍♀️",
  ],
  'Other': [
    "Something for my new hobby would be great! 🎨",
    "A nice experience we could share 🎭",
    "That thing I showed you last time 🎁",
    "Maybe something for my collection? ⭐️",
    "A gift card would be perfect 🛍️",
    "That item from my wishlist 📝",
    "Something cozy for home 🏠",
    "A fun surprise would be nice! 🎉",
  ],
};

// Default suggestions if occasion doesn't match
const defaultSuggestions = [
  "Something special would be nice! 🎁",
  "I have a few ideas in mind... 💭",
  "That thing we talked about! 😊",
  "Maybe something from my wishlist? 📝",
  "A surprise would be fun! 🎉",
  "I'd love something cozy 🛋️",
  "Something for my hobby perhaps? 🎨",
  "A nice experience would be amazing! 🎭",
];

interface CardData {
  id: string;
  recipient_email: string;
  message_subject: string;
  message_html: string;
  status: string;
  opened: boolean;
  replied: boolean;
  created_at: string;
  reply_message: string | null;
  resend_id: string | null;
  recipient_name: string | null;
  occasion: string;
  gif_url: string;
  background: string;
  receiver_name: string | null;
}

function ReplyPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [card, setCard] = useState<CardData | null>(null);
  const [reply, setReply] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  // Extract GIF URL from HTML content
  const getGifUrl = (html: string) => {
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (!id) return;

    const fetchCard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('emails')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          setError(`Could not load your card. Error: ${error.message}`);
          return;
        }

        if (!data) {
          console.error('No data found for ID:', id);
          setError('Card not found. Please check the URL and try again.');
          return;
        }

        // Mark the card as opened
        const { error: updateError } = await supabase
          .from('emails')
          .update({ opened: true })
          .eq('id', id);

        if (updateError) {
          console.error('Error marking card as opened:', updateError);
        }

        console.log('Card data:', data);
        setCard(data as CardData);
        if (data.replied) {
          setSubmitted(true);
          setReply(data.reply_message || '');
        }
      } catch (e) {
        console.error('Unexpected error:', e);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  // Get the appropriate suggestions based on the message content
  const getSuggestions = () => {
    if (!card?.occasion) return defaultSuggestions;
    return occasionSuggestions[card.occasion] || defaultSuggestions;
  };

  // Rotate through suggestions as placeholder text
  useEffect(() => {
    if (reply) return; // Don't rotate if user has typed something
    
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % getSuggestions().length);
    }, 3000);

    return () => clearInterval(interval);
  }, [reply, card?.occasion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!id || !reply.trim() || !card?.receiver_name) {
        setError('Please share what would make you happy.');
        return;
      }

      // First update the email record with the reply
      devLog('Updating Supabase with:', {
        id,
        reply: reply.trim(),
      });

      const { data: updatedData, error: updateError } = await supabase
        .from('emails')
        .update({
          replied: true,
          reply_message: reply.trim(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error(updateError.message);
      }

      if (!updatedData) {
        console.error('No data returned after update');
        throw new Error('Failed to update record');
      }

      devLog('Supabase update successful:', {
        id: updatedData.id,
        replied: updatedData.replied
      });

      // Now send a notification email about the reply
      const notificationHtml = `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 32px 24px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        ">
          <h1 style="
            color: #000000;
            font-size: 24px;
            text-align: center;
            margin-bottom: 24px;
            font-weight: 700;
          ">
            🎉 ${card.receiver_name} replied to your gift card!
          </h1>

          ${card.gif_url ? `
            <div style="
              width: 200px;
              height: 200px;
              margin: 0 auto 24px auto;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            ">
              <img 
                src="${card.gif_url}" 
                alt="Gift animation" 
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                "
              />
            </div>
          ` : ''}

          <div style="
            text-align: center;
            margin-bottom: 32px;
            padding: 24px;
            background-color: #f5f5f5;
            border-radius: 12px;
          ">
            <p style="
              color: #666666;
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 16px;
            ">
              For ${updatedData.occasion}, they said:
            </p>

            <p style="
              color: #000000;
              font-size: 18px;
              line-height: 1.6;
              font-weight: 500;
            ">
              "${reply.trim()}"
            </p>
          </div>

          <div style="
            text-align: center;
            padding-top: 24px;
            border-top: 1px solid #eaeaea;
          ">
            <p style="
              color: #999999;
              font-size: 14px;
              margin: 0;
            ">
              Time to go gift hunting! 🎁
            </p>
          </div>
        </div>
      `;

      const emailPayload = {
        to: updatedData.recipient_email,
        subject: `${card.receiver_name} replied to your gift card! 🎉`,
        htmlContent: notificationHtml,
        senderName: card.receiver_name,
        occasion: updatedData.occasion,
        recipientName: card.receiver_name
      };

      devLog('Sending notification email with payload:', emailPayload);

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
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

      if (!response.ok) {
        console.error('API Error:', responseData);
        throw new Error(responseData?.error || `API error: ${response.status} ${response.statusText}`);
      }

      if (!responseData.success) {
        console.error('API returned failure:', responseData);
        throw new Error(responseData.error || 'Failed to send email');
      }

      devLog('Email sent successfully:', responseData);
      setCard(prevCard => prevCard ? { ...prevCard, ...updatedData } : null);
      setSubmitted(true);
    } catch (error) {
      console.error('Full error details:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Extract occasion from message HTML for display
  const getOccasionText = () => {
    if (!card?.occasion) return '';
    
    if (card.occasion === 'Thank You') {
      return (
        <p className="text-2xl font-bold text-black">
          Someone wants to <span className="text-pink-600">thank you</span>!
        </p>
      );
    }

    return (
      <p className="text-2xl font-bold text-black">
        What do you want for your{' '}
        <span className="text-pink-600">{card.occasion}</span>?
      </p>
    );
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-xl mx-auto p-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Invalid Link</h2>
          <p className="text-gray-600">This link appears to be invalid. Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your card...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-xl mx-auto p-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Oops!</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-xl mx-auto p-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            🎉 Thanks {card?.receiver_name}!
          </h2>
          <p className="text-gray-600">Your gift ninja will make sure you get something you'll love.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white">
      {error ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-xl mx-auto p-6 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Oops!</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      ) : !card ? (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className={`w-full max-w-md p-6 rounded-xl shadow-xl 
                           ${card.background ? BACKGROUNDS.find((bg: Background) => bg.value === card.background)?.color : 'bg-white'}`}>
              <div className="relative">
                {card.gif_url && (
                  <div className="absolute -top-16 right-0 w-24 h-24 rounded-lg overflow-hidden shadow-lg bg-white">
                    <Image
                      src={card.gif_url}
                      alt="Gift animation"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div className="text-center">
                  <p className="text-lg font-medium mb-2 text-black">
                    Hey {card.receiver_name}! 👋
                  </p>
                  {getOccasionText()}
                </div>
              </div>

              <div className="mt-8">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={getSuggestions()[currentSuggestion]}
                  className="w-full p-4 rounded-lg border border-black/20 bg-white text-black resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  rows={2}
                  required
                />
                <p className="text-sm text-black/60 text-center mt-2">
                  Let your gift ninja know what makes you happy
                </p>
              </div>

              <motion.button
                onClick={handleSubmit}
                disabled={isLoading || !reply.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full mt-6 py-3 px-4 rounded-full font-semibold transition-all ${
                  isLoading || !reply.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Reply'}
              </motion.button>

              {error && (
                <p className="text-sm text-red-500 text-center mt-4">{error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReplyPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReplyPageContent />
    </Suspense>
  );
} 