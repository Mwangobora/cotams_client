import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { AcademicSubmission } from '@/types/submissions';
import { statusVariantMap } from '../utils';
import { SubmissionMetaGrid } from './SubmissionMetaGrid';
import { SubmissionModuleProposals } from './SubmissionModuleProposals';
import { SubmissionLecturerAssignments } from './SubmissionLecturerAssignments';

interface SubmissionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: AcademicSubmission | null;
  isAdmin: boolean;
  isStaff: boolean;
  reviewNotes: string;
  onReviewNotesChange: (value: string) => void;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: () => void;
  actionLoading: boolean;
}

export function SubmissionDetailsDialog({
  open,
  onOpenChange,
  submission,
  isAdmin,
  isStaff,
  reviewNotes,
  onReviewNotesChange,
  onSubmit,
  onApprove,
  onReject,
  actionLoading,
}: SubmissionDetailsDialogProps) {
  if (!submission) return null;

  const canSubmit = isStaff && submission.status === 'DRAFT';
  const canReview = isAdmin && submission.status === 'SUBMITTED';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {submission.title}
            <Badge variant={statusVariantMap[submission.status]}>
              {submission.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SubmissionMetaGrid submission={submission} />

          {submission.description && (
            <div className="text-sm">
              <div className="font-medium">Description</div>
              <div className="text-muted-foreground">{submission.description}</div>
            </div>
          )}

          <SubmissionModuleProposals items={submission.module_items} />
          <SubmissionLecturerAssignments items={submission.module_lecturer_items} />

          {canReview && (
            <div className="space-y-2">
              <Label>Review Notes (required for rejection)</Label>
              <Textarea
                value={reviewNotes}
                onChange={(event) => onReviewNotesChange(event.target.value)}
                placeholder="Add approval or rejection notes"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {canSubmit && (
            <Button onClick={onSubmit} disabled={actionLoading}>
              {actionLoading ? 'Submitting...' : 'Submit for Review'}
            </Button>
          )}
          {canReview && (
            <>
              <Button
                variant="destructive"
                onClick={onReject}
                disabled={actionLoading || reviewNotes.trim().length === 0}
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button onClick={onApprove} disabled={actionLoading}>
                {actionLoading ? 'Approving...' : 'Approve'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
