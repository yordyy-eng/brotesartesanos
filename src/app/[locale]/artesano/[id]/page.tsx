import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowLeft, MapPin, Camera, Mail, MessageCircle, ExternalLink } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload'
import { richTextToPlainText } from '@/lib/richtext'
import type { Media, Category } from '@/payload-types'

type PageParams = { locale: 'es' | 'en'; id: string }

async function getArtisan(id: string, locale: 'es' | 'en') {
  const payload = await getPayloadClient()
  try {
    return await payload.findByID({ collection: 'artisans', id, locale, depth: 1 })
  } catch {
    return null
  }
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
  const { id, locale } = await params
  const artisan = await getArtisan(id, locale)

  if (!artisan) {
    const t = await getTranslations({ locale, namespace: 'profile' })
    return { title: t('notFound') }
  }

  const description = richTextToPlainText(artisan.bio).slice(0, 160)

  return {
    title: `${artisan.name} - ${artisan.craft} | Brotes de Chile 2026`,
    description,
    openGraph: {
      title: `${artisan.name} - ${artisan.craft}`,
      description,
    }
  }
}

export default async function ArtisanProfile({ params }: { params: Promise<PageParams> }) {
  const { id, locale } = await params
  const artisan = await getArtisan(id, locale)

  if (!artisan) return notFound()

  const t = await getTranslations('profile')

  const category = artisan.category as Category
  const image = artisan.image && typeof artisan.image === 'object' ? (artisan.image as Media) : null

  // Extract contact info correctly
  const contactLink = artisan.instagram
  const isInstagram = contactLink?.includes('instagram.com')
  const isEmail = contactLink?.includes('@')
  const isPhone = contactLink?.startsWith('+') || contactLink?.match(/^\d+$/)
  const whatsappHref = isPhone ? `https://wa.me/${contactLink!.replace(/\D/g, '')}` : null

  return (
    <main className="artisan-profile-root">
      <div className="noise-overlay" />

      {/* Editorial Navigation */}
      <nav className="profile-nav">
        <Link href="/brotes-de-chile#catalogo" className="back-btn">
          <ArrowLeft size={16} />
          <span>{t('backToCatalog')}</span>
        </Link>
        <div className="nav-brand">Brotes de Chile <em>2026</em></div>
      </nav>

      <section className="profile-hero">
        <div className="hero-content-grid">
          {/* Main Visual Column */}
          <div className="visual-column">
            <div className="image-frame">
              {image?.url ? (
                <Image
                  src={image.url}
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
                {category?.name}
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
                    href={isEmail ? `mailto:${contactLink}` : whatsappHref ?? contactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meta-item-profile contact-link-profile"
                  >
                    {isInstagram ? <Camera size={16} /> :
                     isEmail ? <Mail size={16} /> :
                     <MessageCircle size={16} />}
                    <span>{isInstagram ? '@' + contactLink.split('instagram.com/')[1].replace('/', '') : contactLink}</span>
                    <ExternalLink size={12} className="opacity-40" />
                  </a>
                )}
              </div>
            </header>

            <div className="profile-bio-section">
              <h3 className="section-subtitle-profile">{t('craftAndLegacy')}</h3>
              {artisan.bio ? (
                <div className="bio-text-profile">
                  <RichText data={artisan.bio} />
                </div>
              ) : (
                <p className="bio-text-profile">{t('defaultBio')}</p>
              )}

              <div className="decorative-quote-mark">“</div>
            </div>

            <footer className="profile-footer">
              <div className="legacy-note">
                <strong>{t('legacyNote')}</strong>
                <span>{t('legacyLocation')}</span>
              </div>
            </footer>
          </div>
        </div>
      </section>
    </main>
  )
}
