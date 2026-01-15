
export interface SkinAnalysis {
  shouldGetFacial: boolean;
  urgencyScore: number; // 1-10
  skinConcerns: string[];
  reasoning: string;
  recommendedTreatment: string;
  homeCareTips: string[];
}

export interface CaptureState {
  image: string | null;
  mode: 'camera' | 'upload' | 'idle';
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  CAPTURING = 'CAPTURING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
