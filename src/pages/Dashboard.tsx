import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Upload, Settings } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import Table from '../components/Table';
import KeystrokesTracker from '../components/KeystrokesTracker';
import WeeklyCalendar from '../components/WeeklyCalendar';
import MonthlyCalendar from '../components/MonthlyCalendar';
import ThemeToggle from '../components/ThemeToggle';
import MemoWidget from '../components/widgets/MemoWidget';
import SalaryWidget from '../components/widgets/SalaryWidget';
import KeystrokesWidget from '../components/widgets/KeystrokesWidget';
import { apiService } from '../services/api';
import type { User, WeeklySummary, WeeklyData } from '../services/api';

type TabType = 'weekly' | 'calendar' | 'analytics' | 'tracker';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('weekly');
  const [isTracking, setIsTracking] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyKeystrokes, setMonthlyKeystrokes] = useState<{ [date: string]: number }>({});
  const [showOverlay, setShowOverlay] = useState(false);
  const [todayKeystrokes, setTodayKeystrokes] = useState('');

  // Memoize demoUser to prevent recreating it on every render
  const demoUser = React.useMemo(() => ({
    id: 'demo-user-1',
    email: 'demo@workflowpay.com',
    name: 'Demo User',
    currency: 'PHP',
    keystrokes: []
  }), []);

  // Define loadWeeklyData first since it's used in the effect
  const loadWeeklyData = useCallback(async () => {
    try {
      const summary = await apiService.getWeeklySummary(demoUser.id);
      setWeeklySummary(summary);
      
      // Generate weekly data for the calendar (Monday-Sunday)
      const weekData: WeeklyData[] = [];
      const today = new Date();
      const startOfWeek = new Date(today);
      
      // Get Monday of current week
      const dayOfWeek = today.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so we need 6 days back
      startOfWeek.setDate(today.getDate() - daysToMonday);
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        weekData.push({
          date: dateString,
          day: dayNames[date.getDay()],
          keystrokes: 0, // Start with 0 instead of random data
          expectedSalary: 0
        });
      }
      
      setWeeklyData(weekData);
    } catch (error) {
      console.error('Failed to load weekly data:', error);
      // Use mock data if API is not available
      setWeeklySummary({
        totalKeystrokes: 0,
        weeklyEarnings: 0,
        currency: 'PHP'
      });
    }
  }, [demoUser.id]);

  // Wrap loadMonthlyData in useCallback to prevent unnecessary re-renders
  const loadMonthlyData = useCallback(async () => {
    try {
      // Get the current date
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
      const currentYear = today.getFullYear();
      
      // If we have weekly data, use that instead of mock data
      if (weeklyData.length > 0) {
        const monthlyData: { [date: string]: number } = {};
        
        // Add all weekly data to the monthly data
        weeklyData.forEach(day => {
          monthlyData[day.date] = day.keystrokes;
        });
        
        setMonthlyKeystrokes(monthlyData);
      } else {
        // Fallback to mock data if no weekly data is available
        const mockData: { [date: string]: number } = {};
        
        for (let i = 1; i <= 31; i++) {
          const date = new Date(currentYear, currentMonth - 1, i);
          if (date.getMonth() === currentMonth - 1) {
            const dateString = date.toISOString().split('T')[0];
            mockData[dateString] = 0; // Initialize with 0 instead of random data
          }
        }
        
        setMonthlyKeystrokes(mockData);
      }
    } catch (error) {
      console.error('Error loading monthly data:', error);
    }
  }, [weeklyData]);
  
  // Update monthly data when weekly data changes
  useEffect(() => {
    if (weeklyData.length > 0) {
      loadMonthlyData();
    }
  }, [weeklyData, loadMonthlyData]);

  // Load data on component mount
  useEffect(() => {
    // Initialize user
    setUser(demoUser);
    
    // Load weekly data
    loadWeeklyData();
  }, [demoUser, loadWeeklyData]);

  // loadMonthlyData is now defined above with useCallback

  const handleKeystrokesSubmit = async (data: { count: number; duration: number }) => {
    try {
      if (!user) return;
      
      const result = await apiService.addKeystrokes(user.id, data.count);
      console.log('Keystrokes submitted:', result);
      
      // Reload weekly data
      await loadWeeklyData();
    } catch (error) {
      console.error('Failed to submit keystrokes:', error);
      // In demo mode, just update local state
      if (weeklySummary) {
        setWeeklySummary({
          ...weeklySummary,
          totalKeystrokes: weeklySummary.totalKeystrokes + data.count,
          weeklyEarnings: weeklySummary.weeklyEarnings + (data.count * 0.01)
        });
      }
    }
  };

  const handleUpdateKeystrokes = async (date: string, count: number) => {
    try {
      if (!user) return;
      
      await apiService.addKeystrokes(user.id, count, date);
      await loadWeeklyData();
      
      // Update monthly data to reflect the changes
      setMonthlyKeystrokes(prev => ({
        ...prev,
        [date]: count
      }));
    } catch (error) {
      console.error('Failed to update keystrokes:', error);
    }
  };

  const handleStartTracking = () => {
    setIsTracking(true);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const tabs = [
    { id: 'weekly', label: 'Weekly KS', disabled: false },
    { id: 'calendar', label: 'Calendar', disabled: true },
    { id: 'analytics', label: 'Analytics', disabled: true },
    { id: 'tracker', label: 'Tracker', disabled: true }
  ];

  const analyticsData = {
    headers: ['Metric', 'This Week', 'Last Week', 'Change'],
    data: [
      ['Total Keystrokes', '12,400', '10,800', '+14.8%'],
      ['Expected Salary', '₱124.00', '₱108.00', '+14.8%'],
      ['Average/Day', '1,771', '1,543', '+14.8%'],
      ['Days Worked', '7', '7', '0%'],
    ]
  };

  const getTableData = () => {
    switch (activeTab) {
      case 'analytics':
        return analyticsData;
      default:
        return analyticsData;
    }
  };

  const currentData = getTableData();

  const renderMainContent = () => {
    if (activeTab === 'tracker') {
      return (
        <div className="bg-card rounded-lg p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Keystrokes Tracker</h2>
            <div className="flex gap-2">
              <ThemeToggle isDark={isDarkMode} onToggle={handleThemeToggle} />
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
          <KeystrokesTracker
            onKeystrokesSubmit={handleKeystrokesSubmit}
            isTracking={isTracking}
            onStartTracking={handleStartTracking}
            onStopTracking={handleStopTracking}
          />
        </div>
      );
    }

    if (activeTab === 'weekly') {
      return (
        <div>
          <div className="mb-6">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {
                const today = new Date();
                const todayStr = new Date(today).toISOString().split('T')[0];
                const todayData = weeklyData.find(item => item.date === todayStr);
                setTodayKeystrokes(todayData ? todayData.keystrokes.toString() : '0');
                setShowOverlay(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Input Today's Keystrokes</span>
            </Button>
          </div>
          <WeeklyCalendar
            data={weeklyData}
            onUpdateKeystrokes={handleUpdateKeystrokes}
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
            todayKeystrokes={todayKeystrokes}
            setTodayKeystrokes={setTodayKeystrokes}
          />
        </div>
      );
    }

    if (activeTab === 'calendar') {
      return (
        <MonthlyCalendar
          year={2025}
          month={8}
          keystrokesData={monthlyKeystrokes}
          onDateClick={(date) => {
            console.log('Clicked date:', date);
            // Could open a modal to edit keystrokes for that date
          }}
        />
      );
    }

    return (
      <div className="bg-card rounded-lg p-6 min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Performance Analytics</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Upload className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Table 
          headers={currentData.headers}
          data={currentData.data}
          className="w-full"
        />
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark' : 'bg-gray-100'} p-6 transition-colors`}>
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-3">
            {/* Input Button - Removed as it's now part of the WeeklyCalendar tab */}

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id as TabType)}
                  disabled={tab.disabled}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-card text-white'
                      : tab.disabled
                      ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 text-gray-300 hover:bg-card hover:text-white'
                  }`}
                  title={tab.disabled ? 'Coming soon' : ''}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Content Panel */}
            {renderMainContent()}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <MemoWidget />
            <SalaryWidget 
              expectedSalary={weeklyData.reduce((sum, day) => sum + day.expectedSalary, 0)}
              lastWeekSalary={weeklyData.reduce((sum, day) => sum + day.expectedSalary, 0) * 0.9} // 90% of current week as mock data
            />
            <KeystrokesWidget 
              totalKeystrokes={weeklyData.reduce((sum, day) => sum + day.keystrokes, 0)}
              lastWeekKeystrokes={weeklyData.reduce((sum, day) => sum + day.keystrokes, 0) * 0.9} // 90% of current week as mock data
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 