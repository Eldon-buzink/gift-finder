'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [recipientName, setRecipientName] = useState('');

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
    if (!card?.message_html) return defaultSuggestions;
    // Extract occasion from message HTML
    const occasionMatch = card.message_html.match(/<h2>(.*?)<\/h2>/);
    const occasion = occasionMatch ? occasionMatch[1] : null;
    return occasionSuggestions[occasion || ''] || defaultSuggestions;
  };

  // Rotate through suggestions
  useEffect(() => {
    if (reply) return; // Don't rotate if user has typed something
    
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % getSuggestions().length);
    }, 2000);

    return () => clearInterval(interval);
  }, [reply]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!id || !reply.trim() || !recipientName.trim()) {
        setError('Please fill in both your name and reply.');
        return;
      }

      const name = recipientName.trim();
      console.log('Starting submission with name:', name);

      // First update the email record with the reply and recipient name
      console.log('Updating Supabase with:', {
        id,
        name,
        reply: reply.trim(),
      });

      const { data: updatedData, error: updateError } = await supabase
        .from('emails')
        .update({
          replied: true,
          reply_message: reply.trim(),
          recipient_name: name
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

      console.log('Supabase update successful:', {
        id: updatedData.id,
        recipient_name: updatedData.recipient_name,
        replied: updatedData.replied
      });

      // Now send a notification email about the reply
      const emailPayload = {
        to: updatedData.recipient_email,
        subject: 'Your gift card has been replied to! 🎉',
        htmlContent: `<div>Reply received: ${reply.trim()}</div>`,
        senderName: name,
        occasion: updatedData.occasion,
        recipientName: name
      };

      console.log('Sending notification email with payload:', emailPayload);

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
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

      if (!response.ok) {
        console.error('API Error:', responseData);
        throw new Error(responseData?.error || `API error: ${response.status} ${response.statusText}`);
      }

      if (!responseData.success) {
        console.error('API returned failure:', responseData);
        throw new Error(responseData.error || 'Failed to send email');
      }

      console.log('Email sent successfully:', responseData);
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
    if (!card?.message_html) return '';
    
    const occasionMatch = card.message_html.match(/<h2>(.*?)<\/h2>/);
    if (!occasionMatch) return '';
    
    const occasion = occasionMatch[1];
    
    if (occasion === 'Thank You') {
      return (
        <p className="text-[22px]">
          Someone wants to <span className="text-[#E91E63]">thank you</span>!
        </p>
      );
    }

    return (
      <p className="text-[22px]">
        What do you want for your{' '}
        <span className="text-[#E91E63]">{occasion}</span>?
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
            🎉 Thanks {recipientName}!
          </h2>
          <p className="text-gray-600">Your gift ninja will make sure you get something you'll love.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
        <div className="max-w-2xl mx-auto p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h1 className="text-[32px] font-semibold">
                  Hey{recipientName ? ` ${recipientName}` : ''}!
                </h1>
                <span className="text-[32px]">👋</span>
              </div>
              {getOccasionText()}
            </div>

            {card.gif_url && (
              <div className="relative w-full aspect-video rounded-[16px] overflow-hidden">
                <Image
                  src={card.gif_url}
                  alt="Gift animation"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  First, what's your name?
                </label>
                <input
                  type="text"
                  id="name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  required
                />
              </div>

              <div className="space-y-4">
                <label htmlFor="reply" className="block text-sm font-medium text-gray-700">
                  What would make you happy?
                </label>
                <textarea
                  id="reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Tell us what you'd like..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Need inspiration? Try one of these:</p>
                <div className="grid grid-cols-1 gap-2">
                  {getSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSuggestion(index);
                        setReply(suggestion);
                      }}
                      className={`text-left p-3 rounded-lg transition-all ${
                        currentSuggestion === index
                          ? 'bg-black text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading || !recipientName.trim() || !reply.trim()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  isLoading || !recipientName.trim() || !reply.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Reply'}
              </button>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
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