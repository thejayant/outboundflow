import { TemplateForm } from "@/components/forms/template-form";
import { PageHeader } from "@/components/layout/page-header";
import { SimpleDataTable } from "@/components/data-table/simple-data-table";
import { getWorkspaceContext } from "@/lib/db/workspace";
import { listTemplates } from "@/services/campaign-service";

export default async function TemplatesPage() {
  const workspace = await getWorkspaceContext();
  const templates = (await listTemplates(workspace.workspaceId)) as Array<{
    id: string;
    name: string;
    subject_template: string;
    body_template: string;
  }>;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Templates"
        title="Reusable copy blocks"
        description="Subject/body templates with merge variables like {{first_name}}, {{company}}, and custom fields."
      />
      <TemplateForm />
      <SimpleDataTable
        title="Saved templates"
        rows={templates}
        columns={[
          { key: "name", header: "Name" },
          { key: "subject_template", header: "Subject" },
          { key: "body_template", header: "Body" },
        ]}
      />
    </div>
  );
}
