import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Lecturer } from '@/types/lecturers';
import type { Module } from '@/types/modules';
import { ModuleLecturerAssignmentCard } from './ModuleLecturerAssignmentCard';
import type { ModuleLecturerDraft } from './ModuleLecturerAssignmentCard';

interface LecturerAssignmentsSectionProps {
  items: ModuleLecturerDraft[];
  modules: Module[];
  lecturers: Lecturer[];
  loadingModules: boolean;
  loadingLecturers: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: Partial<ModuleLecturerDraft>) => void;
}

export function LecturerAssignmentsSection({
  items,
  modules,
  lecturers,
  loadingModules,
  loadingLecturers,
  onAdd,
  onRemove,
  onUpdate,
}: LecturerAssignmentsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Lecturer Assignments</CardTitle>
        <Button type="button" variant="outline" onClick={onAdd}>
          Add Assignment
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No lecturer assignments yet.</div>
        ) : (
          items.map((item, index) => (
            <ModuleLecturerAssignmentCard
              key={`${item.proposed_module}-${index}`}
              index={index}
              item={item}
              modules={modules}
              lecturers={lecturers}
              loadingModules={loadingModules}
              loadingLecturers={loadingLecturers}
              onRemove={() => onRemove(index)}
              onUpdate={(value) => onUpdate(index, value)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
