import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body } from 'express-validator';

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'http://localhost:3001',
    'https://your-production-domain.com' // Replace with your production domain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Input validation middleware
export const validateInput = (method) => {
  switch (method) {
    case 'addKeystrokes':
      return [
        body('userId').isString().notEmpty(),
        body('count').isInt({ min: 0 }),
        body('date').optional().isISO8601()
      ];
    case 'getUser':
      return [
        param('id').isString().notEmpty()
      ];
    default:
      return [];
  }
};

// Error handling middleware
export const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);
  
  // Don't leak stack traces in production
  const errorResponse = process.env.NODE_ENV === 'production' 
    ? { error: 'Something went wrong!' }
    : { error: err.message, stack: err.stack };

  res.status(500).json(errorResponse);
};

// Security headers middleware
export const securityHeaders = [
  // Helmet helps secure Express apps by setting various HTTP headers
  helmet(),
  
  // Prevent clickjacking
  helmet.frameguard({ action: 'deny' }),
  
  // Enable XSS filter in browsers
  helmet.xssFilter(),
  
  // Prevent MIME type sniffing
  helmet.noSniff(),
  
  // Set Content Security Policy
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  })
];

export { apiLimiter, corsOptions };
