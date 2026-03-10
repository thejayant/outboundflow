type TemplateContext = {
  first_name?: string | null;
  company?: string | null;
  website?: string | null;
  custom?: Record<string, string | number | boolean | null | undefined> | null;
};

export function renderTemplate(template: string, context: TemplateContext) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key: string) => {
    if (key.startsWith("custom.")) {
      const customKey = key.replace("custom.", "");
      return String(context.custom?.[customKey] ?? "");
    }

    const value = context[key as keyof TemplateContext];
    return value == null ? "" : String(value);
  });
}
