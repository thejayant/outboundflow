import { NextResponse } from "next/server";
import { getWorkspaceContext } from "@/lib/db/workspace";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireSupabaseConfiguration } from "@/lib/supabase/env";
import { processImportFile } from "@/services/import-service";
import { logActivity } from "@/services/activity-log-service";

export async function POST(request: Request) {
  requireSupabaseConfiguration();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.redirect(new URL("/imports?error=missing-file", request.url));
  }

  const workspace = await getWorkspaceContext();
  const buffer = await file.arrayBuffer();
  const supabase = createAdminSupabaseClient();
  const storagePath = `${workspace.workspaceId}/${Date.now()}-${file.name}`;
  await supabase.storage.from("imports").upload(storagePath, file, {
    upsert: false,
    contentType: file.type,
  });

  const sourceType = file.name.toLowerCase().endsWith(".csv") ? "csv" : "xlsx";
  const result = await processImportFile({
    workspaceId: workspace.workspaceId,
    userId: workspace.userId,
    fileName: file.name,
    fileBuffer: buffer,
    storagePath,
    sourceType,
  });

  await logActivity({
    workspaceId: workspace.workspaceId,
    actorUserId: workspace.userId,
    action: "import.processed",
    targetType: "import",
    targetId: result.importId,
    metadata: { importedCount: result.importedCount },
  });

  return NextResponse.redirect(new URL("/imports?status=uploaded", request.url));
}
