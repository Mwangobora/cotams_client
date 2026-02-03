import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LecturerOption {
  id: string;
  name: string;
}

interface AssignmentOption {
  id: string;
  module: string;
  module_name?: string;
  module_code?: string;
  source?: 'LIVE' | 'PENDING';
}

interface LecturerModuleSelectorProps {
  lecturerOptions: LecturerOption[];
  moduleOptionsForLecturer: AssignmentOption[];
  selectedLecturer: string;
  selectedModule: string;
  selectedAssignmentName: string;
  selectedLecturerName: string;
  onLecturerChange: (value: string) => void;
  onModuleChange: (value: string) => void;
  disabled: boolean;
}

export function LecturerModuleSelector({
  lecturerOptions,
  moduleOptionsForLecturer,
  selectedLecturer,
  selectedModule,
  selectedAssignmentName,
  selectedLecturerName,
  onLecturerChange,
  onModuleChange,
  disabled,
}: LecturerModuleSelectorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <Label>Lecturer (from staff assignments)</Label>
          <Select value={selectedLecturer} onValueChange={onLecturerChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Select lecturer" />
            </SelectTrigger>
            <SelectContent>
              {lecturerOptions.length === 0 && (
                <SelectItem value="__none" disabled>
                  No lecturer assignments found
                </SelectItem>
              )}
              {lecturerOptions.map((lecturer) => (
                <SelectItem key={lecturer.id} value={lecturer.id}>
                  {lecturer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Module (auto-filtered by lecturer)</Label>
          <Select
            value={selectedModule}
            onValueChange={onModuleChange}
            disabled={!selectedLecturer}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedLecturer ? 'Select module' : 'Select lecturer first'} />
            </SelectTrigger>
            <SelectContent>
              {selectedLecturer && moduleOptionsForLecturer.length === 0 && (
                <SelectItem value="__none" disabled>
                  No modules for this lecturer
                </SelectItem>
              )}
              {moduleOptionsForLecturer.map((item) => (
                <SelectItem key={item.id} value={item.module}>
                  {item.module_code || ''} {item.module_name || item.module}
                  {item.source === 'PENDING' && (
                    <Badge variant="secondary" className="ml-2">
                      Pending
                    </Badge>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Selected Module</Label>
          <Input value={selectedAssignmentName} disabled />
        </div>
        <div>
          <Label>Selected Lecturer</Label>
          <Input value={selectedLecturerName} disabled />
        </div>
      </div>
    </div>
  );
}
