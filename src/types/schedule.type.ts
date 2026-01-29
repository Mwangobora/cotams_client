export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
export type SessionType = 'LECTURE' | 'LAB' | 'TUTORIAL';

export interface TimetableSession {
  id: string;
  module_code: string;
  module_name?: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  room: string;
  room_name?: string;
  lecturer: string;
  lecturer_name?: string;
  stream: string;
  stream_name?: string;
  session_type: SessionType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimetableSessionCreate {
  module_code: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  room: string;
  lecturer: string;
  stream: string;
  session_type: SessionType;
}

export interface ClashDetection {
  has_clash: boolean;
  clashes: Array<{
    clash_type: string;
    conflicting_session: TimetableSession;
    message: string;
  }>;
}
