import { useEffect, useState } from 'react';

export default function PmQuoteForm() {
  const today = new Date().toISOString().slice(0,10);
  const empty = { id: null, quote_text: '', author: 'Prime Minister', image_url: '', event_url: '', quote_date: today };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toYMD = (val) => {
    if (!val) return '';
    try {
      if (val instanceof Date) {
        const d = val;
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth()+1).padStart(2,'0');
        const dd = String(d.getUTCDate()).padStart(2,'0');
        return `${y}-${m}-${dd}`;
      }
      const s = String(val);
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
      const d2 = new Date(s);
      if (!isNaN(d2.getTime())) {
        const y = d2.getUTCFullYear();
        const m = String(d2.getUTCMonth()+1).padStart(2,'0');
        const dd = String(d2.getUTCDate()).padStart(2,'0');
        return `${y}-${m}-${dd}`;
      }
      return s;
    } catch { return String(val); }
  };

  const formatDDMMYYYY = (val) => {
    if (!val) return '';
    try {
      if (val instanceof Date) {
        const d = val;
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const y = d.getUTCFullYear();
        return `${dd}.${mm}.${y}`;
      }
      const s = String(val);
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const [y, m, d] = s.split('-');
        return `${d}.${m}.${y}`;
      }
      const d2 = new Date(s);
      if (!isNaN(d2.getTime())) {
        const dd = String(d2.getUTCDate()).padStart(2, '0');
        const mm = String(d2.getUTCMonth() + 1).padStart(2, '0');
        const y = d2.getUTCFullYear();
        return `${dd}.${mm}.${y}`;
      }
      return s;
    } catch { return String(val); }
  };

  const load = async () => {
    const res = await fetch('/api/admin/pm-quotes');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        const normalized = { ...empty, ...data };
        normalized.quote_date = toYMD(normalized.quote_date) || today;
        setForm(normalized);
      } else setForm(empty);
    }
    setLoaded(true);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pm-quotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">PM Quote</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Quote Text</label>
            <textarea className="w-full border rounded p-2" rows={4} value={form.quote_text} onChange={(e) => setForm({ ...form, quote_text: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Author</label>
            <input className="w-full border rounded p-2" value={form.author || ''} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Image URL</label>
            <input className="w-full border rounded p-2" value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Event URL</label>
            <input className="w-full border rounded p-2" value={form.event_url || ''} onChange={(e) => setForm({ ...form, event_url: e.target.value })} placeholder="https://example.com/event" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input type="date" className="w-full border rounded p-2" value={form.quote_date || today} onChange={(e) => setForm({ ...form, quote_date: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
              {form.id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="flex flex-wrap rounded-[8px] overflow-hidden bg-[#ebeaea]">
          <div className="flex-[0_0_300px] p-[30px] flex justify-center items-center w-full md:w-auto">
            <div className="relative w-[160px] h-[160px] rounded-full overflow-hidden bg-white shadow">
              <img src={form.image_url || '/images/pm/pm-modi.jpg'} alt="PM" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
          <div className="flex-1 p-[30px] flex flex-col justify-center">
            <p className="text-[1.1rem] leading-[1.6] text-[#162f6a] font-medium" style={{ whiteSpace: 'pre-line' }}>
              <span className="block text-[3rem] text-[#162f6a] leading-none mb-3" aria-hidden="true">“</span>
              {form.quote_text || 'Your quote will appear here...'}
            </p>
            <div className="mt-3 text-[#162f6a] uppercase text-[0.85rem]">
              {form.author || 'Prime Minister'}
              <br />
              <span className="text-[0.8rem] bg-[#e9e9e9] rounded-[20px] font-medium px-2 inline-block mt-1">{formatDDMMYYYY(form.quote_date || today)}</span>
            </div>
            <div className="mt-4">
              <a href={form.event_url || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[#0b3a82] border border-[#0b3a82] py-[8px] px-4 rounded-[6px] no-underline font-semibold text-[0.85rem] hover:bg-[#f5f9ff] hover:shadow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0b3a82]">
                  <path d="M14 3h7v7" stroke="#0b3a82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14L21 3" stroke="#0b3a82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 14v7H3V3h7" stroke="#0b3a82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                VIEW EVENT
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
