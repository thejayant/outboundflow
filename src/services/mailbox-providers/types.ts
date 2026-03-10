export type SendMessageInput = {
  accessToken: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  replyThreadId?: string | null;
};

export type ProviderTokenState = {
  accessToken: string;
  refreshToken?: string | null;
  tokenExpiry?: string | null;
};

export type SyncThreadsInput = {
  accessToken: string;
  userEmail: string;
  historyId?: string | null;
  recentThreadIds?: string[];
};

export type SyncResult = {
  historyId?: string | null;
  threads: Array<{
    gmailThreadId: string;
    messages: Array<{
      gmailMessageId: string;
      direction: "outbound" | "inbound";
      fromEmail: string | null;
      toEmails: string[];
      subject: string | null;
      snippet: string | null;
      bodyText: string | null;
      bodyHtml: string | null;
      sentAt: string;
      headers: Record<string, string>;
    }>;
  }>;
};

export type ReplyDetectionResult = {
  gmailThreadId: string;
  gmailMessageId: string;
  sentAt: string;
  fromEmail: string | null;
};

export interface MailboxProvider {
  sendMessage(input: SendMessageInput): Promise<{
    messageId: string;
    threadId: string;
    internalDate: string;
  }>;
  refreshToken(connectionId: string): Promise<ProviderTokenState>;
  syncThreads(input: SyncThreadsInput): Promise<SyncResult>;
  detectReplies(input: SyncResult): Promise<ReplyDetectionResult[]>;
}
