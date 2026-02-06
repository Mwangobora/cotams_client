/**
 * Sessions Management Feature
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SessionsApi } from '@/apis/SessionsApi';
import type { Session } from '@/types/sessions';
import { SessionFormDialog } from './SessionFormDialog/SessionFormDialog';

export function SessionsPage() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
  const api = new SessionsApi();

  const { data: sessionsResponse, isLoading } = useQuery({
    queryKey: ['sessions', page, pageSize],
    queryFn: () => api.getSessions({ page, page_size: pageSize }),
    placeholderData: keepPreviousData,
  });

  const sessions = Array.isArray(sessionsResponse) ? sessionsResponse : sessionsResponse?.results || [];
  const totalSessions = Array.isArray(sessionsResponse) ? sessionsResponse.length : sessionsResponse?.count || 0;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteSession(id),
    onSuccess: () => {
      toast.success('Session deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (error: any) => {
      toast.error(`Error deleting session: ${error.message}`);
    }
  });

  const columns = [
    {
      header: 'Course',
      accessor: (session: Session) => session.module_name || session.module_code
    },
    {
      header: 'Room',
      accessor: (session: Session) => session.room_name
    },
    {
      header: 'Day & Time',
      accessor: (session: Session) => 
        `${session.day_display || session.day_of_week} ${session.display_time || `${session.start_time}-${session.end_time}`}`
    },
    {
      header: 'Duration',
      accessor: (session: Session) => `${session.duration_hours}h`
    },
    {
      header: 'Type',
      accessor: (session: Session) => (
        <Badge variant="outline">{session.session_type}</Badge>
      )
    },
    {
      header: 'Lecturer',
      accessor: (session: Session) => session.lecturer_name || 'Not assigned'
    }
  ];

  const handleAdd = () => {
    setSelectedSession(null);
    setIsFormOpen(true);
  };

  const handleEdit = (session: Session) => {
    setSelectedSession(session);
    setIsFormOpen(true);
  };

  const handleDelete = (session: Session) => {
    setSelectedSession(session);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSession) {
      deleteMutation.mutate(selectedSession.id);
    }
  };

  return (
    <>
      <DataTable
        title="Sessions Management"
        columns={columns}
        data={sessions}
        loading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonText="Add Session"
        emptyMessage="No sessions found"
        pagination={{
          page,
          pageSize,
          total: totalSessions,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />

      <SessionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        session={selectedSession}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Session"
        description="Are you sure you want to delete this session? This action cannot be undone."
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
        confirmText="Delete"
      />
    </>
  );
}
