export type ProgramLevel = 'CERTIFICATE' | 'DIPLOMA' | 'UNDERGRADUATE' | 'POSTGRADUATE';

export interface Program {
  id: string;
  code: string;
  name: string;
  description?: string;
  department: string;
  department_name?: string;
  level: ProgramLevel;
  duration_years: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  code: string;
  name: string;
  description?: string;
  department: string;
  department_name?: string;
  credits: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stream {
  id: string;
  code: string;
  name: string;
  program_year: string;
  capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Curriculum {
  id: string;
  program_year: string;
  module: string;
  module_name?: string;
  semester: number;
  is_core: boolean;
  created_at: string;
}
