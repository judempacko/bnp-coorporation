'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useLocale, useTranslations } from 'next-intl';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const SERVICES = [
  'securite-incendie',
  'construction-btp',
  'forage-et-eau',
  'energies-renouvelables',
  'drones-imagerie-aerienne',
  'reparation-navale',
  'nettoyage-industriel',
  'autre',
] as const;

type Status = 'idle' | 'sending' | 'success' | 'error';

// Indicatifs internationaux : Cameroun par défaut, puis Afrique, Europe, Amériques, Asie.
const COUNTRIES: Array<{ code: string; fr: string; en: string }> = [
  { code: '+237', fr: 'Cameroun', en: 'Cameroon' },
  { code: '+241', fr: 'Gabon', en: 'Gabon' },
  { code: '+242', fr: 'Congo', en: 'Congo' },
  { code: '+243', fr: 'RD Congo', en: 'DR Congo' },
  { code: '+236', fr: 'Centrafrique', en: 'Central African Republic' },
  { code: '+235', fr: 'Tchad', en: 'Chad' },
  { code: '+240', fr: 'Guinée équatoriale', en: 'Equatorial Guinea' },
  { code: '+234', fr: 'Nigéria', en: 'Nigeria' },
  { code: '+233', fr: 'Ghana', en: 'Ghana' },
  { code: '+225', fr: "Côte d'Ivoire", en: 'Ivory Coast' },
  { code: '+221', fr: 'Sénégal', en: 'Senegal' },
  { code: '+223', fr: 'Mali', en: 'Mali' },
  { code: '+226', fr: 'Burkina Faso', en: 'Burkina Faso' },
  { code: '+227', fr: 'Niger', en: 'Niger' },
  { code: '+229', fr: 'Bénin', en: 'Benin' },
  { code: '+228', fr: 'Togo', en: 'Togo' },
  { code: '+224', fr: 'Guinée', en: 'Guinea' },
  { code: '+212', fr: 'Maroc', en: 'Morocco' },
  { code: '+213', fr: 'Algérie', en: 'Algeria' },
  { code: '+216', fr: 'Tunisie', en: 'Tunisia' },
  { code: '+33', fr: 'France', en: 'France' },
  { code: '+32', fr: 'Belgique', en: 'Belgium' },
  { code: '+41', fr: 'Suisse', en: 'Switzerland' },
  { code: '+34', fr: 'Espagne', en: 'Spain' },
  { code: '+39', fr: 'Italie', en: 'Italy' },
  { code: '+49', fr: 'Allemagne', en: 'Germany' },
  { code: '+44', fr: 'Royaume-Uni', en: 'United Kingdom' },
  { code: '+1', fr: 'USA / Canada', en: 'USA / Canada' },
  { code: '+55', fr: 'Brésil', en: 'Brazil' },
  { code: '+971', fr: 'Émirats arabes unis', en: 'UAE' },
  { code: '+966', fr: 'Arabie saoudite', en: 'Saudi Arabia' },
  { code: '+86', fr: 'Chine', en: 'China' },
  { code: '+91', fr: 'Inde', en: 'India' },
  { code: '+81', fr: 'Japon', en: 'Japan' },
];

// Mêmes règles que le serveur : lettres accentuées + espaces + ' . -
const NAME_RE = /^[\p{L}\p{M} '.-]+$/u;

function digitsOf(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Numéro international valide = 7 à 15 chiffres au total (norme E.164).
function isValidPhone(phone: string): boolean {
  if (!/^\+?[0-9\s().-]+$/.test(phone)) return false;
  const d = digitsOf(phone);
  return d.length >= 7 && d.length <= 15;
}

export function ContactForm() {
  const t = useTranslations('ContactPage');
  const locale = useLocale();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCode: '+237',
    phoneNumber: '',
    service: '',
    message: '',
    consent: false,
    company: '', // honeypot anti-spam
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Rend le widget Turnstile (seulement si la sitekey est configurée).
  const renderWidget = useCallback(() => {
    if (!siteKey || !widgetRef.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(widgetRef.current, {
      sitekey: siteKey,
      callback: (token: string) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(null),
      'error-callback': () => setTurnstileToken(null),
    });
  }, [siteKey]);

  useEffect(() => {
    renderWidget();
  }, [renderWidget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Validation client miroir du serveur (le serveur revalide tout).
    const name = formData.name.trim();
    if (name.length < 2 || name.length > 100 || !NAME_RE.test(name)) {
      setStatus('error');
      setErrorCode('invalid_name');
      return;
    }
    const phone = formData.phoneNumber.trim()
      ? `${formData.phoneCode} ${formData.phoneNumber.trim()}`
      : '';
    if (phone && !isValidPhone(phone)) {
      setStatus('error');
      setErrorCode('invalid_phone');
      return;
    }

    setStatus('sending');
    setErrorCode(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, phone, turnstileToken }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phoneCode: formData.phoneCode,
          phoneNumber: '',
          service: '',
          message: '',
          consent: false,
          company: '',
        });
        setTurnstileToken(null);
        if (widgetId.current && window.turnstile) {
          window.turnstile.reset(widgetId.current);
        }
      } else {
        setStatus('error');
        setErrorCode(
          typeof data?.error === 'string' ? data.error : 'send_failed'
        );
      }
    } catch {
      setStatus('error');
      setErrorCode('send_failed');
    }
  };

  const isSubmitting = status === 'sending';
  const errorMessage =
    errorCode === 'too_many_requests'
      ? t('errorRateLimit')
      : errorCode === 'invalid_name'
        ? t('errorInvalidName')
        : errorCode === 'invalid_email'
        ? t('errorInvalidEmail')
        : errorCode === 'invalid_phone'
          ? t('errorInvalidPhone')
          : errorCode === 'consent_required'
            ? t('errorConsent')
            : errorCode === 'turnstile_failed'
              ? t('errorCaptcha')
              : t('errorGeneric');

  const inputClass =
    'w-full bg-white px-4 py-3 text-[16px] leading-[1.7] text-ink placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand';

  return (
    <div className="max-w-[760px] mx-auto px-6">
      <h2 className="text-center text-[24px] sm:text-[28px] leading-[1.25] font-semibold text-ink max-w-[560px] mx-auto">
        {t('formTitle')}
      </h2>
      <p className="mt-3 text-center text-[16px] leading-[1.7] text-muted max-w-[560px] mx-auto">
        {t('formSubtitle')}
      </p>

      {status === 'success' && (
        <div
          role="status"
          className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[16px] font-medium flex items-start gap-2"
        >
          <svg className="w-5 h-5 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t('successMessage')}</span>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 text-[16px] font-medium"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        {siteKey && (
          <>
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              async
              defer
              onLoad={renderWidget}
            />
            <div ref={widgetRef} className="flex justify-center" />
          </>
        )}
        {/* Honeypot : invisible pour les humains, piège à bots */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="hidden"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('namePlaceholder')}
            aria-label={t('namePlaceholder')}
            className={inputClass}
            autoComplete="name"
          />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={t('emailPlaceholder')}
            aria-label={t('emailPlaceholder')}
            className={inputClass}
            autoComplete="email"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex gap-3">
            <select
              value={formData.phoneCode}
              onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
              aria-label={t('dialCodeLabel')}
              className={`${inputClass} w-[128px] shrink-0 cursor-pointer`}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {(locale === 'en' ? c.en : c.fr).slice(0, 12)}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                // Filtrage live : les lettres ne peuvent même pas être saisies.
                setFormData({ ...formData, phoneNumber: e.target.value.replace(/[^0-9\s().-]/g, '') })
              }
              placeholder={t('phonePlaceholder')}
              aria-label={t('phonePlaceholder')}
              className={inputClass}
              autoComplete="tel-national"
              inputMode="tel"
              minLength={6}
              maxLength={18}
            />
          </div>
          <select
            required
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            aria-label={t('servicePlaceholder')}
            className={`${inputClass} ${formData.service ? '' : 'text-neutral-400'}`}
          >
            <option value="" disabled>
              {t('servicePlaceholder')}
            </option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {t(`service_${s}`)}
              </option>
            ))}
          </select>
        </div>

        <textarea
          required
          rows={5}
          minLength={10}
          maxLength={5000}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={t('messagePlaceholder')}
          aria-label={t('messagePlaceholder')}
          className={`${inputClass} resize-y`}
        />

        <label className="flex items-start gap-3 text-[14px] leading-[1.6] text-muted cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-1 h-4 w-4 shrink-0 accent-brand"
          />
          <span>{t('consentLabel')}</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-brand w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('sending') : t('sendButton')}
        </button>
      </form>
    </div>
  );
}
