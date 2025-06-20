import { use } from 'react';
import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

type Params = {
  view_link_id: string;
};

type ReplyData = {
  receiver_name: string;
  reply_message: string;
  occasion: string;
  background: string;
  gif_url: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { view_link_id } = use(params);
  
  // Debug: Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600">Missing Supabase configuration</p>
        </div>
      </div>
    );
  }

  const supabase = createServerClient();

  try {
    console.log('Querying Supabase for view_link_id:', view_link_id);
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // First, let's try to check if we can connect to Supabase at all
    const { data: testData, error: testError } = await supabase
      .from('emails')
      .select('count')
      .limit(1);

    console.log('Test query result:', { testData, testError });

    if (testError) {
      console.error('Test query failed:', testError);
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
            <p className="text-gray-600">Unable to connect to database</p>
            <div className="mt-4 text-xs text-gray-400">
              Error: {testError.message}
            </div>
          </div>
        </div>
      );
    }
    
    // Query Supabase for the reply data
    const { data, error } = await supabase
      .from('emails')
      .select('receiver_name, reply_message, occasion, background, gif_url')
      .eq('view_link_id', view_link_id)
      .single();

    console.log('Supabase response:', { data, error });

    // If no data found or no reply message, show not found
    if (error) {
      console.error('Supabase error:', error);
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
            <p className="text-gray-600">Error querying database</p>
            <div className="mt-4 text-xs text-gray-400">
              Error: {error.message}
            </div>
          </div>
        </div>
      );
    }

    if (!data || !data.reply_message) {
      console.error('No data or reply message found for view_link_id:', view_link_id);
      notFound();
    }

    const replyData: ReplyData = data;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🎁 Gift Reply
            </h1>
            <p className="text-gray-600">
              From {replyData.receiver_name}
            </p>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              What makes me happy:
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {replyData.reply_message}
            </p>
          </div>

          {replyData.occasion && (
            <div className="text-sm text-gray-500">
              Occasion: {replyData.occasion}
            </div>
          )}

          <div className="mt-6 text-xs text-gray-400">
            View link ID: {view_link_id}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Something went wrong while loading the gift reply.</p>
          <div className="mt-4 text-xs text-gray-400">
            View link ID: {view_link_id}
          </div>
        </div>
      </div>
    );
  }
} 