import { useQuery } from '@tanstack/react-query';
import { RoomsApi } from '@/apis/RoomsApi';
import { ModuleLecturersApi } from '@/apis/ModuleLecturersApi';
import { SubmissionsApi } from '@/apis/SubmissionsApi';
import { ModulesApi } from '@/apis/ModulesApi';
import { LecturersApi } from '@/apis/LecturersApi';
import { ProgramsApi } from '@/apis/ProgramsApi';
import { ProgramYearsApi } from '@/apis/ProgramYearsApi';
import { StreamsApi } from '@/apis/StreamsApi';

interface UseSessionOptionsParams {
  open: boolean;
  selectedProgram: string;
  selectedProgramYear: string;
}

export function useSessionOptions({
  open,
  selectedProgram,
  selectedProgramYear,
}: UseSessionOptionsParams) {
  const pageSizeAll = 1000;
  const roomsApi = new RoomsApi();
  const moduleLecturersApi = new ModuleLecturersApi();
  const submissionsApi = new SubmissionsApi();
  const modulesApi = new ModulesApi();
  const lecturersApi = new LecturersApi();
  const programsApi = new ProgramsApi();
  const programYearsApi = new ProgramYearsApi();
  const streamsApi = new StreamsApi();

  const { data: roomsResponse } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsApi.getRooms({ page: 1, page_size: pageSizeAll }),
    enabled: open,
  });
  const rooms = Array.isArray(roomsResponse) ? roomsResponse : roomsResponse?.results || [];

  const { data: programsResponse } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programsApi.getPrograms({ page: 1, page_size: pageSizeAll }),
    enabled: open,
  });
  const programs = Array.isArray(programsResponse)
    ? programsResponse
    : programsResponse?.results || [];

  const { data: programYearsResponse } = useQuery({
    queryKey: ['program-years', selectedProgram],
    queryFn: () =>
      programYearsApi.getProgramYears(
        selectedProgram
          ? { program: selectedProgram, page: 1, page_size: pageSizeAll }
          : { page: 1, page_size: pageSizeAll }
      ),
    enabled: open,
  });
  const programYears = Array.isArray(programYearsResponse)
    ? programYearsResponse
    : programYearsResponse?.results || [];

  const { data: streamsResponse } = useQuery({
    queryKey: ['streams', selectedProgramYear],
    queryFn: () =>
      streamsApi.getStreams(
        selectedProgramYear
          ? { program_year: selectedProgramYear, page: 1, page_size: pageSizeAll }
          : { page: 1, page_size: pageSizeAll }
      ),
    enabled: open,
  });
  const streams = Array.isArray(streamsResponse)
    ? streamsResponse
    : streamsResponse?.results || [];

  const { data: assignmentsResponse } = useQuery({
    queryKey: ['module-lecturers'],
    queryFn: () => moduleLecturersApi.getAssignments({ page: 1, page_size: pageSizeAll }),
    enabled: open,
  });
  const assignments = Array.isArray(assignmentsResponse)
    ? assignmentsResponse
    : assignmentsResponse?.results || [];

  const { data: submissionsResponse } = useQuery({
    queryKey: ['submissions', 'submitted'],
    queryFn: () =>
      submissionsApi.getSubmissions({ status: 'SUBMITTED', page: 1, page_size: pageSizeAll }),
    enabled: open,
  });
  const submissions = Array.isArray(submissionsResponse)
    ? submissionsResponse
    : submissionsResponse?.results || [];

  const { data: modulesResponse } = useQuery({
    queryKey: ['modules'],
    queryFn: () => modulesApi.getModules({ page: 1, page_size: pageSizeAll }),
    enabled: open,
  });
  const modules = Array.isArray(modulesResponse) ? modulesResponse : modulesResponse?.results || [];

  const { data: lecturersResponse } = useQuery({
    queryKey: ['lecturers'],
    queryFn: () => lecturersApi.getLecturers({ page: 1, page_size: pageSizeAll }),
    enabled: open,
  });
  const lecturers = Array.isArray(lecturersResponse)
    ? lecturersResponse
    : lecturersResponse?.results || [];

  return {
    rooms,
    programs,
    programYears,
    streams,
    assignments,
    submissions,
    modules,
    lecturers,
  };
}
