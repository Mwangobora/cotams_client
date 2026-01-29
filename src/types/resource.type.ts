export type RoomType = 'LECTURE_HALL' | 'LAB' | 'WORKSHOP';

export interface Room {
  id: string;
  code: string;
  name: string;
  room_type: RoomType;
  capacity: number;
  building?: string;
  floor?: string;
  facilities?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomCreate {
  code: string;
  name: string;
  room_type: RoomType;
  capacity: number;
  building?: string;
  floor?: string;
  facilities?: Record<string, any>;
  is_active?: boolean;
}
