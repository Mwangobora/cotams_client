/**
 * Mobile Day View Component
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SessionCard } from './index';
import { DAYS } from '../types';
import type { SessionsByDay, DayOfWeek } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimetableDayViewProps {
  sessions: SessionsByDay;
  selectedDay: DayOfWeek;
  onDayChange: (day: DayOfWeek) => void;
}

export function TimetableDayView({ sessions, selectedDay, onDayChange }: TimetableDayViewProps) {
  const currentDayIndex = DAYS.findIndex(d => d.code === selectedDay);
  const currentDay = DAYS[currentDayIndex];
  const daySessions = sessions[selectedDay] || [];

  const goToPreviousDay = () => {
    const prevIndex = currentDayIndex > 0 ? currentDayIndex - 1 : DAYS.length - 1;
    onDayChange(DAYS[prevIndex].code);
  };

  const goToNextDay = () => {
    const nextIndex = currentDayIndex < DAYS.length - 1 ? currentDayIndex + 1 : 0;
    onDayChange(DAYS[nextIndex].code);
  };

  const goToToday = () => {
    const today = new Date();
    const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert Sunday=0 to Sunday=6
    onDayChange(DAYS[todayIndex].code);
  };

  // Sort sessions by start time
  const sortedSessions = [...daySessions].sort((a, b) => 
    a.start_time.localeCompare(b.start_time)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Day Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousDay}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-center">
          <h2 className="text-xl font-semibold">{currentDay?.name}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="text-sm text-muted-foreground"
          >
            Today
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextDay}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {DAYS.map((day) => (
          <Button
            key={day.code}
            variant={selectedDay === day.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => onDayChange(day.code)}
            className="min-w-fit whitespace-nowrap"
          >
            {day.name.slice(0, 3)}
          </Button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sortedSessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No sessions scheduled for {currentDay?.name}
          </div>
        ) : (
          sortedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              variant="list"
            />
          ))
        )}
      </div>
    </motion.div>
  );
}