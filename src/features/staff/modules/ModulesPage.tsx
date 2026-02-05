/**
 * Modules Management Feature (Staff)
 */

import { useEffect, useMemo, useState } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/store/auth.store';
import { ModulesApi } from '@/apis/ModulesApi';
import { DepartmentsApi } from '@/apis/DepartmentsApi';
import type { Module } from '@/types/modules';
import type { Department } from '@/types/departments';

interface ModuleFormState {
  code: string;
  name: string;
  description: string;
  credits: number;
  hours_per_week: number;
  is_active: boolean;
}

export function ModulesPage() {
  const queryClient = useQueryClient();
  const api = new ModulesApi();
  const departmentsApi = new DepartmentsApi();
  const { user } = useAuthStore();
  const departmentId = user?.staff_profile?.department || '';
  const departmentName = user?.staff_profile?.department_name || '';
  const [selectedDepartment, setSelectedDepartment] = useState(departmentId);

  useEffect(() => {
    if (departmentId && !selectedDepartment) {
      setSelectedDepartment(departmentId);
    }
  }, [departmentId, selectedDepartment]);


  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Module | null>(null);
  const [formData, setFormData] = useState<ModuleFormState>({
    code: '',
    name: '',
    description: '',
    credits: 3,
    hours_per_week: 3,
    is_active: true,
  });

  const { data: departmentsResponse, isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getDepartments({ is_active: true }),
  });

  const { data: modulesResponse, isLoading } = useQuery({
    queryKey: ['modules', selectedDepartment],
    queryFn: () =>
      api.getModules(selectedDepartment ? { department: selectedDepartment } : {}),
  });


  const modules = Array.isArray(modulesResponse)
    ? modulesResponse
    : modulesResponse?.results || [];
  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : departmentsResponse?.results || [];

  const createMutation = useMutation({
    mutationFn: (data: ModuleFormState) =>
      api.createModule({
        ...data,
        department: selectedDepartment,
      }),
    onSuccess: () => {
      toast.success('Module created');
      queryClient.invalidateQueries({ queryKey: ['modules'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['modules', selectedDepartment] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create module');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ModuleFormState }) =>
      api.updateModule(id, data),
    onSuccess: () => {
      toast.success('Module updated');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update module');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteModule(id),
    onSuccess: () => {
      toast.success('Module deleted');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete module');
    },
  });

  const columns = useMemo(
    () => [
      { header: 'Code', accessor: 'code' as keyof Module },
      { header: 'Name', accessor: 'name' as keyof Module },
      {
        header: 'Credits',
        accessor: (module: Module) => module.credits,
      },
      {
        header: 'Hours/Week',
        accessor: (module: Module) => module.hours_per_week,
      },
      {
        header: 'Status',
        accessor: (module: Module) => (
          <Badge variant={module.is_active ? 'default' : 'secondary'}>
            {module.is_active ? 'Active' : 'Inactive'}
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
      credits: 3,
      hours_per_week: 3,
      is_active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (module: Module) => {
    setSelected(module);
    setFormData({
      code: module.code,
      name: module.name,
      description: module.description || '',
      credits: module.credits,
      hours_per_week: module.hours_per_week,
      is_active: module.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedDepartment) {
      toast.error('Department is required to create a module.');
      return;
    }
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Code and name are required.');
      return;
    }
    if (formData.credits <= 0 || formData.hours_per_week <= 0) {
      toast.error('Credits and hours per week must be positive.');
      return;
    }

    const payload = {
      ...formData,
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    if (selected) {
      updateMutation.mutate({ id: selected.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <>
      {!selectedDepartment && (
        <Alert variant="destructive">
          <AlertDescription>
            Select a department to continue.
          </AlertDescription>
        </Alert>
      )}

      <DataTable
        title="Modules"
        columns={columns}
        data={modules}
        loading={isLoading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(module: Module) => deleteMutation.mutate(module.id)}
        actions
        editButtonText="Edit"
        emptyMessage="No modules found"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Module' : 'Create Module'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                disabled={loadingDepartments || Boolean(departmentId)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={loadingDepartments ? 'Loading...' : 'Select department'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {departments.length === 0 && (
                    <SelectItem value="__none" disabled>
                      No departments found
                    </SelectItem>
                  )}
                  {departments.map((dept: Department) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.code} - {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {departmentName && (
                <div className="text-xs text-muted-foreground">
                  Default department: {departmentName}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  value={formData.code}
                  onChange={(event) => setFormData({ ...formData, code: event.target.value })}
                  placeholder="CS401"
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="Machine Learning"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Credits</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.credits}
                  onChange={(event) =>
                    setFormData({ ...formData, credits: Number(event.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Hours / Week</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.hours_per_week}
                  onChange={(event) =>
                    setFormData({ ...formData, hours_per_week: Number(event.target.value) })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                placeholder="Module description"
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
              disabled={createMutation.isPending || updateMutation.isPending || !selectedDepartment}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : selected
                  ? 'Update Module'
                  : 'Create Module'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
