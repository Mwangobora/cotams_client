/**
 * Room Form Dialog Component
 */

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { RoomsApi } from '@/apis/RoomsApi';
import type { Room, RoomFormData } from '@/types/rooms';

interface RoomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room | null;
}

const ROOM_TYPES = [
  'LECTURE_HALL',
  'LABORATORY', 
  'TUTORIAL_ROOM',
  'OFFICE',
  'OTHER'
] as const;

type RoomType = typeof ROOM_TYPES[number];

const ROOM_FEATURES = [
  'Projector',
  'Whiteboard', 
  'Air Conditioning',
  'Computers',
  'Audio System',
  'Wi-Fi',
  'Interactive Board'
];

export function RoomFormDialog({ 
  open, 
  onOpenChange, 
  room 
}: RoomFormDialogProps) {
  const [formData, setFormData] = useState<RoomFormData>({
    code: '',
    name: '',
    building: '',
    floor: 0,
    capacity: 0,
    room_type: 'LECTURE_HALL',
    features: [],
    is_active: true
  });
  
  const queryClient = useQueryClient();
  const api = new RoomsApi();

  const mutation = useMutation({
    mutationFn: (data: RoomFormData) => 
      room 
        ? api.updateRoom(room.id, data)
        : api.createRoom(data),
    onSuccess: () => {
      toast.success(room ? 'Room updated' : 'Room created', {
        description: 'Changes saved successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error('Error', {
        description: error?.message ?? 'Something went wrong',
      });
    }
  });

  useEffect(() => {
    if (room) {
      setFormData({
        code: room.code,
        name: room.name,
        building: room.building,
        floor: room.floor,
        capacity: room.capacity,
        room_type: room.room_type,
        features: room.features || [],
        is_active: room.is_active
      });
    } else {
      setFormData({
        code: '',
        name: '',
        building: '',
        floor: 0,
        capacity: 0,
        room_type: 'LECTURE_HALL',
        features: [],
        is_active: true
      });
    }
  }, [room, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {room ? 'Edit Room' : 'Add Room'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Room Code</Label>
              <Input
                value={formData.code}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, code: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label>Room Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Building</Label>
                <Input
                  value={formData.building}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, building: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label>Floor</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.floor}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, floor: +e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, capacity: +e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label>Room Type</Label>
              <Select
                value={formData.room_type}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, room_type: value as RoomType }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Features</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {ROOM_FEATURES.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={(checked: boolean) => 
                        handleFeatureChange(feature, checked)
                      }
                    />
                    <Label htmlFor={feature} className="text-sm">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked: boolean) => 
                  setFormData(prev => ({ ...prev, is_active: checked }))
                }
              />
              <Label htmlFor="is_active">
                Room is active
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
