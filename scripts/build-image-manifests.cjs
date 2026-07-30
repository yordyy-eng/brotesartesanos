// Precomputes the list of decodable, deduped image candidates for the two
// static photo pools (PDF extraction + scraped official-site photos).
//
// Why this exists as a build-time script instead of runtime validation:
// sharp's native addon is not safe to call from inside worker threads, and
// Next.js's static-generation workers on Windows crash (access violation)
// when a page render path calls `sharp(...).metadata()` there. Running the
// decode check once here, in a plain Node main-thread process, and writing
// the result to a JSON manifest lets the app just read an array at request
// time — no sharp involved in the request/build path at all.
//
// Re-run this (`node scripts/build-image-manifests.cjs`) whenever images are
// added to public/pdf-assets/images or public/reference/huellas-oficial.
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const MIN_SIZE = 150_000

async function buildManifest(dir, excludeRe) {
  let files = []
  try {
    files = fs.readdirSync(dir)
  } catch {
    return []
  }

  const seenSizes = new Set()
  const candidates = []
  for (const file of files) {
    if (excludeRe && excludeRe.test(file)) continue
    const full = path.join(dir, file)
    let size = 0
    try {
      size = fs.statSync(full).size
    } catch {
      continue
    }
    if (size < MIN_SIZE || seenSizes.has(size)) continue
    try {
      await sharp(full).metadata()
    } catch {
      continue
    }
    seenSizes.add(size)
    candidates.push(file)
  }
  return candidates.sort()
}

async function main() {
  const outDir = path.join(process.cwd(), 'src', 'lib', 'generated')
  fs.mkdirSync(outDir, { recursive: true })

  const pdfCandidates = await buildManifest(
    path.join(process.cwd(), 'public', 'pdf-assets', 'images'),
    null,
  )
  fs.writeFileSync(
    path.join(outDir, 'pdf-images-manifest.json'),
    JSON.stringify(pdfCandidates, null, 2),
  )
  console.log(`pdf-images-manifest.json: ${pdfCandidates.length} candidates`)

  const officialCandidates = await buildManifest(
    path.join(process.cwd(), 'public', 'reference', 'huellas-oficial'),
    /logo|favicon|cropped/i,
  )
  fs.writeFileSync(
    path.join(outDir, 'official-site-images-manifest.json'),
    JSON.stringify(officialCandidates, null, 2),
  )
  console.log(`official-site-images-manifest.json: ${officialCandidates.length} candidates`)
}

main()
