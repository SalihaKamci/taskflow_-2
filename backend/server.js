const app = require('./src/app');
const sequelize = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync models (development only)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Models synced');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error.message);

  }
}

startServer();