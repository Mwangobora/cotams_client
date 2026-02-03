/**
 * Programs Management Feature (Staff)
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
import { ProgramsApi } from '@/apis/ProgramsApi';
import { DepartmentsApi } from '@/apis/DepartmentsApi';
import type { Program } from '@/types/programs';
import type { Department } from '@/types/departments';

const PROGRAM_LEVELS = [
  { value: 'CERTIFICATE', label: 'Certificate' },
  { value: 'DIPLOMA', label: 'Diploma' },
  { value: 'BACHELOR', label: 'Bachelor' },
  { value: 'MASTER', label: 'Master' },
  { value: 'PHD', label: 'PhD' },
];

interface ProgramFormState {
  code: string;
  name: string;
  description: string;
  duration_years: number;
  level: string;
  is_active: boolean;
}

export function ProgramsPage() {
  const queryClient = useQueryClient();
  const api = new ProgramsApi();
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
  const [selected, setSelected] = useState<Program | null>(null);
  const [formData, setFormData] = useState<ProgramFormState>({
    code: '',
    name: '',
    description: '',
    duration_years: 3,
    level: 'BACHELOR',
    is_active: true,
  });

  const { data: departmentsResponse, isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getDepartments({ is_active: true }),
  });

  const { data: programsResponse, isLoading } = useQuery({
    queryKey: ['programs', 'staff'],
    queryFn: () => api.getPrograms(),
  });

  const programs = Array.isArray(programsResponse)
    ? programsResponse
    : programsResponse?.results || [];
  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : departmentsResponse?.results || [];

  const createMutation = useMutation({
    mutationFn: (data: ProgramFormState) =>
      api.createProgram({
        ...data,
        department: selectedDepartment,
      }),
    onSuccess: () => {
      toast.success('Program created');
      queryClient.invalidateQueries({ queryKey: ['programs'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['programs', 'staff'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create program');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProgramFormState }) =>
      api.updateProgram(id, data),
    onSuccess: () => {
      toast.success('Program updated');
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', 'staff'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update program');
    },
  });

  const columns = useMemo(
    () => [
      { header: 'Code', accessor: 'code' as keyof Program },
      { header: 'Name', accessor: 'name' as keyof Program },
      {
        header: 'Level',
        accessor: (program: Program) => program.level || '—',
      },
      {
        header: 'Duration',
        accessor: (program: Program) => `${program.duration_years} years`,
      },
      {
        header: 'Status',
        accessor: (program: Program) => (
          <Badge variant={program.is_active ? 'default' : 'secondary'}>
            {program.is_active ? 'Active' : 'Inactive'}
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
      duration_years: 3,
      level: 'BACHELOR',
      is_active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (program: Program) => {
    setSelected(program);
    setFormData({
      code: program.code,
      name: program.name,
      description: program.description || '',
      duration_years: program.duration_years,
      level: program.level || 'BACHELOR',
      is_active: program.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedDepartment) {
      toast.error('Department is required to create a program.');
      return;
    }
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Code and name are required.');
      return;
    }
    if (formData.duration_years <= 0) {
      toast.error('Duration must be positive.');
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
          <AlertDescription>Select a department to continue.</AlertDescription>
        </Alert>
      )}

      <DataTable
        title="Programs"
        columns={columns}
        data={programs}
        loading={isLoading}
        onAdd={openCreate}
        onEdit={openEdit}
        actions
        editButtonText="Edit"
        emptyMessage="No programs found"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Program' : 'Create Program'}</DialogTitle>
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
                  onChange={(event) =>
                    setFormData({ ...formData, code: event.target.value })
                  }
                  placeholder="BCS"
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                  placeholder="Bachelor of Computer Science"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAM_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (years)</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.duration_years}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      duration_years: Number(event.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
                placeholder="Program description"
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
                  ? 'Update Program'
                  : 'Create Program'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
