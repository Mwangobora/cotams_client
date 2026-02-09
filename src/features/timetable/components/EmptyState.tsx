/**
 * Empty State Component for Timetable
 */

import { Calendar, CalendarX, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type?: 'sessions' | 'streams' | 'rooms' | 'lecturers' | 'general';
  onAction?: () => void;
  actionLabel?: string;
  canCreate?: boolean;
}

const emptyStates = {
  sessions: {
    icon: CalendarX,
    title: 'No sessions found',
    description: 'No timetable sessions match your current filters. Try adjusting your search criteria.',
  },
  streams: {
    icon: Users,
    title: 'No streams available',
    description: 'No academic streams have been created yet.',
  },
  rooms: {
    icon: MapPin,
    title: 'No rooms available',
    description: 'No rooms have been added to the system.',
  },
  lecturers: {
    icon: Users,
    title: 'No lecturers available',
    description: 'No lecturers are available for assignment.',
  },
  general: {
    icon: Calendar,
    title: 'Welcome to the Timetable',
    description: 'Your class schedule will appear here once sessions are created.',
  }
};

export function EmptyState({ 
  type = 'sessions', 
  onAction, 
  actionLabel,
  canCreate = false 
}: EmptyStateProps) {
  const config = emptyStates[type];
  const Icon = config.icon;

  return (
    <Card className="border-dashed border-border bg-card">
      <CardContent className="p-12 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        
        <h3 className="mb-2 text-lg font-semibold">
          {config.title}
        </h3>
        
        <p className="mb-4 text-sm text-muted-foreground max-w-sm mx-auto">
          {config.description}
        </p>

        {canCreate && onAction && actionLabel && (
          <Button onClick={onAction} variant="default">
            {actionLabel}
          </Button>
        )}

        {type === 'sessions' && (
          <div className="mt-6 text-xs text-muted-foreground">
            <p>Try clearing filters or checking different time periods</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}