import axios from 'axios'

export interface ScrapedData {
  profilePicUrl?: string | null
  followers?: number
  bio?: string
  name?: string
  username?: string
  isPrivate?: boolean
  cachedAt?: Date
}

// Cache em memória
interface CacheItem {
  data: ScrapedData
  timestamp: number
}

const cache: { [key: string]: CacheItem } = {}
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutos em milissegundos
const RATE_LIMIT_DELAY = 5000 // 5 segundos entre requisições
let lastRequestTime = 0

// Função para esperar o delay necessário
const waitForRateLimit = async () => {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest
    console.log(`Aguardando ${waitTime}ms antes da próxima requisição...`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
  
  lastRequestTime = Date.now()
}

/**
 * Converte a URL da imagem do Instagram para uma URL do nosso backend
 * @param originalUrl URL original da imagem do Instagram
 * @returns URL do proxy no nosso backend
 */
function convertToProxyUrl(originalUrl: string): string {
  if (!originalUrl) return '';
  const encodedUrl = encodeURIComponent(originalUrl);
  return `http://localhost:3001/proxy-image?url=${encodedUrl}`;
}

interface InstagramProfile {
  name: string;
  followers: number;
  biography: string;
  is_private: boolean;
  profile_pic_url: string;
}

/**
 * Scrapes an Instagram profile to extract public information.
 * @param instagramHandle The Instagram username, with or without '@'.
 * @returns An object containing the scraped data.
 */
export async function scrapeInstagramProfile(username: string): Promise<InstagramProfile> {
  try {
    const response = await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'X-IG-App-ID': '936619743392459'
      }
    });

    const userData = response.data.data.user;

    if (!userData) {
      throw new Error('Perfil não encontrado');
    }

    // Converte a URL da imagem para usar nosso proxy
    const profilePicUrl = convertToProxyUrl(userData.profile_pic_url);

    return {
      name: userData.full_name,
      followers: userData.edge_followed_by.count,
      biography: userData.biography,
      is_private: userData.is_private,
      profile_pic_url: profilePicUrl
    };
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new Error('Muitas requisições. Tente novamente em alguns minutos.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Perfil não encontrado');
    }

    throw new Error('Erro ao buscar dados do Instagram: ' + error.message);
  }
} 