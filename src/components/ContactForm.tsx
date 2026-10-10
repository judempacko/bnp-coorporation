'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function ContactForm() {
  const t = useTranslations('ContactPage');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const inputClass =
    'w-full bg-white px-4 py-3 text-[16px] leading-[1.7] text-[#2c2c2c] placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#0A66C2]';

  return (
    <div className="max-w-[760px] mx-auto px-6">
      <h2 className="text-center text-[24px] sm:text-[28px] leading-[1.25] font-semibold text-[#2c2c2c] max-w-[560px] mx-auto">
        {t('formTitle')}
      </h2>
      <p className="mt-3 text-center text-[16px] leading-[1.7] text-[#666] max-w-[560px] mx-auto">
        {t('formSubtitle')}
      </p>

      {submitted && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[16px] font-medium flex items-start gap-2">
          <svg className="w-5 h-5 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t('successMessage')}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('namePlaceholder')}
            className={inputClass}
            autoComplete="name"
          />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={t('emailPlaceholder')}
            className={inputClass}
            autoComplete="email"
          />
        </div>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder={t('subjectPlaceholder')}
          className={inputClass}
          autoComplete="off"
        />
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={t('messagePlaceholder')}
          className={`${inputClass} resize-y`}
        />
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
