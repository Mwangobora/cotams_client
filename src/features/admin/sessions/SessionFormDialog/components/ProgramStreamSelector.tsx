import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Program, ProgramYear } from '@/types/programs';
import type { Stream } from '@/types/streams';

interface ProgramStreamSelectorProps {
  programs: Program[];
  programYears: ProgramYear[];
  streams: Stream[];
  selectedProgram: string;
  selectedProgramYear: string;
  selectedStream: string;
  onProgramChange: (value: string) => void;
  onProgramYearChange: (value: string) => void;
  onStreamChange: (value: string) => void;
}

export function ProgramStreamSelector({
  programs,
  programYears,
  streams,
  selectedProgram,
  selectedProgramYear,
  selectedStream,
  onProgramChange,
  onProgramYearChange,
  onStreamChange,
}: ProgramStreamSelectorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div>
        <Label>Program</Label>
        <Select value={selectedProgram} onValueChange={onProgramChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select program" />
          </SelectTrigger>
          <SelectContent>
            {programs.length === 0 && (
              <SelectItem value="__none" disabled>
                No programs found
              </SelectItem>
            )}
            {programs.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.code} - {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Year of Study</Label>
        <Select
          value={selectedProgramYear}
          onValueChange={onProgramYearChange}
          disabled={!selectedProgram}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {programYears.length === 0 && (
              <SelectItem value="__none" disabled>
                No program years found
              </SelectItem>
            )}
            {programYears.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                Year {year.year_number} {year.name ? `- ${year.name}` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Stream</Label>
        <Select
          value={selectedStream}
          onValueChange={onStreamChange}
          disabled={!selectedProgramYear}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select stream" />
          </SelectTrigger>
          <SelectContent>
            {streams.length === 0 && (
              <SelectItem value="__none" disabled>
                No streams found
              </SelectItem>
            )}
            {streams.map((stream) => (
              <SelectItem key={stream.id} value={stream.id}>
                {stream.stream_code} {stream.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
