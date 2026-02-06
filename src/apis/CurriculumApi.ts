import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { Curriculum, CurriculumFilters, CurriculumFormData } from '@/types/curriculum';

export class CurriculumApi {
  async getCurriculum(
    filters: CurriculumFilters = {}
  ): Promise<{ results: Curriculum[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      const response = await axios.get<{ results: Curriculum[]; count: number }>(
        `${API_ENDPOINTS.academics.curriculum}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async createCurriculum(data: CurriculumFormData): Promise<Curriculum> {
    try {
      const response = await axios.post<Curriculum>(API_ENDPOINTS.academics.curriculum, data);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async updateCurriculum(id: string, data: Partial<CurriculumFormData>): Promise<Curriculum> {
    try {
      const response = await axios.patch<Curriculum>(
        `${API_ENDPOINTS.academics.curriculum}${id}/`,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async deleteCurriculum(id: string): Promise<void> {
    try {
      await axios.delete(`${API_ENDPOINTS.academics.curriculum}${id}/`);
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const curriculumApi = new CurriculumApi();
