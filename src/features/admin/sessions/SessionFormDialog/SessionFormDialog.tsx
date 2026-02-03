import type { Session } from '@/types/sessions';
import { useSessionFormController } from './hooks/useSessionFormController';
import { SessionFormDialogView } from './components/SessionFormDialogView';

interface SessionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
}

export function SessionFormDialog({ open, onOpenChange, session }: SessionFormDialogProps) {
  const controller = useSessionFormController({
    open,
    session,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <SessionFormDialogView
      open={open}
      onOpenChange={onOpenChange}
      session={session}
      clashError={controller.state.clashError}
      onSubmit={controller.handleSubmit}
      saving={controller.mutation.isPending}
      programs={controller.options.programs}
      programYears={controller.options.programYears}
      streams={controller.options.streams}
      selectedProgram={controller.state.selectedProgram}
      selectedProgramYear={controller.state.selectedProgramYear}
      selectedStream={controller.state.formData.stream}
      onProgramChange={controller.setProgram}
      onProgramYearChange={controller.setProgramYear}
      onStreamChange={controller.setStream}
      lecturerOptions={controller.lecturerOptions}
      moduleOptionsForLecturer={controller.moduleOptionsForLecturer}
      selectedLecturer={controller.state.formData.lecturer}
      selectedModule={controller.state.formData.module}
      selectedAssignmentName={
        controller.selectedAssignment?.module_name ||
        controller.selectedAssignment?.module_code ||
        controller.state.formData.module
      }
      selectedLecturerName={String(
        controller.selectedAssignment?.lecturer_name || controller.state.formData.lecturer || ''
      )}
      onLecturerChange={controller.setLecturer}
      onModuleChange={controller.setModule}
      rooms={controller.options.rooms}
      selectedRoom={controller.state.formData.room}
      onRoomChange={controller.setRoom}
      dayOfWeek={controller.state.formData.day_of_week}
      sessionType={controller.state.formData.session_type}
      startTime={controller.state.formData.start_time}
      endTime={controller.state.formData.end_time}
      onDayChange={controller.setDayOfWeek}
      onTypeChange={controller.setSessionType}
      onStartTimeChange={controller.setStartTime}
      onEndTimeChange={controller.setEndTime}
    />
  );
}
