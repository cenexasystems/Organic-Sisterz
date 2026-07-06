import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://organicsisterz.com';

const pages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/gift', priority: '0.8', changefreq: 'monthly' }
];

const generateSitemap = () => {
  const date = new Date().toISOString().split('T')[0];

  const urlTags = pages.map(page => `
  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>
  `.trim();

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log('sitemap.xml generated successfully!');
};

const generateRobotsTxt = () => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /profile
Disallow: /cart
Disallow: /invoice

Sitemap: ${DOMAIN}/sitemap.xml
  `.trim();

  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('robots.txt generated successfully!');
};

generateSitemap();
generateRobotsTxt();
