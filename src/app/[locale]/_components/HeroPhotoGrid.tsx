import Image from 'next/image'

interface HeroPhotoGridProps {
  images: { url: string }[]
}

export default function HeroPhotoGrid({ images }: HeroPhotoGridProps) {
  if (images.length === 0) return null

  return (
    <div className="hero-photo-grid" aria-hidden="true">
      {images.map((img, i) => (
        <div key={img.url + i} className="hero-photo-tile">
          <Image src={img.url} alt="" fill sizes="20vw" style={{ objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  )
}
