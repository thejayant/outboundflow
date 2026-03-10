import { GmailMailboxProvider } from "@/services/mailbox-providers/gmail/provider";
import type { MailboxProvider } from "@/services/mailbox-providers/types";

export function getMailboxProvider(provider: string): MailboxProvider {
  if (provider === "gmail") {
    return new GmailMailboxProvider();
  }

  throw new Error(`Unsupported mailbox provider: ${provider}`);
}
