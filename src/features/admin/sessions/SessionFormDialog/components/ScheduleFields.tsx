import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DayOfWeek, SessionType, Semester } from '@/types/sessions';

interface ScheduleFieldsProps {
  dayOfWeek: DayOfWeek;
  sessionType: SessionType;
  academicYear: string;
  semester: Semester;
  startTime: string;
  endTime: string;
  onDayChange: (value: DayOfWeek) => void;
  onTypeChange: (value: SessionType) => void;
  onAcademicYearChange: (value: string) => void;
  onSemesterChange: (value: Semester) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export function ScheduleFields({
  dayOfWeek,
  sessionType,
  academicYear,
  semester,
  startTime,
  endTime,
  onDayChange,
  onTypeChange,
  onAcademicYearChange,
  onSemesterChange,
  onStartTimeChange,
  onEndTimeChange,
}: ScheduleFieldsProps) {
  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 5 }, (_, i) => currentYear + i - 2).map(
    (year) => `${year}/${year + 1}`
  );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Academic Year</Label>
          <Select value={academicYear} onValueChange={onAcademicYearChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Semester</Label>
          <Select value={semester} onValueChange={onSemesterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SEMESTER_1">Semester 1</SelectItem>
              <SelectItem value="SEMESTER_2">Semester 2</SelectItem>
              <SelectItem value="YEAR_LONG">Year Long</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Day</Label>
          <Select value={dayOfWeek} onValueChange={onDayChange}>
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MON">Monday</SelectItem>
              <SelectItem value="TUE">Tuesday</SelectItem>
              <SelectItem value="WED">Wednesday</SelectItem>
              <SelectItem value="THU">Thursday</SelectItem>
              <SelectItem value="FRI">Friday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Type</Label>
          <Select value={sessionType} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LECTURE">Lecture</SelectItem>
              <SelectItem value="LAB">Lab</SelectItem>
              <SelectItem value="TUTORIAL">Tutorial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Start Time</Label>
          <Input type="time" value={startTime} onChange={(e) => onStartTimeChange(e.target.value)} />
        </div>

        <div>
          <Label>End Time</Label>
          <Input type="time" value={endTime} onChange={(e) => onEndTimeChange(e.target.value)} />
        </div>
      </div>
    </>
  );
}
