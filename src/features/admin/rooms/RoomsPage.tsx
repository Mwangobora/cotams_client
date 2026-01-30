/**
 * Rooms Management Feature
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RoomsApi } from '@/apis/RoomsApi';
import { type Room } from '@/types/rooms';
import { RoomFormDialog } from './RoomFormDialog/RoomFormDialog';

export function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const queryClient = useQueryClient();
  const api = new RoomsApi();

  const { data: roomsResponse, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => api.getRooms()
  });

  const rooms = Array.isArray(roomsResponse) ? roomsResponse : roomsResponse?.results || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteRoom(id),
    onSuccess: () => {
      toast.success('Room deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
    onError: (error: any) => {
      toast.error(`Error deleting room: ${error.message}`);
    }
  });

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as keyof Room
    },
    {
      header: 'Building',
      accessor: 'building' as keyof Room
    },
    {
      header: 'Floor',
      accessor: 'floor' as keyof Room
    },
    {
      header: 'Capacity',
      accessor: 'capacity' as keyof Room
    },
    {
      header: 'Type',
      accessor: (room: Room) => (
        <Badge variant="outline">{room.room_type}</Badge>
      )
    },
    {
      header: 'Features',
      accessor: (room: Room) => 
        room.features?.join(', ') || 'None'
    },
    {
      header: 'Status',
      accessor: (room: Room) => (
        <Badge variant={room.is_active ? 'default' : 'secondary'}>
          {room.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const handleAdd = () => {
    setSelectedRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRoom) {
      deleteMutation.mutate(selectedRoom.id);
    }
  };

  return (
    <>
      <DataTable
        title="Rooms Management"
        columns={columns}
        data={rooms}
        loading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonText="Add Room"
        emptyMessage="No rooms found"
      />

      <RoomFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        room={selectedRoom}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Room"
        description="Are you sure you want to delete this room? This action cannot be undone."
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
        confirmText="Delete"
      />
    </>
  );
}