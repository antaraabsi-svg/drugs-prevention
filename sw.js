/* عمل البرنامج دون إنترنت: الصفحات من الشبكة أولًا (لتصل التحديثات) ثم من الذاكرة، والخطوط تُخزَّن عند أول تحميل */
const CACHE = 'diwan-drugs-v2';
const FILES = ['./','index.html','intro.mp4','manifest.webmanifest',
  'assets/css/tokens.css','assets/css/base.css','assets/css/layout.css','assets/css/components.css','assets/css/pages.css','assets/css/print.css',
  'assets/js/icons.js','assets/js/qr.js','assets/js/data.js','assets/js/app.js',
  'assets/img/logo-64.webp','assets/img/logo-96.webp','assets/img/logo-192.webp','assets/img/logo-256.webp','assets/img/logo-512.webp','assets/img/signature.jpg',
  'assets/fonts/offline-ar-400.woff','assets/fonts/offline-ar-700.woff'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* المتصفح يطلب الفيديو على أجزاء (Range)، فنقتطع الجزء المطلوب من النسخة المحفوظة */
async function rangeFrom(req, res) {
  const buf = await res.arrayBuffer();
  const m = /bytes=(\d+)-(\d*)/.exec(req.headers.get('range') || '');
  if (!m) return res;
  const start = +m[1], end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), { status: 206, statusText: 'Partial Content',
    headers: { 'Content-Type': 'video/mp4', 'Content-Range': 'bytes ' + start + '-' + end + '/' + buf.byteLength, 'Content-Length': String(end - start + 1) } });
}
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  /* خط Cairo من Google: نخزّنه عند أول تحميل ليعمل دون إنترنت */
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)); return res; }).catch(() => hit)));
    return;
  }
  if (url.origin !== location.origin) return;
  if (/\.mp4$/i.test(url.pathname)) {
    e.respondWith(caches.match(req.url).then(hit => hit ? (req.headers.has('range') ? rangeFrom(req, hit.clone()) : hit) : fetch(req)));
    return;
  }
  e.respondWith(fetch(req).then(res => { if (res && res.ok) { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)); } return res; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
});
