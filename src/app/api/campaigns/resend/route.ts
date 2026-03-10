import { NextResponse } from "next/server";
import { resendCampaignContactSchema } from "@/lib/zod/schemas";
import { markFailedContactForResend } from "@/services/campaign-service";

export async function POST(request: Request) {
  const payload = resendCampaignContactSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const result = await markFailedContactForResend(payload.data.campaignContactId);
  return NextResponse.json(result);
}
