/**
 * Timetable Filters Component - Role-based filtering
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth.store';
import { useStreamsQuery, useRoomsQuery, useLecturersQuery } from '../queries';
import { Filter, RotateCcw } from 'lucide-react';
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

  // Queries for dropdown options (only load when authenticated and needed)
  const { data: streams = [], isLoading: loadingStreams } = useStreamsQuery({ enabled: isAuthenticated && isAdmin });
  const { data: rooms = [], isLoading: loadingRooms } = useRoomsQuery({ enabled: isAuthenticated && isAdmin });
  const { data: lecturers = [], isLoading: loadingLecturers } = useLecturersQuery({ enabled: isAuthenticated && isAdmin });

  const updateFilter = (key: keyof TimetableFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' || value === 'all' ? undefined : value,
    });
  };

  const resetFilters = () => {
    const currentYear = new Date().getFullYear().toString();
    onFiltersChange({
      academic_year: currentYear,
      semester: 'SEMESTER_1',
    });
  };

  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 5 }, (_, i) => `${currentYear + i - 2}`);

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
          <Select value={filters.academic_year || ''} onValueChange={(value) => updateFilter('academic_year', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}/{parseInt(year) + 1}
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

        {/* Stream - Admin only */}
        {isAdmin && (
          <div className="space-y-2">
            <Label>Stream</Label>
            {loadingStreams ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={filters.stream || ''} onValueChange={(value) => updateFilter('stream', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All streams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All streams</SelectItem>
                  {streams.map((stream) => (
                    <SelectItem key={stream.id} value={stream.id.toString()}>
                      {stream.stream_code} - {stream.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
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