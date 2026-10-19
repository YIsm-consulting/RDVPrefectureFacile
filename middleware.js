/* Routing Middleware Vercel : refuse (403) les robots d'entraînement des IA
   qui ignoreraient robots.txt. Googlebot, Bingbot, les moteurs de recherche IA
   (OAI-SearchBot, Claude-SearchBot, PerplexityBot) et la consultation à la
   demande (ChatGPT-User, Claude-User…) ne sont volontairement PAS bloqués.

   Dernière mise à jour : 2026-10-19. Pour bloquer un nouveau robot, l'ajouter
   ici ET dans robots.txt. Veille : https://github.com/ai-robots-txt/ai.robots.txt
   Comparaison par sous-chaîne insensible à la casse : éviter les noms courts. */

const TRAINING_BOTS = [
  'GPTBot', 'ClaudeBot', 'anthropic-ai', 'Claude-Web', 'CCBot',
  'Meta-ExternalAgent', 'FacebookBot', 'Bytespider', 'TikTokSpider', 'Amazonbot',
  'cohere-ai', 'cohere-training-data-crawler', 'Diffbot', 'omgili', 'webzio-extended',
  'ImagesiftBot', 'img2dataset', 'AI2Bot', 'PanguBot', 'Timpibot', 'FriendlyCrawler',
  'VelenPublicWebCrawler', 'ICC-Crawler', 'FirecrawlAgent',
];

// Outils d'aspiration génériques (non concernés par robots.txt).
const SCRAPER_TOOLS = ['Scrapy', 'python-requests', 'python-urllib', 'aiohttp', 'httpx', 'Go-http-client'];

const BLOCKED_UA = new RegExp(
  [...TRAINING_BOTS, ...SCRAPER_TOOLS].map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'i'
);

export default function middleware(request) {
  const ua = request.headers.get('user-agent');
  if (ua && BLOCKED_UA.test(ua)) {
    return new Response(
      "403 - Acces refuse aux robots de collecte pour l'IA. Voir /robots.txt et /mentions-legales.\n",
      {
        status: 403,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'x-robots-tag': 'noindex',
          'cache-control': 'no-store',
        },
      }
    );
  }
}

export const config = {
  // Restent ouverts : robots.txt et /.well-known (règles lisibles par les
  // robots), le sitemap, l'API et les fichiers d'assets.
  matcher: ['/((?!api/|assets/|robots\\.txt|\\.well-known/|favicon\\.ico|sitemap\\.xml).*)'],
};
