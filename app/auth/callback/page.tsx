'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      // Handle any errors
      if (error) {
        console.error('Error during auth callback:', error);
        router.push('/?error=Unable to authenticate');
        return;
      }

      // Successful authentication
      router.push('/dashboard');
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner />
      <p className="mt-4 text-gray-600">Completing authentication...</p>
    </div>
  );
} 