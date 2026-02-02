/**
 * Departments Types
 */

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  head_name?: string | null;
  head_id?: string | null;
  is_active: boolean;
  programs_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentFormData {
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  head_id?: string | null;
}

export interface DepartmentFilters {
  search?: string;
  is_active?: boolean;
  code?: string;
}
