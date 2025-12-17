import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import PageHeader from "@/components/PageHeader";
import SubNavTabs from "@/components/SubNavTabs";

export default function ReportDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/documents/${encodeURIComponent(String(id))}/files`);
        if (!res.ok) throw new Error('Failed to load report files');
        const data = await res.json();
        if (mounted) setFiles((data && data.files) || []);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load report files');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  return (
    <>
      <main id="main">
        <PageHeader pagePath="/documents/reports" />
        <SubNavTabs />

        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Report Files</h2>
                <p className="text-sm text-gray-600">Files for report ID: {id}</p>
              </div>
            </div>

            <div className="bg-blue-200 text-blue-900 font-semibold rounded-t-md px-4 py-2 text-xs">Files</div>
            <div className="divide-y border border-t-0 rounded-b-md">
              {loading ? (
                <div className="px-4 py-6 text-center text-gray-500">Loading files...</div>
              ) : error ? (
                <div className="px-4 py-6 text-center text-red-600">{error}</div>
              ) : files.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500">No files found for this report.</div>
              ) : files.map((f) => (
                <div key={f.id} className="grid grid-cols-[1fr_auto] items-center px-4 py-3 bg-white">
                  <div>
                    <p className="mb-0 text-sm text-gray-800">{f.original_name}</p>
                    <small className="text-gray-600">{f.file_type} • {f.file_size}</small>
                  </div>
                  <div>
                    <a href={f.file_url || '#'} target={f.file_url ? '_blank' : undefined} rel={f.file_url ? 'noreferrer' : undefined} className="inline-flex items-center gap-2 uppercase text-sm px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200">
                      <span aria-hidden="true" className="material-symbols-outlined">visibility</span>
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <a className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-blue-800 border-blue-300 hover:bg-blue-50" href="/documents/reports">
                <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
                Back to Reports
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
