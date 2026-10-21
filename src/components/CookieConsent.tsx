'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Cookie } from '@phosphor-icons/react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  DEFAULT_CONSENT_CHOICES,
  OPEN_CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentChoices,
} from '@/lib/consent';

interface CookieConsentProps {
  locale: string;
}

const subscribeToMount = () => () => {};
const getMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;

const actionBase =
  'inline-flex min-h-11 items-center justify-center rounded-md px-4 text-[15px] font-semibold transition-colors';

const actionSecondary = `${actionBase} border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50`;

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
  locked?: boolean;
  lockedLabel?: string;
}

function ConsentToggle({
  id,
  checked,
  onChange,
  title,
  description,
  locked = false,
  lockedLabel,
}: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-[15px] font-semibold text-ink">
          {title}
        </label>
        <p className="mt-1 text-[14px] leading-[1.55] text-muted">{description}</p>
      </div>
      <div className="flex shrink-0 items-center pt-0.5">
        {locked ? (
          <span className="text-[13px] font-medium text-neutral-500">{lockedLabel}</span>
        ) : (
          <label className="relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center">
            <span className="sr-only">{title}</span>
            <input
              id={id}
              type="checkbox"
              checked={checked}
              onChange={(event) => onChange(event.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="relative block h-5 w-9 rounded-full bg-neutral-300 transition-colors peer-checked:bg-brand peer-checked:[&>span]:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
            >
              <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform" />
            </span>
          </label>
        )}
      </div>
    </div>
  );
}

export function CookieConsent({ locale }: CookieConsentProps) {
  const fr = locale !== 'en';
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getMountedSnapshot,
    getServerMountedSnapshot
  );
  const [open, setOpen] = useState(
    () => typeof window !== 'undefined' && !readConsent()
  );
  const [hasExisting, setHasExisting] = useState(
    () => typeof window !== 'undefined' && Boolean(readConsent())
  );
  const [showDetails, setShowDetails] = useState(false);
  const [choices, setChoices] = useState<ConsentChoices>(() => {
    if (typeof window === 'undefined') return DEFAULT_CONSENT_CHOICES;
    const existing = readConsent();
    return existing
      ? { analytics: existing.analytics, marketing: existing.marketing }
      : DEFAULT_CONSENT_CHOICES;
  });

  useEffect(() => {
    const onOpen = () => {
      const current = readConsent();
      setChoices({
        analytics: current?.analytics ?? false,
        marketing: current?.marketing ?? false,
      });
      setHasExisting(Boolean(current));
      setShowDetails(true);
      setOpen(true);
    };

    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  const save = useCallback((next: ConsentChoices) => {
    writeConsent(next);
    setChoices(next);
    setHasExisting(true);
    setOpen(false);
    setShowDetails(false);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setOpen(true);
        return;
      }
      if (readConsent()) {
        setOpen(false);
        setShowDetails(false);
        return;
      }
      save(DEFAULT_CONSENT_CHOICES);
    },
    [save]
  );

  if (!mounted) return null;

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      modal={false}
      disablePointerDismissal={!hasExisting}
      swipeDirection="down"
    >
      <DrawerContent className="max-h-[calc(100dvh-1rem)] border-t border-neutral-200 bg-white text-ink shadow-[0_-16px_40px_-24px_rgba(15,23,42,0.35)] [--drawer-inset:0px] motion-reduce:transition-none data-[swipe-direction=down]:rounded-none">
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
          <div className="flex flex-col gap-5 px-6 py-5 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-16 lg:py-6">
            <div className="flex min-w-0 items-start gap-3.5">
              <Cookie
                size={22}
                weight="regular"
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-black"
              />
              <div className="min-w-0">
                <DrawerTitle className="text-[18px] font-semibold leading-snug text-ink">
                  {fr ? 'Cookies et confidentialité' : 'Cookies & privacy'}
                </DrawerTitle>
                <DrawerDescription className="mt-1.5 max-w-2xl text-[15px] leading-[1.6] text-muted">
                  {fr
                    ? "Ce site utilise des cookies nécessaires à son fonctionnement. Avec votre accord, nous pouvons activer la mesure d'audience et le marketing. Aucun traceur de ce type n'est actif aujourd'hui. "
                    : 'This site uses cookies necessary for it to work. With your consent, we may enable analytics and marketing. No such tracker is active today. '}
                  <Link
                    href={`/${locale}/politique-de-confidentialite#cookies`}
                    className="font-medium text-ink underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-brand"
                  >
                    {fr ? 'Politique de confidentialité' : 'Privacy policy'}
                  </Link>
                </DrawerDescription>
              </div>
            </div>

            {showDetails ? (
              <div className="flex shrink-0 items-center gap-2.5 max-lg:w-full">
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="min-h-11 shrink-0 px-2 text-[15px] font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-ink"
                >
                  {fr ? 'Retour' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={() => save(choices)}
                  className={`${actionBase} w-full bg-brand text-white hover:bg-brand-hover lg:w-auto`}
                >
                  {fr ? 'Enregistrer mes choix' : 'Save choices'}
                </button>
              </div>
            ) : (
              <div className="grid shrink-0 grid-cols-2 gap-2 max-lg:w-full lg:flex lg:items-center lg:gap-2.5">
                <button
                  type="button"
                  onClick={() => save({ analytics: false, marketing: false })}
                  className={actionSecondary}
                >
                  {fr ? 'Tout refuser' : 'Reject all'}
                </button>
                <button
                  type="button"
                  onClick={() => save({ analytics: true, marketing: true })}
                  className={actionSecondary}
                >
                  {fr ? 'Tout accepter' : 'Accept all'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  aria-expanded={showDetails}
                  className="col-span-2 min-h-11 px-2 text-[15px] font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-ink lg:order-first lg:col-span-1"
                >
                  {fr ? 'Personnaliser' : 'Customise'}
                </button>
              </div>
            )}
          </div>

          {showDetails ? (
            <div className="min-h-0 flex-1 overflow-y-auto border-t border-neutral-200">
              <div className="mx-auto w-full max-w-7xl divide-y divide-neutral-200 px-6 sm:px-12 lg:px-16">
                <ConsentToggle
                  id="consent-necessary"
                  checked
                  locked
                  onChange={() => undefined}
                  title={fr ? 'Cookies nécessaires' : 'Necessary cookies'}
                  description={
                    fr
                      ? 'Mémorisation de votre choix et sécurité du formulaire.'
                      : 'Remembering your choice and securing the form.'
                  }
                  lockedLabel={fr ? 'Toujours actifs' : 'Always on'}
                />
                <ConsentToggle
                  id="consent-analytics"
                  checked={choices.analytics}
                  onChange={(value) => setChoices((prev) => ({ ...prev, analytics: value }))}
                  title={fr ? "Mesure d'audience" : 'Analytics'}
                  description={
                    fr
                      ? 'Mesure de fréquentation anonyme. Aucun outil installé.'
                      : 'Anonymous traffic measurement. No tool installed.'
                  }
                />
                <ConsentToggle
                  id="consent-marketing"
                  checked={choices.marketing}
                  onChange={(value) => setChoices((prev) => ({ ...prev, marketing: value }))}
                  title="Marketing"
                  description={
                    fr
                      ? 'Personnalisation et mesure des campagnes. Aucun cookie déposé.'
                      : 'Campaign personalisation and measurement. No cookie set.'
                  }
                />
              </div>
            </div>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
