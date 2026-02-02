/**
 * Module Lecturer Assignment Types
 */

export interface ModuleLecturerAssignment {
  id: string;
  module: string;
  module_code?: string;
  module_name?: string;
  lecturer: string;
  lecturer_name?: string;
  lecturer_employee_id?: string;
  academic_year: string;
  semester: number;
  is_primary: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ModuleLecturerFormData {
  module: string;
  lecturer: string;
  academic_year: string;
  semester: number;
  is_primary: boolean;
  is_active?: boolean;
}

export interface ModuleLecturerFilters {
  module?: string;
  lecturer?: string;
  academic_year?: string;
  semester?: number;
}
