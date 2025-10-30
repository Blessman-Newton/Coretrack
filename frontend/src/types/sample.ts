// Backend-compatible sample types
export type SampleType = 'core' | 'assay' | 'geochemical' | 'mineralogy';
export type SampleStatus = 'collected' | 'processing' | 'completed';

export interface Sample {
  id: number;
  dispatch_id: number;
  sample_id: string;
  barcode?: string;
  sample_type: SampleType;
  from_depth?: number;
  to_depth?: number;
  status: SampleStatus;
  created_at: string;
  updated_at: string;
}

export interface SampleFormData {
  dispatch_id: number;
  sample_id: string;
  barcode?: string;
  sample_type: SampleType;
  from_depth?: number;
  to_depth?: number;
  status?: SampleStatus;
}

// Legacy interface for backward compatibility (if needed)
export interface LegacySample {
  id: number;
  holeId: string;
  depthSampledTo: number;
  samplesGenerated: number;
  samplesSubmittedToLab: number;
  dateSubmitted: string;
}

export interface LegacySampleFormData {
  holeId: string;
  depthSampledTo: number;
  samplesGenerated: number;
  samplesSubmittedToLab: number;
}
