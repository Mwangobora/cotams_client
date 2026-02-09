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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
  showPagination?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    mode?: 'client' | 'server';
  };
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
  deleteButtonText = 'Delete',
  showPagination = true,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  pagination
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const isControlled = Boolean(pagination);
  const effectivePage = isControlled ? pagination!.page : page;
  const effectivePageSize = isControlled ? pagination!.pageSize : pageSize;
  const effectivePageSizeOptions =
    pagination?.pageSizeOptions?.length ? pagination.pageSizeOptions : pageSizeOptions;
  const paginationMode = pagination?.mode ?? (isControlled ? 'server' : 'client');

  const totalItems = isControlled ? pagination!.total : data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));

  useEffect(() => {
    if (isControlled) return;
    if (page > totalPages) setPage(totalPages);
  }, [isControlled, page, totalPages]);

  useEffect(() => {
    if (isControlled) return;
    setPage(1);
  }, [isControlled, pageSize]);

  useEffect(() => {
    if (!isControlled) return;
    if (pagination!.page > totalPages && totalPages > 0) {
      pagination!.onPageChange(totalPages);
    }
  }, [isControlled, pagination, totalPages]);

  const getCellValue = (item: T, column: Column<T>): React.ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    const value = item[column.accessor];
    return value as React.ReactNode;
  };

  const paginatedData = useMemo(() => {
    if (!showPagination) return data;
    if (paginationMode === 'server') return data;
    const start = (effectivePage - 1) * effectivePageSize;
    return data.slice(start, start + effectivePageSize);
  }, [data, effectivePage, effectivePageSize, paginationMode, showPagination]);

  const startItem =
    totalItems === 0 ? 0 : (effectivePage - 1) * effectivePageSize + 1;
  const endItem = Math.min(effectivePage * effectivePageSize, totalItems);

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <TooltipProvider>
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
          <div className="space-y-4">
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
                {paginatedData.map((item, index) => (
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
                        <div className="flex items-center gap-3">
                          {/* Desktop: Icon-only with tooltips */}
                          <div className="hidden md:flex items-center gap-3">
                            {onEdit && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost-edit" 
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => onEdit(item)}
                                    aria-label={`Edit ${editButtonText}`}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{editButtonText}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {onDelete && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost-delete" 
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => handleDeleteClick(item)}
                                    aria-label={`Delete ${deleteButtonText}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{deleteButtonText}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>

                          {/* Mobile: Icon + Label */}
                          <div className="flex md:hidden items-center gap-2">
                            {onEdit && (
                              <Button 
                                variant="ghost-edit" 
                                size="sm"
                                onClick={() => onEdit(item)}
                                className="h-8 gap-1.5"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>{editButtonText}</span>
                              </Button>
                            )}
                            {onDelete && (
                              <Button 
                                variant="ghost-delete" 
                                size="sm"
                                onClick={() => handleDeleteClick(item)}
                                className="h-8 gap-1.5"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>{deleteButtonText}</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {showPagination && totalItems > 0 && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startItem}-{endItem} of {totalItems}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows</span>
                  <Select
                    value={String(effectivePageSize)}
                    onValueChange={(value) => {
                      const nextSize = Number(value);
                      if (isControlled) {
                        pagination?.onPageSizeChange?.(nextSize);
                        if (effectivePage !== 1) {
                          pagination?.onPageChange(1);
                        }
                      } else {
                        setPageSize(nextSize);
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-[90px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {effectivePageSizeOptions.map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => {
                      if (isControlled) {
                        pagination?.onPageChange(Math.max(1, effectivePage - 1));
                      } else {
                        setPage((prev) => Math.max(1, prev - 1));
                      }
                    }}
                    disabled={effectivePage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {effectivePage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => {
                      if (isControlled) {
                        pagination?.onPageChange(Math.min(totalPages, effectivePage + 1));
                      } else {
                        setPage((prev) => Math.min(totalPages, prev + 1));
                      }
                    }}
                    disabled={effectivePage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteButtonText.toLowerCase()}?`}
        description="This action cannot be undone."
        confirmText={deleteButtonText}
      />
    </Card>
    </TooltipProvider>
  );
}
