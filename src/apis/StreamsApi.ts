/**
 * Streams API Client
 */

import axios from '@/services/api';
import { normalizeAxiosError } from '@/features/auth/errors';
import { API_ENDPOINTS } from '@/config/endpoints';
import type { Stream } from '@/types/streams';

export interface StreamFormData {
  program_year: string;
  stream_code: string;
  name?: string;
  capacity?: number | null;
  is_active: boolean;
}

export interface StreamFilters {
  program_year?: string;
  is_active?: boolean;
}

export class StreamsApi {
  async getStreams(filters: StreamFilters = {}): Promise<{ results: Stream[]; count: number }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<{ results: Stream[]; count: number }>(
        `${API_ENDPOINTS.academics.streams}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async createStream(data: StreamFormData): Promise<Stream> {
    try {
      const response = await axios.post<Stream>(
        API_ENDPOINTS.academics.streams,
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }

  async updateStream(id: string, data: Partial<StreamFormData>): Promise<Stream> {
    try {
      const response = await axios.patch<Stream>(
        API_ENDPOINTS.academics.streamDetail(id),
        data
      );
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}

export const streamsApi = new StreamsApi();
