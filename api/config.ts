import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const webhook = process.env.N8N_WEBHOOK || process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK || "";
  const secret = process.env.WEBHOOK_SECRET || process.env.NEXT_PUBLIC_WEBHOOK_SECRET || "";
  
  // Log for Vercel logs
  console.log(`Config requested. Webhook found: ${!!webhook}, Secret found: ${!!secret}`);
  
  // Prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.status(200).json({
    n8nWebhook: webhook,
    webhookSecret: secret
  });
}
