import { useEffect, useState } from 'react';
import type { DayOfWeek, Session, SessionFormData, SessionType, Semester } from '@/types/sessions';

interface UseSessionFormStateParams {
  session?: Session | null;
  open: boolean;
}

interface UseSessionFormStateResult {
  formData: SessionFormData;
  setFormData: React.Dispatch<React.SetStateAction<SessionFormData>>;
  selectedAssignmentId: string;
  setSelectedAssignmentId: React.Dispatch<React.SetStateAction<string>>;
  selectedProgram: string;
  setSelectedProgram: React.Dispatch<React.SetStateAction<string>>;
  selectedProgramYear: string;
  setSelectedProgramYear: React.Dispatch<React.SetStateAction<string>>;
  clashError: string;
  setClashError: React.Dispatch<React.SetStateAction<string>>;
}

export function useSessionFormState({ session, open }: UseSessionFormStateParams): UseSessionFormStateResult {
  const baseYear = new Date().getFullYear();
  const currentYear = `${baseYear}/${baseYear + 1}`;
  const [formData, setFormData] = useState<SessionFormData>({
    stream: '',
    module: '',
    lecturer: '',
    room: '',
    day_of_week: 'MON' as DayOfWeek,
    start_time: '',
    end_time: '',
    session_type: 'LECTURE' as SessionType,
    academic_year: currentYear,
    semester: 'SEMESTER_1' as Semester,
  });
  const [clashError, setClashError] = useState<string>('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedProgramYear, setSelectedProgramYear] = useState<string>('');

  useEffect(() => {
    if (session) {
      setFormData({
        stream: session.stream || '',
        module: session.module || '',
        lecturer: session.lecturer || '',
        room: session.room || '',
        day_of_week: session.day_of_week,
        start_time: session.start_time,
        end_time: session.end_time,
        session_type: session.session_type,
        academic_year: session.academic_year,
        semester: session.semester,
      });
    } else {
      setFormData({
        stream: '',
        module: '',
        lecturer: '',
        room: '',
        day_of_week: 'MON' as DayOfWeek,
        start_time: '',
        end_time: '',
        session_type: 'LECTURE' as SessionType,
        academic_year: currentYear,
        semester: 'SEMESTER_1' as Semester,
      });
      setSelectedAssignmentId('');
      setSelectedProgram('');
      setSelectedProgramYear('');
    }
    setClashError('');
  }, [session, open, currentYear]);

  return {
    formData,
    setFormData,
    selectedAssignmentId,
    setSelectedAssignmentId,
    selectedProgram,
    setSelectedProgram,
    selectedProgramYear,
    setSelectedProgramYear,
    clashError,
    setClashError,
  };
}
