import React from 'react';
import Card from '../Card';

const MemoWidget: React.FC = () => {
  return (
    <Card className="mb-4">
      <h3 className="text-white font-semibold mb-2">Memo</h3>
      <p className="text-white text-sm">
        Don't forget to take breaks 😜
      </p>
    </Card>
  );
};

export default MemoWidget; 