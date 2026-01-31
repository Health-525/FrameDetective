type RunInput = {
  video: string
  prompt?: string
  mask_color?: string
  mask_opacity?: number
  mask_only?: boolean
  return_zip?: boolean
}

type RunOutput = {
  url: string
  filename: string
  zip_url?: string
  video_url?: string
  appearances?: number
  segments?: { start_index: number; end_index: number }[]
  total_frames?: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export async function runSam3(input: RunInput): Promise<RunOutput> {
  const res = await fetch(`${API_BASE_URL}/api/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  return res.json()
}

type AnalyzeZipInput = {
  zip_url: string
  threshold?: number
  min_run?: number
}

type AnalyzeZipOutput = {
  zip_url: string
  filename: string
  appearances: number
  segments: { start_index: number; end_index: number }[]
  total_frames: number
}

export async function analyzeZip(input: AnalyzeZipInput): Promise<AnalyzeZipOutput> {
  const res = await fetch(`${API_BASE_URL}/api/analyze-zip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  return res.json()
}

