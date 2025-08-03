import React, { useState } from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import Table from '../components/Table';
import MemoWidget from '../components/widgets/MemoWidget';
import SalaryWidget from '../components/widgets/SalaryWidget';
import KeystrokesWidget from '../components/widgets/KeystrokesWidget';

type TabType = 'weekly' | 'calendar' | 'analytics';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('weekly');

  const tabs = [
    { id: 'weekly', label: 'Weekly KS' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'analytics', label: 'Analytics' }
  ];

  const weeklyData = {
    headers: ['Date', 'Keystrokes', 'Hours', 'Earnings'],
    data: [
      ['Mon, Oct 7', '2,450', '8.5', '45.50 PHP'],
      ['Tue, Oct 8', '2,100', '7.8', '38.75 PHP'],
      ['Wed, Oct 9', '2,800', '9.2', '52.00 PHP'],
      ['Thu, Oct 10', '2,300', '8.1', '42.50 PHP'],
      ['Fri, Oct 11', '2,600', '8.9', '48.25 PHP'],
    ]
  };

  const calendarData = {
    headers: ['Month', 'Total Hours', 'Total Keystrokes', 'Total Earnings'],
    data: [
      ['October 2025', '42.5', '12,250', '225.00 PHP'],
      ['September 2025', '38.2', '11,800', '210.50 PHP'],
      ['August 2025', '41.8', '12,100', '220.75 PHP'],
    ]
  };

  const analyticsData = {
    headers: ['Metric', 'This Week', 'Last Week', 'Change'],
    data: [
      ['Average Keystrokes/Day', '2,450', '2,100', '+16.7%'],
      ['Average Hours/Day', '8.5', '7.8', '+9.0%'],
      ['Average Earnings/Day', '45.50 PHP', '38.75 PHP', '+17.4%'],
      ['Productivity Score', '85%', '78%', '+7%'],
    ]
  };

  const getTableData = () => {
    switch (activeTab) {
      case 'weekly':
        return weeklyData;
      case 'calendar':
        return calendarData;
      case 'analytics':
        return analyticsData;
      default:
        return weeklyData;
    }
  };

  const currentData = getTableData();

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-3">
            {/* Input Button */}
            <div className="mb-6">
              <Button 
                variant="primary" 
                size="lg"
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Input Keystrokes
              </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-card text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-card hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Content Panel */}
            <div className="bg-card rounded-lg p-6 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {activeTab === 'weekly' && 'Weekly Keystrokes'}
                  {activeTab === 'calendar' && 'Monthly Overview'}
                  {activeTab === 'analytics' && 'Performance Analytics'}
                </h2>
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
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <MemoWidget />
            <SalaryWidget />
            <KeystrokesWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 