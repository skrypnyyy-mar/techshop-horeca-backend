const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const pinoHttp = require('pino-http');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { errorHandler } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const horecaRoutes = require('./routes/horeca.routes');
const bookingRoutes = require('./routes/booking.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// 🔴 Logging middleware: replace morgan with pino-http
app.use(pinoHttp({ logger }));

// 🔴 Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechShop HoReCa API',
      version: '1.0.0',
      description: 'API for Electronics Store + HoReCa Booking System',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🔴 Root endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// 🔴 Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/horeca', horecaRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// 404 Handler
app.use((req, res, next) => {
  const { ApiError } = require('./middlewares/errorHandler');
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
