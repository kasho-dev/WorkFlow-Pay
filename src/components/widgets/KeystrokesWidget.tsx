import React from 'react';
import { Keyboard } from 'lucide-react';
import Card from '../Card';

interface KeystrokesWidgetProps {
  totalKeystrokes: number;
  lastWeekKeystrokes?: number;
}

const KeystrokesWidget: React.FC<KeystrokesWidgetProps> = ({
  totalKeystrokes = 0,
  lastWeekKeystrokes
}) => {
  const formattedKeystrokes = totalKeystrokes.toLocaleString();
  
  // Calculate difference from last week if data is available
  let differenceElement = null;
  if (lastWeekKeystrokes !== undefined && lastWeekKeystrokes > 0) {
    const difference = totalKeystrokes - lastWeekKeystrokes;
    const isIncrease = difference >= 0;
    const differenceText = Math.abs(difference).toLocaleString();
    
    differenceElement = (
      <div className="text-xs mt-1">
        <span className={isIncrease ? 'text-green-400' : 'text-red-400'}>
          {isIncrease ? '↑' : '↓'} {differenceText} 
        </span>
        <span className="text-gray-400">
          {isIncrease ? 'more' : 'less'} than last week
        </span>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-semibold">Total Keystrokes This Week</h3>
        <Keyboard className="w-5 h-5 text-blue-400" />
      </div>
      <div className="text-3xl font-bold text-blue-400 mb-1">
        {formattedKeystrokes}
      </div>
      {differenceElement || (
        <div className="text-xs text-gray-400 mt-1">
          Start tracking your keystrokes!
        </div>
      )}
    </Card>
  );
};

export default KeystrokesWidget;