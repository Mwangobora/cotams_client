/**
 * Programs Management Types
 */

export interface Program {
  id: string;
  code: string;
  name: string;
  description: string;
  duration_years: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  program_years: ProgramYear[];
}

export interface ProgramYear {
  id: string;
  year_number: number;
  year_name: string;
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
  duration_years: number;
  is_active: boolean;
}

export interface ProgramFilters {
  search?: string;
  is_active?: boolean;
  duration_years?: number;
}