/**
 * React Query hooks for timetable with WebSocket integration
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { timetableApi } from '@/apis/TimetableApi';
import { getWebSocketClient } from '@/lib/ws';
import type { TimetableFilters } from './types';

export const TIMETABLE_QUERY_KEYS = {
  all: ['timetable'] as const,
  sessions: (filters: TimetableFilters) => ['timetable', 'sessions', filters] as const,
  session: (id: string) => ['timetable', 'session', id] as const,
  streams: () => ['timetable', 'streams'] as const,
  rooms: () => ['timetable', 'rooms'] as const,
  lecturers: () => ['timetable', 'lecturers'] as const,
};

/**
 * Hook to fetch sessions with filters and real-time updates
 */
export function useSessionsQuery(filters: TimetableFilters = {}) {
  const queryClient = useQueryClient();

  // Set up WebSocket listeners for real-time updates
  useEffect(() => {
    // Skip WebSocket connection for now to avoid connection errors
    // TODO: Enable when WebSocket endpoint is ready
    return;
    
    // Only connect WebSocket if user is authenticated
    if (!Cookies.get('access_token')) return;
    
    const wsClient = getWebSocketClient();

    const handleSessionUpdate = () => {
      queryClient.invalidateQueries({ 
        queryKey: TIMETABLE_QUERY_KEYS.all 
      });
    };

    wsClient.on('timetable_update', handleSessionUpdate);
    wsClient.on('session_created', handleSessionUpdate);
    wsClient.on('session_updated', handleSessionUpdate);
    wsClient.on('session_deleted', handleSessionUpdate);

    // Connect if not already connected
    wsClient.connect().catch(() => {
      // Silently handle connection failures - WebSocket is optional
      console.warn('WebSocket connection failed, continuing without real-time updates');
    });

    return () => {
      wsClient.off('timetable_update');
      wsClient.off('session_created');
      wsClient.off('session_updated');
      wsClient.off('session_deleted');
    };
  }, [queryClient]);

  return useQuery({
    queryKey: TIMETABLE_QUERY_KEYS.sessions(filters),
    queryFn: () => timetableApi.getSessions(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!Cookies.get('access_token'), // Only run when authenticated
  });
}

/**
 * Hook to fetch session details
 */
export function useSessionQuery(id: string) {
  return useQuery({
    queryKey: TIMETABLE_QUERY_KEYS.session(id),
    queryFn: () => timetableApi.getSession(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch streams for filters
 */
export function useStreamsQuery(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: TIMETABLE_QUERY_KEYS.streams(),
    queryFn: () => timetableApi.getStreams(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: options.enabled !== false && !!Cookies.get('access_token'),
  });
}

/**
 * Hook to fetch rooms for filters
 */
export function useRoomsQuery(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: TIMETABLE_QUERY_KEYS.rooms(),
    queryFn: () => timetableApi.getRooms(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: options.enabled !== false && !!Cookies.get('access_token'),
  });
}

/**
 * Hook to fetch lecturers for filters
 */
export function useLecturersQuery(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: TIMETABLE_QUERY_KEYS.lecturers(),
    queryFn: () => timetableApi.getLecturers(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: options.enabled !== false && !!Cookies.get('access_token'),
  });
}

/**
 * Hook to invalidate timetable queries (for WebSocket updates)
 */
export function useTimetableQueryClient() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: TIMETABLE_QUERY_KEYS.all });
  };

  const invalidateSessions = (filters?: TimetableFilters) => {
    if (filters) {
      queryClient.invalidateQueries({ queryKey: TIMETABLE_QUERY_KEYS.sessions(filters) });
    } else {
      queryClient.invalidateQueries({ queryKey: ['timetable', 'sessions'] });
    }
  };

  return { invalidateAll, invalidateSessions };
}