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
  async getLecturers(
    filters: LecturerFilters = {}
  ): Promise<{ results: Lecturer[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const query = params.toString();
      const response = await axios.get<{ results: any[]; count: number }>(
        `${API_ENDPOINTS.accounts.lecturers}${query ? `&${query}` : ''}`
      );
      
      // Transform the backend response to our frontend format
      const results = response.data.results.map((lecturer: any) => ({
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
      return { results, count: response.data.count };
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Get lecturers by department
   */
  async getDepartmentLecturers(departmentId: string): Promise<Lecturer[]> {
    try {
      const response = await axios.get<any[]>(
        API_ENDPOINTS.institutions.departmentLecturers(departmentId)
      );
      return response.data.map((lecturer: any) => ({
        id: lecturer.id,
        name: lecturer.user_full_name || lecturer.employee_id || 'Unknown',
        email: lecturer.user_email || '',
        employee_id: lecturer.employee_id,
        phone: lecturer.phone_number,
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
   * Create lecturer (staff/admin)
   */
  async createLecturer(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    employee_id: string;
    department: string;
    title?: string;
    specialization?: string;
    office_location?: string;
    phone_number?: string;
  }): Promise<any> {
    try {
      const response = await axios.post(
        API_ENDPOINTS.accounts.adminUsers,
        {
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          role_codes: ['LECTURER'],
          profile_type: 'lecturer',
          profile_data: {
            employee_id: data.employee_id,
            department: data.department,
            title: data.title || '',
            specialization: data.specialization || '',
            office_location: data.office_location || '',
            phone_number: data.phone_number || '',
          },
        }
      );
      return response.data;
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
