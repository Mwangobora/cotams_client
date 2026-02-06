import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useAuthStore } from '@/store/auth.store';
import { CurriculumApi } from '@/apis/CurriculumApi';
import type { Curriculum, CurriculumFormData } from '@/types/curriculum';
import { CurriculumFormDialog } from './CurriculumFormDialog';
import { CurriculumFilters } from './CurriculumFilters';
import { getCurriculumColumns } from './curriculumColumns';
import { useCurriculumData } from './useCurriculumData';

export function CurriculumPage() {
  const { user } = useAuthStore();
  const departmentId = user?.staff_profile?.department;
  const queryClient = useQueryClient();
  const curriculumApi = new CurriculumApi();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Curriculum | null>(null);
  const {
    programs,
    programYears,
    modules,
    curriculum,
    totalCurriculum,
    isLoading,
    page,
    pageSize,
    selectedProgram,
    selectedYear,
    selectedSemester,
    moduleMap,
    yearMap,
    setPage,
    setPageSize,
    setSelectedProgram,
    setSelectedYear,
    setSelectedSemester,
  } = useCurriculumData(departmentId);

  const createMutation = useMutation({
    mutationFn: (data: CurriculumFormData) => curriculumApi.createCurriculum(data),
    onSuccess: () => {
      toast.success('Curriculum added');
      queryClient.invalidateQueries({ queryKey: ['curriculum'] });
      setDialogOpen(false);
    },
    onError: (error: any) => toast.error(error.message || 'Failed to add curriculum'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CurriculumFormData }) =>
      curriculumApi.updateCurriculum(id, data),
    onSuccess: () => {
      toast.success('Curriculum updated');
      queryClient.invalidateQueries({ queryKey: ['curriculum'] });
      setDialogOpen(false);
    },
    onError: (error: any) => toast.error(error.message || 'Failed to update curriculum'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => curriculumApi.deleteCurriculum(id),
    onSuccess: () => {
      toast.success('Curriculum deleted');
      queryClient.invalidateQueries({ queryKey: ['curriculum'] });
      setConfirmOpen(false);
    },
    onError: (error: any) => toast.error(error.message || 'Failed to delete curriculum'),
  });

  const columns = getCurriculumColumns(moduleMap, yearMap);

  return (
    <>
      <CurriculumFilters
        programs={programs}
        programYears={programYears}
        selectedProgram={selectedProgram}
        selectedYear={selectedYear}
        selectedSemester={selectedSemester}
        onProgramChange={setSelectedProgram}
        onYearChange={setSelectedYear}
        onSemesterChange={setSelectedSemester}
      />

      <DataTable
        title="Curriculum"
        columns={columns}
        data={curriculum}
        loading={isLoading}
        onAdd={() => setDialogOpen(true)}
        onEdit={(item) => {
          setSelected(item);
          setDialogOpen(true);
        }}
        onDelete={(item) => {
          setSelected(item);
          setConfirmOpen(true);
        }}
        actions
        editButtonText="Edit"
        deleteButtonText="Delete"
        emptyMessage="No curriculum found"
        pagination={{
          page,
          pageSize,
          total: totalCurriculum,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />

      <CurriculumFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
          setDialogOpen(open);
        }}
        onSubmit={(data) => {
          if (selected) updateMutation.mutate({ id: selected.id, data });
          else createMutation.mutate(data);
        }}
        loading={createMutation.isPending || updateMutation.isPending}
        programs={programs}
        programYears={programYears}
        modules={modules}
        initial={selected}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Curriculum"
        description="Delete this curriculum entry? This cannot be undone."
        confirmText="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => selected && deleteMutation.mutate(selected.id)}
      />
    </>
  );
}
