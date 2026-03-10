import Papa from "papaparse";
import * as XLSX from "xlsx";

export type ParsedImportRow = Record<string, string | null>;

function normalizeCell(value: unknown) {
  if (value == null) {
    return null;
  }

  const stringValue = String(value).trim();
  return stringValue.length ? stringValue : null;
}

export async function parseImportFile(
  fileName: string,
  arrayBuffer: ArrayBuffer,
): Promise<ParsedImportRow[]> {
  const lower = fileName.toLowerCase();

  if (lower.endsWith(".csv")) {
    const text = new TextDecoder().decode(arrayBuffer);
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });

    return parsed.data.map((row) =>
      Object.fromEntries(Object.entries(row).map(([key, value]) => [key, normalizeCell(value)])),
    );
  }

  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: null,
    });

    return json.map((row) =>
      Object.fromEntries(Object.entries(row).map(([key, value]) => [key, normalizeCell(value)])),
    );
  }

  throw new Error("Unsupported file type. Use CSV or XLSX.");
}

export function googleSheetsUrlToCsvUrl(url: string) {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);

  if (!match) {
    throw new Error("Invalid Google Sheets URL.");
  }

  const gidMatch = url.match(/gid=([0-9]+)/);
  const gid = gidMatch?.[1] ?? "0";

  return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=${gid}`;
}
