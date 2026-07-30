import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'

export default async function Footer({ locale }: { locale: 'es' | 'en' }) {
  const payload = await getPayloadClient()
  const contacto = await payload.findGlobal({ slug: 'contacto', locale })

  return (
    <footer>
      <Image
        src="/logo-huellas-emblem.png"
        alt={contacto.orgName ?? 'Huellas de Nahuelbuta'}
        width={96}
        height={96}
        className="footer-logo"
      />
      <strong>{contacto.orgName}</strong>
      <p>
        {contacto.email}
        {contacto.address ? ` · ${contacto.address}` : ''}
      </p>
      <p>
        {contacto.instagramUrl && (
          <a href={contacto.instagramUrl} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        )}
        {contacto.facebookUrl && (
          <>
            {' · '}
            <a href={contacto.facebookUrl} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </>
        )}
      </p>
      <p className="footer-credit">
        Desarrollado por{' '}
        <a href="https://adelchen.cl" target="_blank" rel="noopener noreferrer">
          adelchen.cl
        </a>
      </p>
    </footer>
  )
}
