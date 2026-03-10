import { PageHeader } from "@/components/layout/page-header";
import { ImportMapper } from "@/components/imports/import-mapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkspaceContext } from "@/lib/db/workspace";
import { listImports } from "@/services/import-service";

export default async function ImportsPage() {
  const workspace = await getWorkspaceContext();
  const imports = (await listImports(workspace.workspaceId)) as Array<{
    id: string;
    file_name: string | null;
    source_type: string;
    status: string;
    imported_count: number;
  }>;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Imports"
        title="Lead ingestion"
        description="Upload CSV/XLSX files, import public Google Sheets, and preserve raw rows for debugging."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Upload lead file</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <form action="/api/imports/upload" method="post" encType="multipart/form-data" className="grid gap-4">
              <input
                type="file"
                name="file"
                accept=".csv,.xlsx,.xls"
                className="rounded-3xl border border-border bg-white/75 p-4 text-sm"
              />
              <button className="h-11 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
                Upload file
              </button>
            </form>
            <form action="/api/imports/sheets" method="post" className="grid gap-4">
              <input
                type="url"
                name="url"
                placeholder="https://docs.google.com/spreadsheets/..."
                className="h-11 rounded-2xl border border-border bg-white/75 px-4 text-sm"
              />
              <button className="h-11 rounded-full border border-border bg-card px-4 text-sm font-medium">
                Import public Sheet
              </button>
            </form>
          </CardContent>
        </Card>
        <ImportMapper headers={["Email", "First Name", "Company", "Website", "Job Title"]} />
      </div>
      <Card className="border-border/60 bg-card/90">
        <CardHeader>
          <CardTitle>Import history</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {imports.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-3xl border border-border/60 bg-background/65 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{item.file_name ?? "Untitled import"}</p>
                <p className="text-muted-foreground">{item.source_type}</p>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {item.status} · {item.imported_count}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
