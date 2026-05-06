#!/usr/bin/env node
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SOURCE = resolve(ROOT, 'CLAUDE/Logos/logo.png')
const OUT_DIR = resolve(ROOT, 'public')

// Crop window onto the green halal centre of the source logo.
// Source is 625x625; the centre disc spans roughly the middle 70% of the image.
const CROP_RATIO = 0.7

const SIZES = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-48.png', size: 48 },
  { name: 'favicon-64.png', size: 64 },
  { name: 'favicon.png', size: 32 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'favicon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

const buildCircularMask = (size) => {
  const r = size / 2
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/>` +
      `</svg>`
  )
}

const cropToCentre = async () => {
  const meta = await sharp(SOURCE).metadata()
  const cropSize = Math.round(Math.min(meta.width, meta.height) * CROP_RATIO)
  const left = Math.round((meta.width - cropSize) / 2)
  const top = Math.round((meta.height - cropSize) / 2)
  return sharp(SOURCE)
    .extract({ left, top, width: cropSize, height: cropSize })
    .toBuffer()
}

const main = async () => {
  await mkdir(OUT_DIR, { recursive: true })
  const cropped = await cropToCentre()

  for (const { name, size } of SIZES) {
    const mask = buildCircularMask(size)
    await sharp(cropped)
      .resize(size, size, { fit: 'cover' })
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toFile(resolve(OUT_DIR, name))
    console.log(`wrote public/${name} (${size}x${size})`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
