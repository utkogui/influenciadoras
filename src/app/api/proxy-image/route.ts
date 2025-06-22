import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Configuração do CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    if (!url) {
      return NextResponse.json(
        { error: 'URL da imagem não fornecida' },
        { status: 400, headers: corsHeaders }
      );
    }

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.instagram.com/',
      }
    });

    // Cria uma resposta com o buffer da imagem
    const imageBuffer = Buffer.from(response.data, 'binary');
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': response.headers['content-type'],
        'Cache-Control': 'public, max-age=31536000',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Erro ao fazer proxy da imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar imagem' },
      { status: 500, headers: corsHeaders }
    );
  }
} 