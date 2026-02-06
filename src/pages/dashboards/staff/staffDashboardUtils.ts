import type { Program, ProgramYear } from '@/types/programs';
import type { Stream } from '@/types/streams';

export const toArray = <T,>(response: any): T[] =>
  Array.isArray(response) ? response : response?.results || [];

export const getCount = (response: any) =>
  Array.isArray(response) ? response.length : response?.count || 0;

export const buildQuery = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const getDepartmentStreams = (
  programs: Program[],
  programYears: ProgramYear[],
  streams: Stream[]
) => {
  const programIds = new Set(programs.map((p) => p.id));
  const departmentYears = programYears.filter(
    (year) => year.program && programIds.has(year.program)
  );
  const programYearIds = new Set(departmentYears.map((year) => year.id));
  return streams.filter((stream) => programYearIds.has(stream.program_year));
};
