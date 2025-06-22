import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../backend/src';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Encaminha a requisição para o app Express
  return new Promise((resolve, reject) => {
    app(req, res);
    res.on('finish', resolve);
    res.on('error', reject);
  });
} 