# 🚀 WorkFlow+Pay - Keystrokes Salary Tracker

A modern, full-stack keystrokes tracking application that calculates expected salary based on keystrokes input. Built with React, TypeScript, Node.js, and PostgreSQL.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Keystrokes Tracking**: Live counting with start/pause/stop functionality
- **Salary Calculation**: Automatic earnings based on keystrokes (keystrokes × 0.01)
- **Weekly Calendar**: Monday-Sunday table with editable keystrokes input
- **Today's Input Overlay**: Quick input for today's keystrokes with real-time date sync
- **Monthly Calendar**: Full calendar view with keystrokes and salary display
- **Analytics Dashboard**: Performance metrics and trends
- **Theme Toggle**: Dark/Light mode support
- **Mobile Responsive**: Works perfectly on all devices

### 📊 Salary Calculation Logic
```
Expected Salary = Keystrokes × 0.01
```
- **Example**: 5,000 keystrokes = ₱50.00 expected salary
- **Real-time**: Updates as you type
- **Daily/Weekly/Monthly**: Automatic aggregation

### 🎨 User Interface
- **Modern Design**: Clean, professional dashboard
- **Excel-like Tables**: Familiar spreadsheet interface
- **Editable Cells**: Click to edit keystrokes directly
- **Today's Overlay**: Quick input modal for today's keystrokes
- **Visual Feedback**: Color-coded salary indicators
- **Responsive Layout**: Works on desktop, tablet, and mobile

### 📈 Analytics & Reporting
- **Weekly Summary**: Monday-Sunday table with daily breakdown
- **Today's Input**: Overlay modal for quick keystrokes entry
- **Monthly Overview**: Calendar view with daily breakdown
- **Performance Metrics**: Average keystrokes per day
- **Trend Analysis**: Week-over-week comparisons
- **Export Functionality**: Download data in various formats

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Vite** - Fast development and building

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Reliable database (Neon.tech)

### Database
- **Neon.tech** - Serverless PostgreSQL
- **Prisma Migrations** - Database schema management
- **Real-time Sync** - Automatic data persistence

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon.tech account (free tier available)

### 1. Clone & Install
```bash
git clone <repository-url>
cd workflow-pay
npm install
```

### 2. Database Setup
1. Create a Neon.tech account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your database connection string
4. Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@host:port/database"
PORT=3001
NODE_ENV=development
```

### 3. Initialize Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start Development Servers
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 📱 How to Use

### 1. Keystrokes Tracking
1. Click "Input Keystrokes" or go to "Tracker" tab
2. Click "Start Tracking"
3. Type anywhere to count keystrokes
4. Watch real-time salary calculation
5. Click "Stop" to save your session

### 2. Weekly Calendar (Weekly KS Tab)
1. **View Monday-Sunday Table**: See the full week layout
2. **Input Today's Keystrokes**: Click the "Input Today's Keystrokes" button
3. **Today's Overlay**: Enter keystrokes for today with real-time date
4. **Edit Data**: Click edit icon to modify any day's keystrokes
5. **Auto Calculate**: Salary updates automatically
6. **View Totals**: See weekly summary at bottom

### 3. Monthly Calendar
1. Go to "Calendar" tab
2. Navigate through months
3. Click on dates to view details
4. See keystrokes and salary per day
5. View monthly summary statistics

### 4. Analytics
1. Go to "Analytics" tab
2. View performance metrics
3. Compare week-over-week data
4. Export data as needed

## 🔧 API Endpoints

### Health Check
- `GET /api/health` - Test API connection

### User Management
- `POST /api/user` - Create or update user
- `GET /api/user/:id` - Get user profile

### Keystrokes Tracking
- `POST /api/keystrokes` - Submit keystrokes data
- `GET /api/keystrokes/:userId` - Get keystrokes history

### Analytics
- `GET /api/weekly-summary/:userId` - Get weekly summary
- `GET /api/monthly-analytics/:userId` - Get monthly analytics

### Import/Export
- `POST /api/import-keystrokes/:userId` - Import from Excel/CSV

## 📊 Database Schema

### User
```sql
- id (String, Primary Key)
- email (String, Unique)
- name (String)
- currency (String, Default: "PHP")
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Keystroke
```sql
- id (String, Primary Key)
- userId (String, Foreign Key)
- count (Integer)
- date (DateTime)
- duration (Integer, Default: 0)
- createdAt (DateTime)
- updatedAt (DateTime)
```

## 🎨 Components

### Core Components
- **Header** - Application header with logo
- **Button** - Reusable button component
- **Card** - Container component for widgets
- **Table** - Data table component
- **ThemeToggle** - Dark/Light mode toggle

### Specialized Components
- **KeystrokesTracker** - Real-time tracking interface
- **WeeklyCalendar** - Monday-Sunday table with today's overlay
- **MonthlyCalendar** - Full calendar view
- **Widgets** - Dashboard widgets (Memo, Salary, Keystrokes)

## 🚀 Deployment

### Frontend Build
```bash
npm run build
```

### Backend Production
```bash
npm run server
```

### Environment Variables
```env
DATABASE_URL=your_neon_database_url
PORT=3001
NODE_ENV=production
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start frontend development server
npm run dev:server   # Start backend development server
npm run build        # Build frontend for production
npm run server       # Start backend production server
npm run lint         # Run ESLint
```

### Database Operations
```bash
npx prisma studio    # Open database browser
npx prisma migrate dev  # Run migrations
npx prisma generate  # Generate Prisma client
```

## 🎯 Key Features Implemented

✅ **Real-time Keystrokes Tracking** - Live counting with start/pause/stop  
✅ **Salary Calculation** - Keystrokes × 0.01 formula  
✅ **Weekly Calendar** - Monday-Sunday table with editable cells  
✅ **Today's Input Overlay** - Quick input modal with real-time date  
✅ **Monthly Calendar** - Full calendar view  
✅ **Editable Input** - Click to edit keystrokes  
✅ **Expected Salary Display** - Real-time calculation  
✅ **Aesthetic Design** - Modern, pleasing UI  
✅ **Excel Import** - Import functionality ready  
✅ **Mobile Responsive** - Works on all devices  
✅ **Dark/Light Mode** - Theme toggle  
✅ **Analytics** - Performance metrics  
✅ **Database Integration** - Neon.tech PostgreSQL  

## 🎉 Ready to Use!

Your keystrokes tracker is now fully functional with:
- ✅ Real-time keystroke counting
- ✅ Automatic salary calculation (keystrokes × 0.01)
- ✅ Modern dashboard with weekly/monthly views
- ✅ Monday-Sunday weekly table
- ✅ Today's keystrokes input overlay
- ✅ Excel-like editable tables
- ✅ Mobile-responsive design
- ✅ Dark/Light mode toggle
- ✅ Database integration with Neon.tech
- ✅ RESTful API backend

Start tracking your keystrokes and calculating your expected salary! 🚀
