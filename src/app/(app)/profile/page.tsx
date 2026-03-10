import Link from "next/link";
import { Mail } from "lucide-react";
import { ProfileForm } from "@/components/forms/profile-form";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkspaceContext } from "@/lib/db/workspace";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getWorkspaceGmailAccounts } from "@/services/gmail-service";

export default async function ProfilePage() {
  const workspace = await getWorkspaceContext();
  const supabase = createAdminSupabaseClient();
  const { data: rawProfile } = await supabase
    .from("profiles")
    .select("full_name, title")
    .eq("id", workspace.userId)
    .maybeSingle();
  const profile = rawProfile as { full_name?: string | null; title?: string | null } | null;
  const gmailAccounts = (await getWorkspaceGmailAccounts(workspace.workspaceId)) as Array<{
    id: string;
    email_address: string;
    status: string;
  }>;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Profile"
        title="Personal settings"
        description="Manage your profile, mailbox connection, and personal sending defaults."
      />
      <ProfileForm
        defaultValues={{
          fullName: profile?.full_name ?? "",
          title: profile?.title ?? "",
        }}
      />
      <Card className="border-border/60 bg-card/90">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Connected Gmail accounts</CardTitle>
          <Button asChild>
            <Link href="/api/gmail/connect">
              <Mail className="size-4" />
              Connect Gmail
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3">
          {gmailAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between rounded-3xl border border-border/60 bg-background/65 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{account.email_address}</p>
                <p className="text-muted-foreground">{account.status}</p>
              </div>
              <form action="/api/gmail/disconnect" method="post">
                <input type="hidden" name="gmailAccountId" value={account.id} />
                <button className="font-medium text-danger">Disconnect</button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
