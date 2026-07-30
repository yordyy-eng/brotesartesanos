import manifest from './generated/pdf-images-manifest.json'

// The 385 images embedded in the source PDF (public/pdf-assets/images/) — real
// photography of the artisans' actual craftwork, not just their portraits.
// Used as extra texture in hero photo mosaics alongside the artisan portraits.
//
// The candidate list is precomputed by scripts/build-image-manifests.cjs
// (dedupes repeated re-embeds by file size, filters out undecodable/corrupt
// files via sharp) — re-run that script if images are added or removed here.
// Validating with sharp at request time is deliberately avoided: sharp's
// native addon crashes when called from inside Next's static-generation
// worker threads on Windows.
const candidates: string[] = manifest

export function getPdfImageSample(offset: number, count: number): { url: string }[] {
  if (candidates.length === 0) return []
  const result: { url: string }[] = []
  for (let i = 0; i < count; i++) {
    const file = candidates[(offset + i) % candidates.length]
    result.push({ url: `/pdf-assets/images/${file}` })
  }
  return result
}
