import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SubmissionModuleLecturerItem } from '@/types/submissions';

interface SubmissionLecturerAssignmentsProps {
  items: SubmissionModuleLecturerItem[];
}

const formatPrograms = (items?: Array<{ id: string; code: string; name: string }>) => {
  if (!items || items.length === 0) return '—';
  return items.map((program) => `${program.code} - ${program.name}`).join(', ');
};

export function SubmissionLecturerAssignments({
  items,
}: SubmissionLecturerAssignmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Lecturer Assignments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No lecturer assignments.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-md border p-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  Module: {item.proposed_module_code || item.proposed_module || '—'}{' '}
                  {item.proposed_module_name ? `- ${item.proposed_module_name}` : ''}
                </div>
                <Badge variant="outline">{item.action}</Badge>
              </div>
              <div className="text-muted-foreground">
                Lecturer: {item.proposed_lecturer_name || item.proposed_lecturer || '—'}
                {item.proposed_lecturer_department_name
                  ? ` (${item.proposed_lecturer_department_name})`
                  : ''}
              </div>
              <div className="text-muted-foreground">
                Department: {item.proposed_module_department_name || '—'}{' '}
                {item.proposed_module_department_code
                  ? `(${item.proposed_module_department_code})`
                  : ''}
              </div>
              <div className="text-muted-foreground">
                Programs: {formatPrograms(item.proposed_module_programs)}
              </div>
              <div className="text-muted-foreground">
                Academic Year: {item.proposed_academic_year || '—'} · Semester:{' '}
                {item.proposed_semester ?? '—'}
              </div>
              <div className="text-muted-foreground">
                Primary: {item.proposed_is_primary ? 'Yes' : 'No'}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
