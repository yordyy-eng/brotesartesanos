import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, Camera, Mail, Phone, ExternalLink } from 'lucide-react'

// Dynamic SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const artisan = await db.artisan.findUnique({
    where: { id: resolvedParams.id },
    include: { category: true }
  })
  
  if (!artisan) return { title: 'Artesano no encontrado' }
  
  return {
    title: `${artisan.name} - ${artisan.craft} | Brotes de Chile 2026`,
    description: artisan.bio?.slice(0, 160),
    openGraph: {
      title: `${artisan.name} - ${artisan.craft}`,
      description: artisan.bio?.slice(0, 160),
    }
  }
}

export default async function ArtisanProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const artisan = await db.artisan.findUnique({
    where: { id: resolvedParams.id },
    include: { category: true }
  })

  if (!artisan) return notFound()

  // Extract contact info correctly
  const contactLink = artisan.instagram
  const isInstagram = contactLink?.includes('instagram.com')
  const isEmail = contactLink?.includes('@')
  const isPhone = contactLink?.startsWith('+') || contactLink?.match(/^\d+$/)

  return (
    <main className="artisan-profile-root">
      <div className="noise-overlay" />
      
      {/* Editorial Navigation */}
      <nav className="profile-nav">
        <Link href="/#catalogo" className="back-btn">
          <ArrowLeft size={16} />
          <span>Volver al Catálogo</span>
        </Link>
        <div className="nav-brand">Brotes de Chile <em>2026</em></div>
      </nav>

      <section className="profile-hero">
        <div className="hero-content-grid">
          {/* Main Visual Column */}
          <div className="visual-column">
            <div className="image-frame">
              {artisan.image ? (
                <Image 
                  src={artisan.image} 
                  alt={artisan.name} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority 
                />
              ) : (
                <div className="placeholder-avatar">
                  {artisan.initials ?? artisan.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="image-overlay-glow" />
            </div>
            {artisan.craft && (
              <div className="craft-badge-floating">
                <span>{artisan.craft}</span>
              </div>
            )}
          </div>

          {/* Text Content Column */}
          <div className="content-column">
            <header className="profile-header">
              <div className="category-tag-profile">
                {artisan.category.name}
              </div>
              <h1 className="artisan-name-display">
                {artisan.name}
              </h1>
              
              <div className="profile-metadata">
                {artisan.location && (
                  <div className="meta-item-profile">
                    <MapPin size={16} className="text-terracotta" />
                    <span>{artisan.location}</span>
                  </div>
                )}
                
                {contactLink && (
                  <a 
                    href={isEmail ? `mailto:${contactLink}` : isPhone ? `tel:${contactLink}` : contactLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="meta-item-profile contact-link-profile"
                  >
                    {isInstagram ? <Camera size={16} /> : 
                     isEmail ? <Mail size={16} /> : 
                     <Phone size={16} />}
                    <span>{isInstagram ? '@' + contactLink.split('instagram.com/')[1].replace('/', '') : contactLink}</span>
                    <ExternalLink size={12} className="opacity-40" />
                  </a>
                )}
              </div>
            </header>

            <div className="profile-bio-section">
              <h3 className="section-subtitle-profile">El Oficio y el Legado</h3>
              <p className="bio-text-profile">
                {artisan.bio || "Este artesano/a forma parte de los 40 fundadores del catálogo Brotes de Chile, preservando las técnicas tradicionales que definen nuestra identidad cultural."}
              </p>
              
              <div className="decorative-quote-mark">“</div>
            </div>

            <footer className="profile-footer">
              <div className="legacy-note">
                <strong>Catálogo Digital Patrimonio Cultural</strong>
                <span>Exposición 2026 · Santiago de Chile</span>
              </div>
            </footer>
          </div>
        </div>
      </section>
    </main>
  )
}
