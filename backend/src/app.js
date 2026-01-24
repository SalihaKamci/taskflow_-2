const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();


app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

console.log('Loading routes...');
try {
  const authRoutes = require("./routes/authRoutes");
  const dashboardRoutes = require('./routes/dashboardRoutes');
  const projectRoutes = require('./routes/projectRoutes');
  const taskRoutes = require('./routes/taskRoutes');
  const userRoutes = require('./routes/userRoutes');
  const fileRoutes  = require("./routes/fileRoutes");
    const commentRoutes = require('./routes/commentRoutes');

  console.log('Routes loaded successfully');

  app.use("/api/auth", authRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/users", userRoutes);
    app.use("/api/files", fileRoutes); // Yeni
  app.use("/api/comments", commentRoutes); // Yeni
  
} catch (error) {
  console.error('Error loading routes:', error.message);


}



app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;