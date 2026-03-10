import { describe, expect, it } from "vitest";
import { isWithinSendWindow } from "@/lib/utils/time";

describe("isWithinSendWindow", () => {
  it("returns true within the window", () => {
    const date = new Date("2026-03-10T06:00:00.000Z");
    expect(isWithinSendWindow(date, "Asia/Calcutta", "11:00", "12:00")).toBe(true);
  });
});
