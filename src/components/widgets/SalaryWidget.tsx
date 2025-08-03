import React from 'react';
import Card from '../Card';

const SalaryWidget: React.FC = () => {
  return (
    <Card className="mb-4">
      <h3 className="text-white font-semibold mb-2">Expected Salary</h3>
      <div className="text-2xl font-bold text-white mb-2">580.41 PHP</div>
      <div className="bg-primary text-white text-xs px-2 py-1 rounded-full inline-block mb-2">
        +2.45%
      </div>
      <div className="text-white text-xs">Next Payout: Oct 15, 2025</div>
    </Card>
  );
};

export default SalaryWidget; 