'use client';

import type { ReactNode } from 'react';
import { openConsentPreferences } from '@/lib/consent';

interface CookieSettingsButtonProps {
  children: ReactNode;
  className?: string;
}

export function CookieSettingsButton({ children, className }: CookieSettingsButtonProps) {
  return (
    <button type="button" onClick={openConsentPreferences} className={className}>
      {children}
    </button>
  );
}
