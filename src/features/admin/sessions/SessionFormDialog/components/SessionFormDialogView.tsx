import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Session, DayOfWeek, SessionType } from '@/types/sessions';
import type { Program, ProgramYear } from '@/types/programs';
import type { Stream } from '@/types/streams';
import { ProgramStreamSelector } from './ProgramStreamSelector';
import { LecturerModuleSelector } from './LecturerModuleSelector';
import { RoomSelector } from './RoomSelector';
import { ScheduleFields } from './ScheduleFields';

interface SessionFormDialogViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
  clashError: string;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  programs: Program[];
  programYears: ProgramYear[];
  streams: Stream[];
  selectedProgram: string;
  selectedProgramYear: string;
  selectedStream: string;
  onProgramChange: (value: string) => void;
  onProgramYearChange: (value: string) => void;
  onStreamChange: (value: string) => void;
  lecturerOptions: Array<{ id: string; name: string }>;
  moduleOptionsForLecturer: Array<{
    id: string;
    module: string;
    module_name?: string;
    module_code?: string;
    source?: 'LIVE' | 'PENDING';
  }>;
  selectedLecturer: string;
  selectedModule: string;
  selectedAssignmentName: string;
  selectedLecturerName: string;
  onLecturerChange: (value: string) => void;
  onModuleChange: (value: string) => void;
  rooms: Array<{ id: string; name: string; capacity?: number }>;
  selectedRoom: string;
  onRoomChange: (value: string) => void;
  dayOfWeek: DayOfWeek;
  sessionType: SessionType;
  startTime: string;
  endTime: string;
  onDayChange: (value: DayOfWeek) => void;
  onTypeChange: (value: SessionType) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export function SessionFormDialogView({
  open,
  onOpenChange,
  session,
  clashError,
  onSubmit,
  saving,
  programs,
  programYears,
  streams,
  selectedProgram,
  selectedProgramYear,
  selectedStream,
  onProgramChange,
  onProgramYearChange,
  onStreamChange,
  lecturerOptions,
  moduleOptionsForLecturer,
  selectedLecturer,
  selectedModule,
  selectedAssignmentName,
  selectedLecturerName,
  onLecturerChange,
  onModuleChange,
  rooms,
  selectedRoom,
  onRoomChange,
  dayOfWeek,
  sessionType,
  startTime,
  endTime,
  onDayChange,
  onTypeChange,
  onStartTimeChange,
  onEndTimeChange,
}: SessionFormDialogViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{session ? 'Edit Session' : 'Add Session'}</DialogTitle>
            <DialogDescription>
              Choose a program, year, and stream before picking lecturer and module.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {clashError && (
              <Alert variant="destructive">
                <AlertDescription>{clashError}</AlertDescription>
              </Alert>
            )}
            <ProgramStreamSelector
              programs={programs}
              programYears={programYears}
              streams={streams}
              selectedProgram={selectedProgram}
              selectedProgramYear={selectedProgramYear}
              selectedStream={selectedStream}
              onProgramChange={onProgramChange}
              onProgramYearChange={onProgramYearChange}
              onStreamChange={onStreamChange}
            />
            <LecturerModuleSelector
              lecturerOptions={lecturerOptions}
              moduleOptionsForLecturer={moduleOptionsForLecturer}
              selectedLecturer={selectedLecturer}
              selectedModule={selectedModule}
              selectedAssignmentName={selectedAssignmentName}
              selectedLecturerName={selectedLecturerName}
              onLecturerChange={onLecturerChange}
              onModuleChange={onModuleChange}
              disabled={!selectedStream}
            />
            <RoomSelector rooms={rooms} value={selectedRoom} onChange={onRoomChange} />
            <ScheduleFields
              dayOfWeek={dayOfWeek}
              sessionType={sessionType}
              startTime={startTime}
              endTime={endTime}
              onDayChange={onDayChange}
              onTypeChange={onTypeChange}
              onStartTimeChange={onStartTimeChange}
              onEndTimeChange={onEndTimeChange}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
