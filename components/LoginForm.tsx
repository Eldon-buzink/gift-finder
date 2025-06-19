'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ email });

    setLoading(false);

    if (error) {
      alert('🫠 Something went wrong. Try again.');
    } else {
      router.push('/check-inbox');
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md space-y-4 p-6 bg-white rounded-2xl shadow-xl text-center"
    >
      <h1 className="text-2xl font-bold">🎁 Welcome to Gift Hunt</h1>
      <p className="text-sm text-gray-500">Let&apos;s figure out what they *really* want</p>

      <input
        type="email"
        placeholder="Your email"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-500 text-white font-bold py-2 rounded hover:bg-pink-600 transition"
      >
        {loading ? 'Sending the magic... 🔮' : 'Send me the magic link 🔑'}
      </button>

      <p className="text-xs text-gray-400">You&apos;ll stay anonymous. Like a gift ninja 🥷</p>
    </form>
  );
} 