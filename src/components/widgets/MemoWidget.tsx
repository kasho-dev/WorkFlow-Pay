import React, { useState, useEffect } from 'react';
import { Edit2, Save } from 'lucide-react';
import Card from '../Card';

const MEMO_STORAGE_KEY = 'workflow-pay-memo';

const MemoWidget: React.FC = () => {
  const [memo, setMemo] = useState('Hi Baby. Good luck today! :P');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  // Load saved memo from localStorage on component mount
  useEffect(() => {
    const savedMemo = localStorage.getItem(MEMO_STORAGE_KEY);
    if (savedMemo) {
      setMemo(savedMemo);
    }
  }, []);

  const handleEditClick = () => {
    setEditValue(memo);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue) {
      setMemo(trimmedValue);
      localStorage.setItem(MEMO_STORAGE_KEY, trimmedValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-semibold">Memo</h3>
        {!isEditing ? (
          <button 
            onClick={handleEditClick}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Edit memo"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={handleSave}
            className="text-green-400 hover:text-green-300 transition-colors"
            aria-label="Save memo"
          >
            <Save className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {isEditing ? (
        <textarea
          className="w-full bg-gray-700 text-white rounded p-2 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          rows={3}
        />
      ) : (
        <p 
          className="text-white text-xl whitespace-pre-line cursor-text"
          onClick={handleEditClick}
        >
          {memo}
        </p>
      )}
    </Card>
  );
};

export default MemoWidget;