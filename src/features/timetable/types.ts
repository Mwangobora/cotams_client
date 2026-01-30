/**
 * Timetable feature types
 */

export interface Session {
  id: string;
  academic_year: string;
  semester: string;
  semester_display: string;
  module: string;
  module_code: string;
  module_name: string;
  lecturer: string;
  lecturer_name: string;
  lecturer_employee_id: string;
  stream: string;
  stream_code: string;
  stream_name?: string;
  room: string;
  room_code: string;
  room_name: string;
  room_building: string;
  day_of_week: DayOfWeek;
  day_display: string;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  display_time: string;
  duration_hours?: number;
  session_type: SessionType;
  session_type_display: string;
  created_by?: string;
  created_by_email?: string;
  created_at: string;
  updated_at: string;
}

export interface Stream {
  id: string;
  program_year: string;
  stream_code: string;
  name: string;
  capacity?: number;
  is_active: boolean;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  room_type: string;
  capacity: number;
  building: string;
  floor?: string;
  facilities?: Record<string, any>;
  is_active: boolean;
}

export interface Lecturer {
  id: string;
  employee_id: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
}

export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
export type SessionType = 'LECTURE' | 'LAB' | 'TUTORIAL';
export type SemesterType = 'SEMESTER_1' | 'SEMESTER_2' | 'YEAR_LONG';

export interface TimetableFilters {
  academic_year?: string;
  semester?: string;
  stream?: string;
  lecturer?: string;
  room?: string;
  module?: string;
  day_of_week?: DayOfWeek;
  session_type?: SessionType;
}

export interface SessionsByDay {
  [day: string]: Session[];
}

export const DAYS: { code: DayOfWeek; name: string; index: number }[] = [
  { code: 'MON', name: 'Monday', index: 0 },
  { code: 'TUE', name: 'Tuesday', index: 1 },
  { code: 'WED', name: 'Wednesday', index: 2 },
  { code: 'THU', name: 'Thursday', index: 3 },
  { code: 'FRI', name: 'Friday', index: 4 },
  { code: 'SAT', name: 'Saturday', index: 5 },
  { code: 'SUN', name: 'Sunday', index: 6 },
];

export const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const hour = 7 + i;
  return `${hour.toString().padStart(2, '0')}:00`;
});