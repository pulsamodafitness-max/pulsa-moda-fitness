const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const PUBLIC = path.join(ROOT, "public")

const MANIFEST = [
  { slug: "conjunto-balance",    dir: "balance",    sub: "conjunto-calca" },
  { slug: "conjunto-core",       dir: "core",       sub: "conjunto-calca" },
  { slug: "conjunto-highline",   dir: "highline",   sub: "conjunto-calca" },
  { slug: "conjunto-intensity",  dir: "intensity",  sub: "conjunto-calca" },
  { slug: "conjunto-max-shape",  dir: "maxshapee",  sub: "conjunto-calca" },
  { slug: "conjunto-perfect-fit",dir: "perfectfit", sub: "conjunto-calca" },
  { slug: "conjunto-powerline",  dir: "powerline",  sub: "conjunto-calca" },
  { slug: "conjunto-ultrafit",   dir: "ultrafit",   sub: "conjunto-calca" },
  { slug: "conjunto-breeze",     dir: "breeze",     sub: "conjunto-short" },
  { slug: "conjunto-energy",     dir: "energy",     sub: "conjunto-short" },
  { slug: "conjunto-fit",        dir: "fit",        sub: "conjunto-short" },
  { slug: "conjunto-flow",       dir: "flow",       sub: "conjunto-short" },
  { slug: "conjunto-glow",       dir: "glow",       sub: "conjunto-short" },
  { slug: "conjunto-jump",       dir: "jump",       sub: "conjunto-short" },
  { slug: "conjunto-pulse",      dir: "pulse",      sub: "conjunto-short" },
  { slug: "conjunto-pulse-one",  dir: "pulse-one",  sub: "conjunto-short" },
  { slug: "conjunto-ritmo",      dir: "ritmo",      sub: "conjunto-short" },
  { slug: "conjunto-spark",      dir: "spark",      sub: "conjunto-short" },
  { slug: "conjunto-strike",     dir: "strike",     sub: "conjunto-short" },
  { slug: "conjunto-sunny",      dir: "sunny",      sub: "conjunto-short" },
  { slug: "conjunto-velocity",   dir: "velocity",   sub: "conjunto-short" },
  { slug: "conjunto-vibe",       dir: "vibe",       sub: "conjunto-short" },
  { slug: "conjunto-wave",       dir: "wave",       sub: "conjunto-short" },
]

const COLOR_DIR = "preto"
const SIZES = [
  { srcName: "1.jpg",  destName: "front.webp",  width: 800  },
  { srcName: "2.jpg",  destName: "back.webp",   width: 800  },
  { srcName: "1.jpg",  destName: "front-1200.webp",  width: 1200 },
  { srcName: "2.jpg",  destName: "back-1200.webp",   width: 1200 },
  { srcName: "1.jpg",  destName: "front-1920.webp",  width: 1920 },
  { srcName: "2.jpg",  destName: "back-1920.webp",   width: 1920 },
]

async function main() {
  console.log("\n  Generating front.webp / back.webp for preto/ …\n")

  for (const entry of MANIFEST) {
    const destDir = path.join(PUBLIC, "products", entry.slug, COLOR_DIR)
    const srcBase = path.join(PUBLIC, "images", "produtos", entry.sub, entry.dir)

    if (!fs.existsSync(srcBase)) {
      console.warn(`  ⚠  source dir not found: ${srcBase}`)
      continue
    }

    fs.mkdirSync(destDir, { recursive: true })

    for (const sz of SIZES) {
      const src = path.join(srcBase, sz.srcName)
      const dest = path.join(destDir, sz.destName)

      if (!fs.existsSync(src)) {
        console.warn(`  ⚠  ${entry.slug}: ${sz.srcName} not found`)
        continue
      }

      if (fs.existsSync(dest)) {
        console.log(`  ✓ ${entry.slug}/${COLOR_DIR}/${sz.destName} — already exists`)
        continue
      }

      await sharp(src)
        .resize(sz.width, undefined, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(dest)

      console.log(`  ✓ ${entry.slug}/${COLOR_DIR}/${sz.destName} (${sz.width}px)`)
    }
  }

  console.log("\n  Done.\n")
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
