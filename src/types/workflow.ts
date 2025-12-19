// =============================================
// OBRAIN WORKFLOW TYPES
// Production-ready type definitions
// =============================================

export type WorkflowStage = 'brief' | 'strategy' | 'concept' | 'generate' | 'iterate' | 'export';

export type CampaignObjective = 'awareness' | 'engagement' | 'sales' | 'launch' | 'other';

export type Platform = 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'twitter' | 'linkedin';

export type EnergyLevel = 'calm' | 'moderate' | 'energetic' | 'intense';

export type AssetType = 'image' | 'video' | 'caption';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

// Brief Stage Data
export interface CampaignBrief {
  businessName: string;
  businessDescription: string;
  productOrService: string;
  targetAudience: string;
  objective: CampaignObjective;
  platforms: Platform[];
  budget?: string;
  timeline?: string;
  additionalNotes?: string;
}

// Creative Strategy (AI-generated)
export interface CreativeStrategy {
  id: string;
  title: string;
  visualStyle: string;
  hookIdea: string;
  contentAngle: string;
  exampleHeadline: string;
  mood: string;
  energyLevel: EnergyLevel;
  aiReasoning: string;
  isSelected: boolean;
}

// Generation Job
export interface GenerationJob {
  id: string;
  jobType: AssetType;
  status: JobStatus;
  prompt: string;
  model: string;
  parameters: Record<string, unknown>;
  seed?: string;
  resultUrl?: string;
  errorMessage?: string;
  progress: number;
  retryCount: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

// Generated Asset
export interface GeneratedAsset {
  id: string;
  type: AssetType;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  qualityScore?: number;
  qualityIssues?: string[];
  isApproved: boolean;
  isFavorite: boolean;
  metadata: Record<string, unknown>;
}

// Caption
export interface Caption {
  id: string;
  platform: Platform | 'general';
  text: string;
  hashtags: string[];
  callToAction?: string;
  tone: string;
  isSelected: boolean;
}

// Export Package
export interface ExportPackage {
  id: string;
  name: string;
  platform: Platform;
  formatPreset: ExportFormat;
  assets: string[];
  downloadUrl?: string;
}

export interface ExportFormat {
  width: number;
  height: number;
  aspectRatio: string;
  safeArea?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Platform Export Presets
export const PLATFORM_PRESETS: Record<string, ExportFormat> = {
  'instagram-post': { width: 1080, height: 1080, aspectRatio: '1:1' },
  'instagram-story': { width: 1080, height: 1920, aspectRatio: '9:16', safeArea: { top: 120, bottom: 120, left: 48, right: 48 } },
  'instagram-reel': { width: 1080, height: 1920, aspectRatio: '9:16', safeArea: { top: 120, bottom: 200, left: 48, right: 48 } },
  'tiktok': { width: 1080, height: 1920, aspectRatio: '9:16', safeArea: { top: 100, bottom: 150, left: 48, right: 100 } },
  'facebook-post': { width: 1200, height: 630, aspectRatio: '1.91:1' },
  'facebook-story': { width: 1080, height: 1920, aspectRatio: '9:16' },
  'youtube-short': { width: 1080, height: 1920, aspectRatio: '9:16' },
  'youtube-thumbnail': { width: 1280, height: 720, aspectRatio: '16:9' },
  'twitter-post': { width: 1200, height: 675, aspectRatio: '16:9' },
  'linkedin-post': { width: 1200, height: 627, aspectRatio: '1.91:1' },
};

// Workflow State
export interface WorkflowState {
  // Current stage
  stage: WorkflowStage;
  
  // Context
  workspaceId: string | null;
  projectId: string | null;
  campaignId: string | null;
  brandKitId: string | null;
  
  // Brief data
  brief: Partial<CampaignBrief>;
  
  // Strategy data
  strategies: CreativeStrategy[];
  selectedStrategy: CreativeStrategy | null;
  
  // Generation data
  jobs: GenerationJob[];
  assets: GeneratedAsset[];
  captions: Caption[];
  
  // Export data
  exports: ExportPackage[];
  
  // Reference images
  referenceImages: string[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

// Chat Message Types
export interface DirectorMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    stage?: WorkflowStage;
    action?: string;
    data?: Record<string, unknown>;
  };
  createdAt: string;
}

// Workflow Actions
export type WorkflowAction =
  | { type: 'SET_STAGE'; payload: WorkflowStage }
  | { type: 'SET_CONTEXT'; payload: { workspaceId?: string; projectId?: string; campaignId?: string; brandKitId?: string } }
  | { type: 'UPDATE_BRIEF'; payload: Partial<CampaignBrief> }
  | { type: 'SET_STRATEGIES'; payload: CreativeStrategy[] }
  | { type: 'SELECT_STRATEGY'; payload: string }
  | { type: 'ADD_JOB'; payload: GenerationJob }
  | { type: 'UPDATE_JOB'; payload: { id: string; updates: Partial<GenerationJob> } }
  | { type: 'ADD_ASSET'; payload: GeneratedAsset }
  | { type: 'UPDATE_ASSET'; payload: { id: string; updates: Partial<GeneratedAsset> } }
  | { type: 'ADD_CAPTION'; payload: Caption }
  | { type: 'SELECT_CAPTION'; payload: { assetId: string; captionId: string } }
  | { type: 'ADD_EXPORT'; payload: ExportPackage }
  | { type: 'SET_REFERENCE_IMAGES'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

// Stage completion checks
export const STAGE_REQUIREMENTS: Record<WorkflowStage, (state: WorkflowState) => boolean> = {
  brief: (state) => !!(
    state.brief.businessName &&
    state.brief.businessDescription &&
    state.brief.objective &&
    state.brief.platforms?.length
  ),
  strategy: (state) => state.strategies.length > 0,
  concept: (state) => state.selectedStrategy !== null,
  generate: (state) => state.assets.length > 0,
  iterate: (state) => state.assets.some(a => a.isApproved),
  export: (state) => state.exports.length > 0,
};

export const STAGE_ORDER: WorkflowStage[] = ['brief', 'strategy', 'concept', 'generate', 'iterate', 'export'];

export const STAGE_LABELS: Record<WorkflowStage, { ar: string; en: string }> = {
  brief: { ar: 'الملخص', en: 'Brief' },
  strategy: { ar: 'الاستراتيجية', en: 'Strategy' },
  concept: { ar: 'المفهوم', en: 'Concept' },
  generate: { ar: 'الإنشاء', en: 'Generate' },
  iterate: { ar: 'التكرار', en: 'Iterate' },
  export: { ar: 'التصدير', en: 'Export' },
};
