export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = 'bnpc-consent';
export const CONSENT_COOKIE_NAME = 'bnpc_consent';
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 183;

export const CONSENT_CHANGED_EVENT = 'bnpc:consent-changed';
export const OPEN_CONSENT_EVENT = 'bnpc:open-consent-preferences';

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentChoices {
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentRecord extends ConsentChoices {
  version: number;
  date: string;
  expiresAt: number;
}

export const DEFAULT_CONSENT_CHOICES: ConsentChoices = {
  analytics: false,
  marketing: false,
};

function isConsentRecord(value: unknown): value is ConsentRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    record.version === CONSENT_VERSION &&
    typeof record.analytics === 'boolean' &&
    typeof record.marketing === 'boolean' &&
    typeof record.date === 'string' &&
    typeof record.expiresAt === 'number'
  );
}

function readCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${CONSENT_COOKIE_NAME}=`;
  const found = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  if (!found) return null;
  try {
    return decodeURIComponent(found.slice(prefix.length));
  } catch {
    return null;
  }
}

function writeCookie(record: ConsentRecord): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(record)
  )}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function clearCookie(): void {
  document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function readConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  const now = Date.now();

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isConsentRecord(parsed) && parsed.expiresAt > now) return parsed;
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    }
  } catch {
    // Stockage indisponible (mode privé) : on tente le cookie.
  }

  const cookie = readCookie();
  if (!cookie) return null;
  try {
    const parsed: unknown = JSON.parse(cookie);
    if (isConsentRecord(parsed) && parsed.expiresAt > now) return parsed;
  } catch {
    return null;
  }
  return null;
}

export function writeConsent(choices: ConsentChoices): ConsentRecord {
  const now = Date.now();
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    date: new Date(now).toISOString(),
    expiresAt: now + CONSENT_MAX_AGE_SECONDS * 1000,
    analytics: choices.analytics,
    marketing: choices.marketing,
  };

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Cookie de secours ci-dessous.
  }
  writeCookie(record);

  window.dispatchEvent(
    new CustomEvent<ConsentRecord>(CONSENT_CHANGED_EVENT, { detail: record })
  );
  return record;
}

export function clearConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Ignoré : le cookie est nettoyé juste après.
  }
  clearCookie();
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'necessary') return true;
  const consent = readConsent();
  if (!consent) return false;
  return category === 'analytics' ? consent.analytics : consent.marketing;
}

export function openConsentPreferences(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
