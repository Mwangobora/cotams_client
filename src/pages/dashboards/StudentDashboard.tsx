/**
 * Student Dashboard Page
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { PageContainer } from '@/components/layout/layout-primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Calendar, Clock, AlertCircle, BookOpen } from 'lucide-react';
import { TimetableGrid } from '@/features/timetable/components/TimetableGrid';
import { timetableApi } from '@/apis/TimetableApi';
import { ProgramsApi } from '@/apis/ProgramsApi';
import { ProgramYearsApi } from '@/apis/ProgramYearsApi';
import { StreamsApi } from '@/apis/StreamsApi';
import type { SessionsByDay, DayOfWeek } from '@/features/timetable/types';

export function StudentDashboard() {
  const { user } = useAuthStore();
  const currentYear = new Date().getFullYear();
  
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedProgramYear, setSelectedProgramYear] = useState<string>('');
  const [selectedStream, setSelectedStream] = useState<string>('');
  const [academicYear, setAcademicYear] = useState(`${currentYear}/${currentYear + 1}`);
  const [semester] = useState('SEMESTER_1');

  const academicYears = Array.from({ length: 5 }, (_, i) => currentYear + i - 2).map(
    (year) => `${year}/${year + 1}`
  );

  const programsApi = new ProgramsApi();
  const programYearsApi = new ProgramYearsApi();
  const streamsApi = new StreamsApi();

  // Fetch programs
  const { data: programsResponse } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programsApi.getPrograms(),
  });
  const programs = Array.isArray(programsResponse) ? programsResponse : programsResponse?.results || [];

  // Fetch program years based on selected program
  const { data: programYearsResponse } = useQuery({
    queryKey: ['program-years', selectedProgram],
    queryFn: () => programYearsApi.getProgramYears(selectedProgram ? { program: selectedProgram } : {}),
    enabled: !!selectedProgram,
  });
  const programYears = Array.isArray(programYearsResponse) ? programYearsResponse : programYearsResponse?.results || [];

  // Fetch streams based on selected program year
  const { data: streamsResponse } = useQuery({
    queryKey: ['streams', selectedProgramYear],
    queryFn: () => streamsApi.getStreams(selectedProgramYear ? { program_year: selectedProgramYear } : {}),
    enabled: !!selectedProgramYear,
  });
  const streams = Array.isArray(streamsResponse) ? streamsResponse : streamsResponse?.results || [];

  // Fetch sessions when stream is selected
  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['student-timetable', selectedStream, academicYear, semester],
    queryFn: async () => {
      console.log('Fetching student sessions with:', { stream: selectedStream, academic_year: academicYear, semester });
      const result = await timetableApi.getSessions({ stream: selectedStream, academic_year: academicYear, semester });
      console.log('Student sessions received:', result);
      return result;
    },
    enabled: !!selectedStream,
  });

  // Group sessions by day
  const sessionsByDay: SessionsByDay = sessions.reduce((acc, session) => {
    if (!acc[session.day_of_week]) {
      acc[session.day_of_week] = [];
    }
    acc[session.day_of_week].push(session);
    return acc;
  }, {} as SessionsByDay);

  // Get today's sessions
  const today = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()] as DayOfWeek;
  const todaySessions = sessionsByDay[today] || [];

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">
            View your timetable and academic schedule
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Your Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Program</Label>
                <Select value={selectedProgram} onValueChange={(value) => {
                  setSelectedProgram(value);
                  setSelectedProgramYear('');
                  setSelectedStream('');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program: any) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.code} - {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year of Study</Label>
                <Select 
                  value={selectedProgramYear} 
                  onValueChange={(value) => {
                    setSelectedProgramYear(value);
                    setSelectedStream('');
                  }}
                  disabled={!selectedProgram}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {programYears.map((year: any) => (
                      <SelectItem key={year.id} value={year.id}>
                        Year {year.year_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Stream</Label>
                <Select 
                  value={selectedStream} 
                  onValueChange={setSelectedStream}
                  disabled={!selectedProgramYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    {streams.map((stream: any) => (
                      <SelectItem key={stream.id} value={stream.id}>
                        {stream.stream_code} - {stream.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select
                  value={academicYear}
                  onValueChange={setAcademicYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
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
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {selectedStream && !isLoading && !error && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sessions.length}</div>
                <p className="text-xs text-muted-foreground">This {semester === 'SEMESTER_1' ? 'Semester 1' : 'Semester 2'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todaySessions.length}</div>
                <p className="text-xs text-muted-foreground">{today}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Class</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {todaySessions.length > 0 ? todaySessions[0].start_time : '—'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {todaySessions.length > 0 ? todaySessions[0].module_name : 'No classes today'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modules</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(sessions.map(s => s.module)).size}
                </div>
                <p className="text-xs text-muted-foreground">Enrolled courses</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Timetable */}
        {!selectedStream ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select your program, year of study, and stream to view your timetable.
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load timetable. Please try again.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        ) : sessions.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No sessions found for the selected stream and semester.
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>My Timetable - {semester === 'SEMESTER_1' ? 'Semester 1' : semester === 'SEMESTER_2' ? 'Semester 2' : 'Year Long'} {academicYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <TimetableGrid sessions={sessionsByDay} />
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
