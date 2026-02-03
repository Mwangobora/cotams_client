/**
 * Stream Types
 */

export interface Stream {
  id: string;
  program_year: string;
  program_year_display?: string;
  stream_code: string;
  name?: string;
  capacity?: number | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
