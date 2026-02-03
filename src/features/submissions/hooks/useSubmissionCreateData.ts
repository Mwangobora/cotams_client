import { useQuery } from '@tanstack/react-query';
import { LecturersApi } from '@/apis/LecturersApi';
import { ModulesApi } from '@/apis/ModulesApi';
import { DepartmentsApi } from '@/apis/DepartmentsApi';

interface SubmissionCreateDataOptions {
  isStaff: boolean;
  selectedDepartment: string;
}

export function useSubmissionCreateData({
  isStaff,
  selectedDepartment,
}: SubmissionCreateDataOptions) {
  const lecturersApi = new LecturersApi();
  const modulesApi = new ModulesApi();
  const departmentsApi = new DepartmentsApi();

  const { data: departmentsResponse, isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getDepartments({ is_active: true }),
    enabled: isStaff,
  });

  const { data: lecturersResponse, isLoading: loadingLecturers } = useQuery({
    queryKey: ['lecturers', selectedDepartment],
    queryFn: () =>
      selectedDepartment
        ? lecturersApi.getDepartmentLecturers(selectedDepartment)
        : Promise.resolve([]),
    enabled: isStaff,
  });

  const { data: modulesResponse, isLoading: loadingModules } = useQuery({
    queryKey: ['modules', selectedDepartment],
    queryFn: () =>
      modulesApi.getModules(selectedDepartment ? { department: selectedDepartment } : {}),
    enabled: isStaff,
  });

  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : departmentsResponse?.results || [];
  const lecturers = Array.isArray(lecturersResponse) ? lecturersResponse : [];
  const modules = Array.isArray(modulesResponse) ? modulesResponse : modulesResponse?.results || [];

  return {
    departments,
    lecturers,
    modules,
    loadingDepartments,
    loadingLecturers,
    loadingModules,
  };
}
