import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-card rounded-lg p-4 pt-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card; 