import React from 'react';
import Logo from '../assets/WorkFlow+Pay icon.svg';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center pb-6">
      <div className="flex items-center">
        <img src={Logo} alt="workflowpay" />
      </div>
      <div className="text-white">
        Welcome, User
      </div>
    </header>
  );
};

export default Header; 