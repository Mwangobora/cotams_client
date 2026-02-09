/**
 * Session Card Component - displays session in grid/list view
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SessionDetailsModal } from './index';
import { Clock, MapPin, User, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Session } from '../types';

interface SessionCardProps {
  session: Session;
  variant?: 'grid' | 'list';
  className?: string;
}

export function SessionCard({ session, variant = 'grid', className }: SessionCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const isGrid = variant === 'grid';

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDetails(true)}
      >
        <Card className={cn(
          'cursor-pointer transition-all duration-150 hover:shadow-md border-[#E5E7EB]',
          isGrid && 'text-xs',
          className
        )}>
          <CardContent className={cn(
            'p-3',
            isGrid ? 'space-y-1.5' : 'space-y-2'
          )}>
            {/* Module */}
            <div className="flex items-center gap-2">
              <BookOpen className={cn('shrink-0 text-[#0992C2]', isGrid ? 'h-3 w-3' : 'h-4 w-4')} />
              <div className="min-w-0">
                <p className={cn('font-semibold truncate text-[#0F172A]', isGrid ? 'text-xs' : 'text-sm')}>
                  {session.module_code}
                </p>
                {!isGrid && (
                  <p className="text-xs text-[#64748B] truncate">
                    {session.module_name}
                  </p>
                )}
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock className={cn('shrink-0 text-[#64748B]', isGrid ? 'h-3 w-3' : 'h-4 w-4')} />
              <span className={cn('text-[#64748B]', isGrid ? 'text-xs' : 'text-sm')}>
                {session.display_time}
              </span>
            </div>

            {/* Room */}
            <div className="flex items-center gap-2">
              <MapPin className={cn('shrink-0 text-[#64748B]', isGrid ? 'h-3 w-3' : 'h-4 w-4')} />
              <span className={cn('text-[#64748B] truncate', isGrid ? 'text-xs' : 'text-sm')}>
                {session.room_code}
              </span>
            </div>

            {/* Lecturer (list view only) */}
            {!isGrid && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 shrink-0 text-[#64748B]" />
                <span className="text-sm text-[#64748B] truncate">
                  {session.lecturer_name}
                </span>
              </div>
            )}

            {/* Session Type Badge */}
            <div className="flex justify-between items-center">
              <Badge 
                variant="secondary" 
                className={cn(isGrid ? 'text-xs px-1.5 py-0.5' : 'text-xs')}
              >
                {session.session_type_display}
              </Badge>
              
              {isGrid && session.duration_hours && (
                <span className="text-xs text-[#64748B] font-medium">
                  {session.duration_hours}h
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <SessionDetailsModal
        session={session}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
}