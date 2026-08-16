/**
 * export-csv.ts
 * Generic utility for building and downloading CSV files in the browser.
 */

/** A single column definition: the CSV header label and a value getter. */
export interface CsvColumn<T> {
  header: string;
  getValue: (row: T) => string | number | null | undefined;
}

/** Escape a single CSV cell value (handles commas, quotes, newlines). */
function escapeCell(value: string | number | null | undefined): string {
  const str = value == null ? "" : String(value);
  // Wrap in quotes if the value contains a comma, double-quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Convert an array of rows into a CSV string using the provided column definitions. */
export function buildCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(",");
  const body = rows
    .map((row) =>
      columns.map((c) => escapeCell(c.getValue(row))).join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
}

/**
 * Trigger a browser download for a CSV string.
 * @param csv    The raw CSV content.
 * @param filename  File name (without extension is fine — .csv is appended if missing).
 * @param format  "csv_excel" adds a UTF-8 BOM so Excel opens it correctly;
 *               "csv_plain" exports without a BOM.
 */
export function downloadCsv(
  csv: string,
  filename: string,
  format: "csv_excel" | "csv_plain" = "csv_excel"
): void {
  const bom = format === "csv_excel" ? "\uFEFF" : "";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
