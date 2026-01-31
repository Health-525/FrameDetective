import React, { useState, useEffect } from 'react'
import {
  Upload,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Users,
  Database,
  FileText,
  Settings,
  BarChart3,
  Eye,
  X,
  ChevronRight,
  MapPin
} from 'lucide-react'

type AlertItem = {
  id: number
  type: 'urgent' | 'high' | 'medium'
  confidence: number
  case: string
  time: string
  location: string
}

const AntiTraffickingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'video' | 'age' | 'batch'>('dashboard')
  const [videoProgress, setVideoProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchingProgress] = useState(58)
  const [selectedReview, setSelectedReview] = useState<AlertItem | null>(null)
  const [reviewDecision, setReviewDecision] = useState('')

  useEffect(() => {
    if (isAnalyzing && videoProgress < 100) {
      const timer = setTimeout(() => {
        setVideoProgress(prev => Math.min(prev + 1, 100))
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isAnalyzing, videoProgress])

  const alerts: AlertItem[] = [
    { id: 1, type: 'urgent', confidence: 94, case: '20190523001', time: '12-13 11:23', location: 'XX市XX路口' },
    { id: 2, type: 'high', confidence: 91, case: '20180712003', time: '12-13 09:15', location: 'XX车站' },
    { id: 3, type: 'medium', confidence: 89, case: '20200301012', time: '12-12 23:47', location: 'XX商场' }
  ]

  const stats = {
    pending: 234,
    matched: 1847,
    processed: 697234,
    total: 1203000
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border-l-4 border-red-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-600" size={24} />
          <div>
            <div className="font-bold text-red-900">紧急告警</div>
            <div className="text-sm text-red-700">发现 3 个高置信度匹配，需立即复核</div>
          </div>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          立即处理
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm">待复核告警</div>
              <div className="text-3xl font-bold text-orange-600 mt-2">{stats.pending}</div>
            </div>
            <Clock className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm">发现疑似匹配</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">{stats.matched}</div>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm">今日处理量</div>
              <div className="text-3xl font-bold text-green-600 mt-2">1,247</div>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm">本月破案</div>
              <div className="text-3xl font-bold text-teal-600 mt-2">12</div>
            </div>
            <BarChart3 className="text-teal-600" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-lg">🎯 高置信度匹配结果</h3>
          <button className="text-blue-600 text-sm hover:underline">查看全部</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">序号</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">档案编号</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">置信度</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">匹配来源</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">发现时间</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">地点</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, idx) => (
                <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-mono text-sm">{alert.case}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        alert.confidence >= 90
                          ? 'bg-red-100 text-red-700'
                          : alert.confidence >= 85
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {alert.confidence}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">监控视频</td>
                  <td className="px-4 py-3 text-sm">{alert.time}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-500" />
                      {alert.location}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedReview(alert)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      复核
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderVideoAnalysis = () => (
    <div className="grid grid-cols-4 gap-6">
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="font-bold mb-4">📤 上传视频</h3>
          <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center hover:border-blue-500 cursor-pointer">
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <div className="text-sm text-gray-600">点击或拖拽上传</div>
            <div className="text-xs text-gray-400 mt-1">支持 MP4, AVI, MOV</div>
          </div>
          <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            批量上传
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="font-bold mb-3">任务队列</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span>⏳ 正在分析</span>
              <span className="font-bold text-purple-600">2</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span>✅ 已完成</span>
              <span className="font-bold text-green-600">15</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <span>⚠️ 需复核</span>
              <span className="font-bold text-orange-600">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="text-xs text-gray-500 mb-1">当前任务</div>
          <div className="font-mono text-sm mb-2">视频_20241213_01</div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>上传时间: 14:23</div>
            <div>大小: 2.3GB</div>
            <div>状态: 分析中</div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>进度</span>
              <span className="font-bold">{videoProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => setIsAnalyzing(!isAnalyzing)}
            className="w-full mt-3 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
          >
            {isAnalyzing ? '暂停' : '开始分析'}
          </button>
        </div>
      </div>

      <div className="col-span-2 bg-white border border-gray-200 rounded p-4">
        <h3 className="font-bold mb-4">视频回放器</h3>
        <div className="bg-gray-900 rounded aspect-video flex items-center justify-center mb-4">
          <div className="text-center text-white">
            <Play className="mx-auto mb-2" size={48} />
            <div className="text-sm">视频预览区域</div>
            <div className="text-xs text-gray-400 mt-1">检测框标注：绿框=儿童 红框=疑似目标</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Play size={20} />
            </button>
            <div className="flex-1 bg-gray-200 rounded h-2 relative">
              <div className="absolute top-0 left-0 h-full bg-blue-600 rounded" style={{ width: '45%' }} />
              <div className="absolute top-0 bg-red-500 w-1 h-4 -mt-1" style={{ left: '12%' }} />
              <div className="absolute top-0 bg-red-500 w-1 h-4 -mt-1" style={{ left: '28%' }} />
              <div className="absolute top-0 bg-red-500 w-1 h-4 -mt-1" style={{ left: '45%' }} />
            </div>
            <span className="text-sm font-mono">00:12:34</span>
          </div>
          <div className="text-xs text-gray-600">疑点时间轴: 00:03 | 00:12 | 00:45</div>
        </div>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-green-600 mt-0.5" size={20} />
            <div className="flex-1">
              <div className="font-bold text-green-900 mb-2">🟢 检测到疑似目标（置信度 87%）</div>
              <div className="text-sm text-green-800 space-y-1">
                <div>• 儿童特征：年龄5-7岁，男童</div>
                <div>• 异常行为：成人牵引</div>
                <div>• 时空信息：XX路口，2024-12-10 15:23</div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                  标记为线索
                </button>
                <button className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50">
                  误报
                </button>
                <button className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50">
                  加入案件
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="font-bold mb-4">🤖 AI分析引擎</h3>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">当前任务进度</div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
              <div className="text-2xl font-bold text-purple-600">{videoProgress}%</div>
            </div>

            <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">已分析帧数</span>
                <span className="font-bold">24,503</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">检测目标数</span>
                <span className="font-bold">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">疑似匹配</span>
                <span className="font-bold text-orange-600">8</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-1">处理时间预估</div>
              <div className="font-bold">剩余约 23 分钟</div>
            </div>

            <div className="pt-3 space-y-2">
              <button className="w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                暂停分析
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                导出报告
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="font-bold mb-3 text-sm">快速操作</h3>
          <div className="space-y-2 text-sm">
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2">
              <ChevronRight size={16} />
              与失踪库比对
            </button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2">
              <ChevronRight size={16} />
              启动年龄推演
            </button>
            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2">
              <ChevronRight size={16} />
              跨区域协查
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAgeProgression = () => (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white border border-gray-200 rounded p-6">
        <h3 className="font-bold text-lg mb-4">失踪儿童档案 #20190523001</h3>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-600 mb-2">原始照片（3岁）</div>
            <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Users size={48} />
                <div className="text-xs mt-2">失踪时照片</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">AI推演图像（8岁）</div>
            <div className="aspect-square bg-purple-100 rounded flex items-center justify-center border-2 border-purple-400">
              <div className="text-center text-purple-600">
                <Users size={48} />
                <div className="text-xs mt-2">AI生成预测</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">比对结果（置信度排序）</div>
            <div className="space-y-2">
              <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                候选1 <span className="font-bold text-red-600">92%</span>
              </div>
              <div className="p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                候选2 <span className="font-bold text-orange-600">85%</span>
              </div>
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                候选3 <span className="font-bold text-yellow-600">78%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-bold mb-3">失踪信息</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">姓名</span>
                <span>张XX（化名）</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">失踪时间</span>
                <span>2019-05-23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">失踪地点</span>
                <span>XX市XX区</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">体貌特征</span>
                <span>左耳后胎记</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">推演任务状态</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={16} />
                图像生成完成 (12-13 14:30)
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Clock size={16} />
                全库比对中...
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>已比对 2,340,567 / 8,000,000</span>
                  <span className="font-bold">29%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '29%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            开始全量比对
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            查看详细报告
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            生成多版本推演
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded p-4">
        <h3 className="font-bold mb-4">AI成长预测 - 技术解释</h3>
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-gray-600 mb-1">模型版本</div>
            <div className="font-mono text-xs bg-gray-100 p-2 rounded">
              FaceAging-v3.2 (公安专用版)
            </div>
          </div>

          <div>
            <div className="text-gray-600 mb-1">输入信息</div>
            <div>3张原始照片 (1-3岁)</div>
          </div>

          <div>
            <div className="text-gray-600 mb-1">推演年龄</div>
            <div>8岁（当前年龄估算）</div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="font-bold mb-2">预测依据</div>
            <ul className="space-y-1 text-xs">
              <li>• 颅骨生长曲线模型</li>
              <li>• 五官比例变化算法</li>
              <li>• 亲缘面部特征继承</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="font-bold mb-2">置信度评估</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>整体相似度</span>
                  <span className="font-bold">高 (88%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="font-bold mb-2">关键特征保留</div>
            <div className="text-xs space-y-1">
              <div>✓ 眼距、鼻型、耳廓</div>
              <div className="text-gray-600">⚠ 不确定：发型、体重</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBatchMatching = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded p-6">
        <h3 className="font-bold text-lg mb-4">📊 当前运行任务</h3>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">任务ID</div>
              <div className="font-mono font-bold">BM-20241213-001</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">任务类型</div>
              <div>失踪儿童库 × 2024年Q4监控数据</div>
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            规模：1,203个档案 × 500万小时监控
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4 mb-4">
          <h4 className="font-bold mb-3">进度监控</h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>总体进度</span>
                <span className="font-bold">{matchingProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${matchingProgress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">已处理</div>
                <div className="font-bold text-lg">{stats.processed.toLocaleString()}</div>
                <div className="text-xs text-gray-500">/ {stats.total.toLocaleString()} 档案</div>
              </div>
              <div>
                <div className="text-gray-600">发现匹配</div>
                <div className="font-bold text-lg text-blue-600">{stats.matched.toLocaleString()}</div>
                <div className="text-xs text-gray-500">高置信度 ≥ 80%</div>
              </div>
              <div>
                <div className="text-gray-600">待人工复核</div>
                <div className="font-bold text-lg text-orange-600">{stats.pending}</div>
                <div className="text-xs text-gray-500">需确认</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4 mb-4">
          <h4 className="font-bold mb-3">性能指标</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">处理速度</div>
              <div className="font-bold">12,300 档案/小时</div>
            </div>
            <div>
              <div className="text-gray-600">预计完成</div>
              <div className="font-bold">2024-12-15 02:30</div>
            </div>
            <div>
              <div className="text-gray-600">资源占用</div>
              <div className="font-bold">GPU集群 8/12 活跃</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
            暂停任务
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            调整优先级
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            查看实时结果
          </button>
        </div>
      </div>
    </div>
  )

  const renderReviewModal = () => {
    if (!selectedReview) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h3 className="font-bold text-lg">人工复核 - 匹配结果 #{selectedReview.case}</h3>
            <button onClick={() => setSelectedReview(null)} className="p-1 hover:bg-gray-100 rounded">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">失踪档案照片（原始）</div>
                <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                  <div className="text-gray-500">
                    <Users size={64} />
                    <div className="text-xs mt-2">3岁时照片</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">AI推演图像（8岁预测）</div>
                <div className="aspect-square bg-purple-100 rounded flex items-center justify-center border-2 border-purple-400">
                  <div className="text-purple-600">
                    <Users size={64} />
                    <div className="text-xs mt-2">AI生成</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">监控抓拍（匹配目标）</div>
                <div className="aspect-square bg-blue-100 rounded flex items-center justify-center border-2 border-blue-400">
                  <div className="text-blue-600">
                    <Users size={64} />
                    <div className="text-xs mt-2">监控画面</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded p-4">
              <h4 className="font-bold mb-3">AI匹配依据</h4>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">置信度</span>
                  <span className="text-2xl font-bold text-red-600">{selectedReview.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-600 h-3 rounded-full"
                    style={{ width: `${selectedReview.confidence}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="font-semibold text-sm mb-2">相似特征（热力图）</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>✓ 眼部轮廓匹配度</span>
                      <span className="font-bold text-green-600">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ 鼻梁形态匹配度</span>
                      <span className="font-bold text-green-600">88%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✓ 耳廓结构匹配度</span>
                      <span className="font-bold text-green-600">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⚠ 脸型有差异</span>
                      <span className="text-gray-600 text-xs">（年龄变化）</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-sm mb-2">时空信息</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">地点：</span>
                      <span className="ml-2">{selectedReview.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">时间：</span>
                      <span className="ml-2">2024-12-10 15:23:17</span>
                    </div>
                    <div>
                      <span className="text-gray-600">摄像头：</span>
                      <span className="ml-2 font-mono text-xs">XXJK-20241210-A032</span>
                    </div>
                    <div>
                      <span className="text-gray-600">视频源：</span>
                      <span className="ml-2">公共监控系统</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded p-3 text-sm">
                <div className="font-semibold mb-1">模型信息</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div>模型版本：FaceRecognition-v4.5 (公安专用)</div>
                  <div>特征向量距离：0.156 (阈值: 0.200)</div>
                  <div>对比样本数：8,234,567</div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded p-4">
              <h4 className="font-bold mb-3">人工判定</h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">判定结果 *</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="decision"
                        value="high"
                        checked={reviewDecision === 'high'}
                        onChange={e => setReviewDecision(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">高度疑似 - 建议立即核查</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="decision"
                        value="possible"
                        checked={reviewDecision === 'possible'}
                        onChange={e => setReviewDecision(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">可能匹配 - 需进一步调查</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="decision"
                        value="exclude"
                        checked={reviewDecision === 'exclude'}
                        onChange={e => setReviewDecision(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">排除 - 标记原因：</span>
                    </label>
                  </div>

                  {reviewDecision === 'exclude' && (
                    <div className="ml-6 mt-2 space-y-1">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="w-4 h-4" />
                        年龄差异过大
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="w-4 h-4" />
                        性别不符
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="w-4 h-4" />
                        特征冲突
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="w-4 h-4" />
                        图像质量问题
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">操作意见 *</label>
                  <textarea
                    className="w-full border border-gray-300 rounded p-3 text-sm"
                    rows={4}
                    placeholder="[必填] 请输入研判依据与处置建议..."
                  />
                </div>

                <div className="bg-gray-50 rounded p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">复核人</span>
                    <span className="font-medium">[当前登录警员]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">工号</span>
                    <input
                      type="text"
                      placeholder="请输入工号"
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">时间</span>
                    <span className="font-medium">2024-12-13 14:45</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-medium">
                    ✓ 提交复核
                  </button>
                  <button className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                    转专案组
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded hover:bg-gray-50">
                    标记误报
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded hover:bg-gray-50">
                    下一条
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded p-4">
              <h4 className="font-bold mb-3">📝 证据链完整追溯</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    <div className="w-0.5 h-full bg-blue-300" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-semibold">2019-05-23 儿童失踪</div>
                    <div className="text-sm text-gray-600">操作人：报案人</div>
                    <div className="text-sm text-gray-600">档案建立：李警官 (110234)</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full" />
                    <div className="w-0.5 h-full bg-purple-300" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-semibold">2024-12-12 启动AI推演</div>
                    <div className="text-sm text-gray-600">操作人：张警官 (110567)</div>
                    <div className="text-sm text-gray-600">授权文号：X公刑[2024]123号</div>
                    <div className="text-sm text-gray-600">模型版本：FaceAging-v3.2</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-orange-600 rounded-full" />
                    <div className="w-0.5 h-full bg-orange-300" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-semibold">2024-12-13 全量比对命中</div>
                    <div className="text-sm text-gray-600">系统自动匹配</div>
                    <div className="text-sm text-gray-600">匹配ID：BM-20241213-001-0127</div>
                    <div className="text-sm text-gray-600">置信度：{selectedReview.confidence}%</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-400">待完成：人工复核确认</div>
                    <div className="text-sm text-gray-400">复核人：[待填写]</div>
                  </div>
                </div>
              </div>

              <button className="mt-4 w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                导出完整证据链PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                <Eye className="text-blue-900" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">守护行动</h1>
                <div className="text-xs text-blue-200">打拐人像智能研判系统</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="text-blue-200">当前用户</div>
                <div className="font-medium">张警官 (110567)</div>
              </div>
              <button className="p-2 hover:bg-blue-800 rounded">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: '工作台', icon: BarChart3 },
              { id: 'video', label: '视频分析', icon: Play },
              { id: 'age', label: '年龄推演', icon: Users },
              { id: 'batch', label: '全量匹配', icon: Database }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'video' && renderVideoAnalysis()}
        {activeTab === 'age' && renderAgeProgression()}
        {activeTab === 'batch' && renderBatchMatching()}
      </div>

      {renderReviewModal()}
    </div>
  )
}

export default AntiTraffickingSystem

