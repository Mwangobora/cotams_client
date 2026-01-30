/**
 * Session Details Modal Component
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Users, 
  Calendar,
  GraduationCap
} from 'lucide-react';
import type { Session } from '../types';

interface SessionDetailsModalProps {
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionDetailsModal({ session, open, onOpenChange }: SessionDetailsModalProps) {
  const detailItems = [
    {
      icon: BookOpen,
      label: 'Module',
      value: session.module_name,
      subtitle: session.module_code,
    },
    {
      icon: User,
      label: 'Lecturer',
      value: session.lecturer_name,
      subtitle: session.lecturer_employee_id,
    },
    {
      icon: Users,
      label: 'Stream',
      value: session.stream_name || session.stream_code,
      subtitle: session.stream_code,
    },
    {
      icon: MapPin,
      label: 'Room',
      value: session.room_name,
      subtitle: `${session.room_code} - ${session.room_building}`,
    },
    {
      icon: Clock,
      label: 'Time',
      value: `${session.day_display}, ${session.display_time}`,
      subtitle: session.duration_hours ? `Duration: ${session.duration_hours} hours` : undefined,
    },
    {
      icon: Calendar,
      label: 'Academic Period',
      value: `${session.academic_year}`,
      subtitle: session.semester_display,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Session Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this timetable session including module, lecturer, room and schedule information.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Session Type Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-sm">
              {session.session_type_display}
            </Badge>
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-4">
            {detailItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold wrap-break-word">
                    {item.value}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Timestamps */}
          {session.created_at && (
            <>
              <Separator />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Created: {new Date(session.created_at).toLocaleString()}</p>
                {session.updated_at && (
                  <p>Updated: {new Date(session.updated_at).toLocaleString()}</p>
                )}
                {session.created_by_email && (
                  <p>Created by: {session.created_by_email}</p>
                )}
              </div>
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}