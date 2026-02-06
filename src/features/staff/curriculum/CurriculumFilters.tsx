import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Program, ProgramYear } from '@/types/programs';

interface CurriculumFiltersProps {
  programs: Program[];
  programYears: ProgramYear[];
  selectedProgram: string;
  selectedYear: string;
  selectedSemester: string;
  onProgramChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
}

export function CurriculumFilters({
  programs,
  programYears,
  selectedProgram,
  selectedYear,
  selectedSemester,
  onProgramChange,
  onYearChange,
  onSemesterChange,
}: CurriculumFiltersProps) {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-2">
        <Label>Program</Label>
        <Select
          value={selectedProgram || '__all'}
          onValueChange={(value) => onProgramChange(value === '__all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All programs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All programs</SelectItem>
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
          value={selectedYear || '__all'}
          onValueChange={(value) => onYearChange(value === '__all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All years</SelectItem>
            {programYears.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                {year.program_code || year.program_name || 'Program'} - Year {year.year_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Semester</Label>
        <Select
          value={selectedSemester || '__all'}
          onValueChange={(value) => onSemesterChange(value === '__all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All semesters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All semesters</SelectItem>
            {[1, 2, 3, 4].map((value) => (
              <SelectItem key={value} value={String(value)}>
                Semester {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
