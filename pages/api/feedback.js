import crypto from "crypto";
import nodemailer from "nodemailer";
import DOMPurify from "isomorphic-dompurify";

const SECRET = process.env.JWT_SECRET;

// Suggestions - letters, numbers, space aur , - ( ) . / allowed
const SUGGESTION_ALLOWED = /^[\p{L}\p{M}\p{N}\s,\-().\/]*$/u;

// ---------- CAPTCHA (stateless, signed token) ----------
const CAPTCHA_TTL_MS = 5 * 60 * 1000;
// Confusing chars removed (I, l, O, 0, 1) 
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const usedTokens = new Map(); // signature -> expiry

const sign = (data) =>
  crypto.createHmac("sha256", SECRET).update(data).digest("hex");

function createCaptcha() {
  let code = "";
  for (let i = 0; i < 6; i++) code += CHARS[crypto.randomInt(CHARS.length)];
  const nonce = crypto.randomBytes(8).toString("hex");
  const exp = Date.now() + CAPTCHA_TTL_MS;
  const sig = sign(`${nonce}.${exp}.${code}`);
  return { code, token: `${nonce}.${exp}.${sig}` };
}

function verifyCaptcha(token, answer) {
  if (typeof token !== "string" || typeof answer !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [nonce, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!exp || Date.now() > exp) return false;
  if (usedTokens.has(sig)) return false;

  // Token is valid, mark it as used and clean up old tokens
  usedTokens.set(sig, exp);
  for (const [k, v] of usedTokens) {
    if (v < Date.now()) usedTokens.delete(k);
  }

  const expected = Buffer.from(sign(`${nonce}.${expStr}.${answer}`));
  const actual = Buffer.from(sig);
  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  );
}

// ---------- Rate limit: 10 attempts / hour / IP (in-memory) ----------
const hits = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 10;

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// ---------- Helpers ----------
// Tags + newline remove (for text/plain email)
const clean = (v, max) =>
  DOMPurify.sanitize(String(v ?? ""), { ALLOWED_TAGS: [] })
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, max);

// Message allowed newline, only remove tags
const cleanMessage = (v, max) =>
  DOMPurify.sanitize(String(v ?? ""), { ALLOWED_TAGS: [] })
    .trim()
    .slice(0, max);

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

// ---------- Handler ----------
export default async function handler(req, res) {
  if (!SECRET) {
    return res
      .status(500)
      .json({ message: "Feedback service is not configured" });
  }

  // GET: new captcha
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(createCaptcha());
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "";

  // Honeypot: fill bots
  if (req.body?.website) {
    return res.status(200).json({ message: "Thank you for your feedback" });
  }

  if (rateLimited(ip)) {
    return res
      .status(429)
      .json({ message: "Too many submissions. Please try again later." });
  }

  const name = clean(req.body?.name, 100);
  const email = clean(req.body?.email, 100);
  const mobile = clean(req.body?.mobile, 10);
  const suggestion = cleanMessage(req.body?.suggestion, 2000);

  if (!name || !email || !suggestion) {
    return res
      .status(400)
      .json({ message: "Name, email and suggestions are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (mobile && !/^[0-9]{10}$/.test(mobile)) {
    return res.status(400).json({ message: "Mobile number must be 10 digits" });
  }

  if (suggestion.length < 10) {
    return res
      .status(400)
      .json({ message: "Suggestions must be at least 10 characters" });
  }
  if (!SUGGESTION_ALLOWED.test(String(req.body?.suggestion ?? ""))) {
    return res.status(400).json({
      message:
        "Suggestions can contain only letters, numbers, spaces and , - ( ) . /",
    });
  }

  // Captcha
  if (!verifyCaptcha(req.body?.captchaToken, String(req.body?.captcha ?? ""))) {
    return res
      .status(400)
      .json({ message: "Invalid or expired CAPTCHA. Please try again." });
  }

  const adminTo = process.env.FEEDBACK_TO_EMAIL;
  if (!adminTo || !process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.error("Feedback mail: SMTP/FEEDBACK_TO_EMAIL env not configured");
    return res
      .status(500)
      .json({ message: "Feedback service is not configured" });
  }

  const from = `"Cabinet Secretariat" <${process.env.SMTP_USER}>`;
  const transporter = getTransporter();

  try {
    // 1) Admin (env mail) feedback
    await transporter.sendMail({
      from,
      to: adminTo,
      replyTo: `"${name}" <${email}>`,
      subject: `[Feedback] Website feedback from ${name}`,
      text:
        `Name: ${name}\nEmail: ${email}\nMobile: ${mobile || "-"}\nIP: ${ip}\n\n` +
        `Suggestions:\n${suggestion}`,
      html:
        `<p><b>Name:</b> ${esc(name)}</p>` +
        `<p><b>Email:</b> ${esc(email)}</p>` +
        `<p><b>Mobile:</b> ${esc(mobile || "-")}</p>` +
        `<p><b>IP:</b> ${esc(ip)}</p>` +
        `<p><b>Suggestions:</b></p>` +
        `<p style="white-space:pre-wrap">${esc(suggestion)}</p>`,
    });
  } catch (error) {
    console.error("Feedback admin mail error:", error);
    return res
      .status(500)
      .json({ message: "Unable to send feedback. Please try again later." });
  }

  try {
    // 2) User mail
    await transporter.sendMail({
      from,
      to: email,
      subject: "We received your feedback",
      text:
        `Dear Sir/Madam,\n\nThank you for your feedback.\n\nFeedback details are below.\n\n` +
        `${suggestion}`,
      html:
        `<p>Dear Sir/Madam,</p>` +
        `<p>Thank you for your feedback. Feedback details are below.</p>` +
        `<p style="white-space:pre-wrap">${esc(suggestion)}</p>`,
    });
  } catch (error) {
    console.error("Feedback user copy mail error:", error);
  }

  return res.status(201).json({ message: "Thank you for your feedback" });
}
