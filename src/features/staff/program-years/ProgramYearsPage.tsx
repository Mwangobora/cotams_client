/**
 * Program Years Management Feature (Staff)
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProgramsApi } from '@/apis/ProgramsApi';
import { ProgramYearsApi } from '@/apis/ProgramYearsApi';
import type { ProgramYearFormData } from '@/apis/ProgramYearsApi';
import type { Program, ProgramYear } from '@/types/programs';

interface ProgramYearFormState {
  program: string;
  year_number: number;
  name: string;
  is_active: boolean;
}

export function ProgramYearsPage() {
  const queryClient = useQueryClient();
  const programsApi = new ProgramsApi();
  const programYearsApi = new ProgramYearsApi();

  const [selected, setSelected] = useState<ProgramYear | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [selectedProgram]);
  const [formData, setFormData] = useState<ProgramYearFormState>({
    program: '',
    year_number: 1,
    name: '',
    is_active: true,
  });

  const { data: programsResponse } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programsApi.getPrograms(),
  });
  const programs = Array.isArray(programsResponse)
    ? programsResponse
    : programsResponse?.results || [];

  const selectedProgramFilter = selectedProgram === '__all' ? '' : selectedProgram;
  const { data: yearsResponse, isLoading } = useQuery({
    queryKey: ['program-years', selectedProgramFilter, page, pageSize],
    queryFn: () =>
      programYearsApi.getProgramYears(
        selectedProgramFilter
          ? { program: selectedProgramFilter, page, page_size: pageSize }
          : { page, page_size: pageSize }
      ),
    keepPreviousData: true,
  });
  const programYears = Array.isArray(yearsResponse)
    ? yearsResponse
    : yearsResponse?.results || [];
  const totalProgramYears = Array.isArray(yearsResponse)
    ? yearsResponse.length
    : yearsResponse?.count || 0;

  const createMutation = useMutation({
    mutationFn: (data: ProgramYearFormData) => programYearsApi.createProgramYear(data),
    onSuccess: () => {
      toast.success('Program year created');
      queryClient.invalidateQueries({ queryKey: ['program-years'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create program year');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProgramYearFormData }) =>
      programYearsApi.updateProgramYear(id, data),
    onSuccess: () => {
      toast.success('Program year updated');
      queryClient.invalidateQueries({ queryKey: ['program-years'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update program year');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => programYearsApi.deleteProgramYear(id),
    onSuccess: () => {
      toast.success('Program year deleted');
      queryClient.invalidateQueries({ queryKey: ['program-years'] });
      setDeleteOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete program year');
    },
  });

  const columns = useMemo(
    () => [
      {
        header: 'Program',
        accessor: (year: ProgramYear) => year.program_code || year.program_name || year.program || '—',
      },
      { header: 'Year', accessor: (year: ProgramYear) => year.year_number },
      { header: 'Name', accessor: (year: ProgramYear) => year.name || '—' },
      {
        header: 'Status',
        accessor: (year: ProgramYear) => (
          <Badge variant={year.is_active ? 'default' : 'secondary'}>
            {year.is_active ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ],
    []
  );

  const openCreate = () => {
    setSelected(null);
    setFormData({
      program: selectedProgram,
      year_number: 1,
      name: '',
      is_active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (year: ProgramYear) => {
    setSelected(year);
    setFormData({
      program: year.program || '',
      year_number: year.year_number,
      name: year.name || '',
      is_active: year.is_active,
    });
    setDialogOpen(true);
  };

  const openDelete = (year: ProgramYear) => {
    setSelected(year);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.program) {
      toast.error('Program is required.');
      return;
    }
    if (!formData.year_number || formData.year_number < 1) {
      toast.error('Year number must be at least 1.');
      return;
    }

    const payload: ProgramYearFormData = {
      program: formData.program,
      year_number: formData.year_number,
      name: formData.name.trim() || undefined,
      is_active: formData.is_active,
    };

    if (selected) {
      updateMutation.mutate({ id: selected.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Label>Filter by Program</Label>
        <Select value={selectedProgram} onValueChange={setSelectedProgram}>
          <SelectTrigger>
            <SelectValue placeholder="All programs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All programs</SelectItem>
            {programs.map((program: Program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.code} - {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        title="Program Years"
        columns={columns}
        data={programYears}
        loading={isLoading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={openDelete}
        actions
        editButtonText="Edit"
        deleteButtonText="Delete"
        emptyMessage="No program years found"
        pagination={{
          page,
          pageSize,
          total: totalProgramYears,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Program Year' : 'Create Program Year'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Program</Label>
              <Select
                value={formData.program}
                onValueChange={(value) => setFormData({ ...formData, program: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program: Program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.code} - {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Year Number</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.year_number}
                  onChange={(event) =>
                    setFormData({ ...formData, year_number: Number(event.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Name (optional)</Label>
                <Input
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="First Year"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: Boolean(checked) })
                }
              />
              <Label>Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : selected
                  ? 'Update Program Year'
                  : 'Create Program Year'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Program Year"
        description={`Delete ${selected?.name || `Year ${selected?.year_number || ''}` || 'this year'}? This cannot be undone.`}
        confirmText="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => selected && deleteMutation.mutate(selected.id)}
      />
    </>
  );
}
