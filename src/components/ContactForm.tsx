'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useTranslations } from 'next-intl';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const SERVICES = [
  'incendie',
  'btp',
  'forage',
  'solaire',
  'drones',
  'naval',
  'autre',
] as const;

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const t = useTranslations('ContactPage');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
    setStatus('sending');
    setErrorCode(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
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
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder={t('phonePlaceholder')}
            aria-label={t('phonePlaceholder')}
            className={inputClass}
            autoComplete="tel"
          />
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
