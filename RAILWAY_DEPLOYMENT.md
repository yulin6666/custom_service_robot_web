# Railway 部署指南

本指南将帮助您将智能客服机器人Web界面部署到 Railway。

## 🚀 为什么选择 Railway？

- ✅ 自动生成 `.up.railway.app` 公网域名
- ✅ 免费额度（每月 $5 免费使用额度）
- ✅ 自动检测 Next.js 项目
- ✅ 支持环境变量配置
- ✅ 自动 HTTPS
- ✅ 与后端 API 在同一平台，方便管理

---

## 📋 前置条件

1. 拥有 Railway 账号（可用 GitHub 账号登录）
2. 项目代码已推送到 GitHub
3. 后端 API 已部署到 Railway

---

## 方式一：通过 Railway Dashboard 部署（推荐）

### 步骤 1: 登录 Railway

1. 访问 [Railway.app](https://railway.app/)
2. 点击 "Login"
3. 选择 "Login with GitHub"

### 步骤 2: 创建新项目

1. 进入 [Railway Dashboard](https://railway.app/dashboard)
2. 点击 **"New Project"**
3. 选择 **"Deploy from GitHub repo"**
4. 在列表中找到并选择 `custom_service_robot_web` 仓库
5. 点击 **"Deploy Now"**

### 步骤 3: 配置环境变量

Railway 开始部署后：

1. 在项目页面，点击你的服务（service）
2. 切换到 **"Variables"** 标签
3. 点击 **"New Variable"**
4. 添加环境变量：
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://customservicerobot-production.up.railway.app
   ```
5. 点击 **"Add"**

### 步骤 4: 查看部署状态

1. 切换到 **"Deployments"** 标签
2. 查看构建日志，确保构建成功
3. 构建完成后，状态会显示为 **"Active"**

### 步骤 5: 获取访问地址

1. 在服务页面，切换到 **"Settings"** 标签
2. 找到 **"Domains"** 部分
3. 点击 **"Generate Domain"**
4. Railway 会自动生成一个公网域名，格式如：
   ```
   https://custom-service-robot-web-production.up.railway.app
   ```
5. 点击域名链接即可访问你的应用

---

## 方式二：通过 Railway CLI 部署

### 步骤 1: 安装 Railway CLI

```bash
# macOS / Linux
brew install railway

# 或者使用 npm
npm install -g @railway/cli
```

### 步骤 2: 登录 Railway

```bash
railway login
```

会打开浏览器完成授权。

### 步骤 3: 初始化项目

在项目目录运行：

```bash
cd /Users/linofficemac/Documents/AI/custom_service_robot_web
railway init
```

选择：
- **"Create a new project"**
- 输入项目名称，例如：`custom-service-robot-web`

### 步骤 4: 配置环境变量

```bash
railway variables set NEXT_PUBLIC_API_URL=https://customservicerobot-production.up.railway.app
```

### 步骤 5: 部署项目

```bash
railway up
```

等待部署完成。

### 步骤 6: 生成公网域名

```bash
railway domain
```

会自动生成一个 `.up.railway.app` 域名。

### 步骤 7: 查看部署

```bash
# 查看部署日志
railway logs

# 在浏览器中打开项目
railway open
```

---

## 🔧 配置说明

### nixpacks.toml

项目已包含 `nixpacks.toml` 配置文件，Railway 会自动使用：

```toml
[phases.setup]
nixPkgs = ["nodejs_18"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

### 环境变量

必须配置的环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_API_URL` | 后端 API 地址 | `https://customservicerobot-production.up.railway.app` |
| `PORT` | 端口号（Railway 自动设置） | 自动分配 |

---

## 🌐 域名配置

### Railway 自动生成的域名

格式：`https://[project-name]-production.up.railway.app`

例如：
- `https://custom-service-robot-web-production.up.railway.app`

### 自定义域名（可选）

如果你有自己的域名：

1. 在 Railway 项目的 **"Settings"** → **"Domains"**
2. 点击 **"Custom Domain"**
3. 输入你的域名，例如：`chat.yourdomain.com`
4. 在你的域名 DNS 设置中添加 CNAME 记录：
   ```
   Type: CNAME
   Name: chat
   Value: [你的railway域名]
   TTL: 3600
   ```
5. 等待 DNS 生效（通常几分钟到几小时）

---

## 📊 监控和日志

### 查看部署日志

**Dashboard 方式**：
1. 进入项目页面
2. 点击 **"Deployments"** 标签
3. 选择特定部署查看详细日志

**CLI 方式**：
```bash
# 实时查看日志
railway logs

# 查看最近的日志
railway logs --tail 100
```

### 查看运行状态

```bash
railway status
```

---

## 🔄 更新部署

### 自动部署（推荐）

Railway 默认启用自动部署，每次推送到 GitHub 主分支都会自动触发：

```bash
git add .
git commit -m "Update: your changes"
git push origin main
```

### 手动部署

**CLI 方式**：
```bash
railway up
```

**Dashboard 方式**：
1. 进入 **"Deployments"** 标签
2. 点击 **"Deploy"**

---

## ❌ 回滚部署

如果新版本有问题：

**Dashboard 方式**：
1. 进入 **"Deployments"** 标签
2. 找到之前正常的部署
3. 点击 **"..."** → **"Redeploy"**

**CLI 方式**：
```bash
railway rollback
```

---

## 🐛 常见问题

### 1. 部署失败："Build failed"

**解决方案**：
```bash
# 本地测试构建
npm run build

# 查看错误日志
railway logs

# 检查 package.json 依赖版本
```

### 2. 网站打不开

**检查清单**：
- ✅ 部署状态是否为 "Active"
- ✅ 域名是否已生成
- ✅ 环境变量 `NEXT_PUBLIC_API_URL` 是否配置
- ✅ 后端 API 是否正常运行

### 3. API 连接失败

**解决方案**：
```bash
# 检查环境变量
railway variables

# 确认后端 API 地址
curl -I https://customservicerobot-production.up.railway.app/api/v1/sessions

# 重新部署以应用新的环境变量
railway up
```

### 4. "Error: Cannot find module"

**原因**：依赖安装失败

**解决方案**：
1. 确保 `package.json` 正确
2. 删除本地的 `node_modules` 和 `package-lock.json`
3. 重新安装：`npm install`
4. 提交更改并重新部署

---

## 💰 费用说明

Railway 提供：
- **免费额度**：每月 $5 使用额度（约 500 小时运行时间）
- **Hobby Plan**：$5/月订阅（包含 $5 使用额度）
- **按使用付费**：超出部分按实际使用计费

对于小型项目，免费额度通常足够使用。

---

## 🔗 相关链接

- [Railway 官网](https://railway.app/)
- [Railway 文档](https://docs.railway.app/)
- [Nixpacks 文档](https://nixpacks.com/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

---

## 🎯 部署检查清单

部署完成后，确认以下项目：

- [ ] 部署状态为 "Active"
- [ ] 公网域名已生成（.up.railway.app）
- [ ] 环境变量 `NEXT_PUBLIC_API_URL` 已配置
- [ ] 网站可以访问
- [ ] 聊天功能正常工作
- [ ] 后端 API 连接成功
- [ ] Debug 日志可以查看

---

## 🚀 快速开始

最快 3 步完成部署：

```bash
# 1. 安装 CLI
npm install -g @railway/cli

# 2. 登录并初始化
railway login
railway init

# 3. 设置环境变量并部署
railway variables set NEXT_PUBLIC_API_URL=https://customservicerobot-production.up.railway.app
railway up
railway domain
```

完成！🎉

---

需要帮助？查看 [Railway 文档](https://docs.railway.app/) 或提交 Issue。
