import { fromZonedTime, toZonedTime } from "date-fns-tz";

export function isWithinSendWindow(date: Date, timezone: string, start: string, end: string) {
  const zoned = toZonedTime(date, timezone);
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const currentMinutes = zoned.getHours() * 60 + zoned.getMinutes();
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

export function getWindowStartIso(date: Date, timezone: string, start: string) {
  const zoned = toZonedTime(date, timezone);
  const [hour, minute] = start.split(":").map(Number);
  zoned.setHours(hour, minute, 0, 0);
  return fromZonedTime(zoned, timezone).toISOString();
}
