"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import GiftSuggestions from '@/components/GiftSuggestions';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Suggestion {
  label: string;
  url?: string;
}

export default function ViewReplyPage({ params }: { params: { view_link_id: string } }) {
  const { view_link_id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    async function fetchDataAndSuggestions() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("emails")
        .select("receiver_name, occasion, reply_message, background, gif_url")
        .eq("view_link_id", view_link_id)
        .single();

      if (error || !data || !data.reply_message) {
        setError("This gift request doesn&apos;t exist (or has expired).");
        setLoading(false);
        return;
      }

      setData(data);

      try {
        const { fetchGiftSuggestions } = await import('@/app/actions/getGiftSuggestionsAction');
        const result = await fetchGiftSuggestions(data.reply_message, data.occasion);

        setSuggestions(result.length ? result : [
          { label: '🕯️ Candles' },
          { label: '🍷 Wine' },
          { label: '🧱 Lego' },
        ]);
      } catch (err) {
        console.error("Failed to load suggestions:", err);
        setSuggestions([
          { label: '🕯️ Candles' },
          { label: '🍷 Wine' },
          { label: '🧱 Lego' },
        ]);
      }

      setLoading(false);
    }

    fetchDataAndSuggestions();
  }, [view_link_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4" />
        <p className="text-lg text-gray-500">Loading reply...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <div className="text-3xl mb-4">😕</div>
        <h1 className="text-xl font-semibold mb-2 text-center">{error}</h1>
        <Link href="/flow/start" className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">Send a new gift request</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">{data.receiver_name} replied!</h1>
        {data.gif_url && (
          <div className="w-full flex justify-center my-4">
            <Image src={data.gif_url} alt="Gift gif" width={200} height={200} className="rounded-xl shadow-md border border-gray-200" />
          </div>
        )}
        <div className="w-full text-center text-lg md:text-xl text-gray-700 mb-4 font-medium">
          What makes <span className="text-purple-700 font-bold">{data.receiver_name}</span> really happy for their <span className="text-pink-600 font-bold">{data.occasion}</span> is
        </div>
        <div className="w-full rounded-2xl p-6 mb-6 text-center bg-gray-50 border border-purple-100 shadow-md animate-fade-in">
          <p className="text-xl md:text-2xl text-black font-bold">{data.reply_message}</p>
        </div>
        <div className="w-full text-center mb-6">
          <p className="text-base text-gray-700 font-medium">Thanks for spreading some joy 🎉<br/>We&apos;re glad you used our app to make someone&apos;s day.</p>
        </div>
        <div className="w-full text-center mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2"><span role='img' aria-label='gift'>🎁</span>Suggested gifts</h2>
          <GiftSuggestions suggestions={suggestions} />
        </div>
        <Link href="/flow/start" className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-pink-600 transition text-center font-semibold">Send another gift request</Link>
      </div>
    </div>
  );
} 