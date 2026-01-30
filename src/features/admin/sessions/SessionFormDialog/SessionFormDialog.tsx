import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from 'sonner';
import { SessionsApi } from '@/apis/SessionsApi';
import { RoomsApi } from '@/apis/RoomsApi';
import { ProgramsApi } from '@/apis/ProgramsApi';
import { LecturersApi } from '@/apis/LecturersApi';
import type { Session, SessionFormData, DayOfWeek, SessionType, Semester } from '@/types/sessions';

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
  
  const queryClient = useQueryClient();
  const sessionsApi = new SessionsApi();
  const roomsApi = new RoomsApi();
  const programsApi = new ProgramsApi();
  const lecturersApi = new LecturersApi();

  // Fetch options for dropdowns
  const { data: roomsResponse } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsApi.getRooms()
  });
  const rooms = Array.isArray(roomsResponse) ? roomsResponse : roomsResponse?.results || [];

  const { data: programsResponse } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programsApi.getPrograms()
  });
  const programs = Array.isArray(programsResponse) ? programsResponse : programsResponse?.results || [];

  const { data: lecturersResponse } = useQuery({
    queryKey: ['lecturers'],
    queryFn: () => lecturersApi.getLecturers()
  });
  const lecturers = Array.isArray(lecturersResponse) ? lecturersResponse : (lecturersResponse as any)?.results || [];

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
    }
    setClashError('');
  }, [session, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {session ? 'Edit Session' : 'Add Session'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {clashError && (
              <Alert variant="destructive">
                <AlertDescription>{clashError}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label>Module</Label>
              <Select
                value={formData.module}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, module: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {programs.flatMap((p: any) => 
                    p.courses?.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </SelectItem>
                    )) || []
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lecturer</Label>
              <Select
                value={formData.lecturer}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, lecturer: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lecturer" />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map((l: any) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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