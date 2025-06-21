import axios from 'axios'

export interface ScrapedData {
  profilePicUrl?: string | null
  followers?: number
  bio?: string
  name?: string
  username?: string
  isPrivate?: boolean
}

/**
 * Converte a URL da imagem do Instagram para uma URL do nosso backend
 * @param originalUrl URL original da imagem do Instagram
 * @returns URL do proxy no nosso backend
 */
function convertToProxyUrl(originalUrl: string): string {
  if (!originalUrl) return '';
  // Encode a URL original para usar como parâmetro
  const encodedUrl = encodeURIComponent(originalUrl);
  return `http://localhost:3001/proxy-image?url=${encodedUrl}`;
}

/**
 * Scrapes an Instagram profile to extract public information.
 * @param instagramHandle The Instagram username, with or without '@'.
 * @returns An object containing the scraped data.
 */
export async function scrapeInstagramProfile(
  instagramHandle: string,
): Promise<ScrapedData> {
  try {
    // Remove todos os @ do início e adiciona apenas um
    const username = instagramHandle.replace(/^@+/, '');

    // Usa a API pública do Instagram para dados básicos
    const response = await axios.get(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'X-IG-App-ID': '936619743392459',  // ID público do Instagram Web
          'Referer': 'https://www.instagram.com/',
          'Origin': 'https://www.instagram.com',
        }
      }
    );

    const userData = response.data?.data?.user;

    if (!userData) {
      throw new Error(`Perfil @${username} não encontrado.`);
    }

    const originalProfilePicUrl = userData.profile_pic_url_hd || userData.profile_pic_url;
    const proxiedProfilePicUrl = originalProfilePicUrl ? convertToProxyUrl(originalProfilePicUrl) : null;

    return {
      profilePicUrl: proxiedProfilePicUrl,
      bio: userData.biography,
      followers: userData.edge_followed_by?.count,
      name: userData.full_name,
      username: userData.username,
      isPrivate: userData.is_private,
    };

  } catch (error) {
    console.error(`Falha ao fazer scrape de ${instagramHandle}`, error);
    
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`Perfil @${instagramHandle} não encontrado.`);
    }
    
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      throw new Error('Muitas requisições. Tente novamente em alguns minutos.');
    }

    throw new Error(
      `Não foi possível obter os dados de @${instagramHandle}. O perfil pode ser privado, não existir, ou estar temporariamente indisponível.`,
    );
  }
} 