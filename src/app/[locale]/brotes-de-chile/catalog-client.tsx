'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Search, MapPin, ExternalLink, ArrowRight } from 'lucide-react'
import type { HomeHero } from '@/payload-types'
import HeroPhotoGrid from '../_components/HeroPhotoGrid'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  count: number
}

export interface Artisan {
  id: string
  name: string
  initials: string | null
  image: string | null
  craft: string | null
  bioText: string
  location: string | null
  instagram: string | null
  categoryId: string
  categoryName: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Category color map (Premium Earth Tones)
// ─────────────────────────────────────────────────────────────────────────────
const CAT_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  orfebr:  { bg: '#FFF9F0', text: '#B8801A', badge: '#9A6B15' },
  madera:  { bg: '#F8F4ED', text: '#4A3020', badge: '#4A3020' },
  cuero:   { bg: '#FAF3F0', text: '#8B3A1F', badge: '#702E19' },
  textil:  { bg: '#F2F6EF', text: '#2D5016', badge: '#244012' },
  greda:   { bg: '#FDF2F5', text: '#AD1457', badge: '#8E1047' },
  mimbre:  { bg: '#F0F7FF', text: '#1565C0', badge: '#104E96' },
  otros:   { bg: '#F5F2FF', text: '#4527A0', badge: '#371F80' },
}

function getCatColors(id: string) {
  return CAT_COLORS[id] ?? CAT_COLORS['otros']
}

// ─────────────────────────────────────────────────────────────────────────────
// Variants for Animations
// ─────────────────────────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ArtisanCard
// ─────────────────────────────────────────────────────────────────────────────
function ArtisanCard({ artisan }: { artisan: Artisan }) {
  const t = useTranslations('catalog')
  const colors = getCatColors(artisan.categoryId)

  const contactLabel = artisan.instagram
    ? artisan.instagram.startsWith('http')
      ? '@' + artisan.instagram.split('instagram.com/')[1].replace('/', '')
      : artisan.instagram
    : null

  return (
    <motion.div
      variants={cardVariants}
      layout
      className="card-container"
    >
      <Link href={`/artesano/${artisan.id}`} className="card-link-overlay" aria-label={`${t('viewProfile')} ${artisan.name}`} />
      
      <article className="artisan-card-premium">
        <div className="card-media">
          {artisan.image ? (
            <Image 
              src={artisan.image} 
              alt={artisan.name} 
              fill 
              style={{ objectFit: 'cover' }} 
              sizes="(max-width: 768px) 100vw, 33vw" 
              className="card-image"
            />
          ) : (
            <div className="card-placeholder" style={{ background: colors.bg, color: colors.text }}>
              {artisan.initials ?? artisan.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="card-badge" style={{ background: colors.bg, color: colors.badge }}>
            {artisan.categoryName}
          </div>
        </div>

        <div className="card-content">
          <h3 className="card-title">{artisan.name}</h3>
          <p className="card-craft-label">{artisan.craft || 'Artesanía Tradicional'}</p>
          
          <div className="card-divider" />
          
          <div className="card-footer-meta">
            <span className="card-loc">
              <MapPin size={12} strokeWidth={2.5} />
              {artisan.location}
            </span>
            <div className="view-profile-cta">
              {t('viewProfile')} <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </article>

      <style jsx>{`
        .card-container {
          position: relative;
          height: 100%;
        }

        .card-link-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
        }

        .artisan-card-premium {
          background: var(--white);
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          overflow: hidden;
          position: relative;
        }

        .card-container:hover .artisan-card-premium {
          border-color: var(--terracotta);
          box-shadow: 0 20px 40px var(--shadow);
          transform: translateY(-5px);
        }

        .card-media {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
          background: var(--parchment);
        }

        .card-image {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .card-container:hover .card-image {
          transform: scale(1.08);
        }

        .card-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-cormorant), serif;
          font-size: 3rem;
          font-weight: 600;
        }

        .card-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 2;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          padding: 0.4rem 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.9) !important;
        }

        .card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-title {
          font-family: var(--font-cormorant), serif;
          font-size: 1.5rem;
          line-height: 1.1;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--ink);
        }

        .card-craft-label {
          font-size: 13px;
          color: var(--muted);
          font-style: italic;
          margin-bottom: 1rem;
        }

        .card-divider {
          width: 2rem;
          height: 1px;
          background: var(--terracotta);
          opacity: 0.2;
          margin-bottom: 1rem;
          transition: width 0.5s ease;
        }

        .card-container:hover .card-divider {
          width: 100%;
        }

        .card-footer-meta {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-loc {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .view-profile-cta {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--terracotta);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.4s ease;
        }

        .card-container:hover .view-profile-cta {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Catalog Client Component
// ─────────────────────────────────────────────────────────────────────────────
interface CatalogClientProps {
  initialArtisans: Artisan[]
  initialCategories: Category[]
  hero: HomeHero
  heroPhotos: { url: string }[]
}

export default function CatalogClient({ initialArtisans, initialCategories, hero, heroPhotos }: CatalogClientProps) {
  const t = useTranslations('catalog')
  const [activeCategory, setActiveCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')

  const artisans = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return initialArtisans.filter((a) => {
      const matchesCategory = activeCategory === 'todos' || a.categoryId === activeCategory
      const matchesQuery =
        !q ||
        [a.name, a.craft, a.location, a.bioText].some((field) => field?.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [initialArtisans, activeCategory, searchQuery])

  return (
    <div className="catalog-page-wrapper">
      <a href="#catalogo" className="skip-link">{t('skipLink')}</a>

      {/* ── HERO ── */}
      <header className="hero-premium">
        <HeroPhotoGrid images={heroPhotos} />
        <div className="hero-pattern-bg" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="hero-inner"
        >
          <span className="hero-tag-refined">{hero.tag}</span>
          <h1 className="hero-title-main">
            {hero.titlePrefix} <em>{hero.titleEmphasis}</em>
          </h1>
          <p className="hero-sub-premium">
            {hero.subtitle}
          </p>

          <div className="hero-stats-refined">
            {(hero.stats ?? []).map((stat) => (
              <div key={stat.id ?? stat.label} className="stat-group">
                <span className="stat-num">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="scroll-indicator-premium">
          <div className="mouse-wheel" />
        </div>
      </header>

      {/* ── MEMORIAS ── */}
      <section className="section-editorial memorias-section">
        <div className="container">
          <div className="editorial-grid">
            <div className="editorial-header">
              <span className="editorial-tag">{hero.memoriasTag}</span>
              <h2 className="editorial-title">{hero.memoriasTitle}</h2>
            </div>
            <div className="editorial-content">
              <p className="large-lead">{hero.memoriasLead}</p>
              <div className="columns-text">
                {(hero.memoriasParagraphs ?? []).map((p, i) => (
                  <p key={p.id ?? i}>{p.text}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO ── */}
      <section className="catalog-section" id="catalogo">
        <div className="container">
          <header className="catalog-header">
            <div className="header-text">
              <span className="editorial-tag">El Archivo</span>
              <h2 className="editorial-title">Catálogo de Expositores</h2>
            </div>
            
            <div className="catalog-filters-bar">
              <div className="search-refined">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="category-scroll-area">
                <button
                  className={`filter-chip${activeCategory === 'todos' ? ' active' : ''}`}
                  onClick={() => setActiveCategory('todos')}
                >
                  {t('categoryAll')}
                </button>
                {initialCategories.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-chip${activeCategory === cat.id ? ' active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="results-count">
            {t('resultsCount', { count: artisans.length })}
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
            className="artisan-grid-premium"
          >
            <AnimatePresence mode="popLayout">
              {artisans.map(a => <ArtisanCard key={a.id} artisan={a} />)}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .catalog-page-wrapper {
          background: var(--cream);
          position: relative;
        }

        .catalog-page-wrapper::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image: url("/noise.svg");
          opacity: 0.03;
          pointer-events: none;
          z-index: 100;
        }

        /* Hero Refined */
        .hero-premium {
          min-height: 100vh;
          background: var(--ink);
          color: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          text-align: center;
          padding: 4rem 2rem;
          overflow: hidden;
        }

        .hero-pattern-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image:
            radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            radial-gradient(ellipse 65% 55% at 50% 45%, rgba(22,38,28,0.82) 0%, rgba(22,38,28,0.5) 55%, rgba(22,38,28,0.68) 100%);
          background-size: 32px 32px, cover;
        }

        .hero-inner { position: relative; z-index: 2; max-width: 900px; }

        .hero-tag-refined {
          display: inline-block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--gold-light);
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .hero-title-main {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(4rem, 10vw, 8rem);
          line-height: 0.9;
          font-weight: 600;
          margin-bottom: 2rem;
          letter-spacing: -0.03em;
        }

        .hero-title-main em { font-style: italic; color: var(--gold-light); }

        .hero-sub-premium {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: rgba(250,246,238,0.6);
          max-width: 600px;
          margin: 0 auto 4rem;
          font-weight: 300;
          line-height: 1.6;
        }

        .hero-stats-refined {
          display: flex;
          justify-content: center;
          gap: 4rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 3rem;
        }

        .stat-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .stat-num { font-family: var(--font-cormorant), serif; font-size: 3rem; color: var(--gold-light); line-height: 1; }
        .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.5; }

        .scroll-indicator-premium {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .mouse-wheel {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, var(--gold-light), transparent);
          position: relative;
        }

        /* Editorial Section */
        .section-editorial { padding: 10rem 2rem; }
        .editorial-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          align-items: start;
        }

        .editorial-tag {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--terracotta);
          margin-bottom: 1rem;
          display: block;
          font-weight: 600;
        }

        .editorial-title {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.1;
          color: var(--ink);
        }

        .large-lead {
          font-family: var(--font-cormorant), serif;
          font-size: 2.2rem;
          line-height: 1.3;
          margin-bottom: 3rem;
          color: var(--terracotta);
          font-style: italic;
        }

        .columns-text {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          font-size: 1.1rem;
          color: var(--ink-mid);
          font-weight: 300;
          line-height: 1.8;
        }

        /* Catalog Section */
        .catalog-section { padding: 4rem 2rem 10rem; }
        .catalog-header {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        .catalog-filters-bar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: var(--white);
          padding: 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        .search-refined {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon { position: absolute; left: 1.5rem; color: var(--terracotta); }

        .search-refined input {
          width: 100%;
          padding: 1.25rem 1.5rem 1.25rem 4rem;
          border: none;
          background: var(--parchment);
          font-size: 1rem;
          color: var(--ink);
          border-radius: 4px;
          outline: none;
        }

        .category-scroll-area {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          scrollbar-width: none;
        }

        .filter-chip {
          white-space: nowrap;
          padding: 0.6rem 1.25rem;
          border-radius: 4px;
          border: 1px solid var(--border);
          background: var(--white);
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-chip:hover { border-color: var(--terracotta); color: var(--terracotta); }
        .filter-chip.active { background: var(--terracotta); border-color: var(--terracotta); color: var(--white); }

        .results-count { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 2rem; }

        .artisan-grid-premium {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 1024px) {
          .editorial-grid { grid-template-columns: 1fr; }
          .columns-text { grid-template-columns: 1fr; }
          .hero-stats-refined { gap: 2rem; }
        }
      `}</style>
    </div>
  )
}
