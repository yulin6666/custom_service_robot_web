# 部署指南

本指南将帮助您将智能客服机器人Web界面部署到Vercel，并配置后端API连接。

## 前置条件

1. 已安装 Node.js (v18.0.0 或更高版本)
2. 拥有 Vercel 账号 (可以使用 GitHub 账号登录)
3. 后端API服务已部署并可访问

## 本地开发部署

### 步骤 1: 安装依赖

```bash
cd /Users/linofficemac/Documents/AI/custom_service_robot_web
npm install
```

### 步骤 2: 配置环境变量

创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# 如果后端在本地运行
NEXT_PUBLIC_API_URL=http://localhost:8000

# 如果后端已部署到云端
# NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app
```

### 步骤 3: 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:8080 查看应用。

### 步骤 4: 测试功能

1. 确保后端API服务正在运行
2. 在浏览器中打开 http://localhost:8080
3. 尝试发送消息测试对话功能
4. 点击右上角 "Debug" 按钮查看 LangGraph 日志

## Vercel 云端部署

### 方式一：使用 Vercel CLI (推荐)

#### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

选择使用 GitHub、GitLab 或 Email 登录。

#### 3. 部署项目

在项目根目录运行：

```bash
vercel
```

首次部署时，会询问：
- `Set up and deploy "~/Documents/AI/custom_service_robot_web"?` → 输入 `Y`
- `Which scope do you want to deploy to?` → 选择你的账号
- `Link to existing project?` → 输入 `N` (首次部署)
- `What's your project's name?` → 输入项目名称，如 `customer-service-bot-web`
- `In which directory is your code located?` → 直接按 Enter (使用当前目录)

部署成功后，会返回一个临时预览URL，例如：
```
https://customer-service-bot-web-xxx.vercel.app
```

#### 4. 配置环境变量

```bash
vercel env add NEXT_PUBLIC_API_URL
```

选择环境：
- Production → 输入 `Y`
- Preview → 输入 `Y`
- Development → 输入 `Y`

输入后端API地址，例如：
```
https://your-backend-api.railway.app
```

#### 5. 生产部署

```bash
vercel --prod
```

部署完成后，访问生产环境URL。

### 方式二：通过 GitHub 集成

#### 1. 创建 GitHub 仓库

在项目目录初始化 Git：

```bash
cd /Users/linofficemac/Documents/AI/custom_service_robot_web
git init
git add .
git commit -m "Initial commit: Customer service robot web interface"
```

在 GitHub 创建新仓库，然后推送代码：

```bash
git remote add origin https://github.com/your-username/customer-service-bot-web.git
git branch -M main
git push -u origin main
```

#### 2. 导入项目到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 选择你刚创建的 GitHub 仓库
5. 点击 "Import"

#### 3. 配置项目

在项目配置页面：

**Framework Preset:** 自动检测为 Next.js

**Build Command:** (保持默认)
```bash
next build
```

**Output Directory:** (保持默认)
```
.next
```

**Install Command:** (保持默认)
```bash
npm install
```

#### 4. 添加环境变量

在 "Environment Variables" 部分：

- **Key:** `NEXT_PUBLIC_API_URL`
- **Value:** 你的后端API地址 (例如: `https://your-backend-api.railway.app`)
- **Environment:** 全选 (Production, Preview, Development)

#### 5. 部署

点击 "Deploy" 按钮，等待部署完成。

部署成功后，你会得到一个生产环境URL：
```
https://customer-service-bot-web.vercel.app
```

## 后端API配置

### 启用CORS

确保后端API支持跨域请求。如果使用 FastAPI，需要添加 CORS 中间件：

```python
# api.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-domain.vercel.app"],  # 或使用 ["*"] 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 验证API端点

确保以下端点可访问：

1. 创建会话:
```bash
curl -X POST https://your-backend-api.com/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test"}'
```

2. 发送消息:
```bash
curl -X POST https://your-backend-api.com/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好", "session_id": "xxx"}'
```

## 自定义域名 (可选)

### 1. 在 Vercel 添加域名

1. 进入项目设置 → Domains
2. 输入你的域名 (例如: `chat.yourdomain.com`)
3. 点击 "Add"

### 2. 配置 DNS

根据 Vercel 提供的说明，在你的域名服务商添加 DNS 记录：

**A Record:**
```
Type: A
Name: chat (或 @)
Value: 76.76.21.21
```

或者 **CNAME Record:**
```
Type: CNAME
Name: chat
Value: cname.vercel-dns.com
```

### 3. 等待验证

DNS 生效通常需要几分钟到几小时。验证成功后，你的网站就可以通过自定义域名访问了。

## 性能优化

### 1. 启用 Edge Runtime (可选)

在 `app/page.js` 中添加：

```javascript
export const runtime = 'edge'
```

### 2. 图片优化

如果需要添加图片，使用 Next.js 的 Image 组件：

```javascript
import Image from 'next/image'

<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

### 3. 启用 Gzip 压缩

Next.js 和 Vercel 默认启用，无需额外配置。

## 监控和日志

### Vercel Analytics

在 Vercel Dashboard 中启用 Analytics：
1. 进入项目设置
2. 点击 "Analytics"
3. 启用 "Enable Web Analytics"

### 查看部署日志

```bash
vercel logs [deployment-url]
```

或在 Vercel Dashboard 的 "Deployments" 页面查看。

## 常见问题排查

### 1. 部署失败

**问题**: Build 失败
**解决**:
- 检查 `package.json` 中的依赖版本
- 查看部署日志中的错误信息
- 本地运行 `npm run build` 测试构建

### 2. 环境变量不生效

**问题**: API 连接失败
**解决**:
- 确认环境变量名称正确: `NEXT_PUBLIC_API_URL`
- 重新部署项目以应用新的环境变量
- 在浏览器控制台检查实际使用的 API URL

### 3. CORS 错误

**问题**: 浏览器提示跨域错误
**解决**:
- 确保后端 API 已配置 CORS
- 检查 `allow_origins` 是否包含你的 Vercel 域名

### 4. 页面加载慢

**问题**: 首次加载时间长
**解决**:
- 启用 Vercel Edge Network
- 优化图片和资源
- 使用 Next.js 的 Image 组件

## 更新部署

### 方式一: CLI 更新

```bash
# 拉取最新代码
git pull

# 部署
vercel --prod
```

### 方式二: GitHub 自动部署

推送到 GitHub main 分支会自动触发部署：

```bash
git add .
git commit -m "Update: your changes"
git push origin main
```

## 回滚部署

如果新版本有问题，可以快速回滚：

1. 在 Vercel Dashboard → Deployments
2. 找到上一个正常的部署
3. 点击 "..." → "Promote to Production"

或使用 CLI:

```bash
vercel rollback
```

## 安全建议

1. **不要**在代码中硬编码 API 密钥
2. 始终使用环境变量存储敏感信息
3. 定期更新依赖包: `npm update`
4. 启用 HTTPS (Vercel 默认启用)
5. 配置 CSP (Content Security Policy) 头部

## 支持与反馈

如有问题，请参考：
- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 文档](https://vercel.com/docs)
- [项目 README](./readme.md)

祝部署顺利！🎉
