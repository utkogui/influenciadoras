import { NextRequest, NextResponse } from 'next/server';
import { scrapeInstagramProfile } from '@/lib/scraper';

// Configuração do CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Username não fornecido' },
        { status: 400, headers: corsHeaders }
      );
    }

    const data = await scrapeInstagramProfile(username);
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Erro ao fazer scrape:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
} 