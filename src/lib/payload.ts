import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'
import { getPdfImageSample } from './pdf-images'
import { getOfficialSitePhotoSample } from './official-site-images'

export const getPayloadClient = () => getPayload({ config })

async function getArtisanPortraitSample(sort: string, limit: number) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'artisans',
    depth: 1,
    limit,
    sort,
    where: { image: { exists: true } },
  })
  return docs
    .map((doc) => (doc.image && typeof doc.image === 'object' ? (doc.image as Media).url : null))
    .filter((url): url is string => Boolean(url))
    .map((url) => ({ url }))
}

// Photo mosaic used as background texture on page heroes, instead of an
// abstract gradient — a three-way mix of: real artisan portraits, the
// craftwork photography embedded in the source PDF (public/pdf-assets/images/),
// and real event/feria photography downloaded from the client's current site
// (public/reference/huellas-oficial/, see scripts/download_huellas_assets.py).
// `sort`/`offset` vary which slice of each source comes back, so each page's
// hero shows a different combination.
export async function getHeroPhotoMix(sort: string, offset: number, count = 18) {
  const perSource = Math.ceil(count / 3)
  const portraits = await getArtisanPortraitSample(sort, perSource)
  const pdfPhotos = getPdfImageSample(offset, perSource)
  const officialPhotos = getOfficialSitePhotoSample(offset, perSource)

  const mixed: { url: string }[] = []
  const max = Math.max(portraits.length, pdfPhotos.length, officialPhotos.length)
  for (let i = 0; i < max; i++) {
    if (portraits[i]) mixed.push(portraits[i])
    if (officialPhotos[i]) mixed.push(officialPhotos[i])
    if (pdfPhotos[i]) mixed.push(pdfPhotos[i])
  }
  return mixed.slice(0, count)
}

// Same three sources as getHeroPhotoMix, but meant to be shown at full
// brightness/color (photo galleries, card thumbnails on light backgrounds)
// rather than tinted behind a dark hero overlay.
export async function getGalleryPhotos(offset: number, count: number) {
  const perSource = Math.ceil(count / 2)
  const pdfPhotos = getPdfImageSample(offset, perSource)
  const officialPhotos = getOfficialSitePhotoSample(offset + 7, perSource)
  const mixed: { url: string }[] = []
  const max = Math.max(pdfPhotos.length, officialPhotos.length)
  for (let i = 0; i < max; i++) {
    if (officialPhotos[i]) mixed.push(officialPhotos[i])
    if (pdfPhotos[i]) mixed.push(pdfPhotos[i])
  }
  return mixed.slice(0, count)
}
