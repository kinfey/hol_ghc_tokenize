import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT ?? 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp4': 'video/mp4', '.vtt': 'text/vtt' };
createServer(async (req, res) => {
  let url;
  try { url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  const path = resolve(root, `.${url.endsWith('/') ? `${url}index.html` : url}`);
  if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  let info;
  try { info = await stat(path); } catch (error) {
    res.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
    return;
  }
  if (!info.isFile()) { res.writeHead(404).end(); return; }
  const headers = { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream', 'Accept-Ranges': 'bytes', 'X-Content-Type-Options': 'nosniff' };
  let start = 0, end = info.size - 1;
  if (req.headers.range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (match?.[1]) {
      start = Number(match[1]);
      end = match[2] ? Math.min(Number(match[2]), end) : end;
    } else if (match?.[2]) start = Math.max(0, info.size - Number(match[2]));
    if (!match || (!match[1] && !match[2]) || start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end();
      return;
    }
    headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
  }
  res.writeHead(req.headers.range ? 206 : 200, { ...headers, 'Content-Length': end - start + 1 });
  if (req.method === 'HEAD' || !info.size) res.end();
  else createReadStream(path, { start, end }).on('error', () => res.destroy()).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`Token Studio: http://127.0.0.1:${port}/`));
