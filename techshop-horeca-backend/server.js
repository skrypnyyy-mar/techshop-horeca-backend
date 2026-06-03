require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/db');
const logger = require('./src/utils/logger');
const { PORT } = require('./src/config/env');

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📚 Swagger UI: http://localhost:${PORT}/docs`);
});

// Graceful Shutdown
const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    
    try {
      await prisma.$disconnect();
      logger.info('Database disconnected.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during database disconnection:', err);
      process.exit(1);
    }
  });

  // Force close after 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('UNHANDLED_REJECTION');
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  console.error('FULL ERROR:', err); // 🔴 Debug
  shutdown('UNCAUGHT_EXCEPTION');
});
