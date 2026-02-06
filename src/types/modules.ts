/**
 * Module Types
 */

import type { QueryParams } from './api.type';
export interface Module {
  id: string;
  code: string;
  name: string;
  description?: string;
  department: string;
  department_name?: string;
  credits: number;
  hours_per_week: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ModuleFilters extends QueryParams {
  search?: string;
  department?: string;
  is_active?: boolean;
}
