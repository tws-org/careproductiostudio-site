import type { APIRoute } from 'astro';
import { ROUTES, SITE_URL } from '../data/site';

export const GET: APIRoute = () => {
  const urls = ROUTES.map((path) => `  <url>\n    <loc>${new URL(path, SITE_URL).toString()}</loc>\n  </url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
