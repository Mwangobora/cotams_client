/**
 * Lecturers Types
 */

export interface Course {
  id: string;
  name: string;
  code: string;
  credit_hours: number;
  program_name: string;
  academic_year: number;
  semester: string;
}

export interface ScheduleSession {
  day_of_week: string;
  start_time: string;
  end_time: string;
  course_name: string;
  room_name: string;
  session_type: string;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  employee_id: string;
  phone?: string;
  department: string;
  specialization: string;
  qualification?: string;
  bio?: string;
  office_location?: string;
  research_interests?: string;
  is_active: boolean;
  courses?: Course[];
  schedule?: ScheduleSession[];
}

export interface LecturerFilters {
  search?: string;
  department?: string;
  is_active?: boolean;
}