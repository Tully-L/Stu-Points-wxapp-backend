# 微信小程序后端

这是一个基于Express和MongoDB的微信小程序后端服务。

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 创建 `.env` 文件并设置环境变量（参考 `.env.example`）

3. 启动开发服务器：
```bash
npm run dev
```

## Render部署步骤

1. 在Render.com创建新的Web Service
2. 连接GitHub仓库
3. 配置以下设置：
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
   
4. 添加环境变量：
   - `PORT`: 3000
   - `MONGODB_URI`: MongoDB连接URL
   - `JWT_SECRET`: JWT密钥
   - `WX_APPID`: 微信小程序AppID
   - `WX_SECRET`: 微信小程序密钥

## API接口

### 健康检查
- GET `/health`
  - 返回服务器状态和时间戳

### 认证
- POST `/api/auth/login`
  - 请求体：`{ code: string }`
  - 返回：`{ token: string, user: Object }` 