import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/services/api';
import { API_ENDPOINTS } from '@/config/endpoints';
import { ProgramsApi } from '@/apis/ProgramsApi';
import { ModulesApi } from '@/apis/ModulesApi';
import { LecturersApi } from '@/apis/LecturersApi';
import { ProgramYearsApi } from '@/apis/ProgramYearsApi';
import { StreamsApi } from '@/apis/StreamsApi';
import { SubmissionsApi } from '@/apis/SubmissionsApi';
import type { Program, ProgramYear } from '@/types/programs';
import type { Module } from '@/types/modules';
import type { Stream } from '@/types/streams';
import type { AcademicSubmission } from '@/types/submissions';
import { buildQuery, getCount, getDepartmentStreams, toArray } from './staffDashboardUtils';

export function useStaffDashboardData(departmentId: string | undefined) {
  const programsApi = new ProgramsApi();
  const modulesApi = new ModulesApi();
  const lecturersApi = new LecturersApi();
  const programYearsApi = new ProgramYearsApi();
  const streamsApi = new StreamsApi();
  const submissionsApi = new SubmissionsApi();

  const enabled = Boolean(departmentId);
  const listSize = 8;
  const pageSizeAll = 1000;

  const { data: programsResponse, isLoading: loadingPrograms } = useQuery({
    queryKey: ['staff-dashboard', 'programs', departmentId],
    queryFn: () =>
      programsApi.getPrograms({ department: departmentId, page: 1, page_size: pageSizeAll }),
    enabled,
    staleTime: 60_000,
  });

  const { data: modulesResponse, isLoading: loadingModules } = useQuery({
    queryKey: ['staff-dashboard', 'modules', departmentId],
    queryFn: () =>
      modulesApi.getModules({ department: departmentId, page: 1, page_size: listSize }),
    enabled,
    staleTime: 60_000,
  });

  const { data: lecturersResponse, isLoading: loadingLecturers } = useQuery({
    queryKey: ['staff-dashboard', 'lecturers', departmentId],
    queryFn: () =>
      lecturersApi.getLecturers({ department: departmentId, page: 1, page_size: 1 }),
    enabled,
    staleTime: 60_000,
  });

  const { data: programYearsResponse, isLoading: loadingYears } = useQuery({
    queryKey: ['staff-dashboard', 'program-years'],
    queryFn: () => programYearsApi.getProgramYears({ page: 1, page_size: pageSizeAll }),
    enabled,
    staleTime: 60_000,
  });

  const { data: streamsResponse, isLoading: loadingStreams } = useQuery({
    queryKey: ['staff-dashboard', 'streams'],
    queryFn: () => streamsApi.getStreams({ page: 1, page_size: pageSizeAll }),
    enabled,
    staleTime: 60_000,
  });

  const { data: studentsResponse, isLoading: loadingStudents } = useQuery({
    queryKey: ['staff-dashboard', 'students', departmentId],
    queryFn: async () => {
      const query = buildQuery({ department: departmentId, page: 1, page_size: 1 });
      const response = await axios.get(`${API_ENDPOINTS.accounts.students}${query}`);
      return response.data;
    },
    enabled,
    staleTime: 60_000,
  });

  const { data: submissionsResponse, isLoading: loadingSubmissions } = useQuery({
    queryKey: ['staff-dashboard', 'submissions', departmentId],
    queryFn: () =>
      submissionsApi.getSubmissions({
        department: departmentId,
        page: 1,
        page_size: 6,
        ordering: '-created_at',
      }),
    enabled,
    staleTime: 60_000,
  });

  const { data: auditResponse, isLoading: loadingAudit } = useQuery({
    queryKey: ['staff-dashboard', 'audit', departmentId],
    queryFn: async () => {
      const query = buildQuery({ page: 1, page_size: 6 });
      const response = await axios.get(`${API_ENDPOINTS.audit.logs}${query}`);
      return response.data;
    },
    enabled,
    staleTime: 60_000,
  });

  const programs = toArray<Program>(programsResponse);
  const modules = toArray<Module>(modulesResponse);
  const programYears = toArray<ProgramYear>(programYearsResponse);
  const streams = toArray<Stream>(streamsResponse);
  const submissions = toArray<AcademicSubmission>(submissionsResponse);

  const departmentStreams = useMemo(
    () => getDepartmentStreams(programs, programYears, streams),
    [programs, programYears, streams]
  );

  const totalPrograms = getCount(programsResponse);
  const totalModules = getCount(modulesResponse);
  const totalLecturers = getCount(lecturersResponse);
  const totalStudents = getCount(studentsResponse);

  const activityItems = useMemo(() => {
    const audit = toArray<any>(auditResponse);
    if (audit.length > 0) return audit;
    return submissions;
  }, [auditResponse, submissions]);

  return {
    loading:
      loadingPrograms ||
      loadingModules ||
      loadingLecturers ||
      loadingYears ||
      loadingStreams ||
      loadingStudents ||
      loadingSubmissions ||
      loadingAudit,
    programs,
    modules,
    departmentStreams,
    submissions,
    activityItems,
    counts: {
      programs: totalPrograms,
      modules: totalModules,
      streams: departmentStreams.length,
      lecturers: totalLecturers,
      students: totalStudents,
    },
  };
}
