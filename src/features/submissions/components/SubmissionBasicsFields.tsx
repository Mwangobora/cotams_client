import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Department } from '@/types/departments';

interface SubmissionBasicsFieldsProps {
  departments: Department[];
  loadingDepartments: boolean;
  selectedDepartment: string;
  departmentName: string;
  title: string;
  description: string;
  onDepartmentChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function SubmissionBasicsFields({
  departments,
  loadingDepartments,
  selectedDepartment,
  departmentName,
  title,
  description,
  onDepartmentChange,
  onTitleChange,
  onDescriptionChange,
}: SubmissionBasicsFieldsProps) {
  return (
    <>
      {departments.length === 0 && !loadingDepartments && (
        <Alert variant="destructive">
          <AlertDescription>
            No departments available. Ask an admin to create a department first.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Department</Label>
          <Select
            value={selectedDepartment}
            onValueChange={onDepartmentChange}
            disabled={loadingDepartments}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={loadingDepartments ? 'Loading...' : 'Select department'}
              />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
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
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Submission title"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Describe the changes being proposed"
        />
      </div>
    </>
  );
}
