/**
 * Lecturers Management (Staff)
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuthStore } from '@/store/auth.store';
import { LecturersApi } from '@/apis/LecturersApi';
import { DepartmentsApi } from '@/apis/DepartmentsApi';
import type { Lecturer } from '@/types/lecturers';
import type { Department } from '@/types/departments';

interface LecturerFormState {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  department: string;
  title: string;
  specialization: string;
  office_location: string;
  phone_number: string;
  is_active: boolean;
}

const defaultForm: LecturerFormState = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  employee_id: '',
  department: '',
  title: '',
  specialization: '',
  office_location: '',
  phone_number: '',
  is_active: true,
};

export function LecturersPage() {
  const queryClient = useQueryClient();
  const lecturersApi = new LecturersApi();
  const departmentsApi = new DepartmentsApi();
  const { user } = useAuthStore();
  const departmentId = user?.staff_profile?.department || '';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(departmentId);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState<LecturerFormState>({
    ...defaultForm,
    department: departmentId,
  });

  const { data: departmentsResponse, isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getDepartments({ is_active: true }),
  });

  const { data: lecturersResponse, isLoading } = useQuery({
    queryKey: ['lecturers', selectedDepartment, page, pageSize],
    queryFn: () =>
      lecturersApi.getLecturers({
        department: selectedDepartment || undefined,
        page,
        page_size: pageSize,
      }),
    keepPreviousData: true,
  });

  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : departmentsResponse?.results || [];
  const lecturers = Array.isArray(lecturersResponse)
    ? lecturersResponse
    : lecturersResponse?.results || [];
  const totalLecturers = Array.isArray(lecturersResponse)
    ? lecturersResponse.length
    : lecturersResponse?.count || 0;

  useEffect(() => {
    if (departmentId && !selectedDepartment) {
      setSelectedDepartment(departmentId);
      setFormData((prev) => ({ ...prev, department: departmentId }));
      return;
    }
    if (!selectedDepartment && departments.length > 0) {
      const fallbackDept = departments[0].id;
      setSelectedDepartment(fallbackDept);
      setFormData((prev) => ({ ...prev, department: fallbackDept }));
    }
  }, [departmentId, selectedDepartment, departments]);

  useEffect(() => {
    setPage(1);
  }, [selectedDepartment]);

  const createMutation = useMutation({
    mutationFn: (data: LecturerFormState) =>
      lecturersApi.createLecturer({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        employee_id: data.employee_id,
        department: data.department,
        title: data.title,
        specialization: data.specialization,
        office_location: data.office_location,
        phone_number: data.phone_number,
      }),
    onSuccess: () => {
      toast.success('Lecturer created');
      queryClient.invalidateQueries({ queryKey: ['lecturers'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['lecturers', selectedDepartment] });
      setDialogOpen(false);
      setFormData({ ...defaultForm, department: formData.department });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create lecturer');
    },
  });

  const columns = useMemo(
    () => [
      { header: 'Name', accessor: 'name' as keyof Lecturer },
      { header: 'Email', accessor: 'email' as keyof Lecturer },
      { header: 'Employee ID', accessor: 'employee_id' as keyof Lecturer },
      {
        header: 'Status',
        accessor: (lecturer: Lecturer) => (
          <Badge variant={lecturer.is_active ? 'default' : 'secondary'}>
            {lecturer.is_active ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ],
    []
  );

  const openCreate = () => {
    setFormData({
      ...defaultForm,
      department: formData.department || departmentId,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.department) {
      toast.error('Select a department');
      return;
    }
    if (!formData.email || !formData.password || !formData.employee_id) {
      toast.error('Email, password, and employee ID are required.');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <>
      <div className="mb-4">
        <Label>Department</Label>
        <Select
          value={selectedDepartment}
          onValueChange={(value) => {
            setSelectedDepartment(value);
            setFormData((prev) => ({ ...prev, department: value }));
          }}
          disabled={loadingDepartments || Boolean(departmentId)}
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
        title="Lecturers"
        columns={columns}
        data={lecturers}
        loading={isLoading}
        onAdd={openCreate}
        actions
        editButtonText="Edit"
        emptyMessage="No lecturers found"
        pagination={{
          page,
          pageSize,
          total: totalLecturers,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg md:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create Lecturer</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            <Tabs defaultValue="account" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-6">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    disabled={loadingDepartments || Boolean(departmentId)}
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={formData.first_name}
                      onChange={(event) => setFormData({ ...formData, first_name: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={formData.last_name}
                      onChange={(event) => setFormData({ ...formData, last_name: event.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={formData.email}
                      onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input
                      value={formData.employee_id}
                      onChange={(event) => setFormData({ ...formData, employee_id: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    <Input
                      value={formData.specialization}
                      onChange={(event) => setFormData({ ...formData, specialization: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Office Location</Label>
                    <Input
                      value={formData.office_location}
                      onChange={(event) => setFormData({ ...formData, office_location: event.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={formData.phone_number}
                      onChange={(event) => setFormData({ ...formData, phone_number: event.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-7">
                    <Checkbox
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_active: Boolean(checked) })
                      }
                    />
                    <Label>Active</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Lecturer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
