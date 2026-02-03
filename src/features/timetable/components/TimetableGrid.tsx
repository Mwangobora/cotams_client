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
      className="overflow-auto rounded-lg border bg-card"
    >
      <div className="min-w-200">
        {/* Header */}
        <div className="grid grid-cols-8 border-b bg-muted/50">
          <div className="p-3 text-sm font-medium">Time</div>
          {DAYS.map((day) => (
            <div key={day.code} className="p-3 text-sm font-medium text-center">
              {day.name}
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="divide-y">
          {TIME_SLOTS.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 min-h-15">
              {/* Time column */}
              <div className="p-3 text-sm text-muted-foreground bg-muted/20 border-r">
                {timeSlot}
              </div>
              
              {/* Day columns */}
              {DAYS.map((day) => (
                <div key={`${day.code}-${timeSlot}`} className="relative p-2 border-r">
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
