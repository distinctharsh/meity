export default function handler(req, res) {
  const { method } = req;
  if (method !== 'POST') return res.status(405).json({ ok: false });
  const { lang } = req.body || {};
  const value = typeof lang === 'string' ? lang : 'en';
  res.setHeader('Set-Cookie', `lang=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`);
  res.status(200).json({ ok: true, lang: value });
}


