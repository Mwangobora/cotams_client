import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Room } from '@/types/rooms';

export function AdminRoomsPanel({
  used,
  free,
  now,
}: {
  used: Room[];
  free: Room[];
  now: Date;
}) {
  const stamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="h-full">
        <CardHeader className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Room Usage</CardTitle>
            <p className="text-xs text-muted-foreground">Live snapshot at {stamp}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default">Used: {used.length}</Badge>
            <Badge variant="secondary">Free: {free.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">In Use</p>
            <ul className="space-y-2 text-sm">
              {used.slice(0, 6).map((room) => (
                <li key={room.id} className="flex items-center justify-between">
                  <span>{room.name}</span>
                  <span className="text-muted-foreground">{room.building}</span>
                </li>
              ))}
              {used.length === 0 && (
                <li className="text-muted-foreground">No rooms in use.</li>
              )}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Available</p>
            <ul className="space-y-2 text-sm">
              {free.slice(0, 6).map((room) => (
                <li key={room.id} className="flex items-center justify-between">
                  <span>{room.name}</span>
                  <span className="text-muted-foreground">{room.building}</span>
                </li>
              ))}
              {free.length === 0 && (
                <li className="text-muted-foreground">No free rooms.</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
