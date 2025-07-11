const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件配置
app.use(express.json());
app.use(cors());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// JSON美化
app.set('json spaces', 2);

// 根路由
app.get('/', (req, res) => {
  console.log('根路由被访问');
  res.json({
    name: 'Student Points API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/login',
      submissions: {
        create: 'POST /api/submissions',
        list: 'GET /api/submissions/my',
        detail: 'GET /api/submissions/:id'
      }
    },
    documentation: 'API documentation will be available soon'
  });
});

// 路由配置
app.use('/api/auth', require('./routes/auth'));
app.use('/api/submissions', require('./routes/submissions'));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// 健康检查接口
app.get('/health', (req, res) => {
  console.log('健康检查接口被访问');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Student Points API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404处理
app.use((req, res) => {
  console.log(`404错误: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    path: req.path,
    method: req.method
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    path: req.path
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Routes configured:');
  console.log('- GET /');
  console.log('- GET /health');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/submissions');
  console.log('- GET /api/submissions/my');
  console.log('- GET /api/submissions/:id');
}); 