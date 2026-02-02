/**
 * Academic Submissions Feature (Staff/Admin)
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuthStore } from '@/store/auth.store';
import { LecturersApi } from '@/apis/LecturersApi';
import { ModulesApi } from '@/apis/ModulesApi';
import { SubmissionsApi } from '@/apis/SubmissionsApi';
import { DepartmentsApi } from '@/apis/DepartmentsApi';
import type { Lecturer } from '@/types/lecturers';
import type { Module } from '@/types/modules';
import type { Department } from '@/types/departments';
import type {
  AcademicSubmission,
  SubmissionStatus,
  SubmissionModuleInput,
  SubmissionModuleLecturerInput
} from '@/types/submissions';

interface ModuleDraft {
  proposed_code: string;
  proposed_name: string;
  proposed_description: string;
  proposed_credits: number;
  proposed_hours_per_week: number;
  proposed_is_active: boolean;
}

interface ModuleLecturerDraft {
  proposed_module: string;
  proposed_lecturer: string;
  proposed_academic_year: string;
  proposed_semester: number;
  proposed_is_primary: boolean;
}

const statusVariantMap: Record<SubmissionStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  DRAFT: 'secondary',
  SUBMITTED: 'default',
  APPROVED: 'outline',
  REJECTED: 'destructive',
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
};

function SubmissionDetailsDialog({
  open,
  onOpenChange,
  submission,
  isAdmin,
  isStaff,
  reviewNotes,
  onReviewNotesChange,
  onSubmit,
  onApprove,
  onReject,
  actionLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: AcademicSubmission | null;
  isAdmin: boolean;
  isStaff: boolean;
  reviewNotes: string;
  onReviewNotesChange: (value: string) => void;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: () => void;
  actionLoading: boolean;
}) {
  if (!submission) return null;

  const canSubmit = isStaff && submission.status === 'DRAFT';
  const canReview = isAdmin && submission.status === 'SUBMITTED';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {submission.title}
            <Badge variant={statusVariantMap[submission.status]}>
              {submission.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="text-sm text-muted-foreground">
              Department: <span className="text-foreground">{submission.department_name || submission.department}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Submitted By: <span className="text-foreground">{submission.submitted_by_name || '—'}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Created: <span className="text-foreground">{formatDate(submission.created_at)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Submitted: <span className="text-foreground">{formatDate(submission.submitted_at)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Reviewed: <span className="text-foreground">{formatDate(submission.reviewed_at)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Reviewer: <span className="text-foreground">{submission.reviewed_by_name || '—'}</span>
            </div>
          </div>

          {submission.description && (
            <div className="text-sm">
              <div className="font-medium">Description</div>
              <div className="text-muted-foreground">{submission.description}</div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Proposed Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {submission.module_items.length === 0 ? (
                <div className="text-sm text-muted-foreground">No module proposals.</div>
              ) : (
                submission.module_items.map((item) => (
                  <div key={item.id} className="rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {item.proposed_code} - {item.proposed_name}
                      </div>
                      <Badge variant="outline">{item.action}</Badge>
                    </div>
                    <div className="text-muted-foreground">
                      Credits: {item.proposed_credits} · Hours/Week: {item.proposed_hours_per_week}
                    </div>
                    {item.proposed_description && (
                      <div className="text-muted-foreground">{item.proposed_description}</div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lecturer Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {submission.module_lecturer_items.length === 0 ? (
                <div className="text-sm text-muted-foreground">No lecturer assignments.</div>
              ) : (
                submission.module_lecturer_items.map((item) => (
                  <div key={item.id} className="rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        Module: {item.proposed_module || '—'} · Lecturer: {item.proposed_lecturer || '—'}
                      </div>
                      <Badge variant="outline">{item.action}</Badge>
                    </div>
                    <div className="text-muted-foreground">
                      Academic Year: {item.proposed_academic_year || '—'} · Semester: {item.proposed_semester ?? '—'}
                    </div>
                    <div className="text-muted-foreground">
                      Primary: {item.proposed_is_primary ? 'Yes' : 'No'}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {canReview && (
            <div className="space-y-2">
              <Label>Review Notes (required for rejection)</Label>
              <Textarea
                value={reviewNotes}
                onChange={(event) => onReviewNotesChange(event.target.value)}
                placeholder="Add approval or rejection notes"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {canSubmit && (
            <Button onClick={onSubmit} disabled={actionLoading}>
              {actionLoading ? 'Submitting...' : 'Submit for Review'}
            </Button>
          )}
          {canReview && (
            <>
              <Button
                variant="destructive"
                onClick={onReject}
                disabled={actionLoading || reviewNotes.trim().length === 0}
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button onClick={onApprove} disabled={actionLoading}>
                {actionLoading ? 'Approving...' : 'Approve'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SubmissionsPage() {
  const { user } = useAuthStore();
  const roles = user?.roles?.map((role) => role.code) || [];
  const isAdmin = roles.includes('ADMIN');
  const isStaff = roles.includes('STAFF');
  const departmentId = user?.staff_profile?.department || '';
  const departmentName = user?.staff_profile?.department_name || '';

  const queryClient = useQueryClient();
  const submissionsApi = new SubmissionsApi();
  const lecturersApi = new LecturersApi();
  const modulesApi = new ModulesApi();
  const departmentsApi = new DepartmentsApi();

  const [selectedSubmission, setSelectedSubmission] = useState<AcademicSubmission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(departmentId);
  const [moduleItems, setModuleItems] = useState<ModuleDraft[]>([]);
  const [moduleLecturerItems, setModuleLecturerItems] = useState<ModuleLecturerDraft[]>([]);

  useEffect(() => {
    if (departmentId && !selectedDepartment) {
      setSelectedDepartment(departmentId);
    }
  }, [departmentId, selectedDepartment]);

  const { data: submissionsResponse, isLoading } = useQuery({
    queryKey: ['submissions', isAdmin ? 'admin' : 'staff'],
    queryFn: () => submissionsApi.getSubmissions(),
  });

  const { data: departmentsResponse, isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getDepartments({ is_active: true }),
    enabled: isStaff,
  });

  const { data: lecturersResponse, isLoading: loadingLecturers } = useQuery({
    queryKey: ['lecturers'],
    queryFn: () => lecturersApi.getLecturers(),
    enabled: isStaff,
  });

  const { data: modulesResponse, isLoading: loadingModules } = useQuery({
    queryKey: ['modules', selectedDepartment],
    queryFn: () =>
      modulesApi.getModules(
        selectedDepartment ? { department: selectedDepartment } : {}
      ),
    enabled: isStaff,
  });

  const submissions = Array.isArray(submissionsResponse)
    ? submissionsResponse
    : submissionsResponse?.results || [];

  const lecturers = Array.isArray(lecturersResponse) ? lecturersResponse : [];
  const modules = Array.isArray(modulesResponse)
    ? modulesResponse
    : modulesResponse?.results || [];
  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : departmentsResponse?.results || [];

  const createMutation = useMutation({
    mutationFn: (payload: {
      title: string;
      description?: string;
      department: string;
      module_items: SubmissionModuleInput[];
      module_lecturer_items: SubmissionModuleLecturerInput[];
    }) => submissionsApi.createSubmission(payload),
    onSuccess: () => {
      toast.success('Submission created');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setTitle('');
      setDescription('');
      setModuleItems([]);
      setModuleLecturerItems([]);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create submission');
    },
  });

  const submitMutation = useMutation({
    mutationFn: (id: string) => submissionsApi.submitSubmission(id),
    onSuccess: () => {
      toast.success('Submission submitted for review');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setDetailsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit submission');
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      submissionsApi.approveSubmission(id, notes),
    onSuccess: () => {
      toast.success('Submission approved');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setDetailsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve submission');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      submissionsApi.rejectSubmission(id, notes),
    onSuccess: () => {
      toast.success('Submission rejected');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setDetailsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject submission');
    },
  });

  const actionLoading =
    submitMutation.isPending || approveMutation.isPending || rejectMutation.isPending;

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessor: 'title' as keyof AcademicSubmission,
      },
      {
        header: 'Department',
        accessor: (submission: AcademicSubmission) =>
          submission.department_name || submission.department,
      },
      {
        header: 'Status',
        accessor: (submission: AcademicSubmission) => (
          <Badge variant={statusVariantMap[submission.status]}>
            {submission.status}
          </Badge>
        ),
      },
      {
        header: 'Created',
        accessor: (submission: AcademicSubmission) => formatDate(submission.created_at),
      },
      {
        header: 'Submitted',
        accessor: (submission: AcademicSubmission) => formatDate(submission.submitted_at),
      },
    ],
    []
  );

  const openDetails = (submission: AcademicSubmission) => {
    setSelectedSubmission(submission);
    setReviewNotes(submission.review_notes || '');
    setDetailsOpen(true);
  };

  const addModuleItem = () => {
    setModuleItems((items) => [
      ...items,
      {
        proposed_code: '',
        proposed_name: '',
        proposed_description: '',
        proposed_credits: 3,
        proposed_hours_per_week: 3,
        proposed_is_active: true,
      },
    ]);
  };

  const updateModuleItem = (index: number, value: Partial<ModuleDraft>) => {
    setModuleItems((items) =>
      items.map((item, idx) => (idx === index ? { ...item, ...value } : item))
    );
  };

  const removeModuleItem = (index: number) => {
    setModuleItems((items) => items.filter((_, idx) => idx !== index));
  };

  const addModuleLecturerItem = () => {
    setModuleLecturerItems((items) => [
      ...items,
      {
        proposed_module: '',
        proposed_lecturer: '',
        proposed_academic_year: '',
        proposed_semester: 1,
        proposed_is_primary: true,
      },
    ]);
  };

  const updateModuleLecturerItem = (index: number, value: Partial<ModuleLecturerDraft>) => {
    setModuleLecturerItems((items) =>
      items.map((item, idx) => (idx === index ? { ...item, ...value } : item))
    );
  };

  const removeModuleLecturerItem = (index: number) => {
    setModuleLecturerItems((items) => items.filter((_, idx) => idx !== index));
  };

  const handleCreateSubmission = () => {
    if (!selectedDepartment) {
      toast.error('Department is required to create a submission.');
      return;
    }
    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }
    if (moduleItems.length === 0 && moduleLecturerItems.length === 0) {
      toast.error('Add at least one module or lecturer assignment.');
      return;
    }

    const invalidModule = moduleItems.find(
      (item) =>
        !item.proposed_code.trim() ||
        !item.proposed_name.trim() ||
        item.proposed_credits <= 0 ||
        item.proposed_hours_per_week <= 0
    );
    if (invalidModule) {
      toast.error('Fill all module fields with valid values.');
      return;
    }

    const invalidAssignment = moduleLecturerItems.find(
      (item) =>
        !item.proposed_module ||
        !item.proposed_lecturer ||
        !item.proposed_academic_year.trim() ||
        !item.proposed_semester
    );
    if (invalidAssignment) {
      toast.error('Fill all lecturer assignment fields.');
      return;
    }

    const module_items: SubmissionModuleInput[] = moduleItems.map((item) => ({
      action: 'CREATE',
      proposed_code: item.proposed_code.trim(),
      proposed_name: item.proposed_name.trim(),
      proposed_description: item.proposed_description.trim(),
      proposed_credits: item.proposed_credits,
      proposed_hours_per_week: item.proposed_hours_per_week,
      proposed_is_active: item.proposed_is_active,
    }));

    const module_lecturer_items: SubmissionModuleLecturerInput[] = moduleLecturerItems.map(
      (item) => ({
        action: 'CREATE',
        proposed_module: item.proposed_module,
        proposed_lecturer: item.proposed_lecturer,
        proposed_academic_year: item.proposed_academic_year.trim(),
        proposed_semester: item.proposed_semester,
        proposed_is_primary: item.proposed_is_primary,
      })
    );

    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      department: selectedDepartment,
      module_items,
      module_lecturer_items,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Submissions</TabsTrigger>
          {isStaff && <TabsTrigger value="create">Create Submission</TabsTrigger>}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <DataTable
            title={isAdmin ? 'All Submissions' : 'My Submissions'}
            columns={columns}
            data={submissions}
            loading={isLoading}
            onEdit={openDetails}
            editButtonText="View"
            actions
            emptyMessage="No submissions found"
          />
        </TabsContent>

        {isStaff && (
          <TabsContent value="create" className="space-y-4">
            {departments.length === 0 && !loadingDepartments && (
              <Alert variant="destructive">
                <AlertDescription>
                  No departments available. Ask an admin to create a department first.
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Create Academic Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select
                      value={selectedDepartment}
                      onValueChange={setSelectedDepartment}
                      disabled={loadingDepartments}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={loadingDepartments ? 'Loading...' : 'Select department'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department: Department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.code} - {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {departmentName && !selectedDepartment && (
                      <div className="text-xs text-muted-foreground">
                        Default department: {departmentName}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Submission title"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe the changes being proposed"
                  />
                </div>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Module Proposals</CardTitle>
                    <Button type="button" variant="outline" onClick={addModuleItem}>
                      Add Module
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {moduleItems.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No module proposals yet.
                      </div>
                    ) : (
                      moduleItems.map((item, index) => (
                        <div key={`${item.proposed_code}-${index}`} className="rounded-md border p-4">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Module #{index + 1}</div>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeModuleItem(index)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Code</Label>
                              <Input
                                value={item.proposed_code}
                                onChange={(event) =>
                                  updateModuleItem(index, { proposed_code: event.target.value })
                                }
                                placeholder="CS401"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={item.proposed_name}
                                onChange={(event) =>
                                  updateModuleItem(index, { proposed_name: event.target.value })
                                }
                                placeholder="Machine Learning"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Credits</Label>
                              <Input
                                type="number"
                                min={1}
                                value={item.proposed_credits}
                                onChange={(event) =>
                                  updateModuleItem(index, { proposed_credits: Number(event.target.value) })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Hours / Week</Label>
                              <Input
                                type="number"
                                min={1}
                                value={item.proposed_hours_per_week}
                                onChange={(event) =>
                                  updateModuleItem(index, {
                                    proposed_hours_per_week: Number(event.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={item.proposed_description}
                              onChange={(event) =>
                                updateModuleItem(index, { proposed_description: event.target.value })
                              }
                              placeholder="Module description"
                            />
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <Checkbox
                              checked={item.proposed_is_active}
                              onCheckedChange={(checked) =>
                                updateModuleItem(index, { proposed_is_active: Boolean(checked) })
                              }
                            />
                            <Label>Active</Label>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Lecturer Assignments</CardTitle>
                    <Button type="button" variant="outline" onClick={addModuleLecturerItem}>
                      Add Assignment
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {moduleLecturerItems.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No lecturer assignments yet.
                      </div>
                    ) : (
                      moduleLecturerItems.map((item, index) => (
                        <div key={`${item.proposed_module}-${index}`} className="rounded-md border p-4">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Assignment #{index + 1}</div>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeModuleLecturerItem(index)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Module</Label>
                              <Select
                                value={item.proposed_module}
                                onValueChange={(value) =>
                                  updateModuleLecturerItem(index, { proposed_module: value })
                                }
                                disabled={loadingModules}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={loadingModules ? 'Loading...' : 'Select module'} />
                                </SelectTrigger>
                                <SelectContent>
                                  {modules.length === 0 && (
                                    <SelectItem value="__none" disabled>
                                      No modules found
                                    </SelectItem>
                                  )}
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
                                value={item.proposed_lecturer}
                                onValueChange={(value) =>
                                  updateModuleLecturerItem(index, { proposed_lecturer: value })
                                }
                                disabled={loadingLecturers}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={loadingLecturers ? 'Loading...' : 'Select lecturer'}
                                  />
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
                                value={item.proposed_academic_year}
                                onChange={(event) =>
                                  updateModuleLecturerItem(index, {
                                    proposed_academic_year: event.target.value,
                                  })
                                }
                                placeholder="2025/2026"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Semester</Label>
                              <Select
                                value={String(item.proposed_semester)}
                                onValueChange={(value) =>
                                  updateModuleLecturerItem(index, {
                                    proposed_semester: Number(value),
                                  })
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
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <Checkbox
                              checked={item.proposed_is_primary}
                              onCheckedChange={(checked) =>
                                updateModuleLecturerItem(index, {
                                  proposed_is_primary: Boolean(checked),
                                })
                              }
                            />
                            <Label>Primary Lecturer</Label>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={handleCreateSubmission}
                    disabled={createMutation.isPending || !selectedDepartment}
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Submission'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <SubmissionDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        submission={selectedSubmission}
        isAdmin={isAdmin}
        isStaff={isStaff}
        reviewNotes={reviewNotes}
        onReviewNotesChange={setReviewNotes}
        onSubmit={() => selectedSubmission && submitMutation.mutate(selectedSubmission.id)}
        onApprove={() =>
          selectedSubmission && approveMutation.mutate({ id: selectedSubmission.id, notes: reviewNotes })
        }
        onReject={() =>
          selectedSubmission && rejectMutation.mutate({ id: selectedSubmission.id, notes: reviewNotes })
        }
        actionLoading={actionLoading}
      />
    </div>
  );
}
