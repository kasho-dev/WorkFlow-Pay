import React, { useState, useEffect } from 'react';
import Button from './Button';
import { X } from 'lucide-react';

// Helper function to get the start of the week (Monday)
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

interface WeeklyCalendarProps {
  data: WeeklyData[];
  onUpdateKeystrokes: (date: string, count: number) => void;
  showOverlay: boolean;
  setShowOverlay: (show: boolean) => void;
  todayKeystrokes: string;
  setTodayKeystrokes: (value: string) => void;
}

export interface WeeklyData {
  date: string;
  day: string;
  keystrokes: number;
  expectedSalary: number;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = (props) => {
  const [localData, setLocalData] = useState<WeeklyData[]>(props.data);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [updatedCells, setUpdatedCells] = useState<{[key: string]: boolean}>({});
  
  // Destructure props including the new ones
  const { 
    data,
    onUpdateKeystrokes,
    showOverlay, 
    setShowOverlay, 
    todayKeystrokes, 
    setTodayKeystrokes 
  } = props;

  // Initialize current week on mount
  useEffect(() => {
    const today = new Date();
    const start = getStartOfWeek(today);
    const week = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    
    setCurrentWeek(week);
  }, []); // Empty dependency array to run only once on mount

  // Update local data when data prop changes
  useEffect(() => {
    if (currentWeek.length > 0) {
      const weekStart = formatDate(currentWeek[0]);
      const weekEnd = formatDate(new Date(currentWeek[6].setHours(23, 59, 59, 999)));
      
      const filteredData = data.filter(item => {
        return item.date >= weekStart && item.date <= weekEnd;
      });
      
      // If no data for the week, initialize with default values
      if (filteredData.length === 0) {
        const defaultWeekData = currentWeek.map(date => ({
          date: formatDate(date),
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          keystrokes: 0,
          expectedSalary: 0
        }));
        setLocalData(defaultWeekData);
      } else {
        // Ensure we have all days of the week
        const weekData = currentWeek.map(date => {
          const dateStr = formatDate(date);
          const existing = filteredData.find(d => d.date === dateStr);
          return existing || {
            date: dateStr,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            keystrokes: 0,
            expectedSalary: 0
          };
        });
        setLocalData(weekData);
      }
    }
  }, [data, currentWeek]);

  const calculateWeeklyTotal = () => {
    const totalKeystrokes = localData.reduce((sum, item) => sum + item.keystrokes, 0);
    const totalSalary = localData.reduce((sum, item) => sum + item.expectedSalary, 0);
    return { totalKeystrokes, totalSalary };
  };

  const { totalKeystrokes, totalSalary } = calculateWeeklyTotal();

  const handleKeystrokesUpdate = (date: string, count: number) => {
    if (count >= 0) {
      onUpdateKeystrokes(date, count);
      
      // Highlight the updated cell
      setUpdatedCells(prev => ({
        ...prev,
        [date]: true
      }));
      
      // Remove highlight after animation completes
      setTimeout(() => {
        setUpdatedCells(prev => ({
          ...prev,
          [date]: false
        }));
      }, 1500);
      
      // Update local data immediately for better UX
      setLocalData(prev => {
        const itemExists = prev.some(item => item.date === date);
        const item = prev.find(item => item.date === date);
        
        if (itemExists && item) {
          return prev.map(item => 
            item.date === date 
              ? { ...item, keystrokes: count, expectedSalary: count * 0.01 }
              : item
          );
        } else {
          const dateObj = new Date(date);
          return [
            ...prev,
            {
              date,
              day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
              keystrokes: count,
              expectedSalary: count * 0.01
            }
          ];
        }
      });
    }
  };

  const handleTodaySubmit = () => {
    const today = new Date();
    const todayStr = formatDate(today);
    const count = parseInt(todayKeystrokes) || 0;
    handleKeystrokesUpdate(todayStr, count);
    setShowOverlay(false);
  };

  const startEditing = (date: string, keystrokes: number) => {
    setEditingDate(date);
    setEditingValue(keystrokes.toString());
  };

  const saveEditing = (date: string) => {
    const count = parseInt(editingValue) || 0;
    handleKeystrokesUpdate(date, count);
    setEditingDate(null);
  };

  const cancelEditing = () => {
    setEditingDate(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, date: string) => {
    if (e.key === 'Enter') {
      saveEditing(date);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-card rounded-lg p-6 animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Weekly Keystrokes
        </h2>
        <div className="text-sm text-gray-400 animate-pulse-slow">
          {todayFormatted}
        </div>
      </div>

      {/* Animated Weekly Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-800 to-gray-700">
              <th className="border-b border-gray-600 px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">
                Day
              </th>
              <th className="border-b border-gray-600 px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">
                Date
              </th>
              <th className="border-b border-gray-600 px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">
                Keystrokes
              </th>
              <th className="border-b border-gray-600 px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">
                Expected Salary
              </th>
            </tr>
          </thead>
          <tbody>
            {localData.map((item, index) => {
              const isToday = formatDate(new Date()) === item.date;
              const animationDelay = `${index * 50}ms`;
              
              return (
                <tr 
                  key={item.date} 
                  className={`table-row-hover ${isToday ? 'bg-gray-700/50' : index % 2 === 0 ? 'bg-gray-800/80' : 'bg-gray-900/80'}`}
                  style={{
                    animation: `fadeIn 0.3s ease-out ${animationDelay} forwards`,
                    opacity: 0,
                    transform: 'translateY(10px)'
                  }}
                >
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isToday ? 'text-blue-300 font-semibold' : 'text-gray-300'}`}>
                    <div className="flex items-center">
                      {isToday && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                      )}
                      {item.day}
                      {isToday && <span className="ml-2 text-xs bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded">Today</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td 
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${updatedCells[item.date] ? 'cell-update' : ''}`}
                  >
                    <div 
                      className="transition-all duration-200 hover:bg-gray-700/50 rounded px-2 py-1 -mx-2"
                      onClick={() => startEditing(item.date, item.keystrokes)}
                    >
                      {editingDate === item.date ? (
                        <input
                          type="number"
                          className="w-full bg-gray-700 text-white p-1 rounded border border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, item.date)}
                          onBlur={() => saveEditing(item.date)}
                          autoFocus
                        />
                      ) : (
                        <div className="flex justify-between items-center group">
                          <span className={item.keystrokes > 0 ? 'text-green-300' : 'text-gray-400'}>
                            {item.keystrokes > 0 ? item.keystrokes.toLocaleString() : '—'}
                          </span>
                          <span className="text-xs text-transparent group-hover:text-blue-400 transition-colors duration-200">
                            ✏️
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.expectedSalary > 0 ? 'text-green-300' : 'text-gray-400'}`}>
                    ₱{item.expectedSalary > 0 ? item.expectedSalary.toFixed(2) : '0.00'}
                  </td>
                </tr>
              );
            })}
            {/* Weekly Total Row */}
            <tr className="bg-gradient-to-r from-gray-800 to-gray-700 font-semibold">
              <td className="px-6 py-4 text-sm text-blue-300" colSpan={2}>
                Weekly Total
              </td>
              <td className="px-6 py-4 text-sm text-green-300">
                {totalKeystrokes.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-green-300">
                ₱{totalSalary.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700/50">
          <h3 className="text-sm text-gray-400 mb-1">Total Keystrokes</h3>
          <p className="text-2xl font-bold text-white">{totalKeystrokes.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700/50">
          <h3 className="text-sm text-gray-400 mb-1">Expected Salary For This Week</h3>
          <p className="text-2xl font-bold text-green-400">₱{totalSalary.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700/50">
          <h3 className="text-sm text-gray-400 mb-1">Average/Day</h3>
          <p className="text-2xl font-bold text-blue-400">
            {localData.length > 0 ? Math.round(totalKeystrokes / localData.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Today's Input Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 max-w-md w-full mx-4 transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Input Today's Keystrokes
                </span>
              </h3>
              <button 
                onClick={() => setShowOverlay(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-1 hover:bg-gray-700 rounded-full"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Keystrokes for <span className="text-blue-300">{todayFormatted}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full p-4 bg-gray-700/80 border border-gray-600 rounded-lg text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 pr-12"
                  value={todayKeystrokes}
                  onChange={(e) => setTodayKeystrokes(e.target.value)}
                  placeholder="0"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  keystrokes
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary"
                onClick={() => setShowOverlay(false)}
                className="px-6 py-2.5 text-sm"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleTodaySubmit}
                disabled={!todayKeystrokes}
                className={!todayKeystrokes ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;