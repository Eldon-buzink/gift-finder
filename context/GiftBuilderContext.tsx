'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type GiftData = {
  occasion: string;
  name: string;
  background: string;
  gif: string;
};

type GiftBuilderContextType = {
  data: GiftData;
  setData: (newData: Partial<GiftData>) => void;
  reset: () => void;
  isComplete: () => boolean;
  getCurrentStep: () => number;
};

const defaultData: GiftData = {
  occasion: '',
  name: '',
  background: '',
  gif: '',
};

const GiftBuilderContext = createContext<GiftBuilderContextType | undefined>(undefined);

export function GiftBuilderProvider({ children }: { children: ReactNode }) {
  const [data, setGiftData] = useState<GiftData>(defaultData);

  const setData = (newData: Partial<GiftData>) => {
    setGiftData((prev) => ({ ...prev, ...newData }));
  };

  const reset = () => setGiftData(defaultData);

  const isComplete = () => {
    return Boolean(data.occasion && data.name && data.background && data.gif);
  };

  const getCurrentStep = () => {
    if (!data.occasion) return 1;
    if (!data.name) return 2;
    if (!data.background || !data.gif) return 3;
    return 4;
  };

  return (
    <GiftBuilderContext.Provider value={{ data, setData, reset, isComplete, getCurrentStep }}>
      {children}
    </GiftBuilderContext.Provider>
  );
}

export function useGiftBuilder() {
  const context = useContext(GiftBuilderContext);
  if (!context) throw new Error('useGiftBuilder must be used within GiftBuilderProvider');
  return context;
} 