export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const body = req.body || {};
  const value = encodeURIComponent(JSON.stringify(body));
  res.setHeader('Set-Cookie', `cookie_prefs=${value}; Path=/; Max-Age=31536000; SameSite=Lax`);
  res.status(200).json({ ok: true });
}


