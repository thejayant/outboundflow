import { PageHeader } from "@/components/layout/page-header";
import { ThreadViewer } from "@/components/threads/thread-viewer";
import { getWorkspaceContext } from "@/lib/db/workspace";
import { listThreads } from "@/services/analytics-service";

export default async function InboxPage() {
  const workspace = await getWorkspaceContext();
  const threads = (await listThreads(workspace.workspaceId)) as Array<{
    id: string;
    subject: string | null;
    snippet: string | null;
    latest_message_at: string | null;
    messages: Array<{
      id: string;
      direction: string;
      from_email: string | null;
      to_emails?: string[] | null;
      subject: string | null;
      body_text: string | null;
      sent_at: string;
    }>;
  }>;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Inbox"
        title="Thread history"
        description="Normalized Gmail thread sync showing both outbound sends and inbound replies."
      />
      <ThreadViewer threads={threads} />
    </div>
  );
}
