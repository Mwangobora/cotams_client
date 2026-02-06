/**
 * Academic Submissions Types
 */

import type { QueryParams } from './api.type';
export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type SubmissionModuleAction = 'CREATE' | 'UPDATE';
export type SubmissionModuleLecturerAction = 'CREATE' | 'DELETE';

export interface SubmissionModuleItem {
  id: string;
  action: SubmissionModuleAction;
  target_module?: string | null;
  proposed_code: string;
  proposed_name: string;
  proposed_description?: string;
  proposed_credits: number;
  proposed_hours_per_week: number;
  proposed_is_active: boolean;
  is_applied: boolean;
}

export interface SubmissionModuleLecturerItem {
  id: string;
  action: SubmissionModuleLecturerAction;
  target_assignment?: string | null;
  proposed_module?: string | null;
  proposed_lecturer?: string | null;
  proposed_academic_year?: string;
  proposed_semester?: number | null;
  proposed_is_primary?: boolean;
  is_applied: boolean;
  proposed_module_code?: string;
  proposed_module_name?: string;
  proposed_module_department_name?: string;
  proposed_module_department_code?: string;
  proposed_lecturer_name?: string;
  proposed_lecturer_department_name?: string;
  proposed_module_programs?: Array<{ id: string; code: string; name: string }>;
}

export interface AcademicSubmission {
  id: string;
  title: string;
  description?: string;
  department: string;
  department_name?: string;
  status: SubmissionStatus;
  submitted_by?: string;
  submitted_by_name?: string;
  reviewed_by?: string | null;
  reviewed_by_name?: string | null;
  review_notes?: string;
  created_at: string;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  updated_at?: string;
  module_items: SubmissionModuleItem[];
  curriculum_items?: unknown[];
  module_lecturer_items: SubmissionModuleLecturerItem[];
}

export interface SubmissionModuleInput {
  action: SubmissionModuleAction;
  target_module?: string | null;
  proposed_code: string;
  proposed_name: string;
  proposed_description?: string;
  proposed_credits: number;
  proposed_hours_per_week: number;
  proposed_is_active: boolean;
}

export interface SubmissionModuleLecturerInput {
  action: SubmissionModuleLecturerAction;
  target_assignment?: string | null;
  proposed_module?: string | null;
  proposed_lecturer?: string | null;
  proposed_academic_year?: string;
  proposed_semester?: number | null;
  proposed_is_primary?: boolean;
}

export interface AcademicSubmissionCreatePayload {
  title: string;
  description?: string;
  department: string;
  module_items?: SubmissionModuleInput[];
  curriculum_items?: unknown[];
  module_lecturer_items?: SubmissionModuleLecturerInput[];
}

export interface SubmissionFilters extends QueryParams {
  status?: SubmissionStatus;
  department?: string;
}
