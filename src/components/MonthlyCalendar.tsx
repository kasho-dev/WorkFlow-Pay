import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthlyCalendarProps {
  year: number;
  month: number;
  keystrokesData: { [date: string]: number };
  onDateClick: (date: string) => void;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  year,
  month,
  keystrokesData,
  onDateClick
}) => {
  const [currentYear, setCurrentYear] = useState(year);
  const [currentMonth, setCurrentMonth] = useState(month);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth - 1, i);
      const dateString = date.toISOString().split('T')[0];
      const keystrokes = keystrokesData[dateString] || 0;
      const expectedSalary = keystrokes * 0.01;
      
      days.push({
        day: i,
        date: dateString,
        keystrokes,
        expectedSalary
      });
    }

    return days;
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarDays = generateCalendarDays();
  const totalKeystrokes = Object.values(keystrokesData).reduce((sum, count) => sum + count, 0);
  const totalSalary = totalKeystrokes * 0.01;

  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Monthly Calendar</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousMonth}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h3 className="text-lg font-semibold text-white">
            {getMonthName(currentMonth)} {currentYear}
          </h3>
          <button
            onClick={handleNextMonth}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-400 bg-gray-800 rounded">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`p-3 min-h-[80px] border border-gray-600 rounded ${
              day ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer' : 'bg-gray-800'
            }`}
            onClick={() => day && onDateClick(day.date)}
          >
            {day && (
              <div className="h-full flex flex-col">
                <div className="text-sm text-white font-semibold mb-1">
                  {day.day}
                </div>
                {day.keystrokes > 0 && (
                  <div className="text-xs space-y-1">
                    <div className="text-blue-400">
                      {day.keystrokes.toLocaleString()} KS
                    </div>
                    <div className="text-green-400 font-semibold">
                      ₱{day.expectedSalary.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Total Keystrokes</h3>
          <p className="text-2xl font-bold text-white">{totalKeystrokes.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Expected Salary For This Month</h3>
          <p className="text-2xl font-bold text-green-400">₱{totalSalary.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Days Worked</h3>
          <p className="text-2xl font-bold text-blue-400">
            {Object.keys(keystrokesData).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Average/Day</h3>
          <p className="text-2xl font-bold text-purple-400">
            {Object.keys(keystrokesData).length > 0 
              ? Math.round(totalKeystrokes / Object.keys(keystrokesData).length).toLocaleString()
              : 0
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendar; 