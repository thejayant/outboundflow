"use client";

import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { campaignLaunchSchema } from "@/lib/zod/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type WizardProps = {
  gmailAccounts: Array<{ id: string; email_address: string }>;
  contacts: Array<{ id: string; email: string; company?: string | null }>;
};

export function CampaignWizard({ gmailAccounts, contacts }: WizardProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.input<typeof campaignLaunchSchema>>({
    resolver: zodResolver(campaignLaunchSchema),
    defaultValues: {
      campaignName: "",
      gmailAccountId: gmailAccounts[0]?.id ?? "",
      contactListId: "",
      targetContactIds: contacts.slice(0, 3).map((contact) => contact.id),
      timezone: "Asia/Calcutta",
      sendWindowStart: "09:00",
      sendWindowEnd: "17:00",
      dailySendLimit: 25,
      primarySubject: "Quick idea for {{company}}",
      primaryBody: "Hi {{first_name}},\n\nThought this might be relevant for {{company}}.\n\nBest,\nJay",
      followupSubject: "Following up on my note",
      followupBody: "Hi {{first_name}},\n\nBumping this once in case it got buried.\n\nBest,\nJay",
    },
  });
  const targetContactIds = useWatch({
    control: form.control,
    name: "targetContactIds",
  }) ?? [];

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const response = await fetch("/api/campaigns/launch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        toast.error(error?.error ?? "Failed to launch campaign");
        return;
      }

      const payload = await response.json();
      toast.success("Campaign launched");
      window.location.href = `/campaigns/${payload.id}`;
    });
  });

  return (
    <Card className="border-border/60 bg-card/90">
      <CardHeader>
        <CardTitle>Campaign builder</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-8" onSubmit={onSubmit}>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="campaignName">Campaign name</Label>
              <Input id="campaignName" {...form.register("campaignName")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gmailAccountId">Sender mailbox</Label>
              <select
                id="gmailAccountId"
                className="h-11 rounded-2xl border border-border bg-white/75 px-4 text-sm"
                {...form.register("gmailAccountId")}
              >
                {gmailAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.email_address}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="grid gap-4">
            <div className="grid gap-2">
              <Label>Target contacts</Label>
              <div className="grid gap-2 rounded-[28px] border border-border/60 bg-background/60 p-4">
                {contacts.map((contact) => (
                  <label key={contact.id} className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      value={contact.id}
                      checked={targetContactIds.includes(contact.id)}
                      onChange={(event) => {
                        const current = form.getValues("targetContactIds");
                        form.setValue(
                          "targetContactIds",
                          event.target.checked
                            ? [...current, contact.id]
                            : current.filter((value) => value !== contact.id),
                        );
                      }}
                    />
                    <span>
                      {contact.email}
                      {contact.company ? ` · ${contact.company}` : ""}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" {...form.register("timezone")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sendWindowStart">Start</Label>
              <Input id="sendWindowStart" {...form.register("sendWindowStart")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sendWindowEnd">End</Label>
              <Input id="sendWindowEnd" {...form.register("sendWindowEnd")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dailySendLimit">Daily cap</Label>
              <Input id="dailySendLimit" type="number" {...form.register("dailySendLimit")} />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="grid gap-4">
              <h3 className="font-semibold">Primary email</h3>
              <div className="grid gap-2">
                <Label htmlFor="primarySubject">Subject</Label>
                <Input id="primarySubject" {...form.register("primarySubject")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="primaryBody">Body</Label>
                <Textarea id="primaryBody" {...form.register("primaryBody")} />
              </div>
            </div>
            <div className="grid gap-4">
              <h3 className="font-semibold">Follow-up (fixed 2 days)</h3>
              <div className="grid gap-2">
                <Label htmlFor="followupSubject">Subject</Label>
                <Input id="followupSubject" {...form.register("followupSubject")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="followupBody">Body</Label>
                <Textarea id="followupBody" {...form.register("followupBody")} />
              </div>
            </div>
          </section>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Launching..." : "Launch campaign"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
