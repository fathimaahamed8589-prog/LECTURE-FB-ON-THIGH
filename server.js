// Zero-dependency Node server: serves the form and stores responses in responses.json
// Run:  ADMIN_KEY=yourpass node server.js   (default key: anatomy, default port: 3000)
const http = require('http'), fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 3000, KEY = process.env.ADMIN_KEY || 'anatomy';
const DB = path.join(__dirname, 'responses.json');
const load = () => { try { return JSON.parse(fs.readFileSync(DB, 'utf8')); } catch { return []; } };
const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'Content-Type': type }); res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)); };

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (req.method === 'GET' && (url === '/' || url === '/index.html'))
    return send(res, 200, fs.readFileSync(path.join(__dirname, 'public', 'index.html')), 'text/html; charset=utf-8');
  if (url === '/api/responses' && req.method === 'POST') {
    let raw = '';
    req.on('data', c => { raw += c; if (raw.length > 1e5) req.destroy(); });
    req.on('end', () => {
      try {
        const r = JSON.parse(raw); r.submittedAt = new Date().toISOString();
        const all = load(); all.push(r); fs.writeFileSync(DB, JSON.stringify(all, null, 2));
        send(res, 201, { ok: true });
      } catch { send(res, 400, { ok: false }); }
    });
    return;
  }
  if (url === '/api/responses' && (req.method === 'GET' || req.method === 'DELETE')) {
    if (req.headers['x-admin-key'] !== KEY) return send(res, 401, { error: 'bad key' });
    if (req.method === 'DELETE') { fs.writeFileSync(DB, '[]'); return send(res, 200, { ok: true }); }
    return send(res, 200, load());
  }
  send(res, 404, { error: 'not found' });
}).listen(PORT, () => console.log(`Feedback app on http://localhost:${PORT}  (admin key: ${KEY})`));
