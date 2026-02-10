/**
 * Sessions Management Types
 */

import type { QueryParams } from './api.type';
export interface Session {
  id: string;
  stream: string;
  stream_name: string;
  stream_code: string;
  module: string;
  module_name: string;
  module_code: string;
  lecturer: string;
  lecturer_name: string;
  lecturer_employee_id: string;
  room: string;
  room_name: string;
  room_code: string;
  room_building: string;
  day_of_week: DayOfWeek;
  day_display: string;
  start_time: string;
  end_time: string;
  display_time: string;
  duration_hours: number;
  session_type: SessionType;
  session_type_display: string;
  academic_year: string;
  semester: Semester;
  semester_display: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  created_by_email: string;
}

export interface SessionFormData {
  stream: string;
  module: string;
  lecturer: string;
  room: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  session_type: SessionType;
  academic_year: string;
  semester: Semester;
}

export interface SessionFilters extends QueryParams {
  academic_year?: string;
  semester?: Semester;
  day_of_week?: DayOfWeek;
  stream?: string;
  lecturer?: string;
  room?: string;
  session_type?: SessionType;
  search?: string;
}

export interface ClashError {
  type: 'CLASH_ERROR';
  conflicts: ClashConflict[];
}

export interface ClashConflict {
  type: 'ROOM' | 'LECTURER' | 'STREAM';
  conflicting_session_id: string;
  resource_id: string;
  resource_name: string;
  day: string;
  start_time: string;
  end_time: string;
  module_code: string;
}

export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
export type SessionType = 'LECTURE' | 'LAB' | 'TUTORIAL';
export type Semester = 'SEMESTER_1' | 'SEMESTER_2' | 'YEAR_LONG';
