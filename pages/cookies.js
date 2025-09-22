import { useEffect, useState } from 'react';

const defaultPrefs = {
  essential: true,
  functionality: false,
  analytics: false,
  social: false,
};

export default function CookieSettingsPage() {
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const m = document.cookie.match(/cookie_prefs=([^;]+)/);
      if (m) {
        const parsed = JSON.parse(decodeURIComponent(m[1]));
        setPrefs({ ...defaultPrefs, ...parsed });
      }
    } catch { }
  }, []);

  async function save(next) {
    setSaving(true);
    try {
      await fetch('/api/cookies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) });
      setPrefs(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="px-[7%] py-8">
      <h1 className="gi-h1 gi-w-bold text-deep-blue">Cookie Setting</h1>
      <p className="gi-p2 mt-2 max-w-4xl">
        Welcome to the Cookie Settings page, where you have the power to tailor your browsing experience.
        Here, you'll find detailed information about the cookies we use, categorized as "Essential" and "Optional."
        Make informed choices that align with your privacy preferences.
      </p>

      <section className="mt-8">
        <h2 className="gi-h3 gi-w-bold text-deep-blue">ESSENTIAL COOKIES</h2>
        <div className="mt-3 space-y-3">
          <div className="border rounded p-4 flex items-start justify-between">
            <div className="max-w-3xl">
              <p className="gi-p1 gi-w-bold">Session cookies</p>
              <p className="gi-p2">Ensures user session persistence, allowing seamless navigation on the website. (Essential for site functionality)</p>
            </div>
            <div className="gi-p2">On</div>
          </div>
          <div className="border rounded p-4 flex items-start justify-between">
            <div className="max-w-3xl">
              <p className="gi-p1 gi-w-bold">Persistent cookies</p>
              <p className="gi-p2">Remembers user preferences, such as language and region settings, for a personalized browsing experience. (Personalization)</p>
            </div>
            <div className="gi-p2">On</div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="gi-h3 gi-w-bold text-deep-blue">OPTIONAL COOKIES</h2>
        <div className="mt-3 space-y-3">
          <div className="border rounded p-4 flex items-start justify-between">
            <div className="max-w-3xl">
              <p className="gi-p1 gi-w-bold">Preference/functionality cookies</p>
              <p className="gi-p2">Remembers user preferences, such as language and region settings, for a personalized browsing experience. (Personalization)</p>
            </div>
            <div className="flex items-center gap-2 gi-p2">
              <span>Off</span>
              <input aria-label="Toggle preference cookies" type="checkbox" checked={prefs.functionality} onChange={e => setPrefs(p => ({ ...p, functionality: e.target.checked }))} />
              <span>On</span>
            </div>
          </div>

        </div>
      </section>

      <div className="mt-6">
        <button disabled={saving} className="px-4 py-2 bg-deep-blue text-white disabled:opacity-70" onClick={() => save(prefs)}>
          Save Preferences
        </button>
      </div>
    </main>
  );
}


