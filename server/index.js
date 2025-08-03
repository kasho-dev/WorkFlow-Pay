import express from 'express';
import { PrismaClient } from '../src/generated/prisma/index.js';
import { apiLimiter, corsOptions, securityHeaders, validateInput, errorHandler } from './security.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Apply security middleware
app.use(securityHeaders);
app.use(express.json({ limit: '10kb' })); // Limit JSON body size

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Enable CORS with specific origins
app.use((req, res, next) => {
  // Set CORS headers
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Updated salary calculation logic
const calculateSalary = (keystrokes) => {
  // New formula: expectedSalary = keystrokes * 0.01
  const expectedSalary = keystrokes * 0.01;
  
  return {
    keystrokes,
    expectedSalary: Math.round(expectedSalary * 100) / 100
  };
};

// API Routes

// Get user profile
app.get('/api/user/:id', validateInput('getUser'), async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        keystrokes: {
          orderBy: { date: 'desc' },
          take: 10
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Create or update user
app.post('/api/user', validateInput('createUser'), async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, name, currency = 'PHP' } = req.body;
    
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, currency },
      create: { email, name, currency }
    });
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Add keystrokes entry
app.post('/api/keystrokes', validateInput('addKeystrokes'), async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId, count, date = new Date() } = req.body;
    
    const keystroke = await prisma.keystroke.create({
      data: {
        userId,
        count,
        duration: 0, // Not used in new calculation
        date: new Date(date)
      }
    });
    
    // Calculate salary for this entry
    const salaryCalculation = calculateSalary(count);
    
    // Don't send the entire keystroke object in production
    const response = process.env.NODE_ENV === 'production'
      ? { success: true, id: keystroke.id }
      : { keystroke, salaryCalculation };
      
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// Get weekly summary
app.get('/api/weekly-summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const weekStart = startDate ? new Date(startDate) : new Date();
    const weekEnd = endDate ? new Date(endDate) : new Date();
    
    // Set to start and end of week if not provided
    if (!startDate) {
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
    }
    if (!endDate) {
      weekEnd.setDate(weekEnd.getDate() - weekEnd.getDay() + 6);
      weekEnd.setHours(23, 59, 59, 999);
    }
    
    const weeklySummary = await calculateWeeklySalary(userId, weekStart, weekEnd);
    
    res.json(weeklySummary);
  } catch (error) {
    next(error);
  }
});

// Get keystrokes history
app.get('/api/keystrokes/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const keystrokes = await prisma.keystroke.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });
    
    res.json(keystrokes);
  } catch (error) {
    next(error);
  }
});

// Get monthly analytics
app.get('/api/monthly-analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const keystrokes = await prisma.keystroke.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    
    const totalKeystrokes = keystrokes.reduce((sum, k) => sum + k.count, 0);
    const analytics = calculateSalary(totalKeystrokes);
    
    res.json({
      totalKeystrokes,
      expectedSalary: analytics.expectedSalary,
      daysWorked: keystrokes.length,
      averageKeystrokesPerDay: keystrokes.length > 0 ? Math.round(totalKeystrokes / keystrokes.length) : 0
    });
  } catch (error) {
    next(error);
  }
});

// Import keystrokes from Excel (CSV format)
app.post('/api/import-keystrokes/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { keystrokesData } = req.body; // Array of {date, count} objects
    
    const importedKeystrokes = [];
    
    for (const data of keystrokesData) {
      const keystroke = await prisma.keystroke.create({
        data: {
          userId,
          count: data.count,
          duration: 0,
          date: new Date(data.date)
        }
      });
      importedKeystrokes.push(keystroke);
    }
    
    res.json({
      message: `Imported ${importedKeystrokes.length} keystrokes entries`,
      importedKeystrokes
    });
  } catch (error) {
    next(error);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

export default app;