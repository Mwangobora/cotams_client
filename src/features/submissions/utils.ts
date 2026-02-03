import type { SubmissionStatus } from '@/types/submissions';

export const statusVariantMap: Record<
  SubmissionStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  DRAFT: 'secondary',
  SUBMITTED: 'default',
  APPROVED: 'outline',
  REJECTED: 'destructive',
};

export const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
};
