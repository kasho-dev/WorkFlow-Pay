import React from 'react';
import { DollarSign } from 'lucide-react';
import Card from '../Card';

interface SalaryWidgetProps {
  expectedSalary?: number;
  lastWeekSalary?: number;
}

const SalaryWidget: React.FC<SalaryWidgetProps> = ({
  expectedSalary = 0,
  lastWeekSalary = 0
}) => {
  const percentageChange = lastWeekSalary > 0 
    ? ((expectedSalary - lastWeekSalary) / lastWeekSalary * 100).toFixed(1)
    : '0.0';
  const isIncrease = !percentageChange.startsWith('-');

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Expected Salary This Week</h3>
        <DollarSign className="w-5 h-5 text-green-400" />
      </div>
      
      <div className="text-3xl font-bold text-green-400 mb-2">
        ₱{expectedSalary.toFixed(2)}
      </div>
      
      {lastWeekSalary > 0 && (
        <div className="flex items-center text-sm">
          <span className={isIncrease ? 'text-green-400' : 'text-red-400'}>
            {isIncrease ? '+' : ''}{percentageChange}%
          </span>
          <span className="text-gray-400 ml-2">vs last week</span>
        </div>
      )}
      
      <div className="text-xs text-gray-400 mt-2">
        Based on keystrokes × 0.01
      </div>
    </Card>
  );
};

export default SalaryWidget; 