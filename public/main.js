/**
 * SAM3 Video Processor - Main Application Logic
 * Modularized for better maintainability and clarity.
 */

const APP_VERSION = 'v1.2.0';

const App = {
  state: {
    tasks: [],
    currentTaskId: null,
    nextId: 1
  },

  elements: {},

  init() {
    this.cacheElements();
    this.bindEvents();
    this.setAppVersion(APP_VERSION);
    this.setServiceStatus('online', '在线');
    this.clearGlobalAlert();
    this.renderQueueCount();
    this.log('System', '应用程序已就绪');
  },

  cacheElements() {
    // Config Panel
    this.elements.tabs = document.querySelectorAll('.tab-btn');
    this.elements.tabPanes = document.querySelectorAll('.tab-pane');
    
    // Video Task Form
    this.elements.videoForm = document.getElementById('videoTaskForm');
    this.elements.btnStartTask = document.getElementById('btnStartTask');
    this.elements.btnResetForm = document.getElementById('btnResetForm');
    this.elements.inputPrompt = document.getElementById('inputPrompt');
    this.elements.sampleImageInput = document.getElementById('inputSampleImage');
    this.elements.inputFileUpload = document.getElementById('inputFileUpload');
    this.elements.btnBrowseFile = document.getElementById('btnBrowseFile');
    this.elements.dropZone = document.getElementById('dropZone');
    
    // Mode tabs
    this.elements.modeTabs = document.querySelectorAll('.mode-tab-btn');
    this.elements.modePanes = {
      image: document.getElementById('mode-image-pane'),
      text: document.getElementById('mode-text-pane')
    };

    // Header and global status
    this.elements.appVersion = document.getElementById('appVersion');
    this.elements.serviceStatus = document.getElementById('serviceStatus');
    this.elements.globalAlert = document.getElementById('globalAlert');

    // Queue
    this.elements.queueList = document.getElementById('taskQueueList');
    this.elements.queueCount = document.getElementById('queueCount');
    this.elements.queueEmptyState = document.getElementById('queueEmptyState');

    // Preview Panel
    this.elements.previewTaskInfo = document.getElementById('previewTaskInfo');
    this.elements.jsonPreviewCode = document.getElementById('jsonPreviewCode');
    this.elements.btnCopyJson = document.getElementById('btnCopyJson');
    this.elements.previewVideoPlayer = document.getElementById('previewVideoPlayer');
    this.elements.mediaPreviewArea = document.getElementById('mediaPreviewArea');

    // Result & Logs
    this.elements.resultList = document.getElementById('resultList');
    this.elements.resultEmptyState = document.getElementById('resultEmptyState');
    this.elements.systemLogs = document.getElementById('systemLogs');
    this.elements.btnClearLogs = document.getElementById('btnClearLogs');
  },

  bindEvents() {
    // Tab Switching
    this.elements.tabs.forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target));
    });

    // Start Task (Handle both modes)
    this.elements.btnStartTask.addEventListener('click', () => this.handleStartTask());
    
    // Mode Switching
    this.elements.modeTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        this.switchInputMode(mode);
      });
    });

    // Reset Form
    this.elements.btnResetForm.addEventListener('click', () => {
      this.elements.videoForm.reset();
      this.log('Info', '表单已重置');
    });

    // File Upload & Drag-Drop
    if (this.elements.btnBrowseFile && this.elements.inputFileUpload) {
      this.elements.btnBrowseFile.addEventListener('click', () => this.elements.inputFileUpload.click());
      this.elements.inputFileUpload.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.uploadFile(e.target.files[0]);
        }
      });
    }

    if (this.elements.sampleImageInput) {
      const input = this.elements.sampleImageInput;
      const dropZone = this.elements.dropZone;

      // Drag Enter/Over
      ['dragenter', 'dragover'].forEach(eventName => {
        input.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.style.display = 'block';
          dropZone.classList.add('active');
        });
      });

      // Drag Leave
      input.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('active');
        // Hide only if leaving the drop zone area
        setTimeout(() => dropZone.style.display = 'none', 100); 
      });

      // Drop
      input.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.display = 'none';
        dropZone.classList.remove('active');
        
        if (e.dataTransfer.files.length > 0) {
          this.uploadFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Copy JSON
    this.elements.btnCopyJson.addEventListener('click', () => {
      const code = this.elements.jsonPreviewCode.textContent;
      navigator.clipboard.writeText(code).then(() => {
        this.log('Info', 'JSON 已复制到剪贴板');
      });
    });

    // Clear Logs
    this.elements.btnClearLogs.addEventListener('click', () => {
      this.elements.systemLogs.innerHTML = '';
      this.log('System', '日志已清空');
    });

    // Queue Item Selection Delegation
    this.elements.queueList.addEventListener('click', (e) => {
      const item = e.target.closest('.queue-item');
      if (item) {
        this.selectTask(parseInt(item.dataset.id));
      }
      if (e.target.matches('.btn-start')) {
        e.stopPropagation();
        const id = parseInt(e.target.closest('.queue-item').dataset.id);
        this.runTask(id);
      }
      if (e.target.matches('.btn-delete')) {
        e.stopPropagation();
        const id = parseInt(e.target.closest('.queue-item').dataset.id);
        this.removeTask(id);
      }
    });
  },

  switchTab(targetBtn) {
    this.elements.tabs.forEach(btn => btn.classList.remove('active'));
    this.elements.tabPanes.forEach(pane => pane.classList.remove('active'));
    
    targetBtn.classList.add('active');
    const targetId = targetBtn.dataset.target;
    document.getElementById(targetId).classList.add('active');
    this.elements.tabs.forEach(btn => {
      btn.setAttribute('aria-selected', btn === targetBtn ? 'true' : 'false');
    });
  },

  setAppVersion(version) {
    if (this.elements.appVersion) {
      this.elements.appVersion.textContent = version;
    }
  },

  setServiceStatus(status, label) {
    if (!this.elements.serviceStatus) return;
    const el = this.elements.serviceStatus;
    el.textContent = label;
    el.className = 'indicator';
    if (status) {
      el.className += ' ' + status;
    }
  },

  showGlobalAlert(type, message) {
    if (!this.elements.globalAlert) return;
    const el = this.elements.globalAlert;
    el.textContent = message;
    el.className = 'global-alert';
    if (type) {
      el.className += ' ' + type;
    }
  },

  clearGlobalAlert() {
    if (!this.elements.globalAlert) return;
    const el = this.elements.globalAlert;
    el.textContent = '';
    el.className = 'global-alert';
  },

  async uploadFile(file) {
    if (!file.type.startsWith('image/')) {
      this.log('Error', '只支持上传图片文件');
      this.showGlobalAlert('error', '只支持上传图片文件');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);

    this.log('Info', '正在上传图片...');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        // Try to parse error as JSON, but handle HTML/text errors gracefully
        const text = await res.text();
        let errorMsg = '上传失败';
        try {
          const json = JSON.parse(text);
          if (json.error) errorMsg = json.error;
        } catch {
          // If response is not JSON (e.g. 404 HTML or 500 stack trace), use generic message
          // or a snippet of the text if it's short.
          console.error('Upload failed with non-JSON response:', text);
          errorMsg = `上传失败 (Status ${res.status})`;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      this.elements.sampleImageInput.value = data.url;
      this.log('Success', '图片上传成功');
      
      // Optional: Auto-generate prompt after upload
      // this.generatePromptFromImage();
    } catch (err) {
      this.log('Error', `上传失败: ${err.message}`);
      this.showGlobalAlert('error', `上传失败: ${err.message}`);
    }
  },

  // --- Task Management ---

  switchInputMode(mode) {
    // Update tabs
    this.elements.modeTabs.forEach(btn => {
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Update panes
    Object.keys(this.elements.modePanes).forEach(key => {
      const pane = this.elements.modePanes[key];
      if (key === mode) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
    
    this.state.currentInputMode = mode;
  },

  async handleStartTask() {
    const form = this.elements.videoForm;
    const formData = new FormData(form);
    const videoUrl = formData.get('video');

    if (!videoUrl) {
      this.log('Error', '请填写视频 URL');
      this.showGlobalAlert('error', '请填写视频 URL');
      return;
    }

    const currentMode = this.state.currentInputMode || 'text'; // Default to text
    let prompt = '';

    if (currentMode === 'text') {
      prompt = formData.get('prompt').trim();
      if (!prompt) {
        this.log('Error', '请填写提示词');
        return;
      }
      this.addVideoTask(videoUrl, prompt);
    } else {
      // Image Mode: Auto extract features first
      const sampleImageUrl = this.elements.sampleImageInput.value.trim();
      if (!sampleImageUrl) {
        this.log('Error', '请上传或填写目标人物照片 URL');
        this.showGlobalAlert('error', '请上传或填写目标人物照片 URL');
        return;
      }
      
      this.log('Info', '正在分析照片特征...');
      try {
        const extractedPrompt = await this.generatePromptFromImage(sampleImageUrl);
        if (extractedPrompt) {
          this.log('Success', '特征提取成功，开始运行视频搜索任务');
          this.addVideoTask(videoUrl, extractedPrompt);
        }
      } catch (err) {
        this.log('Error', '特征提取失败，无法开始任务');
      }
    }
  },

  addVideoTask(videoUrl, prompt) {
    const form = this.elements.videoForm;
    const formData = new FormData(form);
    
    const task = {
      id: this.state.nextId++,
      type: 'video',
      status: 'pending',
      createdAt: new Date(),
      params: {
        video: videoUrl.trim(),
        prompt: prompt,
        mask_color: formData.get('mask_color'),
        mask_opacity: parseFloat(formData.get('mask_opacity')),
        mask_only: form.querySelector('#checkMaskOnly').checked,
        return_zip: form.querySelector('#checkReturnZip').checked,
        area_threshold: formData.get('area_threshold') ? parseFloat(formData.get('area_threshold')) : undefined,
        min_run: formData.get('min_run') ? parseInt(formData.get('min_run'), 10) : undefined
      }
    };

    this.state.tasks.unshift(task); // Add to top
    this.renderQueue();
    this.selectTask(task.id);
    this.log('Info', `创建新视频任务 #${task.id}`);
    
    // Auto start processing (optional, based on requirement "directly run")
    this.processTask(task);
  },

  async generatePromptFromImage(imageUrl) {
    try {
      this.clearGlobalAlert();
      const res = await fetch('/api/extract-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl })
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data && data.error ? data.error : '生成提示词失败';
        this.log('Error', msg);
        this.showGlobalAlert('error', msg);
        return null;
      }
      
      if (data && data.raw_description != null) {
        const desc = String(data.raw_description);
        if (desc) {
          this.log('Info', '特征描述: ' + desc.substring(0, 100) + '...');
        }
      }
      if (data && data.risk_level) {
        const level = String(data.risk_level).toLowerCase();
        const label = level === 'high' ? '高风险' : level === 'low' ? '低风险' : '中等风险';
        const logLevel = level === 'high' ? 'Error' : level === 'low' ? 'Info' : 'Warn';
        this.log(logLevel, `样本风险等级: ${label}`);
      }
      return data.prompt;
    } catch (err) {
      const msg = err && err.message ? err.message : '生成提示词时发生错误';
      this.log('Error', msg);
      this.showGlobalAlert('error', msg);
      throw err;
    }
  },

  removeTask(id) {
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    if (this.state.currentTaskId === id) {
      this.state.currentTaskId = null;
      this.renderPreview();
    }
    this.renderQueue();
    this.log('Info', `任务 #${id} 已移除`);
  },

  selectTask(id) {
    this.state.currentTaskId = id;
    
    // Highlight in UI
    const items = this.elements.queueList.querySelectorAll('.queue-item');
    items.forEach(el => {
      if (parseInt(el.dataset.id) === id) el.classList.add('selected');
      else el.classList.remove('selected');
    });

    this.renderPreview();
  },

  // --- Execution Logic ---

  async runTask(id) {
    const task = this.state.tasks.find(t => t.id === id);
    if (!task) return;
    if (task.status === 'running') return;

    this.clearGlobalAlert();

    task.status = 'running';
    this.renderQueueItem(task); // Optimistic update
    this.selectTask(task.id); // Auto select running task
    this.log('Info', `开始运行任务 #${id}...`);

    try {
      let result;
      if (task.type === 'video') {
        result = await this.api.runVideo(task.params);
      } else {
        result = await this.api.analyzeZip(task.params);
      }

      task.status = 'success';
      task.result = result;
      this.log('Success', `任务 #${id} 完成`);
      this.renderResultCard(task);
      this.clearGlobalAlert();
    } catch (err) {
      task.status = 'error';
      task.error = err.message;
      this.log('Error', `任务 #${id} 失败: ${err.message}`);
       this.showGlobalAlert('error', `任务 #${id} 失败: ${err.message}`);
    }

    this.renderQueueItem(task);
    this.renderPreview(); // Update preview to show result status if selected
  },

  // --- API Layer ---

  api: {
    async runVideo(params) {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '请求失败');
      return data;
    },
    async analyzeZip(params) {
      const res = await fetch('/api/analyze-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '请求失败');
      return data;
    }
  },

  // --- Rendering ---

  renderQueue() {
    this.renderQueueCount();
    const list = this.elements.queueList;
    if (!list) return;
    const items = list.querySelectorAll('.queue-item');
    items.forEach(node => node.remove());
    const hasTasks = this.state.tasks.length > 0;
    if (this.elements.queueEmptyState) {
      this.elements.queueEmptyState.style.display = hasTasks ? 'none' : '';
    }
    if (!hasTasks) {
      return;
    }

    this.state.tasks.forEach(task => {
      const item = this.createQueueItemElement(task);
      list.appendChild(item);
    });
  },

  renderQueueItem(task) {
    const existing = this.elements.queueList.querySelector(`.queue-item[data-id="${task.id}"]`);
    if (existing) {
      existing.replaceWith(this.createQueueItemElement(task));
    }
  },

  createQueueItemElement(task) {
    const div = document.createElement('div');
    div.className = `queue-item ${this.state.currentTaskId === task.id ? 'selected' : ''}`;
    div.dataset.id = task.id;

    const statusMap = {
      'pending': '等待中',
      'running': '运行中...',
      'success': '成功',
      'error': '失败'
    };

    let title = task.type === 'video' ? (task.params.video || '未知视频') : (task.params.zip_url || 'ZIP 文件');
    
    div.innerHTML = `
      <div class="queue-item-header">
        <span class="queue-id">#${task.id} [${task.type.toUpperCase()}]</span>
        <span class="queue-status ${task.status}">${statusMap[task.status]}</span>
      </div>
      <div class="queue-info" title="${title}">${title}</div>
      <div class="queue-actions" style="margin-top:6px; display:flex; gap:6px;">
        ${task.status !== 'running' ? `<button class="btn-start btn-text-sm" style="color:var(--accent-color);border:1px solid var(--accent-color);padding:2px 6px;border-radius:3px;background:none;cursor:pointer;">运行</button>` : ''}
        <button class="btn-delete btn-text-sm" style="color:var(--danger-color);border:1px solid var(--border-color);padding:2px 6px;border-radius:3px;background:none;cursor:pointer;">删除</button>
      </div>
    `;
    return div;
  },

  renderQueueCount() {
    this.elements.queueCount.textContent = this.state.tasks.length;
  },

  renderPreview() {
    const { previewTaskInfo, jsonPreviewCode, previewVideoPlayer, mediaPreviewArea } = this.elements;
 
    if (!this.state.currentTaskId) {
      previewTaskInfo.innerHTML = '<span class="task-id">未选择任务</span>';
      jsonPreviewCode.textContent = '{}';
      mediaPreviewArea.innerHTML = '<div class="placeholder-box"><p>请在左侧选择任务查看详情</p></div>';
      return;
    }
 
    const task = this.state.tasks.find(t => t.id === this.state.currentTaskId);
    if (!task) return;
 
    const createdAtStr = task.createdAt instanceof Date ? task.createdAt.toLocaleString() : '';
    previewTaskInfo.innerHTML = `
      <span class="task-id">#${task.id}</span>
      <span class="badge">${task.type}</span>
      <span class="queue-status ${task.status}" style="margin-left:8px">${task.status.toUpperCase()}</span>
      ${createdAtStr ? `<span class="task-meta" style="margin-left:8px">${createdAtStr}</span>` : ''}
    `;
 
    jsonPreviewCode.textContent = JSON.stringify(task.params, null, 2);
 
    mediaPreviewArea.innerHTML = '';
    
    if (task.type === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.style.maxWidth = '100%';
      video.style.maxHeight = '100%';
      
      if (task.status === 'success' && task.result && (task.result.video_url || task.result.url)) {
        video.src = task.result.video_url || task.result.url;
        const note = document.createElement('div');
        note.textContent = '结果视频';
        note.style.position = 'absolute';
        note.style.top = '10px';
        note.style.left = '10px';
        note.style.background = 'rgba(0,0,0,0.7)';
        note.style.padding = '4px 8px';
        note.style.borderRadius = '4px';
        note.style.fontSize = '0.75rem';
        mediaPreviewArea.appendChild(note);
      } else {
        video.src = task.params.video;
      }
      mediaPreviewArea.appendChild(video);
      this.renderTimeline(task, mediaPreviewArea, video);
    } else {
      mediaPreviewArea.innerHTML = '<div class="placeholder-box"><p>ZIP 分析任务<br>请在结果区查看详情</p></div>';
    }
  },

  renderTimeline(task, mediaPreviewArea, video) {
    const existing = mediaPreviewArea.querySelector('.timeline-wrapper');
    if (existing) existing.remove();

    if (!task || !task.result) return;
    const res = task.result;
    const segments = Array.isArray(res.segments) ? res.segments : null;
    const totalFrames = typeof res.total_frames === 'number' && res.total_frames > 0 ? res.total_frames : null;
    if (!segments || !segments.length || !totalFrames) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'timeline-wrapper';
    wrapper.style.width = '100%';
    wrapper.style.padding = '8px 0';
    wrapper.style.position = 'relative';
    wrapper.style.color = '#4b5563';
    wrapper.style.fontSize = '0.75rem';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '4px';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = '命中时间轴';
    const infoSpan = document.createElement('span');
    infoSpan.textContent = `片段 ${segments.length} 个`;

    header.appendChild(titleSpan);
    header.appendChild(infoSpan);
    wrapper.appendChild(header);

    const bar = document.createElement('div');
    bar.className = 'timeline-bar';
    wrapper.appendChild(bar);

    segments.forEach(seg => {
      if (typeof seg.start_index !== 'number' || typeof seg.end_index !== 'number') {
        return;
      }
      const start = Math.max(0, seg.start_index);
      const end = Math.min(totalFrames - 1, seg.end_index);
      if (end < start) return;
      const startPercent = (start / totalFrames) * 100;
      const endPercent = ((end + 1) / totalFrames) * 100;
      const widthPercent = Math.max(0.5, endPercent - startPercent);
      const segDiv = document.createElement('div');
      segDiv.className = 'timeline-segment';
      segDiv.style.left = startPercent + '%';
      segDiv.style.width = widthPercent + '%';

      const length = end - start + 1;
      const intensity = Math.max(0.4, Math.min(1, length / (totalFrames * 0.1)));
      segDiv.style.backgroundColor = `rgba(239,68,68,${intensity})`;
      segDiv.style.cursor = video ? 'pointer' : 'default';

      if (video) {
        segDiv.addEventListener('click', () => {
          if (!isFinite(video.duration) || !video.duration || !totalFrames) return;
          const ratio = start / totalFrames;
          const time = ratio * video.duration;
          if (!Number.isNaN(time) && isFinite(time)) {
            video.currentTime = time;
            video.play();
          }
        });
      }

      bar.appendChild(segDiv);
    });

    const markers = document.createElement('div');
    markers.className = 'timeline-markers';
    const m0 = document.createElement('span');
    m0.textContent = '0%';
    const m50 = document.createElement('span');
    m50.textContent = '50%';
    const m100 = document.createElement('span');
    m100.textContent = '100%';
    markers.appendChild(m0);
    markers.appendChild(m50);
    markers.appendChild(m100);
    wrapper.appendChild(markers);

    mediaPreviewArea.appendChild(wrapper);
  },

  renderResultCard(task) {
    const div = document.createElement('div');
    div.className = 'result-card';
    
    const timeStr = new Date().toLocaleTimeString();
    
    let bodyContent = '';
    let linksContent = '';
    let confidenceRow = '';

    if (task.type === 'video') {
      const res = task.result;
      const conf = typeof res.confidence === 'number' ? res.confidence : null;
      const riskLevel = conf !== null ? (conf >= 80 ? 'high' : conf >= 50 ? 'medium' : 'low') : null;
      let barClass = '';
      if (riskLevel === 'high') barClass = 'high';
      else if (riskLevel === 'medium') barClass = 'medium';

      bodyContent = `
        <div><strong>Filename:</strong> ${res.filename}</div>
        ${res.appearances ? `<div><strong>Appearances:</strong> ${res.appearances}</div>` : ''}
      `;
      if (conf !== null) {
        confidenceRow = `
          <div class="confidence-row">
            <span>命中强度</span>
            <div class="confidence-bar">
              <div class="confidence-bar-inner ${barClass}" style="width:${Math.max(0, Math.min(conf, 100))}%;"></div>
            </div>
            <span class="confidence-value">${conf}%</span>
          </div>
        `;
      }
      
      const downloadUrl = res.zip_url || res.url;
      linksContent = `
        <a href="${downloadUrl}" target="_blank" class="link-btn">下载结果</a>
        ${res.video_url ? `<a href="${res.video_url}" target="_blank" class="link-btn">原始视频链接</a>` : ''}
      `;

      // Render segments if available
      if (res.segments && res.segments.length > 0) {
        bodyContent += `<div style="margin-top:8px;font-size:0.8rem;color:#888;">检测到 ${res.segments.length} 个片段</div>`;
      }

    } else {
      // ZIP
      const res = task.result;
      const conf = typeof res.confidence === 'number' ? res.confidence : null;
      const riskLevel = conf !== null ? (conf >= 80 ? 'high' : conf >= 50 ? 'medium' : 'low') : null;
      let barClass = '';
      if (riskLevel === 'high') barClass = 'high';
      else if (riskLevel === 'medium') barClass = 'medium';

      bodyContent = `
        <div><strong>Filename:</strong> ${res.filename}</div>
        <div><strong>Appearances:</strong> ${res.appearances}</div>
        <div><strong>Total Frames:</strong> ${res.total_frames}</div>
      `;
      if (conf !== null) {
        confidenceRow = `
          <div class="confidence-row">
            <span>命中强度</span>
            <div class="confidence-bar">
              <div class="confidence-bar-inner ${barClass}" style="width:${Math.max(0, Math.min(conf, 100))}%;"></div>
            </div>
            <span class="confidence-value">${conf}%</span>
          </div>
        `;
      }
      linksContent = `<a href="${res.zip_url}" target="_blank" class="link-btn">下载 ZIP</a>`;
      
      if (res.segments && res.segments.length > 0) {
        const segList = res.segments.slice(0, 5).map(s => `[${s.start_index}-${s.end_index}]`).join(', ');
        bodyContent += `<div style="margin-top:8px;font-size:0.8rem;color:#ccc;">Segments (Top 5): ${segList}...</div>`;
      }
      }
    
    div.innerHTML = `
      <div class="result-header">
        <span class="result-title">#${task.id} 完成</span>
        <span class="result-time">${timeStr}</span>
      </div>
      <div class="result-body">
        ${bodyContent}
        ${confidenceRow}
        <div class="result-links">
          ${linksContent}
        </div>
      </div>
    `;

    if (this.elements.resultEmptyState) {
      this.elements.resultEmptyState.style.display = 'none';
    }
    this.elements.resultList.insertBefore(div, this.elements.resultList.firstChild);
  },

  log(level, message) {
    const div = document.createElement('div');
    const levelClass = level.toLowerCase();
    div.className = `log-entry ${levelClass}`;
    
    const time = new Date().toLocaleTimeString();
    div.innerHTML = `<span class="time">[${time}]</span> ${message}`;
    
    this.elements.systemLogs.appendChild(div);
    this.elements.systemLogs.scrollTop = this.elements.systemLogs.scrollHeight;
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
