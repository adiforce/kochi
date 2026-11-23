/* 日本工具箱 Service Worker — 離線可用
 * 改了任何頁面後，把 VERSION 數字 +1，手機下次開啟就會抓新版。
 */
const VERSION = 'v35';
const CORE_CACHE = `core-${VERSION}`;
const RUNTIME_CACHE = 'runtime';        // 字型、圖片（跨版本保留）
const RUNTIME_MAX = 200;                // 最多存幾個字型/圖片檔
const TILE_CACHE = 'osm-tiles';     // 地圖圖磚（跨版本保留）
const TILE_MAX = 600;                   // 最多存幾張圖磚
const NET_TIMEOUT = 4000;               // 網路超過 4 秒沒回應就先用快取

// 安裝時先整包存起來，沒逛過的頁面離線也能開
const CORE_FILES = [
  './',
  'index.html',
  'coupon.html',
  'receipt.html',
  'product-check.html',
  'anime-events.html',
  'creditcard.html',
  'jpyrate.html',
  'kakeibo.html',
  'kakeibo2.html',
  'kakeibo-inbox.js',
  'ryoma-guide.js',
  'travel-list.html',
  'travel-checklist.html',
  'travel-plan.html',
  'hotel-info.html',
  'doodle-icons.js',
  'venues.json',
  'weather.json',
  'manifest.webmanifest',
  'favicon.ico',
  'favicon-32.png',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png'
];

// 這些是即時資料（記帳、匯率、AI 辨識），不快取，照舊直接連線
const BYPASS_HOSTS = [
  'script.google.com',
  'script.googleusercontent.com',
  'api.anthropic.com',
  'cdn.jsdelivr.net',
  'currency-api.pages.dev',
  'open-meteo.com',
  'api.open-meteo.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then(cache => cache.addAll(CORE_FILES.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith('core-') && k !== CORE_CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (BYPASS_HOSTS.some(h => url.hostname === h || url.hostname.endsWith('.' + h))) return;

  // 同網站的 HTML / JSON：先抓網路（拿最新行程），失敗或太慢就用快取
  if (url.origin === self.location.origin) {
    const isPage = req.mode === 'navigate' || /\.(html|json|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');
    if (isPage) {
      event.respondWith(networkFirst(req));
    } else {
      event.respondWith(cacheFirst(req, CORE_CACHE));
    }
    return;
  }

  // 地圖元件（Leaflet）：存起來，離線也能開地圖
  if (url.hostname === 'unpkg.com' && url.pathname.includes('/leaflet@')) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // 地圖圖磚（地理院／OSM）：看過的區域存起來（另開快取，不擠掉字型）
  if (url.hostname === 'tile.openstreetmap.org' || url.hostname === 'tile.openstreetmap.jp') {
    event.respondWith(staleWhileRevalidate(req, TILE_CACHE, TILE_MAX));
    return;
  }

  // Google Fonts、外部圖片：有快取就直接用，順便背景更新
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || req.destination === 'image') {
    event.respondWith(staleWhileRevalidate(req));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(CORE_CACHE);
  try {
    const res = await withTimeout(fetch(req), NET_TIMEOUT);
    if (res && res.ok) cache.put(stripSearch(req), res.clone());
    return res;
  } catch (e) {
    const cached = await cache.match(stripSearch(req)) ||
                   (req.mode === 'navigate' ? await cache.match('index.html') : null);
    if (cached) return cached;
    // 逾時但沒快取 → 再等網路一次
    return fetch(req);
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res && res.ok) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, cacheName = RUNTIME_CACHE, max = RUNTIME_MAX) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) {
      cache.put(req, res.clone()).then(() => trimCache(cache, max));
    }
    return res;
  }).catch(() => null);
  return cached || (await network) || Response.error();
}

async function trimCache(cache, max = RUNTIME_MAX) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

function stripSearch(req) {
  const url = new URL(req.url);
  url.search = '';
  url.hash = '';
  return url.toString();
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}
