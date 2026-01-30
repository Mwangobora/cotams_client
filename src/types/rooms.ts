/**
 * Rooms Management Types
 */

export interface Room {
  id: string;
  code: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  room_type: RoomType;
  room_type_display: string;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomFormData {
  code: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  room_type: RoomType;
  features: string[];
  is_active: boolean;
}

export interface RoomFilters {
  search?: string;
  building?: string;
  room_type?: RoomType;
  is_active?: boolean;
  min_capacity?: number;
  max_capacity?: number;
}

export type RoomType = 'LECTURE_HALL' | 'LABORATORY' | 'TUTORIAL_ROOM' | 'OFFICE' | 'OTHER';