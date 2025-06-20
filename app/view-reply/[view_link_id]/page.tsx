import { use } from 'react';
import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ view_link_id: string }> }) {
  const { view_link_id } = use(params);

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

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🎁 Gift Reply
            </h1>
            <p className="text-gray-600">
              From {data.receiver_name}
            </p>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              What makes me happy:
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {data.reply_message}
            </p>
          </div>

          {data.occasion && (
            <div className="text-sm text-gray-500">
              Occasion: {data.occasion}
            </div>
          )}

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