/**
 * Generic Data Table Component for Admin Features
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  addButtonText?: string;
  emptyMessage?: string;
  actions?: boolean;
  editButtonText?: string;
  deleteButtonText?: string;
}

export function DataTable<T extends { id: string | number }>({
  title,
  columns,
  data,
  loading,
  onAdd,
  onEdit,
  onDelete,
  addButtonText = 'Add New',
  emptyMessage = 'No data available',
  actions = true,
  editButtonText = 'Edit',
  deleteButtonText = 'Delete'
}: DataTableProps<T>) {
  const getCellValue = (item: T, column: Column<T>): React.ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    const value = item[column.accessor];
    return value as React.ReactNode;
  };

  return (
    <Card>
      {title && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {onAdd && (
            <Button onClick={onAdd} disabled={loading}>
              {addButtonText}
            </Button>
          )}
        </CardHeader>
      )}
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead 
                    key={index}
                    className={column.className}
                  >
                    {column.header}
                  </TableHead>
                ))}
                {actions && (onEdit || onDelete) && (
                  <TableHead>Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column, colIndex) => (
                    <TableCell 
                      key={colIndex}
                      className={column.className}
                    >
                      {getCellValue(item, column)}
                    </TableCell>
                  ))}
                  {actions && (onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onEdit(item)}
                          >
                            {editButtonText}
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onDelete(item)}
                          >
                            {deleteButtonText}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}