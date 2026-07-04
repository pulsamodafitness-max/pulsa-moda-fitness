/**
 * generate-thumbs.js
 *
 * For each product color variant, crops the main product image to a
 * 100×100 square and saves it as WebP at:
 *   public/products/{slug}/{colorName}/thumb.webp
 *
 * Usage:
 *   node scripts/generate-thumbs.js
 *   node scripts/generate-thumbs.js --sizes 100,300,600
 *
 * Only regenerates when the source image content changes (MD5 hash cache).
 * Skips products whose source image does not exist (e.g. Unsplash placeholders).
 */

const sharp = require("sharp")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const ROOT = path.resolve(__dirname, "..")
const PUBLIC = path.join(ROOT, "public")

const HEX_TO_NAME = {
  "#000000": "preto",
  "#ffffff": "branco",
  "#e11d48": "rosa",
  "#6b7280": "cinza",
  "#1e3a5f": "azul-marinho",
  "#f5f5f5": "off-white",
  "#4a5568": "grafite",
  "#d4a5a5": "rose",
  "#2d6a4f": "verde",
}

const MANIFEST = [
  // ── CONJUNTOS COM CALÇA ──
  { slug: "conjunto-balance",    dir: "balance",    sub: "conjunto-calca" },
  { slug: "conjunto-core",       dir: "core",       sub: "conjunto-calca" },
  { slug: "conjunto-highline",   dir: "highline",   sub: "conjunto-calca" },
  { slug: "conjunto-intensity",  dir: "intensity",  sub: "conjunto-calca" },
  { slug: "conjunto-max-shape",  dir: "maxshapee",  sub: "conjunto-calca" },
  { slug: "conjunto-perfect-fit",dir: "perfectfit", sub: "conjunto-calca" },
  { slug: "conjunto-powerline",  dir: "powerline",  sub: "conjunto-calca" },
  { slug: "conjunto-ultrafit",   dir: "ultrafit",   sub: "conjunto-calca" },

  // ── CONJUNTOS COM SHORT ──
  { slug: "conjunto-breeze",    dir: "breeze",    sub: "conjunto-short" },
  { slug: "conjunto-energy",    dir: "energy",    sub: "conjunto-short" },
  { slug: "conjunto-fit",       dir: "fit",       sub: "conjunto-short" },
  { slug: "conjunto-flow",      dir: "flow",      sub: "conjunto-short" },
  { slug: "conjunto-glow",      dir: "glow",      sub: "conjunto-short" },
  { slug: "conjunto-jump",      dir: "jump",      sub: "conjunto-short" },
  { slug: "conjunto-pulse",     dir: "pulse",     sub: "conjunto-short" },
  { slug: "conjunto-pulse-one", dir: "pulse-one", sub: "conjunto-short" },
  { slug: "conjunto-ritmo",     dir: "ritmo",     sub: "conjunto-short" },
  { slug: "conjunto-spark",     dir: "spark",     sub: "conjunto-short" },
  { slug: "conjunto-strike",    dir: "strike",    sub: "conjunto-short" },
  { slug: "conjunto-sunny",     dir: "sunny",     sub: "conjunto-short" },
  { slug: "conjunto-velocity",  dir: "velocity",  sub: "conjunto-short" },
  { slug: "conjunto-vibe",      dir: "vibe",      sub: "conjunto-short" },
  { slug: "conjunto-wave",      dir: "wave",      sub: "conjunto-short" },

  // ── MACAQUINHOS ──
  { slug: "macaquinho-delight", dir: "delight", sub: "macaquinho" },
  { slug: "macaquinho-beauty",  dir: "beauty",  sub: "macaquinho" },
  { slug: "macaquinho-dream",   dir: "dream",   sub: "macaquinho" },
  { slug: "macaquinho-lady",    dir: "lady",    sub: "macaquinho" },
  { slug: "macaquinho-summer",  dir: "summer",  sub: "macaquinho" },
  { slug: "macaquinho-sweet",   dir: "sweet",   sub: "macaquinho" },
]

const ALL_COLORS = {
  "conjunto-balance":     ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-core":        ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-highline":    ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-intensity":   ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-max-shape":   ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-perfect-fit": ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-powerline":   ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-ultrafit":    ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-breeze":      ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-energy":      ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-fit":         ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-flow":        ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-glow":        ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-jump":        ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-pulse":       ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-pulse-one":   ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-ritmo":       ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-spark":       ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-strike":      ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-sunny":       ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-velocity":    ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-vibe":        ["#000000", "#2d6a4f", "#e11d48"],
  "conjunto-wave":        ["#000000", "#2d6a4f", "#e11d48"],
  "macaquinho-delight":   ["#000000"],
  "macaquinho-beauty":    ["#000000"],
  "macaquinho-dream":     ["#000000"],
  "macaquinho-lady":      ["#000000"],
  "macaquinho-summer":    ["#000000"],
  "macaquinho-sweet":     ["#000000"],
}

function md5(buffer) {
  return crypto.createHash("md5").update(buffer).digest("hex")
}

function colorName(hex) {
  return HEX_TO_NAME[hex.toLowerCase()]
}

async function generateThumb({ slug, sourceJpg, hex, sizes }) {
  const name = colorName(hex)
  if (!name) {
    console.warn(`  ⚠  ${slug}: unknown color ${hex}`)
    return
  }

  const destDir = path.join(PUBLIC, "products", slug, name)
  const thumbPath = path.join(destDir, "thumb.webp")
  const hashFile = path.join(destDir, ".thumb-hash")

  if (!fs.existsSync(sourceJpg)) {
    console.warn(`  ⚠  ${slug}/${name}: source not found (skipping)`)
    return
  }

  const srcBuffer = fs.readFileSync(sourceJpg)
  const hash = md5(srcBuffer)

  if (fs.existsSync(thumbPath) && fs.existsSync(hashFile)) {
    const stored = fs.readFileSync(hashFile, "utf-8").trim()
    if (stored === hash) {
      console.log(`  ✓ ${slug}/${name} — cached`)
      return
    }
  }

  fs.mkdirSync(destDir, { recursive: true })

  await sharp(srcBuffer)
    .resize(sizes[0], sizes[0], { fit: "cover", position: "centre" })
    .webp({ quality: 85 })
    .toFile(thumbPath)

  // Additional sizes
  for (let i = 1; i < sizes.length; i++) {
    const sz = sizes[i]
    const outPath = path.join(destDir, `thumb-${sz}.webp`)
    await sharp(srcBuffer)
      .resize(sz, sz, { fit: "cover", position: "centre" })
      .webp({ quality: 85 })
      .toFile(outPath)
  }

  fs.writeFileSync(hashFile, hash)
  const sizeLabel = sizes.map((s) => `${s}px`).join(",")
  console.log(`  ✓ ${slug}/${name} — ${sizeLabel}`)
}

async function main() {
  const args = process.argv.slice(2)
  const sizesFlag = args.find((a) => a.startsWith("--sizes="))
  const sizes = sizesFlag
    ? sizesFlag.replace("--sizes=", "").split(",").map(Number)
    : [100]

  console.log(`\n  Generating thumbs (${sizes.join(", ")}px) ...\n`)

  for (const entry of MANIFEST) {
    const hexes = ALL_COLORS[entry.slug] || ["#000000"]
    for (const hex of hexes) {
      const name = colorName(hex)
      const frontWebp = name
        ? path.join(PUBLIC, "products", entry.slug, name, "front.webp")
        : null
      const sourceJpg =
        frontWebp && fs.existsSync(frontWebp)
          ? frontWebp
          : path.join(PUBLIC, "images", "produtos", entry.sub, entry.dir, "1.jpg")
      await generateThumb({ slug: entry.slug, sourceJpg, hex, sizes })
    }
  }

  console.log(`\n  Done.\n`)
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
