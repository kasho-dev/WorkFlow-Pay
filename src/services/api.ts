const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
  name: string;
  currency: string;
  keystrokes: Keystroke[];
}

export interface Keystroke {
  id: string;
  userId: string;
  count: number;
  duration: number;
  date: string;
}

export interface WeeklySummary {
  totalKeystrokes: number;
  weeklyEarnings: number;
  currency: string;
}

export interface MonthlyAnalytics {
  totalKeystrokes: number;
  expectedSalary: number;
  daysWorked: number;
  averageKeystrokesPerDay: number;
}

export interface SalaryCalculation {
  keystrokes: number;
  expectedSalary: number;
}

export interface WeeklyData {
  date: string;
  day: string;
  keystrokes: number;
  expectedSalary: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // User management
  async createUser(email: string, name: string): Promise<User> {
    return this.request<User>('/user', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  }

  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/user/${userId}`);
  }

  // Keystrokes tracking
  async addKeystrokes(userId: string, count: number, date?: string): Promise<{
    keystroke: Keystroke;
    salaryCalculation: SalaryCalculation;
  }> {
    return this.request(`/keystrokes`, {
      method: 'POST',
      body: JSON.stringify({ userId, count, date }),
    });
  }

  async getKeystrokes(userId: string, limit: number = 50, offset: number = 0): Promise<Keystroke[]> {
    return this.request<Keystroke[]>(`/keystrokes/${userId}?limit=${limit}&offset=${offset}`);
  }

  // Weekly summary
  async getWeeklySummary(userId: string, startDate?: string, endDate?: string): Promise<WeeklySummary> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return this.request<WeeklySummary>(`/weekly-summary/${userId}?${params.toString()}`);
  }

  // Monthly analytics
  async getMonthlyAnalytics(userId: string, year: number, month: number): Promise<MonthlyAnalytics> {
    return this.request<MonthlyAnalytics>(`/monthly-analytics/${userId}?year=${year}&month=${month}`);
  }

  // Import keystrokes from Excel
  async importKeystrokes(userId: string, keystrokesData: { date: string; count: number }[]): Promise<{
    message: string;
    importedKeystrokes: Keystroke[];
  }> {
    return this.request(`/import-keystrokes/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ keystrokesData }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService(); 