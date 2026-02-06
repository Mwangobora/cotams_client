/**
 * Departments Management Feature (Admin)
 */

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DepartmentsApi } from '@/apis/DepartmentsApi';
import type { Department, DepartmentFormData } from '@/types/departments';

export function DepartmentsPage() {
  const queryClient = useQueryClient();
  const api = new DepartmentsApi();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Department | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formData, setFormData] = useState<DepartmentFormData>({
    code: '',
    name: '',
    description: '',
    is_active: true,
  });

  const { data: departmentsResponse, isLoading } = useQuery({
    queryKey: ['departments', page, pageSize],
    queryFn: () => api.getDepartments({ page, page_size: pageSize }),
    keepPreviousData: true,
  });

  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : departmentsResponse?.results || [];
  const totalDepartments = Array.isArray(departmentsResponse)
    ? departmentsResponse.length
    : departmentsResponse?.count || 0;

  const createMutation = useMutation({
    mutationFn: (data: DepartmentFormData) => api.createDepartment(data),
    onSuccess: () => {
      toast.success('Department created');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create department');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DepartmentFormData> }) =>
      api.updateDepartment(id, data),
    onSuccess: () => {
      toast.success('Department updated');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update department');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteDepartment(id),
    onSuccess: () => {
      toast.success('Department deleted');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setConfirmOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete department');
    },
  });

  const columns = useMemo(
    () => [
      { header: 'Name', accessor: 'name' as keyof Department },
      { header: 'Code', accessor: 'code' as keyof Department },
      {
        header: 'Head',
        accessor: (dept: Department) => dept.head_name || '—',
      },
      {
        header: 'Programs',
        accessor: (dept: Department) => dept.programs_count ?? 0,
      },
      {
        header: 'Status',
        accessor: (dept: Department) => (
          <Badge variant={dept.is_active ? 'default' : 'secondary'}>
            {dept.is_active ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ],
    []
  );

  const openCreate = () => {
    setSelected(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      is_active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (dept: Department) => {
    setSelected(dept);
    setFormData({
      code: dept.code,
      name: dept.name,
      description: dept.description || '',
      is_active: dept.is_active,
    });
    setDialogOpen(true);
  };

  const openDelete = (dept: Department) => {
    setSelected(dept);
    setConfirmOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Code and name are required.');
      return;
    }

    const payload: DepartmentFormData = {
      ...formData,
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
    };

    if (selected) {
      updateMutation.mutate({ id: selected.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <>
      <DataTable
        title="Departments"
        columns={columns}
        data={departments}
        loading={isLoading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={openDelete}
        actions
        editButtonText="Edit"
        deleteButtonText="Delete"
        emptyMessage="No departments found"
        pagination={{
          page,
          pageSize,
          total: totalDepartments,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Department' : 'Create Department'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  value={formData.code}
                  onChange={(event) => setFormData({ ...formData, code: event.target.value })}
                  placeholder="CS"
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                placeholder="Department description"
              />
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
                  ? 'Update Department'
                  : 'Create Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Department"
        description={`Delete ${selected?.name || 'this department'}? This cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => selected && deleteMutation.mutate(selected.id)}
      />
    </>
  );
}
