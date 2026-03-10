import { NextResponse } from "next/server";
import { getWorkspaceContext } from "@/lib/db/workspace";
import { googleSheetsImportSchema } from "@/lib/zod/schemas";
import { importFromGoogleSheet } from "@/services/import-service";
import { logActivity } from "@/services/activity-log-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = googleSheetsImportSchema.safeParse({
    url: formData.get("url"),
  });

  if (!payload.success) {
    return NextResponse.redirect(new URL("/imports?error=invalid-sheet-url", request.url));
  }

  const workspace = await getWorkspaceContext();
  const result = await importFromGoogleSheet({
    workspaceId: workspace.workspaceId,
    userId: workspace.userId,
    url: payload.data.url,
  });

  await logActivity({
    workspaceId: workspace.workspaceId,
    actorUserId: workspace.userId,
    action: "import.google_sheet",
    targetType: "import",
    targetId: result.importId,
  });

  return NextResponse.redirect(new URL("/imports?status=sheets-imported", request.url));
}
