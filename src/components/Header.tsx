import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-6 bg-card rounded-lg mb-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-white">WorkFlow</span>
          <span className="text-primary font-semibold text-xl">+Pay</span>
        </h1>
      </div>
      <div className="text-white">
        Welcome, User
      </div>
    </header>
  );
};

export default Header; 