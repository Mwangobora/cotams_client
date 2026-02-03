/**
 * Program Details Dialog Component
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Program } from '@/types/programs';

interface ProgramDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program?: Program | null;
}

export function ProgramDetailsDialog({ 
  open, 
  onOpenChange, 
  program 
}: ProgramDetailsDialogProps) {
  if (!program) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {program.name}
            <Badge variant={program.is_active ? 'default' : 'secondary'}>
              {program.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Program Info */}
          <Card>
            <CardHeader>
              <CardTitle>Program Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Program Code
                  </label>
                  <p className="text-sm">{program.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Department
                  </label>
                  <p className="text-sm">
                    {program.department_name || program.department_code || program.department || '—'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Duration
                  </label>
                  <p className="text-sm">{program.duration_years} years</p>
                </div>
              </div>
              
              {program.description && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-sm mt-1">{program.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Program Years */}
          {program.program_years && program.program_years.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Program Years ({program.program_years.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Streams</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {program.program_years.map((year) => (
                      <TableRow key={year.id}>
                        <TableCell>{year.year_number}</TableCell>
                        <TableCell>{year.year_name}</TableCell>
                        <TableCell>{year.streams?.length || 0}</TableCell>
                        <TableCell>
                          <Badge variant={year.is_active ? 'default' : 'secondary'}>
                            {year.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
