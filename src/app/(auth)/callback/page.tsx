import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CallbackPage() {
  return (
    <Card className="w-full max-w-lg border-border/60 bg-card/90 card-shadow">
      <CardHeader>
        <CardTitle>Authentication callback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          If Supabase email confirmation or password reset succeeded, you can continue into the
          app now.
        </p>
        <p>
          Google mailbox OAuth also redirects back into the application using route handlers
          under <code>/api/gmail/callback</code>.
        </p>
        <Link href="/dashboard" className="text-primary">
          Go to dashboard
        </Link>
      </CardContent>
    </Card>
  );
}
