import { useMemo } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import type { AcademicSubmission } from '@/types/submissions';
import { formatDate, statusVariantMap } from '../utils';

interface SubmissionsTableProps {
  submissions: AcademicSubmission[];
  isAdmin: boolean;
  isLoading: boolean;
  onView: (submission: AcademicSubmission) => void;
}

export function SubmissionsTable({
  submissions,
  isAdmin,
  isLoading,
  onView,
}: SubmissionsTableProps) {
  const columns = useMemo(
    () => [
      { header: 'Title', accessor: 'title' as keyof AcademicSubmission },
      {
        header: 'Department',
        accessor: (submission: AcademicSubmission) =>
          submission.department_name || submission.department,
      },
      ...(isAdmin
        ? [
            {
              header: 'Submitted By',
              accessor: (submission: AcademicSubmission) =>
                submission.submitted_by_name || '—',
            },
          ]
        : []),
      {
        header: 'Status',
        accessor: (submission: AcademicSubmission) => (
          <Badge variant={statusVariantMap[submission.status]}>
            {submission.status}
          </Badge>
        ),
      },
      {
        header: 'Created',
        accessor: (submission: AcademicSubmission) => formatDate(submission.created_at),
      },
      {
        header: 'Submitted',
        accessor: (submission: AcademicSubmission) => formatDate(submission.submitted_at),
      },
    ],
    [isAdmin]
  );

  return (
    <DataTable
      title={isAdmin ? 'All Submissions' : 'My Submissions'}
      columns={columns}
      data={submissions}
      loading={isLoading}
      onEdit={onView}
      editButtonText="View"
      actions
      emptyMessage="No submissions found"
    />
  );
}
