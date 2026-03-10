import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <main className="page-gradient min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Card className="border-border/60 bg-card/90 card-shadow">
          <CardHeader>
            <CardTitle>Privacy policy placeholder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              OutboundFlow stores workspace data, campaign metadata, Gmail OAuth tokens in
              encrypted form, and imported contacts for outbound operations.
            </p>
            <p>
              Before public launch, replace this page with a legal review version covering data
              retention, mailbox scope usage, user deletion flows, and processor details.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
