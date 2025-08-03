# WorkFlow+Pay Dashboard

A modern, responsive dashboard for tracking keystrokes, and potential earnings. Built with React, TypeScript, Tailwind CSS, and Lucide React icons.

## Features

- **Dark Theme**: Modern dark interface with custom color palette
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Tabs**: Switch between Weekly KS, Calendar, and Analytics views
- **Real-time Widgets**: Display memo, expected salary, and keystrokes data
- **Data Tables**: Organized data display with import/export functionality

## Color Palette

- Primary Blue: `#00AAFF`
- Secondary Blue: `#035BC0`
- Dark Background: `#0A0D10`
- Card Background: `#1C1C1C`
- White Text: `#FFFFFF`

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- Vite

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Header.tsx
│   ├── Table.tsx
│   └── widgets/
│       ├── KeystrokesWidget.tsx
│       ├── MemoWidget.tsx
│       └── SalaryWidget.tsx
├── pages/
│   └── Dashboard.tsx
├── App.tsx
└── main.tsx
```

## Components

- **Header**: Logo and welcome message
- **Button**: Reusable button component with variants
- **Card**: Widget container component
- **Table**: Data display component
- **Widgets**: Specialized dashboard widgets

## Dashboard Features

- **Input Keystrokes**: Primary action button for data entry
- **Navigation Tabs**: Switch between different data views
- **Import/Export**: Data management buttons
- **Widgets**: Real-time metrics and information display
