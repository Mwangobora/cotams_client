import { useState } from 'react';
import { PageContainer, Section } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useMarkAllReadMutation, useMarkReadMutation, useNotificationsQuery } from './hooks';

export function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const isUnread = filter === 'unread';
  const { data, isLoading } = useNotificationsQuery(isUnread ? { is_read: false } : {});
  const markRead = useMarkReadMutation();
  const markAll = useMarkAllReadMutation();
  const notifications = data?.results || [];

  const formatDate = (value: string) => new Date(value).toLocaleString();
  const handleMarkRead = (id: string, isRead: boolean) => {
    if (!isRead) markRead.mutate(id);
  };

  return (
    <PageContainer>
      <Section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <p className="text-sm text-muted-foreground">Real-time alerts and updates.</p>
          </div>
          <Button variant="outline" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
            Mark all read
          </Button>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="mt-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading && <p className="text-sm text-muted-foreground">Loading notifications...</p>}
            {!isLoading && notifications.length === 0 && (
              <p className="text-sm text-muted-foreground">No notifications found.</p>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                className="w-full text-left rounded-lg border p-4 hover:bg-muted/40 transition"
                onClick={() => handleMarkRead(n.id, n.is_read)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{n.title}</h3>
                      {!n.is_read && <Badge variant="destructive">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(n.created_at)}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
