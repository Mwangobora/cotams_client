/**
 * Timetable Filters Component - Role-based filtering
 */

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth.store';
import { useRoomsQuery, useLecturersQuery } from '../queries';
import { Filter, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { DepartmentsApi } from '@/apis/DepartmentsApi';
import { ProgramsApi } from '@/apis/ProgramsApi';
import { ProgramYearsApi } from '@/apis/ProgramYearsApi';
import { StreamsApi } from '@/apis/StreamsApi';
import type { Department } from '@/types/departments';
import type { Program, ProgramYear } from '@/types/programs';
import type { Stream } from '@/types/streams';
import type { TimetableFilters } from '../types';

interface TimetableFiltersProps {
  filters: TimetableFilters;
  onFiltersChange: (filters: TimetableFilters) => void;
  userRoles: string[];
}

export function TimetableFilters({ filters, onFiltersChange, userRoles }: TimetableFiltersProps) {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const isAdmin = userRoles.includes('ADMIN');
  const isLecturer = userRoles.includes('LECTURER');
  const isStudent = userRoles.includes('STUDENT');
  const showStreamSelectors = isLecturer || isStudent;

  const departmentsApi = new DepartmentsApi();
  const programsApi = new ProgramsApi();
  const programYearsApi = new ProgramYearsApi();
  const streamsApi = new StreamsApi();

  // Load saved selections from localStorage
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    () => localStorage.getItem('timetable_department') || '__all'
  );
  const [selectedProgram, setSelectedProgram] = useState<string>(
    () => localStorage.getItem('timetable_program') || '__all'
  );
  const [selectedProgramYear, setSelectedProgramYear] = useState<string>(
    () => localStorage.getItem('timetable_program_year') || '__all'
  );

  // Save selections to localStorage
  useEffect(() => {
    if (selectedProgram !== '__all') {
      localStorage.setItem('timetable_program', selectedProgram);
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedProgramYear !== '__all') {
      localStorage.setItem('timetable_program_year', selectedProgramYear);
    }
  }, [selectedProgramYear]);

  useEffect(() => {
    if (selectedDepartment !== '__all') {
      localStorage.setItem('timetable_department', selectedDepartment);
    }
  }, [selectedDepartment]);

  // Queries for dropdown options (only load when authenticated and needed)
  const { data: rooms = [], isLoading: loadingRooms } = useRoomsQuery({ enabled: isAuthenticated && isAdmin });
  const { data: lecturers = [], isLoading: loadingLecturers } = useLecturersQuery({ enabled: isAuthenticated && isAdmin });

  const updateFilter = (key: keyof TimetableFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' || value === 'all' || value === '__all' ? undefined : value,
    });
  };

  const resetFilters = () => {
    const year = new Date().getFullYear();
    setSelectedDepartment('__all');
    setSelectedProgram('__all');
    setSelectedProgramYear('__all');
    // Clear localStorage
    localStorage.removeItem('timetable_department');
    localStorage.removeItem('timetable_program');
    localStorage.removeItem('timetable_program_year');
    onFiltersChange({
      academic_year: `${year}/${year + 1}`,
      semester: 'SEMESTER_1',
    });
  };

  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 5 }, (_, i) => currentYear + i - 2).map(
    (year) => `${year}/${year + 1}`
  );

  const departmentFilter = selectedDepartment === '__all' ? '' : selectedDepartment;
  const programFilter = selectedProgram === '__all' ? '' : selectedProgram;
  const programYearFilter = selectedProgramYear === '__all' ? '' : selectedProgramYear;

  const { data: departmentsResponse } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getDepartments({ is_active: true }),
    enabled: isAuthenticated,
  });
  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : departmentsResponse?.results || [];

  const { data: programsResponse } = useQuery({
    queryKey: ['programs', departmentFilter],
    queryFn: () => programsApi.getPrograms(departmentFilter ? { department: departmentFilter } : undefined),
    enabled: isAuthenticated,
  });
  const programs = Array.isArray(programsResponse)
    ? programsResponse
    : programsResponse?.results || [];

  const { data: programYearsResponse } = useQuery({
    queryKey: ['program-years', programFilter],
    queryFn: () => programYearsApi.getProgramYears(programFilter ? { program: programFilter } : {}),
    enabled: isAuthenticated,
  });
  const programYears = Array.isArray(programYearsResponse)
    ? programYearsResponse
    : programYearsResponse?.results || [];

  const { data: streamsResponse } = useQuery({
    queryKey: ['streams', programYearFilter],
    queryFn: () =>
      streamsApi.getStreams(programYearFilter ? { program_year: programYearFilter } : {}),
    enabled: isAuthenticated,
  });
  const streams = Array.isArray(streamsResponse)
    ? streamsResponse
    : streamsResponse?.results || [];

  // Auto-select stream only if user explicitly selects a program year (not on initial load)
  // This prevents forcing a filter that might hide all sessions
  useEffect(() => {
    if (!showStreamSelectors) return;
    if (selectedProgramYear === '__all') return; // Don't auto-select if "All years" is selected
    if (!selectedProgramYear) return;
    if (filters.stream && filters.stream !== '__all') return; // Don't override existing selection
    if (streams.length > 0) {
      updateFilter('stream', streams[0].id);
    }
  }, [selectedProgramYear, streams]);

  const programYearLabelMap = useMemo(() => {
    return new Map(
      programYears.map((year: ProgramYear) => [
        year.id,
        `${year.program_code ? `${year.program_code} - ` : ''}Year ${year.year_number}`,
      ])
    );
  }, [programYears]);

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Academic Year - Always visible */}
        <div className="space-y-2">
          <Label>Academic Year</Label>
          <Select
            value={filters.academic_year || ''}
            onValueChange={(value) => updateFilter('academic_year', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semester - Always visible */}
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select value={filters.semester || ''} onValueChange={(value) => updateFilter('semester', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SEMESTER_1">Semester 1</SelectItem>
              <SelectItem value="SEMESTER_2">Semester 2</SelectItem>
              <SelectItem value="YEAR_LONG">Year Long</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stream selectors for lecturers/students */}
        {showStreamSelectors && (
          <>
            <div className="space-y-2">
              <Label>Program</Label>
              <Select
                value={selectedProgram}
                onValueChange={(value) => {
                  setSelectedProgram(value);
                  setSelectedProgramYear('__all');
                  updateFilter('stream', '__all');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All programs</SelectItem>
                  {programs.map((program: Program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.code} - {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Program Year</Label>
              <Select
                value={selectedProgramYear}
                onValueChange={(value) => {
                  setSelectedProgramYear(value);
                  updateFilter('stream', '__all');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All years</SelectItem>
                  {programYears.map((year: ProgramYear) => (
                    <SelectItem key={year.id} value={year.id}>
                      {programYearLabelMap.get(year.id) || `Year ${year.year_number}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stream</Label>
              <Select
                value={filters.stream || '__all'}
                onValueChange={(value) => updateFilter('stream', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All streams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All streams</SelectItem>
                  {streams.map((stream: Stream) => (
                    <SelectItem key={stream.id} value={stream.id}>
                      {stream.stream_code} - {stream.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Lecturer - Admin only */}
        {isAdmin && (
          <div className="space-y-2">
            <Label>Lecturer</Label>
            {loadingLecturers ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={filters.lecturer || ''} onValueChange={(value) => updateFilter('lecturer', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All lecturers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All lecturers</SelectItem>
                  {lecturers.map((lecturer) => (
                    <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                      {lecturer.user?.full_name || lecturer.employee_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Room - Admin only */}
        {isAdmin && (
          <div className="space-y-2">
            <Label>Room</Label>
            {loadingRooms ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={filters.room || ''} onValueChange={(value) => updateFilter('room', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All rooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All rooms</SelectItem>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.code} - {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Session Type */}
        <div className="space-y-2">
          <Label>Session Type</Label>
          <Select value={filters.session_type || ''} onValueChange={(value) => updateFilter('session_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="LECTURE">Lecture</SelectItem>
              <SelectItem value="LAB">Lab</SelectItem>
              <SelectItem value="TUTORIAL">Tutorial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
