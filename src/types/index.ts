import type { FieldArrayWithId } from 'react-hook-form';

export type JobStatus = 'active' | 'archived';

export interface Job {
    id: string;
    title: string;
    slug: string;
    status: JobStatus;
    tags: string[];
    order: number;
    createdAt: number;
    summary: string;
    
}

export interface JobsResponse {
  items: Job[];
  total: number;
}

export type Stage = 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';

export interface Candidate {
    id: string;
    name: string;
    email: string;
    jobId?: string;
    stage: Stage;
    timeline: {timestamp: number; from?:Stage; to:Stage; note?:string}[];
    note?: string;
    profile: string;
}

export type QuestionType = 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file';

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: { value: string }[];
  min?: number;
  max?: number;
  condition?: {
    questionId: string;
    value: string;
  };
}

export interface AssessmentSection {
  id: string;
  title: string;
  questions: Question[];
}

export interface Assessment {
    jobId: string;
    title: string;
    sections: AssessmentSection[];
}

export type SectionField = FieldArrayWithId<Assessment, "sections", "id">;