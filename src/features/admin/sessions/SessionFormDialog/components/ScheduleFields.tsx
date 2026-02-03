import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DayOfWeek, SessionType } from '@/types/sessions';

interface ScheduleFieldsProps {
  dayOfWeek: DayOfWeek;
  sessionType: SessionType;
  startTime: string;
  endTime: string;
  onDayChange: (value: DayOfWeek) => void;
  onTypeChange: (value: SessionType) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export function ScheduleFields({
  dayOfWeek,
  sessionType,
  startTime,
  endTime,
  onDayChange,
  onTypeChange,
  onStartTimeChange,
  onEndTimeChange,
}: ScheduleFieldsProps) {
  return (
    <>
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
