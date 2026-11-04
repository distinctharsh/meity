import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CryptoJS from '../../lib/crypto-js.min.js';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captchaInput: ''
  });

  const [generatedCaptchaText, setGeneratedCaptchaText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  const canvasRef = useRef(null);

  const encryptPassword = (password) => {
    try {
      const publicKey = process.env.NEXT_PUBLIC_LOGIN_CRYPTO_KEY || 'cabsec-cms-secure-fallback-key';

      if (!password) {
        throw new Error('Password is missing.');
      }

      const key = CryptoJS.SHA256(publicKey);
      const ivHash = CryptoJS.SHA256(publicKey);
      const iv = CryptoJS.lib.WordArray.create(ivHash.words.slice(0, 4), 16);

      const encrypted = CryptoJS.AES.encrypt(password, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    } catch (err) {
      console.error('Encryption error:', err);
      return '';
    }
  };

  const generateCaptchaString = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 160;
    canvas.height = 45;

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150}, 0.5)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    ctx.font = 'bold 24px monospace';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < text.length; i++) {
      ctx.save();
      const x = 20 + i * 22;
      const y = 22 + (Math.random() * 8 - 4);
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);

      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 80)}, ${Math.floor(Math.random() * 80)}, ${Math.floor(Math.random() * 120)})`;
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newText = generateCaptchaString();
    setGeneratedCaptchaText(newText);
    drawCaptcha(newText);
    setFormData(prev => ({ ...prev, captchaInput: '' }));
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.username.trim() || !formData.password) {
      setError('Username and password are required.');
      refreshCaptcha();
      return;
    }

    if (formData.captchaInput.trim().toUpperCase() !== generatedCaptchaText.toUpperCase()) {
      setError('Invalid Captcha code. Please try again.');
      refreshCaptcha();
      return;
    }

    setLoading(true);

    try {
      const encryptedPassword = encryptPassword(formData.password);

      if (!encryptedPassword) {
        throw new Error('Unable to encrypt password.');
      }

      const response = await fetch('/api/adm/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          username: formData.username.trim(),
          encryptedPassword: encryptedPassword
        })
      });

      const data = await response.json();
      refreshCaptcha();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }

        setSuccessMsg('Login successful. Redirecting...');
        
        setTimeout(() => {
          window.location.href = '/admin';
        }, 300);
      } else {
        setError(data.message || 'Login failed.');
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Network error. Please try again.');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Head>
        <title>Admin Login - Cabinet Secretariat CMS</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Cabinet Secretariat Content Management System
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 select-none">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Security Verification:</span>
                <div className="flex items-center gap-2">
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-300 rounded-lg bg-white shadow-inner pointer-events-none"
                    title="Captcha Image"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-200"
                    title="Refresh Captcha"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              <input
                type="text"
                name="captchaInput"
                required
                autoComplete="off"
                placeholder="Enter characters shown above"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white tracking-widest font-mono"
                value={formData.captchaInput}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}