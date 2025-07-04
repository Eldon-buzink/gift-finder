import { use } from 'react';
import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGiftSuggestions } from '@/utils/getGiftSuggestions';

type Params = {
  view_link_id: string;
};

type GiftSuggestion = {
  emoji: string;
  name: string;
};

export default function PageWrapper({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params);
  return <PageInner view_link_id={resolvedParams.view_link_id} />;
}

async function PageInner({ view_link_id }: { view_link_id: string }) {
  try {
    console.log("🧠 Rendering view-reply page:", view_link_id);

    const supabase = createServerClient();
    console.log("🔐 Supabase client initialized");

    const { data, error } = await supabase
      .from('emails')
      .select('receiver_name, reply_message, occasion, background, gif_url')
      .eq('view_link_id', view_link_id)
      .single();

    console.log("📬 Supabase query result:", { data, error });

    if (error || !data) {
      console.error("❌ No data returned or query failed");
      notFound();
    }

    // Get AI-powered gift suggestions
    let suggestedGifts: GiftSuggestion[] = [];
    try {
      console.log("🤖 Fetching AI gift suggestions for:", data.reply_message, data.occasion);
      const aiSuggestions = await getGiftSuggestions(data.reply_message, data.occasion || 'special occasion');
      console.log("🎁 AI suggestions received:", aiSuggestions);
      
      // Parse the AI suggestions into our format
      suggestedGifts = aiSuggestions.map((suggestion: any) => {
        const label = suggestion.label || '';
        const emojiMatch = label.match(/^([\p{Emoji_Presentation}\p{Extended_Pictographic}])\s*/u);
        const emoji = emojiMatch ? emojiMatch[1] : '🎁';
        
        // Extract the name after the emoji and before any dash
        const nameMatch = label.replace(/^([\p{Emoji_Presentation}\p{Extended_Pictographic}])\s*/u, '').split(' - ')[0];
        const name = nameMatch || 'Gift suggestion';
        
        return { emoji, name };
      });
    } catch (aiError) {
      console.error("❌ AI suggestions failed, using fallback:", aiError);
      // Fallback suggestions
      suggestedGifts = [
        { emoji: '💼', name: 'Laptop Bag' },
        { emoji: '🎧', name: 'Wireless Headphones' },
        { emoji: '📱', name: 'Phone Stand' },
        { emoji: '☕', name: 'Coffee Mug' },
      ];
    }

    // Fallback values for missing data
    const receiverName = data.receiver_name || 'Someone';
    const occasion = data.occasion || 'special day';

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Large Headline */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              🎉 {receiverName} replied!
            </h1>
          </div>

          {/* Full-width GIF */}
          {data.gif_url && (
            <div className="mb-6">
              <img 
                src={data.gif_url} 
                alt="Celebration GIF"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* Subheadline */}
          <div className="mb-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              What makes <span className="font-semibold text-purple-600">{receiverName}</span> really happy for their{' '}
              <span className="font-semibold text-purple-600">{occasion}</span> is:
            </p>
          </div>

          {/* Big Bold Reply Message */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-800 leading-tight">
              {data.reply_message}
            </p>
          </div>

          {/* Friendly Thank-you Message */}
          <div className="mb-8">
            <p className="text-lg text-gray-600">
              🙌 Thanks for sharing what makes you happy!
            </p>
          </div>

          {/* Suggested Gifts Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              🎁 Suggested gifts
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Based on what you shared, here are some ideas
            </p>
            
            <div className="space-y-3">
              {suggestedGifts.map((gift: GiftSuggestion, index: number) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm flex items-center">
                  <div className="text-2xl mr-4">{gift.emoji}</div>
                  <div className="text-sm font-semibold text-gray-800">{gift.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-4">
            <Link 
              href="/flow/start"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 text-lg"
            >
              💌 Send another gift request
            </Link>
          </div>

          {/* Debug info */}
          <div className="mt-6 text-xs text-gray-400">
            View link ID: {view_link_id}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error("💥 Unexpected error in view-reply page:", err);
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Unexpected error loading reply.</p>
          <div className="mt-4 text-xs text-gray-400">
            View link ID: {view_link_id}
          </div>
        </div>
      </div>
    );
  }
} 