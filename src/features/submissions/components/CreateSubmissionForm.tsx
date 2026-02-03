import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import type { SubmissionModuleLecturerInput } from '@/types/submissions';
import { useCreateSubmissionMutation } from '../mutations';
import { useSubmissionCreateData } from '../hooks/useSubmissionCreateData';
import { SubmissionBasicsFields } from './SubmissionBasicsFields';
import { LecturerAssignmentsSection } from './LecturerAssignmentsSection';
import type { ModuleLecturerDraft } from './ModuleLecturerAssignmentCard';
interface CreateSubmissionFormProps {
  isStaff: boolean;
}
export function CreateSubmissionForm({ isStaff }: CreateSubmissionFormProps) {
  const { user } = useAuthStore();
  const departmentId = user?.staff_profile?.department || '';
  const departmentName = user?.staff_profile?.department_name || '';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(departmentId);
  const [moduleLecturerItems, setModuleLecturerItems] = useState<ModuleLecturerDraft[]>([]);
  useEffect(() => {
    if (departmentId && !selectedDepartment) {
      setSelectedDepartment(departmentId);
    }
  }, [departmentId, selectedDepartment]);
  const {
    departments,
    lecturers,
    modules,
    loadingDepartments,
    loadingLecturers,
    loadingModules,
  } = useSubmissionCreateData({ isStaff, selectedDepartment });
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setModuleLecturerItems([]);
  };
  const createMutation = useCreateSubmissionMutation({ onSuccess: resetForm });
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
    if (moduleLecturerItems.length === 0) {
      toast.error('Add at least one lecturer assignment.');
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
      description: description.trim() || undefined,
      department: selectedDepartment,
      module_lecturer_items,
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Academic Submission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SubmissionBasicsFields
          departments={departments}
          loadingDepartments={loadingDepartments}
          selectedDepartment={selectedDepartment}
          departmentName={departmentName}
          title={title}
          description={description}
          onDepartmentChange={setSelectedDepartment}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />

        <LecturerAssignmentsSection
          items={moduleLecturerItems}
          modules={modules}
          lecturers={lecturers}
          loadingModules={loadingModules}
          loadingLecturers={loadingLecturers}
          onAdd={addModuleLecturerItem}
          onRemove={removeModuleLecturerItem}
          onUpdate={updateModuleLecturerItem}
        />

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
  );
}
