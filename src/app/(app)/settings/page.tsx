import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkspaceContext } from "@/lib/db/workspace";

export default async function SettingsPage() {
  const workspace = await getWorkspaceContext();

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Workspace settings"
        title={workspace.workspaceName}
        description="Team membership, plan limits placeholders, feature flags, and future billing hooks."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/60 bg-card/90">
          <CardHeader><CardTitle>Members</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Default workspace ownership is created on signup.</p>
            <p>Use the `workspace_members` table and RLS policies to manage invites/admin roles.</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/90">
          <CardHeader><CardTitle>Plan limits</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Tables are ready for mailbox, team seat, active campaign, and CRM access restrictions.</p>
            <p>Billing is intentionally excluded from v1.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
