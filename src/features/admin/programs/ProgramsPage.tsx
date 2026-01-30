/**
 * Programs Management Feature
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { ProgramsApi } from '@/apis/ProgramsApi';
import type { Program } from '@/types/programs';
import { ProgramDetailsDialog } from './ProgramDetailsDialog';

export function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const api = new ProgramsApi();

  const { data: programsResponse, isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: () => api.getPrograms()
  });

  const programs = Array.isArray(programsResponse) ? programsResponse : programsResponse?.results || [];

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as keyof Program
    },
    {
      header: 'Code', 
      accessor: 'code' as keyof Program
    },
    {
      header: 'Duration',
      accessor: (program: Program) => `${program.duration_years} years`
    },
    {
      header: 'Description',
      accessor: (program: Program) => program.description || 'No description'
    },
    {
      header: 'Years',
      accessor: (program: Program) => 
        program.program_years?.length || 0
    },
    {
      header: 'Status',
      accessor: (program: Program) => (
        <Badge variant={program.is_active ? 'default' : 'secondary'}>
          {program.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const handleViewDetails = (program: Program) => {
    setSelectedProgram(program);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <DataTable
        title="Programs"
        columns={columns}
        data={programs}
        loading={isLoading}
        onEdit={handleViewDetails}
        actions={true}
        editButtonText="View Details"
        emptyMessage="No programs found"
      />

      <ProgramDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        program={selectedProgram}
      />
    </>
  );
}