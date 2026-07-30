import manifest from './generated/official-site-images-manifest.json'

// Real photography downloaded from the client's current site (huellasdenahuelbuta.cl):
// event/feria photos, product shots, etc. See scripts/download_huellas_assets.py.
//
// The candidate list is precomputed by scripts/build-image-manifests.cjs
// (dedupes repeated WordPress crop re-exports by file size, filters out
// undecodable/corrupt files via sharp) — re-run that script if images are
// added or removed here. Validating with sharp at request time is
// deliberately avoided: sharp's native addon crashes when called from inside
// Next's static-generation worker threads on Windows.
const candidates: string[] = manifest

export function getOfficialSitePhotoSample(offset: number, count: number): { url: string }[] {
  if (candidates.length === 0) return []
  const result: { url: string }[] = []
  for (let i = 0; i < count; i++) {
    const file = candidates[(offset + i) % candidates.length]
    result.push({ url: `/reference/huellas-oficial/${file}` })
  }
  return result
}
