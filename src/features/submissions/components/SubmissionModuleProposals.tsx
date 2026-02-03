import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SubmissionModuleItem } from '@/types/submissions';

interface SubmissionModuleProposalsProps {
  items: SubmissionModuleItem[];
}

export function SubmissionModuleProposals({ items }: SubmissionModuleProposalsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Proposed Modules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No module proposals.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-md border p-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {item.proposed_code} - {item.proposed_name}
                </div>
                <Badge variant="outline">{item.action}</Badge>
              </div>
              <div className="text-muted-foreground">
                Credits: {item.proposed_credits} · Hours/Week: {item.proposed_hours_per_week}
              </div>
              {item.proposed_description && (
                <div className="text-muted-foreground">{item.proposed_description}</div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
