"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ViewReplyPage({ params }: { params: { view_link_id: string } }) {
  const unwrappedParams = React.use(params as any) as { view_link_id: string };
  const { view_link_id } = unwrappedParams;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("gift_requests")
        .select("receiver_name, occasion, reply_message, background, gif_url")
        .eq("view_link_id", view_link_id)
        .single();
      if (error || !data || !data.reply_message) {
        setError("This gift request doesn't exist (or has expired)." );
        setLoading(false);
        return;
      }
      setData(data);
      setLoading(false);
    }
    fetchData();
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
        <h1 className="text-2xl font-bold text-center mb-2">{data.receiver_name} replied!</h1>
        <p className="text-lg text-purple-700 font-medium mb-1">Occasion: {data.occasion}</p>
        {data.gif_url && (
          <div className="w-full flex justify-center my-4">
            <Image src={data.gif_url} alt="Gift gif" width={200} height={200} className="rounded-xl shadow" />
          </div>
        )}
        <div className={`w-full rounded-xl p-4 mb-4 text-center ${data.background ? `bg-${data.background}` : 'bg-gray-100'}` }>
          <p className="text-lg font-semibold mb-2">Their wish:</p>
          <p className="text-xl text-black font-bold">{data.reply_message}</p>
        </div>
        <div className="w-full text-center mb-6">
          <p className="text-base text-gray-700 font-medium">Thanks for spreading some joy 🎉<br/>We're glad you used our app to make someone's day.</p>
        </div>
        <div className="w-full text-center mb-6">
          <h2 className="text-lg font-semibold mb-2">Suggested gifts</h2>
          <ul className="flex flex-wrap justify-center gap-2 mb-2">
            <li className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">Candles</li>
            <li className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">Wine</li>
            <li className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Lego</li>
          </ul>
        </div>
        <Link href="/flow/start" className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-pink-600 transition text-center font-semibold">Send another gift request</Link>
      </div>
    </div>
  );
} 