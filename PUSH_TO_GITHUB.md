# 🚀 GitHub 推送指南

## 快速开始

### 第 1 步：运行安全检查

```bash
.git-check.bat
```

确保所有检查都显示 `[PASS]`。

### 第 2 步：添加远程仓库

**在 GitHub 上创建新仓库后**，复制仓库地址并运行：

```bash
# 替换为你的仓库地址
git remote add origin https://github.com/yourusername/sammodel.git
```

### 第 3 步：提交并推送

```bash
# 添加所有文件
git add .

# 查看将要提交的文件（确认无敏感信息）
git status

# 提交
git commit -m "Initial commit: SAM3 Video Analysis System

- 基于 SAM3 的视频对象检测系统
- 支持视频分析、对象分割、出现统计
- 包含反人口贩卖应用案例"

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## ⚠️ 推送前最后检查

运行以下命令确认：

```bash
# 确认 .env 被忽略
git check-ignore .env
# 应该输出: .env

# 确认没有敏感文件
git status | findstr /I "\.env node_modules uploads outputs .mp4"
# 应该没有输出

# 查看将要上传的文件
git ls-files
```

## 📝 后续更新代码时

```bash
# 1. 修改代码后
git add .

# 2. 提交
git commit -m "描述你的修改"

# 3. 推送
git push
```

## 🔒 环境变量配置

推送到 GitHub 后，其他开发者需要：

1. **克隆仓库**:
   ```bash
   git clone https://github.com/yourusername/sammodel.git
   cd sammodel
   ```

2. **安装依赖**:
   ```bash
   npm install
   cd anti-trafficking-app && npm install && cd ..
   ```

3. **配置环境变量**:
   ```bash
   # 复制模板
   copy .env.example .env

   # 编辑 .env 填入真实密钥
   notepad .env
   ```

4. **启动服务**:
   ```bash
   npm start
   ```

## 🌐 生产环境部署

### Vercel / Netlify

在部署平台的环境变量设置中添加：

```
REPLICATE_API_TOKEN=your_real_token_here
LLM_API_KEY=your_llm_key_here
LLM_BASE_URL=https://api.example.com
LLM_MODEL_NAME=Qwen2.5-VL-32B-Instruct
PORT=3000
```

### Docker

创建 `docker-compose.yml` 时使用环境变量：

```yaml
version: '3'
services:
  sammodel:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REPLICATE_API_TOKEN=${REPLICATE_API_TOKEN}
      - LLM_API_KEY=${LLM_API_KEY}
    env_file:
      - .env
```

## ❓ 常见问题

### Q: 我不小心提交了 .env 怎么办？

A: 立即执行以下步骤：

1. **撤销 GitHub 上的密钥**: https://replicate.com/account/api-tokens
2. **从 Git 历史中移除**:
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from tracking"
   git push
   ```
3. **生成新密钥**并更新本地 `.env`

### Q: 如何验证 .env 没有被上传？

A: 运行：
```bash
git ls-files | findstr "\.env$"
```
如果没有输出，说明安全。

### Q: 可以上传示例视频吗？

A: 可以，但需要：
1. 创建 `example/` 文件夹
2. 在 `.gitignore` 中添加例外规则：
   ```
   !example/*.mp4
   ```
3. 确保视频文件小于 100MB

## 📚 相关文档

- 📖 [README.md](README.md) - 项目说明
- 🔒 [SECURITY.md](SECURITY.md) - 安全最佳实践
- ✅ [GIT_SETUP_CHECKLIST.md](GIT_SETUP_CHECKLIST.md) - 详细检查清单
- 📊 [FINAL_SECURITY_REPORT.md](FINAL_SECURITY_REPORT.md) - 安全扫描报告

---

**准备好了吗？开始推送吧！** 🎉
