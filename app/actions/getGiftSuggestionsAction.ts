'use server';

import { getGiftSuggestions } from '@/utils/getGiftSuggestions';
 
export async function fetchGiftSuggestions(reply: string, occasion: string) {
  return await getGiftSuggestions(reply, occasion);
} 