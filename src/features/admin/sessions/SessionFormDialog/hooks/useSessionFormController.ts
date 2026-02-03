import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SessionsApi } from '@/apis/SessionsApi';
import type { Session, SessionFormData, DayOfWeek, SessionType, Semester } from '@/types/sessions';
import { useSessionFormState } from './useSessionFormState';
import { useSessionOptions } from './useSessionOptions';
import { useSessionAssignments } from './useSessionAssignments';

interface UseSessionFormControllerParams {
  open: boolean;
  session?: Session | null;
  onSuccess: () => void;
}

export function useSessionFormController({
  open,
  session,
  onSuccess,
}: UseSessionFormControllerParams) {
  const queryClient = useQueryClient();
  const sessionsApi = new SessionsApi();

  const state = useSessionFormState({ session, open });
  const options = useSessionOptions({
    open,
    selectedProgram: state.selectedProgram,
    selectedProgramYear: state.selectedProgramYear,
  });

  const { combinedAssignments, lecturerOptions } = useSessionAssignments({
    assignments: options.assignments,
    submissions: options.submissions,
    modules: options.modules,
    lecturers: options.lecturers,
  });

  const selectedAssignment = useMemo(
    () => combinedAssignments.find((item) => item.id === state.selectedAssignmentId),
    [combinedAssignments, state.selectedAssignmentId]
  );

  const moduleOptionsForLecturer = useMemo(
    () => combinedAssignments.filter((item) => item.lecturer === state.formData.lecturer),
    [combinedAssignments, state.formData.lecturer]
  );

  const mutation = useMutation({
    mutationFn: (data: SessionFormData) =>
      session ? sessionsApi.updateSession(session.id, data) : sessionsApi.createSession(data),
    onSuccess: () => {
      toast.success(session ? 'Session updated successfully' : 'Session created successfully');
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      onSuccess();
      state.setClashError('');
    },
    onError: (error: any) => {
      if (error.clash_details) {
        state.setClashError(
          `Time clash detected: ${error.clash_details.conflicting_sessions
            .map((s: any) => `${s.module_name} (${s.start_time}-${s.end_time})`)
            .join(', ')}`
        );
      } else {
        toast.error(`Error: ${error.message}`);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(state.formData);
  };

  return {
    state,
    options,
    combinedAssignments,
    lecturerOptions,
    selectedAssignment,
    moduleOptionsForLecturer,
    mutation,
    handleSubmit,
    setProgram: (value: string) => {
      state.setSelectedProgram(value);
      state.setSelectedProgramYear('');
      state.setFormData((prev) => ({ ...prev, stream: '', module: '', lecturer: '' }));
      state.setSelectedAssignmentId('');
    },
    setProgramYear: (value: string) => {
      state.setSelectedProgramYear(value);
      state.setFormData((prev) => ({ ...prev, stream: '', module: '', lecturer: '' }));
      state.setSelectedAssignmentId('');
    },
    setStream: (value: string) => state.setFormData((prev) => ({ ...prev, stream: value })),
    setLecturer: (value: string) => {
      state.setFormData((prev) => ({ ...prev, lecturer: value, module: '' }));
      state.setSelectedAssignmentId('');
      const modulesForLecturer = combinedAssignments.filter((item) => item.lecturer === value);
      if (modulesForLecturer.length === 1) {
        const only = modulesForLecturer[0];
        state.setFormData((prev) => ({ ...prev, lecturer: value, module: only.module }));
        state.setSelectedAssignmentId(only.id);
      }
    },
    setModule: (value: string) => {
      state.setFormData((prev) => ({ ...prev, module: value }));
      const match = moduleOptionsForLecturer.find((item) => item.module === value);
      state.setSelectedAssignmentId(match?.id || '');
    },
    setRoom: (value: string) => state.setFormData((prev) => ({ ...prev, room: value })),
    setDayOfWeek: (value: DayOfWeek) =>
      state.setFormData((prev) => ({ ...prev, day_of_week: value })),
    setSessionType: (value: SessionType) =>
      state.setFormData((prev) => ({ ...prev, session_type: value })),
    setAcademicYear: (value: string) =>
      state.setFormData((prev) => ({ ...prev, academic_year: value })),
    setSemester: (value: Semester) =>
      state.setFormData((prev) => ({ ...prev, semester: value })),
    setStartTime: (value: string) => state.setFormData((prev) => ({ ...prev, start_time: value })),
    setEndTime: (value: string) => state.setFormData((prev) => ({ ...prev, end_time: value })),
  };
}
