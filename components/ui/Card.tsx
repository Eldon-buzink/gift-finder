// components/Card.tsx
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
    <div className={`p-6 rounded-lg shadow-sm bg-white ${className}`}>
        {children}
      </div>
    );
  }