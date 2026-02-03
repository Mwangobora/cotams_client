import { useMemo, useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SessionsApi } from '@/apis/SessionsApi';
import { RoomsApi } from '@/apis/RoomsApi';
import { ModuleLecturersApi } from '@/apis/ModuleLecturersApi';
import { SubmissionsApi } from '@/apis/SubmissionsApi';
import { ModulesApi } from '@/apis/ModulesApi';
import { LecturersApi } from '@/apis/LecturersApi';
import { TimetableApi } from '@/apis/TimetableApi';
import type { ModuleLecturerAssignment } from '@/types/module-lecturers';
import type { AcademicSubmission } from '@/types/submissions';
import type { Module } from '@/types/modules';
import type { Lecturer } from '@/types/lecturers';
import type { Session, SessionFormData, DayOfWeek, SessionType, Semester } from '@/types/sessions';
import type { Stream } from '@/features/timetable/types';

interface SessionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
}

export function SessionFormDialog({ 
  open, 
  onOpenChange, 
  session 
}: SessionFormDialogProps) {
  const [formData, setFormData] = useState<SessionFormData>({
    stream: '',
    module: '',
    lecturer: '',
    room: '',
    day_of_week: 'MON' as DayOfWeek,
    start_time: '',
    end_time: '',
    session_type: 'LECTURE' as SessionType,
    academic_year: '2024',
    semester: 'SEMESTER_1' as Semester
  });
  const [clashError, setClashError] = useState<string>('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  
  const queryClient = useQueryClient();
  const sessionsApi = new SessionsApi();
  const roomsApi = new RoomsApi();
  const moduleLecturersApi = new ModuleLecturersApi();
  const submissionsApi = new SubmissionsApi();
  const modulesApi = new ModulesApi();
  const lecturersApi = new LecturersApi();
  const timetableApi = new TimetableApi();

  // Fetch options for dropdowns
  const { data: roomsResponse } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsApi.getRooms(),
    enabled: open
  });
  const rooms = Array.isArray(roomsResponse) ? roomsResponse : roomsResponse?.results || [];

  const { data: streamsResponse } = useQuery({
    queryKey: ['streams'],
    queryFn: () => timetableApi.getStreams(),
    enabled: open
  });
  const streams = Array.isArray(streamsResponse) ? streamsResponse : streamsResponse?.results || [];

  const { data: assignmentsResponse } = useQuery({
    queryKey: ['module-lecturers'],
    queryFn: () => moduleLecturersApi.getAssignments(),
    enabled: open
  });
  const assignments = Array.isArray(assignmentsResponse)
    ? assignmentsResponse
    : assignmentsResponse?.results || [];

  const { data: submissionsResponse } = useQuery({
    queryKey: ['submissions', 'submitted'],
    queryFn: () => submissionsApi.getSubmissions({ status: 'SUBMITTED' }),
    enabled: open
  });
  const submissions = Array.isArray(submissionsResponse)
    ? submissionsResponse
    : submissionsResponse?.results || [];

  const { data: modulesResponse } = useQuery({
    queryKey: ['modules'],
    queryFn: () => modulesApi.getModules(),
    enabled: open
  });
  const modules = Array.isArray(modulesResponse)
    ? modulesResponse
    : modulesResponse?.results || [];

  const { data: lecturersResponse } = useQuery({
    queryKey: ['lecturers'],
    queryFn: () => lecturersApi.getLecturers(),
    enabled: open
  });
  const lecturers = Array.isArray(lecturersResponse)
    ? lecturersResponse
    : (lecturersResponse as any)?.results || [];

  const mutation = useMutation({
    mutationFn: (data: SessionFormData) => 
      session 
        ? sessionsApi.updateSession(session.id, data)
        : sessionsApi.createSession(data),
    onSuccess: () => {
      toast.success(session ? 'Session updated successfully' : 'Session created successfully');
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      onOpenChange(false);
      setClashError('');
    },
    onError: (error: any) => {
      if (error.clash_details) {
        setClashError(
          `Time clash detected: ${error.clash_details.conflicting_sessions
            .map((s: any) => `${s.module_name} (${s.start_time}-${s.end_time})`)
            .join(', ')}`
        );
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

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

  const selectedAssignment = useMemo(
    () => combinedAssignments.find((item) => item.id === selectedAssignmentId),
    [combinedAssignments, selectedAssignmentId]
  );

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

  const moduleOptionsForLecturer = useMemo(
    () => combinedAssignments.filter((item) => item.lecturer === formData.lecturer),
    [combinedAssignments, formData.lecturer]
  );

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
        semester: session.semester
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
        academic_year: '2024',
        semester: 'SEMESTER_1' as Semester
      });
      setSelectedAssignmentId('');
    }
    setClashError('');
  }, [session, open]);

  // Separate effect for handling assignment matching
  useEffect(() => {
    if (session && combinedAssignments.length > 0) {
      const match = combinedAssignments.find(
        (item) => item.module === session.module && item.lecturer === session.lecturer
      );
      setSelectedAssignmentId(match?.id || '');
    }
  }, [session, combinedAssignments.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {session ? 'Edit Session' : 'Add Session'}
            </DialogTitle>
            <DialogDescription>
              Pick a lecturer, then choose one of their submitted modules.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {clashError && (
              <Alert variant="destructive">
                <AlertDescription>{clashError}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label>Lecturer (from staff assignments)</Label>
                  <Select
                    value={formData.lecturer}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, lecturer: value, module: '' }));
                      setSelectedAssignmentId('');
                      const modulesForLecturer = combinedAssignments.filter(
                        (item) => item.lecturer === value
                      );
                      if (modulesForLecturer.length === 1) {
                        const only = modulesForLecturer[0];
                        setFormData((prev) => ({
                          ...prev,
                          lecturer: value,
                          module: only.module,
                        }));
                        setSelectedAssignmentId(only.id);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lecturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {lecturerOptions.length === 0 && (
                        <SelectItem value="__none" disabled>
                          No lecturer assignments found
                        </SelectItem>
                      )}
                      {lecturerOptions.map((lecturer) => (
                        <SelectItem key={lecturer.id} value={lecturer.id}>
                          {lecturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Module (auto-filtered by lecturer)</Label>
                  <Select
                    value={formData.module}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, module: value }));
                      const match = moduleOptionsForLecturer.find(
                        (item) => item.module === value
                      );
                      setSelectedAssignmentId(match?.id || '');
                    }}
                    disabled={!formData.lecturer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.lecturer ? 'Select module' : 'Select lecturer first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.lecturer && moduleOptionsForLecturer.length === 0 && (
                        <SelectItem value="__none" disabled>
                          No modules for this lecturer
                        </SelectItem>
                      )}
                      {moduleOptionsForLecturer.map((item) => (
                        <SelectItem key={item.id} value={item.module}>
                          {item.module_code || ''} {item.module_name || item.module}
                          {item.source === 'PENDING' && (
                            <Badge variant="secondary" className="ml-2">
                              Pending
                            </Badge>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Selected Module</Label>
                  <Input
                    value={selectedAssignment?.module_name || selectedAssignment?.module_code || formData.module}
                    disabled
                  />
                </div>
                <div>
                  <Label>Selected Lecturer</Label>
                  <Input
                    value={String(selectedAssignment?.lecturer_name || formData.lecturer || '')}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Stream</Label>
              <Select
                value={formData.stream}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, stream: value }))}
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
                  {streams.map((stream: Stream) => (
                    <SelectItem key={stream.id} value={stream.id}>
                      {stream.stream_code} {stream.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Room</Label>
              <Select
                value={formData.room}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, room: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r: any) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} (Cap: {r.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Day</Label>
                <Select
                  value={formData.day_of_week}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, day_of_week: value as DayOfWeek }))
                  }
                >
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
                <Select
                  value={formData.session_type}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, session_type: value as SessionType }))
                  }
                >
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
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, start_time: e.target.value }))
                  }
                />
              </div>
              
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, end_time: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
