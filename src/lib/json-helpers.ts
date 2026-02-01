// Helper functions for SQLite JSON array fields
// SQLite stores arrays as JSON strings, so we need to parse/stringify them

export function parseJsonArray<T = string>(value: string | null | undefined): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function stringifyJsonArray<T>(arr: T[] | null | undefined): string {
  if (!arr || !Array.isArray(arr)) return '[]';
  return JSON.stringify(arr);
}

// Type helpers for database records with JSON fields
export interface SettingsWithParsedPhones {
  phones: string[];
}

export interface ServiceWithParsedFeatures {
  features: string[];
}

export interface ProjectWithParsedArrays {
  images: string[];
  services: string[];
}

export interface QuoteWithParsedLineItems {
  lineItems: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }> | null;
}

// Transform database records to have parsed arrays
export function parseSettingsPhones<T extends { phones: string }>(settings: T): T & SettingsWithParsedPhones {
  return {
    ...settings,
    phones: parseJsonArray(settings.phones),
  };
}

export function parseServiceFeatures<T extends { features: string }>(service: T): T & ServiceWithParsedFeatures {
  return {
    ...service,
    features: parseJsonArray(service.features),
  };
}

export function parseProjectArrays<T extends { images: string; services: string }>(project: T): T & ProjectWithParsedArrays {
  return {
    ...project,
    images: parseJsonArray(project.images),
    services: parseJsonArray(project.services),
  };
}

export function parseQuoteLineItems<T extends { lineItems: string | null }>(quote: T): T & QuoteWithParsedLineItems {
  return {
    ...quote,
    lineItems: quote.lineItems ? parseJsonArray(quote.lineItems) : null,
  };
}
