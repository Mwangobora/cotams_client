import type { QueryParams } from './api.type';

export interface Curriculum {
  id: string;
  program_year: string;
  module: string;
  module_name?: string;
  program_year_display?: string;
  semester: number;
  is_core: boolean;
  created_at?: string;
}

export interface CurriculumFormData {
  program_year: string;
  module: string;
  semester: number;
  is_core: boolean;
}

export interface CurriculumFilters extends QueryParams {
  program_year?: string;
  module?: string;
  semester?: number;
  is_core?: boolean;
}
