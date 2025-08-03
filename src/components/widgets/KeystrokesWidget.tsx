import React from 'react';
import { Settings } from 'lucide-react';
import Card from '../Card';

const KeystrokesWidget: React.FC = () => {
  return (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-semibold">Keystrokes</h3>
        <Settings className="w-4 h-4 text-white cursor-pointer" />
      </div>
      <div className="text-3xl font-bold text-primary mb-1">2,4K</div>
      <div className="text-white text-xs">1323 Higher than last week</div>
    </Card>
  );
};

export default KeystrokesWidget; 