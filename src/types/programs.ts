/**
 * Programs Management Types
 */

export interface Program {
  id: string;
  code: string;
  name: string;
  description: string;
  department: string;
  department_name?: string;
  department_code?: string;
  duration_years: number;
  level?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  program_years: ProgramYear[];
}

export interface ProgramYear {
  id: string;
  program?: string;
  program_name?: string;
  program_code?: string;
  year_number: number;
  name?: string;
  year_name?: string;
  is_active: boolean;
  streams: ProgramStream[];
}

export interface ProgramStream {
  id: string;
  stream_code: string;
  name: string;
  capacity: number;
  is_active: boolean;
}

export interface ProgramFormData {
  code: string;
  name: string;
  description: string;
  department?: string;
  duration_years: number;
  level: string;
  is_active: boolean;
}

export interface ProgramFilters {
  search?: string;
  is_active?: boolean;
  duration_years?: number;
  department?: string;
  level?: string;
}
