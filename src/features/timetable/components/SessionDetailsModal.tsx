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
      accent: 'text-primary',
    },
    {
      icon: User,
      label: 'Lecturer',
      value: session.lecturer_name,
      subtitle: session.lecturer_employee_id,
      accent: 'text-primary',
    },
    {
      icon: Users,
      label: 'Stream',
      value: session.stream_name || session.stream_code,
      subtitle: session.stream_code,
      accent: 'text-primary',
    },
    {
      icon: MapPin,
      label: 'Room',
      value: session.room_name,
      subtitle: `${session.room_code} - ${session.room_building}`,
      accent: 'text-primary',
    },
    {
      icon: Clock,
      label: 'Time',
      value: `${session.day_display}, ${session.display_time}`,
      subtitle: session.duration_hours ? `Duration: ${session.duration_hours} hours` : undefined,
      accent: 'text-primary',
    },
    {
      icon: Calendar,
      label: 'Academic Period',
      value: `${session.academic_year}`,
      subtitle: session.semester_display,
      accent: 'text-primary',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl bg-card border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            Session Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Details of the selected timetable session.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Session Type Badge */}
          <div className="flex justify-center">
            <Badge className="bg-primary/10 text-primary border-primary/30 text-sm">
              {session.session_type_display}
            </Badge>
          </div>

          <Separator className="bg-border/60" />

          {/* Details */}
          <div className="grid gap-3 md:grid-cols-2">
            {detailItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/60 p-3">
                <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground shrink-0">
                  <item.icon className={`h-5 w-5 ${item.accent}`} />
                </span>
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
              <Separator className="bg-border/60" />
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
