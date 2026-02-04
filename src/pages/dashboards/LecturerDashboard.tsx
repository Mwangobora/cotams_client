/**
 * Lecturer Dashboard Page
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { PageContainer } from '@/components/layout/layout-primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Calendar, Clock, Users, AlertCircle } from 'lucide-react';
import { TimetableGrid } from '@/features/timetable/components/TimetableGrid';
import { timetableApi } from '@/apis/TimetableApi';
import type { SessionsByDay, DayOfWeek } from '@/features/timetable/types';

export function LecturerDashboard() {
  const { user } = useAuthStore();
  const currentYear = new Date().getFullYear();
  
  const [academicYear, setAcademicYear] = useState<string>(
    () => localStorage.getItem('lecturer_academic_year') || `${currentYear}/${currentYear + 1}`
  );
  const [semester, setSemester] = useState<string>(
    () => localStorage.getItem('lecturer_semester') || 'SEMESTER_1'
  );

  useEffect(() => {
    localStorage.setItem('lecturer_academic_year', academicYear);
  }, [academicYear]);

  useEffect(() => {
    localStorage.setItem('lecturer_semester', semester);
  }, [semester]);

  const academicYears = Array.from({ length: 5 }, (_, i) => currentYear + i - 2).map(
    (year) => `${year}/${year + 1}`
  );

  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['lecturer-timetable', academicYear, semester],
    queryFn: async () => {
      const result = await timetableApi.getSessions({ academic_year: academicYear, semester });
      console.log('Lecturer sessions:', result);
      return result;
    },
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

  // Calculate unique modules
  const uniqueModules = new Set(sessions.map(s => s.module));
  const uniqueStreams = new Set(sessions.map(s => s.stream));

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
          <p className="text-muted-foreground">
            Your teaching schedule - {user?.lecturer_profile?.employee_id || user?.email}
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academic Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEMESTER_1">Semester 1</SelectItem>
                    <SelectItem value="SEMESTER_2">Semester 2</SelectItem>
                    <SelectItem value="YEAR_LONG">Year Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load sessions. Please try again.</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Modules</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{uniqueModules.size}</div>
                  <p className="text-xs text-muted-foreground">Teaching this semester</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                  <p className="text-xs text-muted-foreground">Per week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todaySessions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {todaySessions.length > 0 
                      ? `Next at ${todaySessions[0].start_time}` 
                      : 'No classes today'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Streams</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{uniqueStreams.size}</div>
                  <p className="text-xs text-muted-foreground">Teaching groups</p>
                </CardContent>
              </Card>
            </div>

            {/* Timetable */}
            <Card>
              <CardHeader>
                <CardTitle>
                  My Teaching Schedule - {semester === 'SEMESTER_1' ? 'Semester 1' : semester === 'SEMESTER_2' ? 'Semester 2' : 'Year Long'} {academicYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No teaching sessions assigned for this semester.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <TimetableGrid sessions={sessionsByDay} />
                )}
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            {todaySessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule ({today})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todaySessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold">{session.module_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {session.stream_name} • {session.room_code}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{session.display_time}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {session.session_type_display || session.session_type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
