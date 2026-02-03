import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SubmissionsApi } from '@/apis/SubmissionsApi';
import type { AcademicSubmissionCreatePayload } from '@/types/submissions';

const submissionsApi = new SubmissionsApi();

export function useCreateSubmissionMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AcademicSubmissionCreatePayload) =>
      submissionsApi.createSubmission(payload),
    onSuccess: () => {
      toast.success('Submission created');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create submission');
    },
  });
}

export function useSubmitSubmissionMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submissionsApi.submitSubmission(id),
    onSuccess: () => {
      toast.success('Submission submitted for review');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit submission');
    },
  });
}

export function useApproveSubmissionMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      submissionsApi.approveSubmission(id, notes),
    onSuccess: () => {
      toast.success('Submission approved');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve submission');
    },
  });
}

export function useRejectSubmissionMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      submissionsApi.rejectSubmission(id, notes),
    onSuccess: () => {
      toast.success('Submission rejected');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject submission');
    },
  });
}
