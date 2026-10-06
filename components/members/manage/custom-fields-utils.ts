/**
 * Utility helpers to robustly parse and format custom fields
 * across member tables, cards, exports, and profiles.
 */

export function extractCustomFields(item: unknown): Record<string, unknown> {
  if (!item || typeof item !== "object") return {};
  const obj = item as Record<string, unknown>;
  const userObj = obj.user as Record<string, unknown> | undefined;

  let raw: unknown =
    obj.customFields ??
    obj.custom_fields ??
    userObj?.customFields ??
    userObj?.custom_fields;

  if (!raw) return {};

  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return {};
    }
  }

  if (Array.isArray(raw)) {
    const map: Record<string, unknown> = {};
    raw.forEach((entry) => {
      if (entry && typeof entry === "object") {
        const itemRecord = entry as Record<string, unknown>;
        const k =
          (itemRecord.key as string) ||
          (itemRecord.id as string) ||
          (itemRecord.name as string) ||
          (itemRecord.fieldKey as string);
        if (k) {
          map[k] = itemRecord.value ?? itemRecord.val ?? "";
        }
      }
    });
    return map;
  }

  if (typeof raw === "object" && raw !== null) {
    return raw as Record<string, unknown>;
  }

  return {};
}

export function formatFieldHeader(key: string): string {
  if (!key) return "";
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\bid\b/gi, "ID")
    .replace(/\bip\b/gi, "IP")
    .replace(/\burl\b/gi, "URL")
    .replace(/\bcsv\b/gi, "CSV")
    .trim()
    .replace(/^./, (s) => s.toUpperCase());
}
