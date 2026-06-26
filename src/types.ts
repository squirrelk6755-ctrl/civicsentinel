/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

export interface Stakeholder {
  id: string;
  name: string;
  type: string;
  influence: number; // 1-100
  sentiment: 'supportive' | 'neutral' | 'skeptical' | 'opposed';
  primaryConcern: string;
  concerns?: string[];
  benefits?: string[];
  mitigations?: string[];
}

export interface ConsensusStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  votes: number;
  unanimous: boolean;
  status: 'pending' | 'active' | 'completed';
}

export interface VisionAnalysis {
  hazardType: string;
  severityScore: number; // 1-100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedStakeholders: string[];
  analysisTimestamp: string;
  confidenceScore: number; // percentage, e.g. 96.8
  detectedObjects: string[];
  recommendation: string;
  estimatedAffectedArea?: string;
  publicSafetyImpact?: string;
  environmentalImpact?: string;
  infrastructureImpact?: string;
  recommendedPriorityLevel?: string;
  isUnclear?: boolean;
  multilingualAnalysis?: {
    hi?: {
      hazardType?: string;
      estimatedAffectedArea?: string;
      publicSafetyImpact?: string;
      environmentalImpact?: string;
      infrastructureImpact?: string;
      recommendation?: string;
    };
  };
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ReportItem {
  id: string;
  title: string;
  location: string;
  category: 'Transport' | 'Safety' | 'Energy' | 'Environmental' | 'Infrastructure';
  urgency: UrgencyLevel;
  description: string;
  status?: 'active' | 'resolved' | 'pending';
  dateAdded: string;
  imageUrl?: string;
  resolutionScore: number; // percentage
  aiSummary: string;
  jurisdictionResponsibility: string;
  multilingualDrafts: {
    en: string;
    es: string;
    zh: string;
    vi: string;
    hi?: string;
  };
  stakeholders: Stakeholder[];
  consensusSteps: ConsensusStep[];
  visionAnalysis?: VisionAnalysis;
  coordinates?: Coordinates;
}

export interface CommunityComment {
  id: string;
  author: string;
  avatarSeed: string;
  role: string;
  content: string;
  timestamp: string;
  stepId: string;
}

export interface AnalyticsProps {
  activeCases: number;
  stabilizedCases: number;
  avgConsensusDays: number;
  taxpayerSaved: string;
}

export interface MappingStakeholder {
  id: string;
  name: string;
  category: string;
  mainConcerns: string[];
  expectedBenefits: string[];
  suggestedMitigationMeasures: string[];
  initialSentiment: 'supportive' | 'neutral' | 'skeptical' | 'opposed';
  icon: string;
  influence: number;
}
