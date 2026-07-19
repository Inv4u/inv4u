'use client';

import { useEffect, useRef } from 'react';

/* Minimal typing for the Cloudflare Turnstile global. */
interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      size?: 'normal' | 'compact' | 'flexible';
      appearance?: 'always' | 'execute' | 'interaction-only';
    }
  ) => string;
  reset: (id?: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onTurnstileLoad?: () => void;
  }
}

const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';

/**
 * Cloudflare Turnstile widget. Calls `onVerify(token)` when solved.
 *
 * If NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set, the widget renders nothing and
 * immediately reports an empty token — the server gate skips verification in
 * that case, so local dev / current prod keep working until the keys are added.
 * `appearance="interaction-only"` keeps it invisible unless a challenge is needed.
 */
export default function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // No key configured → no CAPTCHA; let the flow proceed (server skips it too).
    if (!siteKey) {
      onVerify('');
      return;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return; // already rendered
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        appearance: 'interaction-only',
        callback: (token) => onVerify(token),
        'expired-callback': () => onVerify(''),
        'error-callback': () => onVerify(''),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      window.onTurnstileLoad = renderWidget;
      if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
        const s = document.createElement('script');
        s.src = SCRIPT_SRC;
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
    };
    // onVerify is stable enough for this one-time setup; siteKey is build-time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="flex justify-center" />;
}
