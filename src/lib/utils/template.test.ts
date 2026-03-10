import { describe, expect, it } from "vitest";
import { renderTemplate } from "@/lib/utils/template";

describe("renderTemplate", () => {
  it("renders standard fields and custom fields", () => {
    const result = renderTemplate("Hi {{first_name}} from {{custom.segment}}", {
      first_name: "Alina",
      custom: { segment: "SaaS" },
    });

    expect(result).toBe("Hi Alina from SaaS");
  });
});
