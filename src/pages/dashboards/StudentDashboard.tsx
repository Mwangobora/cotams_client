/**
 * Student Dashboard Page
 */

import { PageContainer } from '@/components/layout/layout-primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export function StudentDashboard() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">
            View your timetable and academic schedule
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Modules</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">Placeholder data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
