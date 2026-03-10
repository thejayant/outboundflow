import { describe, expect, it } from "vitest";
import { googleSheetsUrlToCsvUrl } from "@/lib/utils/imports";

describe("googleSheetsUrlToCsvUrl", () => {
  it("converts a sheet url into a csv export url", () => {
    const url =
      "https://docs.google.com/spreadsheets/d/test-sheet-id/edit#gid=12345";

    expect(googleSheetsUrlToCsvUrl(url)).toBe(
      "https://docs.google.com/spreadsheets/d/test-sheet-id/export?format=csv&gid=12345",
    );
  });
});
