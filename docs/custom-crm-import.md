# Custom CRM Import API

This is a placeholder v1 extension point. Live CRM sync is not part of the shipped MVP.

## Endpoint

`POST /api/import/custom-crm/contacts`

## Auth

Use a bearer token from `CUSTOM_CRM_API_KEYS`.

Format:

`workspace_id:api_key`

Example env:

```env
CUSTOM_CRM_API_KEYS=00000000-0000-0000-0000-000000000001:super-secret-key
```

## Request body

```json
{
  "workspaceId": "00000000-0000-0000-0000-000000000001",
  "externalSource": "custom-crm",
  "contacts": [
    {
      "externalContactId": "crm-123",
      "email": "lead@example.com",
      "firstName": "Lead",
      "lastName": "Example",
      "company": "Example Co",
      "website": "https://example.com",
      "jobTitle": "Founder",
      "customFields": {
        "segment": "fintech"
      }
    }
  ]
}
```

## Behavior

- Validates payload with Zod
- Verifies the bearer token belongs to the same workspace
- Upserts contacts by `(workspace_id, external_source, external_contact_id)`
- Preserves extra custom fields in `custom_fields_jsonb`

## Future evolution

- Replace bearer secrets with managed API keys table
- Add list sync cursors
- Add CRM adapter implementations behind `CRMAdapter`
