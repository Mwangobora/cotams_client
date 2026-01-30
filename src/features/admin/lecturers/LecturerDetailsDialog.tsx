/**
 * Lecturer Details Dialog Component
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Lecturer } from '@/types/lecturers';

interface LecturerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lecturer?: Lecturer | null;
}

export function LecturerDetailsDialog({ 
  open, 
  onOpenChange, 
  lecturer 
}: LecturerDetailsDialogProps) {
  if (!lecturer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {lecturer.name || 'Lecturer'}
            <Badge variant={lecturer.is_active ? 'default' : 'secondary'}>
              {lecturer.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lecturer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Lecturer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Employee ID
                  </label>
                  <p className="text-sm font-mono">{lecturer.employee_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-sm">{lecturer.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="text-sm">{lecturer.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Department
                  </label>
                  <p className="text-sm">{lecturer.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Specialization
                  </label>
                  <p className="text-sm">
                    {Array.isArray(lecturer.specialization) 
                      ? lecturer.specialization.join(', ')
                      : lecturer.specialization || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Office Location
                  </label>
                  <p className="text-sm">{lecturer.office_location || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses */}
          {lecturer.courses && lecturer.courses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Teaching Assignments ({lecturer.courses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Semester</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lecturer.courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-mono">
                          {course.code}
                        </TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.credit_hours}</TableCell>
                        <TableCell>{course.program_name}</TableCell>
                        <TableCell>{course.academic_year}</TableCell>
                        <TableCell>{course.semester}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Schedule */}
          {lecturer.schedule && lecturer.schedule.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Current Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lecturer.schedule.map((session, index) => (
                      <TableRow key={index}>
                        <TableCell>{session.day_of_week}</TableCell>
                        <TableCell>
                          {session.start_time} - {session.end_time}
                        </TableCell>
                        <TableCell>{session.course_name}</TableCell>
                        <TableCell>{session.room_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {session.session_type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}