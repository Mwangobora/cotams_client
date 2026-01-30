/**
 * Main Timetable Page - Role-based timetable viewing
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/layout-primitives';
import { useAuthStore } from '@/store/auth.store';
import { useSessionsQuery } from '../queries';
import { 
  TimetableGrid,
  TimetableDayView, 
  TimetableFilters,
  TimetableSkeleton,
  EmptyState 
} from './index';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Filter, RefreshCcw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TimetableFilters as FilterType, DayOfWeek, SessionsByDay } from '../types';

export function TimetablePage() {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<FilterType>({
    academic_year: new Date().getFullYear().toString(),
    semester: 'SEMESTER_1',
  });
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('MON');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get user role for role-based filtering
  const userRoles = user?.roles?.map((r: any) => r.code) || [];
  const isAdmin = userRoles.includes('ADMIN');
  const isLecturer = userRoles.includes('LECTURER');
  const isStudent = userRoles.includes('STUDENT');

  // Auto-set role-based filters
  const roleFilters: FilterType = {
    ...filters,
    ...(isLecturer ? { lecturer: user?.id?.toString() } : {}),
    ...(isStudent ? { student: user?.id } : {}),
  };

  const { data: sessions = [], isLoading, error, refetch } = useSessionsQuery(roleFilters);

  // Group sessions by day for grid view
  const sessionsByDay: SessionsByDay = sessions.reduce((acc, session) => {
    if (!acc[session.day_of_week]) {
      acc[session.day_of_week] = [];
    }
    acc[session.day_of_week].push(session);
    return acc;
  }, {} as SessionsByDay);

  if (isLoading) return <TimetableSkeleton />;

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Timetable</h1>
            <p className="text-muted-foreground">
              {isAdmin && 'Manage and view all timetables'}
              {isLecturer && 'Your teaching schedule'}
              {isStudent && 'Your class schedule'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCcw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              Refresh
            </Button>

            {/* Mobile filters trigger */}
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Timetable Filters</SheetTitle>
                  <SheetDescription>
                    Adjust the filters to customize your timetable view
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <TimetableFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    userRoles={userRoles}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'Failed to load timetable'}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {sessions.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Desktop: Weekly Grid */}
                <div className="hidden lg:block">
                  <TimetableGrid sessions={sessionsByDay} />
                </div>

                {/* Mobile: Day View */}
                <div className="lg:hidden">
                  <TimetableDayView
                    sessions={sessionsByDay}
                    selectedDay={selectedDay}
                    onDayChange={setSelectedDay}
                  />
                </div>
              </>
            )}
          </div>

          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80">
            <TimetableFilters
              filters={filters}
              onFiltersChange={setFilters}
              userRoles={userRoles}
            />
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}