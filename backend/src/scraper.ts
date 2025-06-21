import puppeteer, { Browser } from 'puppeteer'

export interface ScrapedData {
  profilePicUrl?: string | null
  followers?: number
  bio?: string
}

/**
 * Scrapes an Instagram profile to extract public information.
 * @param instagramHandle The Instagram username, with or without '@'.
 * @returns An object containing the scraped data.
 */
export async function scrapeInstagramProfile(
  instagramHandle: string,
): Promise<ScrapedData> {
  let browser: Browser | null = null
  const username = instagramHandle.startsWith('@')
    ? instagramHandle.substring(1)
    : instagramHandle
  const url = `https://www.instagram.com/${username}/`

  try {
    // Inicia o Puppeteer com argumentos otimizados para rodar em Docker.
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    })

    const page = await browser.newPage()
    // Define um User-Agent para simular um navegador real.
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    )

    await page.goto(url, { waitUntil: 'networkidle2' })

    // Espera o conteúdo principal da página carregar.
    await page.waitForSelector('main', { timeout: 15000 })

    const data: ScrapedData = await page.evaluate(() => {
      // ATENÇÃO: Estes seletores dependem da estrutura do Instagram e podem quebrar.

      // Foto de perfil
      const picElement = document.querySelector('header img')
      const profilePicUrl = picElement ? picElement.getAttribute('src') : undefined

      // Bio
      const bioElement = document.querySelector('h1 + div')
      const bio = bioElement ? (bioElement as HTMLElement).innerText : undefined

      // Número de seguidores
      let followers: number | undefined
      try {
        const followersElement = Array.from(
          document.querySelectorAll('a[href$="/followers/"] span'),
        )[0] as HTMLSpanElement

        if (followersElement) {
          const followersText = followersElement.title || followersElement.innerText
          const num = parseFloat(followersText.replace(/,/g, ''))
          followers = Math.round(num)
        }
      } catch (e) {
        // Ignora o erro se o seletor não for encontrado.
      }

      return { profilePicUrl, bio, followers }
    })

    return data
  } catch (error) {
    console.error(`Falha ao fazer scrape de ${url}`, error)
    throw new Error(
      `Não foi possível obter os dados de @${username}. O perfil pode ser privado ou a estrutura da página mudou.`,
    )
  } finally {
    if (browser) {
      await browser.close()
    }
  }
} 