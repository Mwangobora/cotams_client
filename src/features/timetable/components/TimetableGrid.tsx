/**
 * Desktop Weekly Timetable Grid Component
 */

import { motion } from 'framer-motion';
import { SessionCard } from './index';
import { DAYS, TIME_SLOTS } from '../types';
import type { SessionsByDay } from '../types';

interface TimetableGridProps {
  sessions: SessionsByDay;
}

export function TimetableGrid({ sessions }: TimetableGridProps) {
  const getSlotForSession = (startTime: string) => {
    const hour = startTime?.slice(0, 2);
    if (!hour || Number.isNaN(Number(hour))) return startTime;
    return `${hour}:00`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto overflow-y-hidden rounded-lg border border-border bg-card shadow-sm"
    >
      <div className="min-w-[900px]">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-border bg-muted">
          <div className="p-3 text-sm font-semibold">Time</div>
          {DAYS.map((day) => (
            <div key={day.code} className="p-3 text-sm font-semibold text-center">
              {day.name}
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="divide-y divide-border">
          {TIME_SLOTS.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 min-h-15">
              {/* Time column */}
              <div className="p-3 text-sm font-medium text-muted-foreground bg-muted/50 border-r border-border">
                {timeSlot}
              </div>
              
              {/* Day columns */}
              {DAYS.map((day) => (
                <div key={`${day.code}-${timeSlot}`} className="relative p-2 border-r border-border hover:bg-muted/30 transition-colors duration-150">
                  {sessions[day.code]
                    ?.filter(session => getSlotForSession(session.start_time) === timeSlot)
                    ?.map(session => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        variant="grid"
                        className="mb-1"
                      />
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
