/**
 * Academic Submissions Feature (Staff/Admin)
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/auth.store';
import { SubmissionsApi } from '@/apis/SubmissionsApi';
import type { AcademicSubmission } from '@/types/submissions';
import { SubmissionDetailsDialog } from './components/SubmissionDetailsDialog';
import { SubmissionsTable } from './components/SubmissionsTable';
import { CreateSubmissionForm } from './components/CreateSubmissionForm';
import {
  useApproveSubmissionMutation,
  useRejectSubmissionMutation,
  useSubmitSubmissionMutation,
} from './mutations';

export function SubmissionsPage() {
  const { user } = useAuthStore();
  const roles = user?.roles?.map((role) => role.code) || [];
  const isAdmin = roles.includes('ADMIN');
  const isStaff = roles.includes('STAFF');

  const submissionsApi = new SubmissionsApi();

  const [selectedSubmission, setSelectedSubmission] = useState<AcademicSubmission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: submissionsResponse, isLoading } = useQuery({
    queryKey: ['submissions', isAdmin ? 'admin' : 'staff', page, pageSize],
    queryFn: () => submissionsApi.getSubmissions({ page, page_size: pageSize }),
    keepPreviousData: true,
  });

  const submissions = Array.isArray(submissionsResponse)
    ? submissionsResponse
    : submissionsResponse?.results || [];
  const totalSubmissions = Array.isArray(submissionsResponse)
    ? submissionsResponse.length
    : submissionsResponse?.count || 0;

  const closeDetails = () => setDetailsOpen(false);

  const submitMutation = useSubmitSubmissionMutation({ onSuccess: closeDetails });
  const approveMutation = useApproveSubmissionMutation({ onSuccess: closeDetails });
  const rejectMutation = useRejectSubmissionMutation({ onSuccess: closeDetails });

  const actionLoading =
    submitMutation.isPending || approveMutation.isPending || rejectMutation.isPending;

  const openDetails = (submission: AcademicSubmission) => {
    setSelectedSubmission(submission);
    setReviewNotes(submission.review_notes || '');
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Submissions</TabsTrigger>
          {isStaff && <TabsTrigger value="create">Create Submission</TabsTrigger>}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <SubmissionsTable
            submissions={submissions}
            isAdmin={isAdmin}
            isLoading={isLoading}
            onView={openDetails}
            page={page}
            pageSize={pageSize}
            total={totalSubmissions}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </TabsContent>

        {isStaff && (
          <TabsContent value="create" className="space-y-4">
            <CreateSubmissionForm isStaff={isStaff} />
          </TabsContent>
        )}
      </Tabs>

      <SubmissionDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        submission={selectedSubmission}
        isAdmin={isAdmin}
        isStaff={isStaff}
        reviewNotes={reviewNotes}
        onReviewNotesChange={setReviewNotes}
        onSubmit={() => selectedSubmission && submitMutation.mutate(selectedSubmission.id)}
        onApprove={() =>
          selectedSubmission &&
          approveMutation.mutate({ id: selectedSubmission.id, notes: reviewNotes })
        }
        onReject={() =>
          selectedSubmission &&
          rejectMutation.mutate({ id: selectedSubmission.id, notes: reviewNotes })
        }
        actionLoading={actionLoading}
      />
    </div>
  );
}
