const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const root = path.join(__dirname, "..", "public", "images", "produtos")

async function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (/\.(jpe?g|png)$/i.test(entry.name)) yield full
  }
}

async function main() {
  const files = []
  for await (const f of walk(root)) files.push(f)
  console.log(`Encontrados ${files.length} arquivos`)

  let i = 0
  const results = await Promise.all(
    files.map(async (file) => {
      const img = sharp(file)
      const meta = await img.metadata()
      const longest = Math.max(meta.width || 0, meta.height || 0)

      if (longest <= 1200 && (meta.format === "jpeg" || meta.format === "png")) {
        i++
        return `IGNORED  (${longest}px) ${path.relative(root, file)}`
      }

      const out = file.replace(/\.(png)$/i, ".jpg")
      await img
        .resize(1200, null, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toFile(out + ".tmp")
      fs.renameSync(out + ".tmp", out)
      if (out !== file) fs.unlinkSync(file)

      i++
      const kb = Math.round(fs.statSync(out).size / 1024)
      return `OK  ${kb}KB  ${path.relative(root, out)}`
    })
  )

  console.log(`\nProcessadas ${i} imagens\n`)
  results.forEach((r) => console.log(r))
}

main().catch(console.error)
