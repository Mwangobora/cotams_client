/**
 * Lecturers API Client
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { Lecturer, LecturerFilters } from '@/types/lecturers';

export class LecturersApi {
  /**
   * Get lecturers with filters
   */
  async getLecturers(filters: LecturerFilters = {}): Promise<Lecturer[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: any[]; count: number }>(
        `${API_ENDPOINTS.accounts.lecturers}&${params.toString()}`
      );
      
      // Transform the backend response to our frontend format
      return response.data.results.map((lecturer: any) => ({
        id: lecturer.id,
        name: lecturer.user?.full_name || 
              `${lecturer.user?.first_name || ''} ${lecturer.user?.last_name || ''}`.trim() || 
              'Unknown',
        email: lecturer.user?.email || '',
        employee_id: lecturer.employee_id,
        phone: lecturer.phone,
        department: lecturer.department,
        specialization: Array.isArray(lecturer.specialization) 
          ? lecturer.specialization.join(', ') 
          : lecturer.specialization || '',
        qualification: lecturer.qualification,
        bio: lecturer.bio,
        office_location: lecturer.office_location,
        research_interests: lecturer.research_interests,
        is_active: lecturer.is_active,
        courses: lecturer.courses || [],
        schedule: lecturer.schedule || []
      }));
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Get lecturer by ID
   */
  async getLecturer(id: string): Promise<Lecturer> {
    try {
      const response = await axios.get<Lecturer>(
        API_ENDPOINTS.accounts.userDetail(id)
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const lecturersApi = new LecturersApi();