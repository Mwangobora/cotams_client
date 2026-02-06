import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProgramYear, Program } from '@/types/programs';
import type { Module } from '@/types/modules';
import type { Curriculum, CurriculumFormData } from '@/types/curriculum';

interface CurriculumFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CurriculumFormData) => void;
  loading?: boolean;
  programs: Program[];
  programYears: ProgramYear[];
  modules: Module[];
  initial?: Curriculum | null;
}

export function CurriculumFormDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  programs,
  programYears,
  modules,
  initial,
}: CurriculumFormDialogProps) {
  const [programId, setProgramId] = useState('');
  const [form, setForm] = useState<CurriculumFormData>({
    program_year: '',
    module: '',
    semester: 1,
    is_core: true,
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      program_year: initial?.program_year || '',
      module: initial?.module || '',
      semester: initial?.semester || 1,
      is_core: initial?.is_core ?? true,
    });
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    if (initial?.program_year) {
      const year = programYears.find((y) => y.id === initial.program_year);
      if (year?.program) setProgramId(year.program);
      return;
    }
    if (!programId && programs.length > 0) setProgramId(programs[0].id);
  }, [open, initial, programYears, programs, programId]);

  const filteredYears = programYears.filter((y) => !programId || y.program === programId);

  const handleSubmit = () => {
    if (!form.program_year || !form.module) return;
    onSubmit(form);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Curriculum' : 'Add Curriculum'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Program</Label>
            <Select value={programId} onValueChange={setProgramId}>
              <SelectTrigger>
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.code} - {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Program Year</Label>
            <Select
              value={form.program_year}
              onValueChange={(value) => setForm((prev) => ({ ...prev, program_year: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select program year" />
              </SelectTrigger>
              <SelectContent>
                {filteredYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.program_code || year.program_name || 'Program'} - Year {year.year_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Module</Label>
            <Select
              value={form.module}
              onValueChange={(value) => setForm((prev) => ({ ...prev, module: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.code} - {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Semester</Label>
            <Select
              value={String(form.semester)}
              onValueChange={(value) => setForm((prev) => ({ ...prev, semester: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    Semester {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.is_core}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_core: Boolean(checked) }))}
            />
            <Label>Core module</Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || !form.program_year || !form.module}>
            {loading ? 'Saving...' : initial ? 'Update Curriculum' : 'Add Curriculum'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
