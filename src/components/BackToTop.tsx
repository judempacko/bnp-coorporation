'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from '@phosphor-icons/react';

/**
 * Bouton retour en haut : fixe en bas à droite, apparaît après 600px
 * de scroll, smooth scroll sauf prefers-reduced-motion.
 */
export function BackToTop({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false);
  const fr = locale !== 'en';

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label={fr ? 'Retour en haut' : 'Back to top'}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-lg transition-all hover:bg-[#0854a0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A66C2] ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp size={20} weight="bold" aria-hidden="true" />
    </button>
  );
}
