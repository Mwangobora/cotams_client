/**
 * Academic Submissions API Client
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type {
  AcademicSubmission,
  AcademicSubmissionCreatePayload,
  SubmissionFilters
} from '@/types/submissions';

export class SubmissionsApi {
  /**
   * Get submissions with optional filters
   */
  async getSubmissions(filters: SubmissionFilters = {}): Promise<{ results: AcademicSubmission[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: AcademicSubmission[]; count: number }>(
        `${API_ENDPOINTS.academics.submissions}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Create submission (staff)
   */
  async createSubmission(payload: AcademicSubmissionCreatePayload): Promise<AcademicSubmission> {
    try {
      const response = await axios.post<AcademicSubmission>(
        API_ENDPOINTS.academics.submissions,
        payload
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Submit draft for approval
   */
  async submitSubmission(id: string): Promise<{ message: string; submission: AcademicSubmission }> {
    try {
      const response = await axios.post<{ message: string; submission: AcademicSubmission }>(
        API_ENDPOINTS.academics.submissionSubmit(id)
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Approve submission (admin)
   */
  async approveSubmission(id: string, notes?: string): Promise<{ message: string; submission: AcademicSubmission }> {
    try {
      const response = await axios.post<{ message: string; submission: AcademicSubmission }>(
        API_ENDPOINTS.academics.submissionApprove(id),
        { notes: notes || '' }
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  /**
   * Reject submission (admin)
   */
  async rejectSubmission(id: string, notes: string): Promise<{ message: string; submission: AcademicSubmission }> {
    try {
      const response = await axios.post<{ message: string; submission: AcademicSubmission }>(
        API_ENDPOINTS.academics.submissionReject(id),
        { notes }
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const submissionsApi = new SubmissionsApi();
