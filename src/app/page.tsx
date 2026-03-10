import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Mail,
    title: "Connect Gmail once",
    description:
      "Keep mailbox auth separate from app auth, store refresh tokens server-side, and send from cron jobs.",
  },
  {
    icon: Workflow,
    title: "Simple campaign engine",
    description:
      "Two-step sequencing, reply-based stop logic, idempotent send queue, and readable service boundaries.",
  },
  {
    icon: ShieldCheck,
    title: "SaaS-ready data model",
    description:
      "Workspace isolation, RLS, unsubscribe handling, audit logs, and future provider extension points.",
  },
];

export default function HomePage() {
  return (
    <main className="page-gradient min-h-screen">
      <section className="surface-grid relative overflow-hidden px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-16">
          <header className="flex items-center justify-between rounded-full border border-border/70 bg-card/80 px-5 py-3 backdrop-blur">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              OutboundFlow
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/privacy">Privacy</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </header>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-primary">
                Internal MVP for small outbound teams
              </div>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-[-0.04em] text-foreground md:text-6xl">
                  Mailchimp-style cold email workflows without the bulk-email baggage.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Import leads, connect Gmail, launch one-to-one campaigns, detect
                  replies, and keep thread history in one workspace-friendly app.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Enter dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sign-up">Create workspace</Link>
                </Button>
              </div>
            </div>
            <Card className="card-shadow overflow-hidden border-border/60 bg-card/90">
              <CardHeader className="border-b border-border/60">
                <CardTitle className="text-lg">Why this stack</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-6">
                {features.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-border/60 bg-background/70 p-4"
                  >
                    <Icon className="mb-3 size-5 text-primary" />
                    <h2 className="font-semibold">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
