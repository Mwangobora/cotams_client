import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/api';
import { API_ENDPOINTS } from '@/config/endpoints';
import { DepartmentsApi } from '@/apis/DepartmentsApi';
import { LecturersApi } from '@/apis/LecturersApi';
import { ModulesApi } from '@/apis/ModulesApi';
import { RoomsApi } from '@/apis/RoomsApi';
import { SessionsApi } from '@/apis/SessionsApi';
import type { Department } from '@/types/departments';
import type { Lecturer } from '@/types/lecturers';
import type { Module } from '@/types/modules';
import type { Room } from '@/types/rooms';
import type { Session } from '@/types/sessions';

const DAY_CODES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

const toArray = <T,>(response: any): T[] =>
  Array.isArray(response) ? response : response?.results || [];

const timeToMinutes = (time: string) => {
  const parts = time.split(':').map(Number);
  const [hours = 0, minutes = 0] = parts;
  return hours * 60 + minutes;
};

export function useAdminDashboardData() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const departmentsApi = new DepartmentsApi();
  const lecturersApi = new LecturersApi();
  const modulesApi = new ModulesApi();
  const roomsApi = new RoomsApi();
  const sessionsApi = new SessionsApi();

  const { data: departmentsResponse, isLoading: loadingDepartments } = useQuery({
    queryKey: ['admin-dashboard', 'departments'],
    queryFn: () => departmentsApi.getDepartments(),
  });

  const { data: lecturersResponse, isLoading: loadingLecturers } = useQuery({
    queryKey: ['admin-dashboard', 'lecturers'],
    queryFn: () => lecturersApi.getLecturers(),
  });

  const { data: modulesResponse, isLoading: loadingModules } = useQuery({
    queryKey: ['admin-dashboard', 'modules'],
    queryFn: () => modulesApi.getModules(),
  });

  const { data: roomsResponse, isLoading: loadingRooms } = useQuery({
    queryKey: ['admin-dashboard', 'rooms'],
    queryFn: () => roomsApi.getRooms(),
  });

  const { data: sessionsResponse, isLoading: loadingSessions } = useQuery({
    queryKey: ['admin-dashboard', 'sessions'],
    queryFn: () => sessionsApi.getSessions(),
  });

  const { data: usersResponse, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-dashboard', 'users'],
    queryFn: async () => (await axios.get(API_ENDPOINTS.accounts.users)).data,
  });

  const departments = toArray<Department>(departmentsResponse);
  const lecturers = toArray<Lecturer>(lecturersResponse);
  const modules = toArray<Module>(modulesResponse);
  const rooms = toArray<Room>(roomsResponse);
  const sessions = toArray<Session>(sessionsResponse);

  const totalUsers = useMemo(() => {
    if (!usersResponse) return 0;
    if (typeof usersResponse.count === 'number') return usersResponse.count;
    if (Array.isArray(usersResponse)) return usersResponse.length;
    return usersResponse.results?.length || 0;
  }, [usersResponse]);

  const departmentStats = useMemo(() => {
    return departments.map((dept) => {
      const lecturersCount = lecturers.filter((l) => l.department === dept.id).length;
      const coursesCount = modules.filter((m) => m.department === dept.id).length;
      return {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        lecturersCount,
        coursesCount,
      };
    });
  }, [departments, lecturers, modules]);

  const todayCode = DAY_CODES[now.getDay()];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const activeSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (session.day_of_week !== todayCode) return false;
      const start = timeToMinutes(session.start_time);
      const end = timeToMinutes(session.end_time);
      return nowMinutes >= start && nowMinutes <= end;
    });
  }, [sessions, todayCode, nowMinutes]);

  const usedRoomIds = useMemo(() => new Set(activeSessions.map((s) => s.room)), [activeSessions]);
  const usedRooms = rooms.filter((room) => usedRoomIds.has(room.id));
  const freeRooms = rooms.filter((room) => !usedRoomIds.has(room.id));

  const todaySessions = useMemo(() => {
    return sessions
      .filter((session) => session.day_of_week === todayCode)
      .sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));
  }, [sessions, todayCode]);

  return {
    loading: loadingDepartments || loadingLecturers || loadingModules || loadingRooms || loadingSessions || loadingUsers,
    totalUsers,
    totals: {
      departments: departments.length,
      lecturers: lecturers.length,
      courses: modules.length,
      sessions: sessions.length,
      rooms: rooms.length,
    },
    departmentStats,
    roomsUsage: {
      used: usedRooms,
      free: freeRooms,
    },
    todaySessions,
    now,
  };
}
