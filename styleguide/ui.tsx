import React from 'react';

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center text-center p-4" style={{
    background: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)'
  }}>
    {children}
  </div>
); 