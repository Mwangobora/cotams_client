/**
 * Streams Management Feature (Staff)
 */

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StreamsApi } from '@/apis/StreamsApi';
import type { StreamFormData } from '@/apis/StreamsApi';
import { ProgramYearsApi } from '@/apis/ProgramYearsApi';
import type { Stream } from '@/types/streams';
import type { ProgramYear } from '@/types/programs';

interface StreamFormState {
  program_year: string;
  stream_code: string;
  name: string;
  capacity: number | '';
  is_active: boolean;
}

export function StreamsPage() {
  const queryClient = useQueryClient();
  const streamsApi = new StreamsApi();
  const programYearsApi = new ProgramYearsApi();

  const [selected, setSelected] = useState<Stream | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProgramYear, setSelectedProgramYear] = useState<string>('');
  const [formData, setFormData] = useState<StreamFormState>({
    program_year: '',
    stream_code: '',
    name: '',
    capacity: '',
    is_active: true,
  });

  const { data: programYearsResponse } = useQuery({
    queryKey: ['program-years'],
    queryFn: () => programYearsApi.getProgramYears(),
  });
  const programYears = Array.isArray(programYearsResponse)
    ? programYearsResponse
    : programYearsResponse?.results || [];

  const selectedProgramYearFilter =
    selectedProgramYear === '__all' ? '' : selectedProgramYear;
  const { data: streamsResponse, isLoading } = useQuery({
    queryKey: ['streams', selectedProgramYearFilter],
    queryFn: () =>
      streamsApi.getStreams(
        selectedProgramYearFilter ? { program_year: selectedProgramYearFilter } : {}
      ),
  });
  const streams = Array.isArray(streamsResponse)
    ? streamsResponse
    : streamsResponse?.results || [];

  const createMutation = useMutation({
    mutationFn: (data: StreamFormData) => streamsApi.createStream(data),
    onSuccess: () => {
      toast.success('Stream created');
      queryClient.invalidateQueries({ queryKey: ['streams'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create stream');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StreamFormData }) =>
      streamsApi.updateStream(id, data),
    onSuccess: () => {
      toast.success('Stream updated');
      queryClient.invalidateQueries({ queryKey: ['streams'] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update stream');
    },
  });

  const programYearMap = useMemo(
    () => new Map(programYears.map((year: ProgramYear) => [year.id, year])),
    [programYears]
  );

  const columns = useMemo(
    () => [
      {
        header: 'Program Year',
        accessor: (stream: Stream) =>
          stream.program_year_display ||
          programYearMap.get(stream.program_year)?.name ||
          programYearMap.get(stream.program_year)?.year_name ||
          stream.program_year,
      },
      { header: 'Code', accessor: 'stream_code' as keyof Stream },
      { header: 'Name', accessor: (stream: Stream) => stream.name || '—' },
      { header: 'Capacity', accessor: (stream: Stream) => stream.capacity ?? '—' },
      {
        header: 'Status',
        accessor: (stream: Stream) => (
          <Badge variant={stream.is_active ? 'default' : 'secondary'}>
            {stream.is_active ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ],
    [programYearMap]
  );

  const openCreate = () => {
    setSelected(null);
    setFormData({
      program_year: selectedProgramYear,
      stream_code: '',
      name: '',
      capacity: '',
      is_active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (stream: Stream) => {
    setSelected(stream);
    setFormData({
      program_year: stream.program_year,
      stream_code: stream.stream_code,
      name: stream.name || '',
      capacity: stream.capacity ?? '',
      is_active: stream.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.program_year) {
      toast.error('Program year is required.');
      return;
    }
    if (!formData.stream_code.trim()) {
      toast.error('Stream code is required.');
      return;
    }

    const payload: StreamFormData = {
      program_year: formData.program_year,
      stream_code: formData.stream_code.trim().toUpperCase(),
      name: formData.name.trim() || undefined,
      capacity: formData.capacity === '' ? undefined : Number(formData.capacity),
      is_active: formData.is_active,
    };

    if (selected) {
      updateMutation.mutate({ id: selected.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Label>Filter by Program Year</Label>
        <Select value={selectedProgramYear} onValueChange={setSelectedProgramYear}>
          <SelectTrigger>
            <SelectValue placeholder="All program years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All program years</SelectItem>
            {programYears.map((year: ProgramYear) => (
              <SelectItem key={year.id} value={year.id}>
                {year.program_code ? `${year.program_code} - ` : ''}Year {year.year_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        title="Streams"
        columns={columns}
        data={streams}
        loading={isLoading}
        onAdd={openCreate}
        onEdit={openEdit}
        actions
        editButtonText="Edit"
        emptyMessage="No streams found"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Stream' : 'Create Stream'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Program Year</Label>
              <Select
                value={formData.program_year}
                onValueChange={(value) => setFormData({ ...formData, program_year: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program year" />
                </SelectTrigger>
                <SelectContent>
                  {programYears.map((year: ProgramYear) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.program_code ? `${year.program_code} - ` : ''}Year {year.year_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Stream Code</Label>
                <Input
                  value={formData.stream_code}
                  onChange={(event) =>
                    setFormData({ ...formData, stream_code: event.target.value })
                  }
                  placeholder="A"
                />
              </div>
              <div className="space-y-2">
                <Label>Name (optional)</Label>
                <Input
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="Morning"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Capacity (optional)</Label>
              <Input
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    capacity: event.target.value === '' ? '' : Number(event.target.value),
                  })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: Boolean(checked) })
                }
              />
              <Label>Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : selected
                  ? 'Update Stream'
                  : 'Create Stream'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
