/**
 * Captura as telas dos projetos publicados para os estudos de caso.
 *
 * Usa o Edge/Chrome já instalado (puppeteer-core não baixa navegador).
 * Caminho do navegador: variável BROWSER_PATH ou o Edge padrão do Windows.
 *
 *   npm run screenshots
 */
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

interface Target {
  name: string
  url: string
  width: number
  height: number
  /** Recorte vertical: remove o que estiver abaixo desta altura (px CSS). */
  cropHeight?: number
  /** Âncora (#id) para rolar antes de capturar. */
  anchor?: string
}

const OUTPUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/assets/screenshots')

const DEFAULT_BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
]

const targets: Target[] = [
  // Recortado acima da faixa de prova social da landing page.
  { name: 'shopping-list', url: 'https://your-shopping-list.vercel.app', width: 1366, height: 860, cropHeight: 700 },
  { name: 'empregae', url: 'https://empregae.vercel.app', width: 1366, height: 760 },
  { name: 'qualidade-agua', url: 'https://avaliacao-da-qualidade-da-agua.vercel.app', width: 1366, height: 820 },
]

function findBrowser(): string {
  const candidates = [process.env.BROWSER_PATH, ...DEFAULT_BROWSERS].filter(Boolean) as string[]
  const found = candidates.find((path) => existsSync(path))
  if (!found) throw new Error('Navegador não encontrado. Defina BROWSER_PATH.')
  return found
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: findBrowser(), headless: true })

  try {
    for (const target of targets) {
      const page = await browser.newPage()
      await page.setViewport({ width: target.width, height: target.height, deviceScaleFactor: 1.5 })
      await page.goto(target.url, { waitUntil: 'networkidle0', timeout: 60_000 })
      if (target.anchor) {
        await page.evaluate((anchor) => document.querySelector(anchor)?.scrollIntoView(), target.anchor)
      }
      await new Promise((r) => setTimeout(r, 1500))

      const path = resolve(OUTPUT_DIR, `${target.name}.webp`) as `${string}.webp`
      await page.screenshot({
        path,
        type: 'webp',
        quality: 82,
        clip: { x: 0, y: 0, width: target.width, height: target.cropHeight ?? target.height },
      })
      console.log(`✓ ${target.name} → ${path}`)
      await page.close()
    }
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
