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
import { ProgramStreamSelector } from './ProgramStreamSelector';
import { LecturerModuleSelector } from './LecturerModuleSelector';
import { RoomSelector } from './RoomSelector';
import { ScheduleFields } from './ScheduleFields';
import type { SessionFormDialogViewProps } from './SessionFormDialogView.types';

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
}: SessionFormDialogViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[85vh] overflow-y-auto sm:max-h-[90vh]">
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
              academicYear={academicYear}
              semester={semester}
              startTime={startTime}
              endTime={endTime}
              onDayChange={onDayChange}
              onTypeChange={onTypeChange}
              onAcademicYearChange={onAcademicYearChange}
              onSemesterChange={onSemesterChange}
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
