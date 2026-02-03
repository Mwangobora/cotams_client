import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Lecturer } from '@/types/lecturers';
import type { Module } from '@/types/modules';

export interface ModuleLecturerDraft {
  proposed_module: string;
  proposed_lecturer: string;
  proposed_academic_year: string;
  proposed_semester: number;
  proposed_is_primary: boolean;
}

interface ModuleLecturerAssignmentCardProps {
  index: number;
  item: ModuleLecturerDraft;
  modules: Module[];
  lecturers: Lecturer[];
  loadingModules: boolean;
  loadingLecturers: boolean;
  onRemove: () => void;
  onUpdate: (value: Partial<ModuleLecturerDraft>) => void;
}

export function ModuleLecturerAssignmentCard({
  index,
  item,
  modules,
  lecturers,
  loadingModules,
  loadingLecturers,
  onRemove,
  onUpdate,
}: ModuleLecturerAssignmentCardProps) {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">Assignment #{index + 1}</div>
        <Button type="button" variant="ghost" onClick={onRemove}>
          Remove
        </Button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Module</Label>
          <Select
            value={item.proposed_module}
            onValueChange={(value) => onUpdate({ proposed_module: value })}
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
              {modules.map((module) => (
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
            onValueChange={(value) => onUpdate({ proposed_lecturer: value })}
            disabled={loadingLecturers}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingLecturers ? 'Loading...' : 'Select lecturer'} />
            </SelectTrigger>
            <SelectContent>
              {lecturers.map((lecturer) => (
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
            onChange={(event) => onUpdate({ proposed_academic_year: event.target.value })}
            placeholder="2025/2026"
          />
        </div>
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select
            value={String(item.proposed_semester)}
            onValueChange={(value) => onUpdate({ proposed_semester: Number(value) })}
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
            onUpdate({
              proposed_is_primary: Boolean(checked),
            })
          }
        />
        <Label>Primary Lecturer</Label>
      </div>
    </div>
  );
}
