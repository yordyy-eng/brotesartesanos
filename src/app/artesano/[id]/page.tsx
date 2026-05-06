import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, Instagram, Mail, Phone } from 'lucide-react'

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
    <main className="profile-page" style={{ minHeight: '100vh', padding: '5rem 1.5rem', background: 'var(--cream)' }}>
      <div className="container-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/#catalogo" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: '3rem', fontWeight: 500 }}>
          <ArrowLeft size={18} /> Volver al catálogo
        </Link>
        
        <article className="profile-card" style={{ background: 'var(--white)', borderRadius: '24px', padding: '4rem 3rem', boxShadow: '0 24px 48px var(--shadow)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
            {artisan.image ? (
              <div className="avatar-large" style={{ width: '120px', height: '120px', borderRadius: '50%', position: 'relative', overflow: 'hidden', border: '4px solid var(--cream)', boxShadow: '0 8px 16px var(--shadow)' }}>
                <Image src={artisan.image} alt={artisan.name} fill style={{ objectFit: 'cover' }} sizes="120px" priority />
              </div>
            ) : (
              <div className="avatar-large" style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--terracotta)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, boxShadow: '0 8px 16px var(--shadow)' }}>
                {artisan.initials ?? artisan.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            
            <div className="badge" style={{ background: 'var(--parchment)', color: 'var(--ink)', padding: '0.5rem 1.5rem', borderRadius: '100px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {artisan.category.name}
            </div>

            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, color: 'var(--ink)', margin: '0' }}>
              {artisan.name}
            </h1>
            
            {artisan.craft && (
              <p style={{ fontSize: '1.4rem', color: 'var(--muted)', fontWeight: 400, fontStyle: 'italic', fontFamily: '"Cormorant Garamond", serif' }}>
                {artisan.craft}
              </p>
            )}

            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {artisan.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ink-mid)' }}>
                  <MapPin size={18} color="var(--terracotta)" />
                  <span>{artisan.location}</span>
                </div>
              )}
              
              {contactLink && (
                <a 
                  href={isEmail ? `mailto:${contactLink}` : isPhone ? `tel:${contactLink}` : contactLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ink-mid)', textDecoration: 'none', fontWeight: 500 }}
                >
                  {isInstagram ? <Instagram size={18} color="var(--terracotta)" /> : 
                   isEmail ? <Mail size={18} color="var(--terracotta)" /> : 
                   <Phone size={18} color="var(--terracotta)" />}
                  <span>{isInstagram ? '@' + contactLink.split('instagram.com/')[1].replace('/', '') : contactLink}</span>
                </a>
              )}
            </div>
          </div>

          {artisan.bio && (
            <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid var(--parchment)' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--terracotta)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }}>
                Sobre el oficio
              </h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--ink-mid)', lineHeight: 1.8, fontWeight: 300 }}>
                {artisan.bio}
              </p>
            </div>
          )}
        </article>
      </div>
    </main>
  )
}
