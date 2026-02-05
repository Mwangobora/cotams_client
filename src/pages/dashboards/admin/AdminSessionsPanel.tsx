import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Session } from '@/types/sessions';

export function AdminSessionsPanel({ sessions }: { sessions: Session[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">Today&apos;s Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions scheduled today.</p>
          ) : (
            <ul className="space-y-3">
              {sessions.slice(0, 8).map((session) => (
                <li
                  key={session.id}
                  className="rounded-lg border border-border/60 bg-muted/40 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{session.module_name}</span>
                    <Badge variant="secondary">{session.session_type_display}</Badge>
                  </div>
                  <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                    <span>{session.lecturer_name}</span>
                    <span>{session.room_name}</span>
                    <span>{session.display_time || `${session.start_time} - ${session.end_time}`}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
