import { useState, useEffect, useCallback } from 'react';
import Footer from '@/components/Footer';
import PageHeader from "@/components/PageHeader";

const EMPTY = { name: '', email: '', mobile: '', suggestion: '', captcha: '', website: '' };

// Suggestions - letters, numbers, space aur , - ( ) . / allowed
const DISALLOWED = /[^\p{L}\p{M}\p{N}\s,\-().\/]/gu;

export default function FeedbackPage() {
  const [form, setForm] = useState(EMPTY);
  const [captcha, setCaptcha] = useState({ code: '', token: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const loadCaptcha = useCallback(async () => {
    try {
      const res = await fetch('/api/feedback', { cache: 'no-store' });
      const data = await res.json();
      setCaptcha({ code: data.code || '', token: data.token || '' });
    } catch {
      setCaptcha({ code: '', token: '' });
    }
    setForm((prev) => ({ ...prev, captcha: '' }));
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  const speakCaptcha = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !captcha.code) return;
    window.speechSynthesis.cancel();
    const text = captcha.code
      .split('')
      .map((ch) => (/[A-Z]/.test(ch) ? `capital ${ch}` : /[a-z]/.test(ch) ? `small ${ch}` : ch))
      .join(', ');
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  // Validation
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const mobileOk = form.mobile === '' || /^[0-9]{10}$/.test(form.mobile);
  const suggestionLen = form.suggestion.trim().length;
  const suggestionOk = suggestionLen >= 10 && suggestionLen <= 2000;
  const valid =
    form.name.trim() !== '' &&
    emailOk &&
    mobileOk &&
    suggestionOk &&
    form.captcha.length === 6 &&
    captcha.token !== '';

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, captchaToken: captcha.token })
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({
          type: 'success',
          text: 'Thank you for your feedback. A copy has been sent to your email.'
        });
        setForm(EMPTY);
      } else {
        setStatus({ type: 'error', text: data.message || 'Something went wrong' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Unable to submit. Please try again.' });
    } finally {
      setSubmitting(false);
      loadCaptcha();
    }
  };

  const input =
    'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const iconBtn =
    'inline-flex items-center justify-center w-10 h-10 rounded bg-gray-500 text-white hover:bg-gray-600';

  return (
    <>
     <main id="main">
      <PageHeader pageTitle="Feedback" />
        <section className="py-16 bg-gray-50">
          <div className="max-w-xl mx-auto px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <p id="formInstructions" className="mb-4 text-right text-sm text-gray-700">
            Note: Field marked with (<span className="text-red-600">*</span>) are required.
          </p>

          {status.text && (
            <div
              role="alert"
              className={`mb-4 rounded-md px-4 py-3 text-sm ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {status.text}
            </div>
          )}

          <form noValidate aria-describedby="formInstructions" onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="fb-name" className="block text-sm font-bold text-gray-800 mb-1">
                Name <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <input
                id="fb-name"
                name="name"
                type="text"
                maxLength={100}
                placeholder="Enter your name"
                aria-required="true"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className={input}
              />
            </div>

            <div>
              <label htmlFor="fb-email" className="block text-sm font-bold text-gray-800 mb-1">
                Email <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <input
                id="fb-email"
                name="email"
                type="email"
                maxLength={100}
                placeholder="Enter email"
                aria-required="true"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className={input}
              />
              {form.email && !emailOk && (
                <p className="text-xs text-red-600 mt-1">Enter a valid email address.</p>
              )}
            </div>

            <div>
              <label htmlFor="fb-mobile" className="block text-sm font-bold text-gray-800 mb-1">
                Mobile
              </label>
              <input
                id="fb-mobile"
                name="mobile"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter 10 digit mobile"
                value={form.mobile}
                onChange={(e) => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={input}
              />
              {!mobileOk && (
                <p className="text-xs text-red-600 mt-1">Mobile number must be 10 digits.</p>
              )}
            </div>

            <div>
              <label htmlFor="fb-suggestion" className="block text-sm font-bold text-gray-800 mb-1">
                Suggestions <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <textarea
                id="fb-suggestion"
                name="suggestion"
                rows={5}
                maxLength={2000}
                placeholder="Enter suggestions (10–2000 characters)"
                aria-required="true"
                value={form.suggestion}
                onChange={(e) => set('suggestion', e.target.value.replace(DISALLOWED, ''))}
                className={input}
              />
               <p className="text-xs text-gray-500 mt-1">
                Only letters, numbers, spaces and , - ( ) . / are allowed.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {suggestionLen}/2000
                {suggestionLen > 0 && suggestionLen < 10 && (
                  <span className="text-red-600"> (minimum 10 characters)</span>
                )}
              </p>
            </div>

            <div>
              <label htmlFor="fb-captcha" className="block text-sm font-bold text-gray-800 mb-1">
                CAPTCHA <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center justify-center bg-gray-200 w-[200px] h-[50px] text-2xl select-none"
                  style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                >
                  {captcha.code || '......'}
                </span>
                <button
                  type="button"
                  title="Play CAPTCHA"
                  aria-label="Play CAPTCHA"
                  onClick={speakCaptcha}
                  className={iconBtn}
                >
                  <span aria-hidden="true" className="material-symbols-outlined">brand_awareness</span>
                </button>
                <button
                  type="button"
                  title="Reload CAPTCHA"
                  aria-label="Reload CAPTCHA"
                  onClick={loadCaptcha}
                  className={iconBtn}
                >
                  <span aria-hidden="true" className="material-symbols-outlined">cached</span>
                </button>
              </div>
              <input
                id="fb-captcha"
                maxLength={6}
                autoComplete="off"
                placeholder="Enter captcha code"
                aria-required="true"
                value={form.captcha}
                onChange={(e) => set('captcha', e.target.value)}
                className={`${input} mt-3`}
              />
            </div>

            {/* Honeypot*/}
            <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <label>
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => set('website', e.target.value)}
                />
              </label>
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={!valid || submitting}
                aria-label="Submit Feedback Form"
                className="px-6 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
    </div>
  </section>
</main>
<Footer />
</>
  );
}