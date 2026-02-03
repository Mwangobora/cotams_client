import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Room {
  id: string;
  name: string;
  capacity?: number;
}

interface RoomSelectorProps {
  rooms: Room[];
  value: string;
  onChange: (value: string) => void;
}

export function RoomSelector({ rooms, value, onChange }: RoomSelectorProps) {
  return (
    <div>
      <Label>Room</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select room" />
        </SelectTrigger>
        <SelectContent>
          {rooms.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.name} (Cap: {room.capacity})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
