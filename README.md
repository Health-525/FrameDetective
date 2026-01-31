# SamSearch

> 🚀 基于 SAM 模型的智能视频内容快速检索系统

SamSearch 是一个强大的视频对象检测与分析平台，利用 Meta 的 SAM (Segment Anything Model) 技术，帮助用户快速定位和检索视频中的特定对象。支持逐帧分析、智能分割、出现统计等高级功能。

## ✨ 核心功能

### 🔍 智能视频检索
- **对象定位**: 在视频中快速定位特定对象（人、物体、场景等）
- **逐帧分析**: 完整扫描每一帧，不遗漏任何细节
- **Mask 生成**: 输出高质量的对象分割 mask

### 📊 数据分析
- **出现统计**: 统计目标对象的出现次数和持续时间
- **置信度计算**: 基于面积比例计算检测置信度
- **时段分割**: 将连续出现时段进行智能分段

### 🎯 灵活输出
- **视频模式**: 生成带 mask 标注的 MP4 视频
- **ZIP 模式**: 导出所有帧的 mask 图像包
- **双重输出**: ZIP 模式同时返回视频和图像包

### 🧠 特征提取
- 支持 VLM (Vision-Language Model) 图像特征提取
- 自动转换本地图片为 base64 格式
- 兼容多种 LLM 提供商

## 🛠️ 技术栈

- **运行时**: Node.js (ES Modules)
- **Web 框架**: Express.js
- **AI 模型**:
  - [SAM3 Video](https://replicate.com/lucataco/sam3-video) - 视频对象分割
  - Qwen2.5-VL - 视觉语言模型特征提取
- **图像处理**: Sharp
- **HTTP 客户端**: Replicate SDK
- **文件处理**: ADM-ZIP

## 📦 快速开始

### 1. 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 并重命名为 `.env`，然后填入你的 API 密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 必需：Replicate API Token
REPLICATE_API_TOKEN=your_replicate_api_token_here

# 可选：LLM 配置（用于特征提取）
LLM_API_KEY=your_llm_api_key
LLM_BASE_URL=https://api.example.com/v1
LLM_MODEL_NAME=Qwen2.5-VL-32B-Instruct

# 可选：服务端口
PORT=3000
```

> 💡 获取 Replicate API Token: https://replicate.com/account/api-tokens
> ⚠️ **重要**: 不要将 `.env` 文件提交到 Git！该文件已在 `.gitignore` 中

### 4. 启动服务

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm start
```

服务将在 `http://localhost:3000` 启动

## 📚 API 文档

### 1. 运行视频分析

**端点**: `POST /api/run`

**请求参数**:

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `video` | string | ✅ | - | 视频 URL（支持直链） |
| `prompt` | string | ❌ | "object" | 检测目标描述（如 "person"、"car"） |
| `mask_color` | string | ❌ | "red" | mask 颜色 |
| `mask_opacity` | number | ❌ | 0.8 | mask 透明度 (0-1) |
| `mask_only` | boolean | ❌ | false | 仅显示 mask |
| `return_zip` | boolean | ❌ | false | 返回 ZIP 压缩包 |
| `area_threshold` | number | ❌ | undefined | 面积阈值（0-1 比例）|
| `min_run` | number | ❌ | 2 | 最小连续帧数 |

**响应示例（视频模式）**:

```json
{
  "url": "https://replicate.delivery/xxx/output.mp4",
  "filename": "output_person_video_2025-01-17T10-30-00-000Z.mp4"
}
```

**响应示例（ZIP 模式）**:

```json
{
  "url": "https://replicate.delivery/xxx/output.zip",
  "video_url": "https://replicate.delivery/xxx/output.mp4",
  "filename": "output_person_video_2025-01-17T10-30-00-000Z.zip",
  "appearances": 3,
  "segments": [[0, 45], [120, 200], [350, 400]],
  "total_frames": 500,
  "max_ratio": 0.25,
  "confidence": 25
}
```

**字段说明**:
- `appearances`: 目标出现的次数
- `segments`: 各次出现的帧区间 `[start, end]`
- `total_frames`: 总帧数
- `max_ratio`: 最大面积占比（0-1）
- `confidence`: 置信度百分比（0-100）

### 2. 分析 ZIP 包

**端点**: `POST /api/analyze-zip`

**请求参数**:

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `zip_url` | string | ✅ | - | ZIP 文件 URL |
| `threshold` | number | ❌ | 1000 | 像素阈值 |
| `min_run` | number | ❌ | 2 | 最小连续帧数 |

**响应示例**:

```json
{
  "zip_url": "https://replicate.delivery/xxx/output.zip",
  "filename": "analyze_2025-01-17T10-30-00-000Z.zip",
  "appearances": 5,
  "segments": [[0, 50], [100, 150], [200, 250], [300, 350], [400, 450]],
  "total_frames": 500,
  "max_ratio": 0.35,
  "confidence": 35
}
```

### 3. 提取图像特征

**端点**: `POST /api/extract-features`

**请求参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `image` | string | ✅ | 图片 URL 或本地路径 |

**特性**:
- 自动将本地 `localhost` 图片转换为 base64
- 支持远程 URL

**响应示例**:

```json
{
  "features": "图像特征描述文本..."
}
```

### 4. 文件上传

**端点**: `POST /api/upload`

**请求类型**: `multipart/form-data`

**请求参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `file` | File | ✅ | 上传的文件 |

**响应示例**:

```json
{
  "url": "http://localhost:3000/uploads/filename.jpg"
}
```

## 💡 使用示例

### JavaScript / Node.js

```javascript
// 1. 分析视频中的人
const response = await fetch('http://localhost:3000/api/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    video: 'https://example.com/video.mp4',
    prompt: 'person',
    return_zip: true,
    min_run: 5
  })
});

const data = await response.json();
console.log(`检测到 ${data.appearances} 次出现`);
console.log(`最高置信度: ${data.confidence}%`);
```

### Python

```python
import requests

# 2. 提取图像特征
response = requests.post('http://localhost:3000/api/extract-features', json={
    'image': 'https://example.com/image.jpg'
})

features = response.json()
print(features)
```

### cURL

```bash
# 3. 上传文件
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/video.mp4"
```

## 📁 项目结构

```
sammodel/
├── src/
│   ├── app.js                 # Express 应用配置
│   ├── config/
│   │   └── env.js             # 环境变量配置
│   ├── controllers/
│   │   ├── videoController.js # 视频处理逻辑
│   │   ├── featureController.js # 特征提取逻辑
│   │   └── uploadController.js # 文件上传逻辑
│   ├── services/
│   │   ├── replicateService.js # Replicate API 封装
│   │   └── llmService.js      # LLM 服务封装
│   ├── middleware/
│   │   └── upload.js          # Multer 中间件
│   ├── routes/
│   │   └── api.js             # API 路由定义
│   └── utils/
│       ├── fileUtils.js       # 文件处理工具
│       └── imageUtils.js      # 图像分析工具
├── public/                    # 静态文件
├── outputs/                   # 输出文件存储
├── index.js                   # 应用入口
├── package.json
└── .env                       # 环境变量（需自行创建）
```

## ⚙️ 配置说明

### SAM3 模型

- **模型版本**: `lucataco/sam3-video:8cbab4c2a3133e679b5b863b80527f6b5c751ec7b33681b7e0b7c79c749df961`
- **模型页面**: https://replicate.com/lucataco/sam3-video

### 阈值调优

- **`area_threshold`**: 面积阈值，控制检测灵敏度
  - 值越小，检测越宽松
  - 值越大，仅保留大面积目标
  - 建议范围: 0.01 - 0.5

- **`threshold`**: 像素阈值（analyze-zip）
  - 最小像素数才认为目标存在
  - 默认 1000 像素

- **`min_run`**: 连续帧数阈值
  - 过滤短暂出现的噪声
  - 默认 2 帧

## 🔐 安全注意事项

⚠️ **重要**:
1. **不要提交 `.env` 文件**到版本控制系统
2. **不要在代码中硬编码 API Token**
3. 生产环境建议使用环境变量或密钥管理服务（如 AWS Secrets Manager）
4. 建议启用 HTTPS 传输
5. 实施请求频率限制防止滥用

## 🐛 常见问题

### Q: API 调用超时怎么办？
A: 视频处理可能需要较长时间，建议：
- 增加客户端超时时间（建议 5-10 分钟）
- 使用异步任务队列
- 实现轮询或 WebSocket 通知

### Q: 如何提高检测准确率？
A:
- 优化 `prompt` 描述（如 "person wearing red"）
- 调整 `area_threshold` 阈值
- 增加 `min_run` 过滤噪声

### Q: 支持哪些视频格式？
A: SAM3 模型支持常见格式（MP4, AVI, MOV 等），建议使用 MP4。

## 📄 许可证

ISC License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请通过 GitHub Issues 联系。

---

**Made with ❤️ for intelligent video search**
