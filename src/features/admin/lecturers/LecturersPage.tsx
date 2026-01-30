/**
 * Lecturers List Feature
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LecturersApi } from '@/apis/LecturersApi';
import type { Lecturer } from '@/types/lecturers';
import { LecturerDetailsDialog } from './LecturerDetailsDialog';

export function LecturersPage() {
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const api = new LecturersApi();

  const { data: lecturersResponse, isLoading } = useQuery<Lecturer[] | { results: Lecturer[] }>({
    queryKey: ['lecturers'],
    queryFn: () => api.getLecturers()
  });

  const lecturers: Lecturer[] = Array.isArray(lecturersResponse) ? lecturersResponse : lecturersResponse?.results || [];

  const filteredLecturers = lecturers.filter((lecturer: any) =>
    lecturer.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecturer.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecturer.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Employee ID',
      accessor: (lecturer: Lecturer) => (
        <span className="font-mono">{lecturer.employee_id}</span>
      )
    },
    {
      header: 'Name',
      accessor: (lecturer: Lecturer) => lecturer.name || 'N/A'
    },
    {
      header: 'Email',
      accessor: (lecturer: Lecturer) => lecturer.email || 'N/A'
    },
    {
      header: 'Department',
      accessor: 'department' as keyof Lecturer
    },
    {
      header: 'Specialization',
      accessor: (lecturer: Lecturer) => 
        Array.isArray(lecturer.specialization) 
          ? lecturer.specialization.join(', ') 
          : lecturer.specialization || 'N/A'
    },
    {
      header: 'Status',
      accessor: (lecturer: Lecturer) => (
        <Badge variant={lecturer.is_active ? 'default' : 'secondary'}>
          {lecturer.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const handleViewDetails = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lecturers</CardTitle>
          <div className="w-72">
            <Input
              placeholder="Search lecturers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredLecturers}
            loading={isLoading}
            onEdit={handleViewDetails}
            actions={true}
            editButtonText="View Details"
            emptyMessage={
              searchTerm 
                ? `No lecturers found matching "${searchTerm}"`
                : "No lecturers found"
            }
          />
        </CardContent>
      </Card>

      <LecturerDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        lecturer={selectedLecturer}
      />
    </>
  );
}