import type { APIRoute } from 'astro';
const SITE = 'https://theee-burger.pages.dev';
const pages = ['', '/menu', '/about', '/locations', '/careers', '/order', '/kitchen'];
export const GET: APIRoute = () => {
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    pages.map((p) => `  <url><loc>${SITE}${p || '/'}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
