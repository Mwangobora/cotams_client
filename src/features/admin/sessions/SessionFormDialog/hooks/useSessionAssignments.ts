import { useMemo } from 'react';
import type { ModuleLecturerAssignment } from '@/types/module-lecturers';
import type { AcademicSubmission } from '@/types/submissions';
import type { Module } from '@/types/modules';
import type { Lecturer } from '@/types/lecturers';

interface UseSessionAssignmentsParams {
  assignments: ModuleLecturerAssignment[];
  submissions: AcademicSubmission[];
  modules: Module[];
  lecturers: Lecturer[];
}

export function useSessionAssignments({
  assignments,
  submissions,
  modules,
  lecturers,
}: UseSessionAssignmentsParams) {
  const moduleMap = useMemo(
    () => new Map(modules.map((m: Module) => [m.id, `${m.code} ${m.name}`])),
    [modules]
  );
  const lecturerMap = useMemo(
    () => new Map(lecturers.map((l: Lecturer) => [l.id, l.name])),
    [lecturers]
  );

  const combinedAssignments = useMemo(() => {
    const pending = submissions.flatMap((submission: AcademicSubmission) =>
      (submission.module_lecturer_items || []).map((item) => ({
        id: `pending:${item.id}`,
        rawId: item.id,
        source: 'PENDING' as const,
        lecturer: item.proposed_lecturer || '',
        module: item.proposed_module || '',
        lecturer_name: lecturerMap.get(item.proposed_lecturer || '') || item.proposed_lecturer || '',
        module_name: moduleMap.get(item.proposed_module || '') || item.proposed_module || '',
        module_code: '',
      }))
    );

    const live = assignments.map((item: ModuleLecturerAssignment) => ({
      ...item,
      id: `live:${item.id}`,
      rawId: item.id,
      source: 'LIVE' as const,
    }));

    return [...live, ...pending];
  }, [assignments, submissions, lecturerMap, moduleMap]);

  const lecturerOptions = useMemo(
    () =>
      Array.from(
        new Map(
          combinedAssignments.map((item) => [
            item.lecturer,
            {
              id: item.lecturer,
              name: String(item.lecturer_name || item.lecturer || ''),
            },
          ])
        ).values()
      ),
    [combinedAssignments]
  );

  return { combinedAssignments, lecturerOptions };
}
