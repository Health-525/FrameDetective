# 安全指南 Security Guide

## 🔐 环境变量保护

### ⚠️ 重要提醒

**永远不要将以下文件提交到 Git：**
- `.env` - 包含真实的 API 密钥
- `.env.local`
- `.env.*.local`
- 任何包含敏感信息的配置文件

### ✅ 正确做法

1. **使用 `.env.example`**:
   - 仅包含配置项名称和示例值
   - 可以安全地提交到 Git
   - 帮助其他开发者了解需要配置哪些变量

2. **本地配置**:
   ```bash
   cp .env.example .env
   # 编辑 .env 填入真实密钥
   ```

3. **生产环境**:
   - 使用环境变量而非文件
   - 使用密钥管理服务（如 AWS Secrets Manager, Azure Key Vault）
   - 定期轮换 API 密钥

## 🚨 已泄露密钥的处理

如果不小心将密钥提交到了 Git：

1. **立即撤销密钥**: 前往 [Replicate Account Settings](https://replicate.com/account/api-tokens) 删除已泄露的密钥

2. **清理 Git 历史**:
   ```bash
   # 使用 BFG Repo-Cleaner 或 git filter-branch
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all

   # 强制推送（谨慎操作！）
   git push origin --force --all
   ```

3. **生成新密钥**: 创建新的 API Token 并更新本地配置

## 📋 安全检查清单

在推送代码前，请确认：

- [ ] `.env` 文件未被追踪
- [ ] `.gitignore` 包含所有敏感文件模式
- [ ] `git status` 不显示敏感文件
- [ ] `.env.example` 不包含真实密钥
- [ ] 代码中没有硬编码的密钥或密码
- [ ] 上传的文件（`public/uploads/`）未被追踪
- [ ] 输出文件（`outputs/`）未被追踪

## 🛡️ 其他安全建议

1. **最小权限原则**: 只授予 API Token 必要的权限
2. **定期审计**: 检查 Git 历史是否有意外提交的敏感信息
3. **使用私有仓库**: 对于商业项目，使用私有 Git 仓库
4. **依赖安全**: 定期运行 `npm audit` 检查依赖漏洞
5. **HTTPS Only**: 生产环境强制使用 HTTPS

## 📞 报告安全问题

如果发现安全漏洞，请通过以下方式联系维护者：
- 邮箱: [your-email@example.com]
- 或创建 Private Security Advisory

**请勿在公开 Issue 中讨论安全漏洞。**
