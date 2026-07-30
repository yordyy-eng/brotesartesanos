'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'

const LOCALES = [
  { code: 'es' as const, label: 'ES' },
  { code: 'en' as const, label: 'EN' },
]

export default function SiteHeader() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <header className="site-header">
      <Link href="/" className="site-header-brand">
        <Image src="/logo-huellas-emblem.png" alt="" width={48} height={48} className="site-header-logo" priority />
        <span>
          Huellas de <em>Nahuelbuta</em>
        </span>
      </Link>

      <nav className="site-header-nav" aria-label="Navegación principal">
        <Link href="/historia">{t('historia')}</Link>
        <Link href="/sobre-nosotros">{t('sobreNosotros')}</Link>
        <Link href="/brotes-de-chile">{t('catalogo')}</Link>
        <Link href="/contacto">{t('contacto')}</Link>
      </nav>

      <div className="site-header-locale">
        {LOCALES.map(({ code, label }) => (
          <button
            key={code}
            className={`locale-btn${locale === code ? ' active' : ''}`}
            onClick={() => router.replace(pathname, { locale: code })}
            aria-current={locale === code}
          >
            {label}
          </button>
        ))}
      </div>

      <style jsx>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 1.25rem 2.5rem;
          background: rgba(30, 18, 10, 0.85);
          backdrop-filter: blur(10px);
          color: var(--cream);
        }

        .site-header-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-cormorant), serif;
          font-size: 1.35rem;
          color: var(--cream);
          text-decoration: none;
          white-space: nowrap;
        }

        .site-header-logo {
          height: 48px;
          width: 48px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .site-header-brand em {
          font-style: italic;
          color: var(--gold-light);
        }

        .site-header-nav {
          display: flex;
          gap: 2rem;
          flex: 1;
          justify-content: center;
        }

        .site-header-nav :global(a) {
          color: rgba(250, 246, 238, 0.75);
          text-decoration: none;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .site-header-nav :global(a:hover) {
          color: var(--gold-light);
        }

        .site-header-locale {
          display: flex;
          gap: 0.5rem;
        }

        .locale-btn {
          background: none;
          border: 1px solid rgba(250, 246, 238, 0.3);
          color: rgba(250, 246, 238, 0.6);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 0.3rem 0.6rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .locale-btn.active {
          background: var(--terracotta);
          border-color: var(--terracotta);
          color: var(--white);
        }

        @media (max-width: 768px) {
          .site-header {
            padding: 1rem 1.25rem;
            flex-wrap: wrap;
            gap: 1rem;
          }
          .site-header-logo {
            height: 36px;
            width: 36px;
          }
          .site-header-nav {
            order: 3;
            width: 100%;
            justify-content: flex-start;
            gap: 1.25rem;
            overflow-x: auto;
          }
        }
      `}</style>
    </header>
  )
}
