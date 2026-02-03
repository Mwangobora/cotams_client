import type { AcademicSubmission } from '@/types/submissions';
import { formatDate } from '../utils';

interface SubmissionMetaGridProps {
  submission: AcademicSubmission;
}

export function SubmissionMetaGrid({ submission }: SubmissionMetaGridProps) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div className="text-sm text-muted-foreground">
        Department: <span className="text-foreground">{submission.department_name || submission.department}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        Submitted By: <span className="text-foreground">{submission.submitted_by_name || '—'}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        Created: <span className="text-foreground">{formatDate(submission.created_at)}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        Submitted: <span className="text-foreground">{formatDate(submission.submitted_at)}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        Reviewed: <span className="text-foreground">{formatDate(submission.reviewed_at)}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        Reviewer: <span className="text-foreground">{submission.reviewed_by_name || '—'}</span>
      </div>
    </div>
  );
}
