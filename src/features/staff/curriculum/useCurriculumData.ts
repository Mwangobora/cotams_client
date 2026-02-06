import { useEffect, useMemo, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { CurriculumApi } from '@/apis/CurriculumApi';
import { ProgramsApi } from '@/apis/ProgramsApi';
import { ProgramYearsApi } from '@/apis/ProgramYearsApi';
import { ModulesApi } from '@/apis/ModulesApi';
import type { Curriculum } from '@/types/curriculum';
import type { ProgramYear } from '@/types/programs';
import type { Module } from '@/types/modules';

export function useCurriculumData(departmentId?: string) {
  const curriculumApi = new CurriculumApi();
  const programsApi = new ProgramsApi();
  const yearsApi = new ProgramYearsApi();
  const modulesApi = new ModulesApi();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const { data: programsResponse } = useQuery({
    queryKey: ['programs', departmentId],
    queryFn: () => programsApi.getPrograms({ department: departmentId, page: 1, page_size: 1000 }),
    enabled: Boolean(departmentId),
  });
  const programs = Array.isArray(programsResponse) ? programsResponse : programsResponse?.results || [];

  const { data: yearsResponse } = useQuery({
    queryKey: ['program-years', selectedProgram],
    queryFn: () =>
      yearsApi.getProgramYears(
        selectedProgram ? { program: selectedProgram, page: 1, page_size: 1000 } : { page: 1, page_size: 1000 }
      ),
  });
  const programYears = Array.isArray(yearsResponse) ? yearsResponse : yearsResponse?.results || [];

  const { data: modulesResponse } = useQuery({
    queryKey: ['modules', departmentId],
    queryFn: () => modulesApi.getModules({ department: departmentId, page: 1, page_size: 1000 }),
    enabled: Boolean(departmentId),
  });
  const modules = Array.isArray(modulesResponse) ? modulesResponse : modulesResponse?.results || [];

  const { data: curriculumResponse, isLoading } = useQuery({
    queryKey: ['curriculum', selectedYear, selectedSemester, page, pageSize],
    queryFn: () =>
      curriculumApi.getCurriculum({
        program_year: selectedYear || undefined,
        semester: selectedSemester ? Number(selectedSemester) : undefined,
        page,
        page_size: pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const curriculum: Curriculum[] = Array.isArray(curriculumResponse)
    ? curriculumResponse
    : curriculumResponse?.results || [];
  const totalCurriculum = Array.isArray(curriculumResponse) ? curriculumResponse.length : curriculumResponse?.count || 0;

  useEffect(() => {
    setSelectedYear('');
    setPage(1);
  }, [selectedProgram]);

  const moduleMap = useMemo(() => new Map(modules.map((m: Module) => [m.id, m])), [modules]);
  const yearMap = useMemo(
    () => new Map(programYears.map((y: ProgramYear) => [y.id, y])),
    [programYears]
  );

  return {
    programs,
    programYears,
    modules,
    curriculum,
    totalCurriculum,
    isLoading,
    page,
    pageSize,
    selectedProgram,
    selectedYear,
    selectedSemester,
    moduleMap,
    yearMap,
    setPage,
    setPageSize,
    setSelectedProgram,
    setSelectedYear,
    setSelectedSemester,
  };
}
