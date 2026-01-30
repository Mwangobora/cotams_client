/**
 * Timetable Loading Skeleton Component
 */

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/layout-primitives';

export function TimetableSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Grid Skeleton */}
            <div className="hidden lg:block">
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-8 border-b">
                    <Skeleton className="h-12 m-2" />
                    {Array.from({ length: 7 }, (_, i) => (
                      <Skeleton key={i} className="h-12 m-2" />
                    ))}
                  </div>
                  
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="grid grid-cols-8 border-b">
                      <Skeleton className="h-16 m-2" />
                      {Array.from({ length: 7 }, (_, j) => (
                        <div key={j} className="p-2 space-y-1">
                          {Math.random() > 0.7 && (
                            <Skeleton className="h-14 w-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Mobile Day View Skeleton */}
            <div className="lg:hidden space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-9" />
                <div className="text-center space-y-1">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-9 w-9" />
              </div>

              <div className="flex gap-2">
                {Array.from({ length: 7 }, (_, i) => (
                  <Skeleton key={i} className="h-8 w-12" />
                ))}
              </div>

              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-80">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-20" />
                
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}

                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}