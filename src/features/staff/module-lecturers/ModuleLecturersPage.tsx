/**
 * Module Lecturer Assignments (Staff)
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery,keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ModulesApi } from '@/apis/ModulesApi';
import { LecturersApi } from '@/apis/LecturersApi';
import { DepartmentsApi } from '@/apis/DepartmentsApi';
import { useAuthStore } from '@/store/auth.store';
import { ModuleLecturersApi } from '@/apis/ModuleLecturersApi';
import type { Module } from '@/types/modules';
import type { Lecturer } from '@/types/lecturers';
import type { Department } from '@/types/departments';
import type {
  ModuleLecturerAssignment,
  ModuleLecturerFormData,
} from '@/types/module-lecturers';

const defaultForm: ModuleLecturerFormData = {
  module: '',
  lecturer: '',
  academic_year: '',
  semester: 1,
  is_primary: true,
};

export function ModuleLecturersPage() {
  const queryClient = useQueryClient();
  const modulesApi = new ModulesApi();
  const lecturersApi = new LecturersApi();
  const assignmentsApi = new ModuleLecturersApi();
  const departmentsApi = new DepartmentsApi();
  const { user } = useAuthStore();
  const staffDepartmentId = user?.staff_profile?.department || '';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<ModuleLecturerAssignment | null>(null);
  const [formData, setFormData] = useState<ModuleLecturerFormData>(defaultForm);
  const [selectedDepartment, setSelectedDepartment] = useState(staffDepartmentId);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: assignmentsResponse, isLoading } = useQuery({
    queryKey: ['module-lecturers', page, pageSize],
    queryFn: () => assignmentsApi.getAssignments({ page, page_size: pageSize }),
    placeholderData: keepPreviousData,
  });

  const { data: departmentsResponse, isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getDepartments({ is_active: true }),
  });

  const { data: modulesResponse, isLoading: loadingModules } = useQuery({
    queryKey: ['modules', selectedDepartment],
    queryFn: () =>
      modulesApi.getModules(selectedDepartment ? { department: selectedDepartment } : {}),
  });

  const { data: lecturersResponse, isLoading: loadingLecturers } = useQuery({
    queryKey: ['lecturers', selectedDepartment],
    queryFn: () =>
      selectedDepartment
        ? lecturersApi.getDepartmentLecturers(selectedDepartment)
        : Promise.resolve([]),
  });

  const assignments = Array.isArray(assignmentsResponse)
    ? assignmentsResponse
    : assignmentsResponse?.results || [];
  const totalAssignments = Array.isArray(assignmentsResponse)
    ? assignmentsResponse.length
    : assignmentsResponse?.count || 0;
  const modules = Array.isArray(modulesResponse)
    ? modulesResponse
    : modulesResponse?.results || [];
  const lecturers = Array.isArray(lecturersResponse) ? lecturersResponse : [];
  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : departmentsResponse?.results || [];

  useEffect(() => {
    setPage(1);
  }, [selectedDepartment]);

  const createMutation = useMutation({
    mutationFn: (data: ModuleLecturerFormData) => assignmentsApi.createAssignment(data),
    onSuccess: () => {
      toast.success('Assignment created');
      queryClient.invalidateQueries({ queryKey: ['module-lecturers'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create assignment');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ModuleLecturerFormData }) =>
      assignmentsApi.updateAssignment(id, data),
    onSuccess: () => {
      toast.success('Assignment updated');
      queryClient.invalidateQueries({ queryKey: ['module-lecturers'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update assignment');
    },
  });

  const columns = useMemo(
    () => [
      {
        header: 'Module',
        accessor: (item: ModuleLecturerAssignment) =>
          item.module_name || item.module_code || item.module,
      },
      {
        header: 'Lecturer',
        accessor: (item: ModuleLecturerAssignment) =>
          item.lecturer_name || item.lecturer_employee_id || item.lecturer,
      },
      { header: 'Academic Year', accessor: 'academic_year' as keyof ModuleLecturerAssignment },
      { header: 'Semester', accessor: (item: ModuleLecturerAssignment) => item.semester },
      {
        header: 'Primary',
        accessor: (item: ModuleLecturerAssignment) => (
          <Badge variant={item.is_primary ? 'default' : 'secondary'}>
            {item.is_primary ? 'Yes' : 'No'}
          </Badge>
        ),
      },
    ],
    []
  );

  const openCreate = () => {
    setSelected(null);
    setFormData(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (item: ModuleLecturerAssignment) => {
    setSelected(item);
    setFormData({
      module: item.module,
      lecturer: item.lecturer,
      academic_year: item.academic_year,
      semester: item.semester,
      is_primary: item.is_primary,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedDepartment) {
      toast.error('Select a department.');
      return;
    }
    if (!formData.module || !formData.lecturer || !formData.academic_year) {
      toast.error('Module, lecturer, and academic year are required.');
      return;
    }

    if (selected) {
      updateMutation.mutate({ id: selected.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Label>Department</Label>
        <Select
          value={selectedDepartment}
          onValueChange={setSelectedDepartment}
          disabled={loadingDepartments || Boolean(staffDepartmentId)}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingDepartments ? 'Loading...' : 'Select department'} />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept: Department) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.code} - {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        title="Module Lecturers"
        columns={columns}
        data={assignments}
        loading={isLoading}
        onAdd={openCreate}
        onEdit={openEdit}
        actions
        editButtonText="Edit"
        emptyMessage="No assignments found"
        pagination={{
          page,
          pageSize,
          total: totalAssignments,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Assignment' : 'Create Assignment'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Module</Label>
              <Select
                value={formData.module}
                onValueChange={(value) => setFormData({ ...formData, module: value })}
                disabled={loadingModules}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingModules ? 'Loading...' : 'Select module'} />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module: Module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.code} - {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lecturer</Label>
              <Select
                value={formData.lecturer}
                onValueChange={(value) => setFormData({ ...formData, lecturer: value })}
                disabled={loadingLecturers}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingLecturers ? 'Loading...' : 'Select lecturer'} />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map((lecturer: Lecturer) => (
                    <SelectItem key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Input
                value={formData.academic_year}
                onChange={(event) =>
                  setFormData({ ...formData, academic_year: event.target.value })
                }
                placeholder="2025/2026"
              />
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select
                value={String(formData.semester)}
                onValueChange={(value) =>
                  setFormData({ ...formData, semester: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.is_primary}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_primary: Boolean(checked) })
                }
              />
              <Label>Primary Lecturer</Label>
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
                  ? 'Update Assignment'
                  : 'Create Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
