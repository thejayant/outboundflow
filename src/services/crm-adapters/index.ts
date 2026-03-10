export interface CRMAdapter {
  listLists(): Promise<Array<{ id: string; name: string }>>;
  fetchContacts(listId?: string): Promise<
    Array<{
      externalContactId: string;
      email: string;
      firstName?: string;
      lastName?: string;
      company?: string;
      website?: string;
      jobTitle?: string;
      customFields?: Record<string, string | number | boolean | null>;
    }>
  >;
  syncContacts(listId?: string): Promise<{ imported: number }>;
}

export class PlaceholderCRMAdapter implements CRMAdapter {
  async listLists() {
    return [{ id: "custom-crm", name: "Custom CRM import endpoint" }];
  }

  async fetchContacts() {
    return [];
  }

  async syncContacts() {
    return { imported: 0 };
  }
}
