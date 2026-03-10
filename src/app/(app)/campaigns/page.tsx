import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { SimpleDataTable } from "@/components/data-table/simple-data-table";
import { getWorkspaceContext } from "@/lib/db/workspace";
import { listCampaigns } from "@/services/campaign-service";

export default async function CampaignsPage() {
  const workspace = await getWorkspaceContext();
  const campaigns = (await listCampaigns(workspace.workspaceId)) as Array<{
    id: string;
    name: string;
    status: string;
    daily_send_limit: number;
    timezone: string;
  }>;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Campaigns"
        title="Outbound programs"
        description="Create, pause, resume, and inspect two-step outreach campaigns."
        actions={
          <Button asChild>
            <Link href="/campaigns/new">New campaign</Link>
          </Button>
        }
      />
      <SimpleDataTable
        title="Campaigns"
        rows={campaigns}
        columns={[
          {
            key: "name",
            header: "Campaign",
            render: (row) => (
              <Link href={`/campaigns/${row.id}`} className="font-medium text-primary">
                {row.name}
              </Link>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <Badge variant={row.status === "active" ? "success" : "neutral"}>{row.status}</Badge>,
          },
          { key: "daily_send_limit", header: "Daily cap" },
          { key: "timezone", header: "Timezone" },
        ]}
      />
    </div>
  );
}
