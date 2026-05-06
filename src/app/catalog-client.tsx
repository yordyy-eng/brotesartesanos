'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Category {
  id: string
  name: string
  _count: { artisans: number }
}

interface Artisan {
  id: string
  name: string
  initials: string | null
  image: string | null
  craft: string | null
  bio: string | null
  location: string | null
  instagram: string | null
  categoryId: string
  category: { name: string }
}

// ─────────────────────────────────────────────────────────────────────────────
// Category color map
// ─────────────────────────────────────────────────────────────────────────────
const CAT_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  orfebr:  { bg: '#FFF3E0', text: '#B8801A', badge: '#7A500A' },
  madera:  { bg: '#F1EBE0', text: '#5D3A1A', badge: '#5D3A1A' },
  cuero:   { bg: '#FDEBD0', text: '#8B3A1F', badge: '#6B2D14' },
  textil:  { bg: '#E8F5E9', text: '#2D5016', badge: '#1E3D0A' },
  greda:   { bg: '#FCE4EC', text: '#AD1457', badge: '#880E4F' },
  mimbre:  { bg: '#E3F2FD', text: '#1565C0', badge: '#0D47A1' },
  otros:   { bg: '#EDE7F6', text: '#4527A0', badge: '#311B92' },
}

function getCatColors(id: string) {
  return CAT_COLORS[id] ?? CAT_COLORS['otros']
}

// ─────────────────────────────────────────────────────────────────────────────
// ArtisanCard
// ─────────────────────────────────────────────────────────────────────────────
function ArtisanCard({ artisan }: { artisan: Artisan }) {
  const colors = getCatColors(artisan.categoryId)

  const contactLabel = artisan.instagram
    ? artisan.instagram.startsWith('http')
      ? '@' + artisan.instagram.split('instagram.com/')[1].replace('/', '')
      : artisan.instagram
    : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link href={`/artesano/${artisan.id}`} style={{ textDecoration: 'none' }}>
        <article
          className="card"
          style={{ '--cat-bg': colors.bg, '--cat-text': colors.text, '--cat-badge': colors.badge } as React.CSSProperties}
        >
          <div className="card-header">
            {artisan.image ? (
              <div className="card-avatar" style={{ position: 'relative', overflow: 'hidden', border: `2px solid ${colors.bg}` }}>
                <Image src={artisan.image} alt={artisan.name} fill style={{ objectFit: 'cover' }} sizes="48px" />
              </div>
            ) : (
              <div className="card-avatar" style={{ background: colors.bg, color: colors.text }}>
                {artisan.initials ?? artisan.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="card-category" style={{ background: colors.bg, color: colors.badge }}>
              {artisan.category.name}
            </span>
          </div>
          <div className="card-name">{artisan.name}</div>
          {artisan.craft && <div className="card-craft">{artisan.craft}</div>}
          {artisan.bio && <p className="card-desc">{artisan.bio}</p>}
          <div className="card-footer" onClick={(e) => {
            // Prevent click from bubbling to the Link if clicking social
            if ((e.target as HTMLElement).tagName === 'A') e.stopPropagation()
          }}>
            <span className="card-location">📍 {artisan.location}</span>
            {artisan.instagram && contactLabel && (
              <a
                className="card-contact"
                href={artisan.instagram.startsWith('http') ? artisan.instagram : `https://instagram.com/${artisan.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contactLabel}
              </a>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Catalog Client Component
// ─────────────────────────────────────────────────────────────────────────────
export default function CatalogClient() {
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch categories once
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error)
  }, [])

  // Fetch artisans when filters change
  const fetchArtisans = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeCategory !== 'todos') params.set('category', activeCategory)
    if (searchQuery) params.set('q', searchQuery)

    const res = await fetch(`/api/artisans?${params.toString()}`)
    const data = await res.json()
    setArtisans(data)
    setLoading(false)
  }, [activeCategory, searchQuery])

  useEffect(() => {
    const t = setTimeout(fetchArtisans, 200)
    return () => clearTimeout(t)
  }, [fetchArtisans])

  return (
    <>
      <a href="#catalogo" className="skip-link">Saltar al catálogo principal</a>

      {/* ── HERO ── */}
      <header className="hero">
        <div className="hero-inner">
          <span className="hero-tag">Muestra de Arte Popular Chileno · Angol 2026</span>
          <h1>
            Brotes de <em>Chile</em>
          </h1>
          <p className="hero-sub">
            Un territorio vivo donde habitan las manos, la memoria y la identidad de un país tejido desde sus raíces.
          </p>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <span className="num">40</span>
              <span className="label">Artesanas y artesanos</span>
            </div>
            <div className="hero-divider" />
            <div className="hero-meta-item">
              <span className="num">40ª</span>
              <span className="label">Versión de la muestra</span>
            </div>
            <div className="hero-divider" />
            <div className="hero-meta-item">
              <span className="num">1984</span>
              <span className="label">Año de origen</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll">Explorar</div>
      </header>

      {/* ── MEMORIAS ── */}
      <section className="memorias">
        <div className="container">
          <p className="section-tag">Historia</p>
          <h2>Memorias de la muestra</h2>
          <div className="memorias-grid">
            <p className="memorias-quote">
              &ldquo;Lo que aquí se exhibe no son solo objetos — son Brotes de memoria, identidad, resistencia y de futuro.&rdquo;
            </p>
            <div className="memorias-text">
              <p>
                Desde su origen en 1984, junto al nacimiento del Festival Brotes de Chile en la ciudad de Angol, la Muestra de Arte Popular ha sido mucho más que un espacio expositivo: un territorio vivo donde habitan las manos, la memoria y la identidad de un país tejido desde sus raíces.
              </p>
              <p>
                En su versión número 40 — un umbral — la muestra vuelve a posicionarse como un espacio de sentido: caminarlo es encontrarse con miradas que saben, manos que narran sin palabras, materiales que conservan el pulso de la tierra.
              </p>
              <p>
                Hoy el asombro regresa. La cantidad cede ante la calidad; la inmediatez, ante el tiempo paciente de la creación. Porque al final, la artesanía no sobrevive por inercia, sino por cuidado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HISTORIA AGRUPACIÓN ── */}
      <section className="historia">
        <div className="container">
          <p className="section-tag" style={{ color: 'var(--gold-light)' }}>Sobre nosotros</p>
          <div className="historia-grid">
            <div className="historia-aside">
              {[
                { num: '2021', desc: 'Año de fundación' },
                { num: '15+', desc: 'Artesanas y productores fundadores' },
                { num: '2026', desc: 'Fondart Nacional adjudicado' },
                { num: '80+', desc: 'Creadores en la Expo Destino' },
              ].map(({ num, desc }) => (
                <div key={desc} className="historia-stat">
                  <div className="num">{num}</div>
                  <div className="desc">{desc}</div>
                </div>
              ))}
            </div>
            <div>
              <h2>Agrupación Huellas de Nahuelbuta</h2>
              <p>
                Nace en el otoño de 2021, en el contexto post pandemia, cuando artesanas y productores del territorio reflexionaron sobre la necesidad de generar mejores espacios para exhibir y comercializar su trabajo, fortaleciendo la representación del oficio artesanal local.
              </p>
              <p>
                En enero de 2022 se conformó oficialmente, con 15 integrantes de diversos oficios: artesanía en lana, tejidos tradicionales, macramé, vitrofusión, madera, talabartería y orfebrería, entre otros.
              </p>
              <p>
                Hoy mantiene un calendario anual de actividades y se proyecta como una organización sólida, profundamente vinculada con el territorio, comprometida con la difusión del arte, la artesanía, la cultura y la producción local.
              </p>
              <p style={{ marginTop: '1.5rem', fontSize: '13px' }}>
                Productora General: <strong style={{ color: 'var(--gold-light)' }}>Mariana Rojas Román</strong>{' '}
                · Productora Ejecutiva: <strong style={{ color: 'var(--gold-light)' }}>María Elisa Robles Rivas</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO ── */}
      <section className="catalogo" id="catalogo">
        <div className="container">
          <p className="section-tag">Catálogo 2026</p>
          <h2>Artesanas y Artesanos</h2>

          <div className="catalogo-controls">
            <div className="search-wrap">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="search"
                type="text"
                placeholder="Buscar por nombre, oficio o ciudad…"
                aria-label="Buscar artesanos por nombre, oficio o ciudad"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filters" id="filters">
              <button
                id="filter-todos"
                className={`filter-btn${activeCategory === 'todos' ? ' active' : ''}`}
                onClick={() => setActiveCategory('todos')}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`filter-${cat.id}`}
                  className={`filter-btn${activeCategory === cat.id ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <p className="catalogo-count" id="count">
            {loading ? 'Buscando…' : `Mostrando ${artisans.length} ${activeCategory === 'todos' ? 'artesanas y artesanos' : 'resultados'}`}
          </p>

          <motion.div layout className="artesanos-grid" id="grid">
            <AnimatePresence mode="popLayout">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="card skeleton"
                      aria-busy="true"
                    />
                  ))
                : artisans.map(a => <ArtisanCard key={a.id} artisan={a} />)
              }
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── AGRADECIMIENTOS ── */}
      <section className="gracias">
        <div className="container">
          <p className="section-tag">Reconocimientos</p>
          <h2>Agradecimientos del proyecto</h2>
          <p style={{ color: 'var(--ink-mid)', maxWidth: '600px', fontWeight: 300 }}>
            Este catálogo fue posible gracias al trabajo colaborativo de muchas personas y organizaciones comprometidas con el arte popular chileno.
          </p>
          <div className="gracias-grid">
            {[
              { title: 'Financiamiento', body: 'Fondart Nacional 2026 · Ministerio de las Culturas, las Artes y el Patrimonio' },
              { title: 'Municipalidad de Angol', body: 'Parte fundamental en la realización de la 40ª Muestra de Arte Popular Chileno' },
              { title: 'Comité organizador', body: 'José Luis Bustamante Oporto y Francisco Gómez Vera por su gestión y apoyo logístico' },
              { title: 'Diseño editorial', body: 'Constanza Parada · @coniivone' },
              { title: 'Fotografía editorial', body: 'Bárbara Aguilar · @_pame_cr2 · Ignacio Hormazábal · @owl.produkciones' },
              { title: 'Cobertura del evento', body: 'Claudio Andrades · @claudiovisual_' },
            ].map(({ title, body }) => (
              <div key={title} className="gracias-item">
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <p><strong>Catálogo Artesanos · Muestra de Arte Popular Chileno Brotes de Chile 2026</strong></p>
        <p style={{ marginTop: '0.5rem' }}>Agrupación Huellas de Nahuelbuta · Angol, Región de La Araucanía</p>
        <p style={{ marginTop: '0.5rem' }}>
          Productora General: <strong>Mariana Rojas Román</strong>{' '}
          · Productora Ejecutiva: <strong>María Elisa Robles Rivas</strong>
        </p>
      </footer>
    </>
  )
}
