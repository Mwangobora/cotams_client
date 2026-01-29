export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  head?: {
    id: string;
    email: string;
    full_name: string;
  };
  head_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by_name?: string;
  programs_count?: number;
  lecturers_count?: number;
}

export interface DepartmentCreate {
  code: string;
  name: string;
  description?: string;
  head_id?: string;
  is_active?: boolean;
}
