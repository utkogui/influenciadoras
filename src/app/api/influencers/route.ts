import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Configuração do CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const allInfluencers = await pool.query('SELECT * FROM influencers ORDER BY created_at DESC');
    return NextResponse.json(allInfluencers.rows, { headers: corsHeaders });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Erro ao buscar influenciadoras.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, instagram, followers, bio, profilePicUrl, profile, notes } = body;

    // Validação básica
    if (!fullName || !instagram) {
      return NextResponse.json(
        { error: 'Nome e Instagram são obrigatórios' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Converte o profile em array se for string
    let profileTags = null;
    if (profile) {
      profileTags = Array.isArray(profile) ? profile : profile.split(',').map((tag: string) => tag.trim());
    }

    const result = await pool.query(
      `INSERT INTO influencers 
       (full_name, instagram, followers, bio, profile_pic_url, profile_tags, notes, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING *`,
      [
        fullName,
        instagram,
        followers || null,
        bio || null,
        profilePicUrl || null,
        profileTags,
        notes || null
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201, headers: corsHeaders });
  } catch (error: any) {
    console.error('Erro ao salvar influenciadora:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { 
          error: 'Já existe uma influenciadora cadastrada com este Instagram.',
          detail: error.detail,
          code: error.code 
        },
        { status: 400, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao salvar influenciadora: ' + error.message,
        detail: error.detail,
        code: error.code 
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 