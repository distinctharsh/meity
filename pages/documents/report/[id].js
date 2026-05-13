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

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '';

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

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

            {/* <div className="bg-blue-200 text-blue-900 font-semibold rounded-t-md px-4 py-2 text-xs">Files</div> */}
            <div className="">
              {loading ? (
                <div className="px-4 py-6 text-center text-gray-500">Loading files...</div>
              ) : error ? (
                <div className="px-4 py-6 text-center text-red-600">{error}</div>
              ) : files.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500">No files found for this report.</div>
              ) : files.map((f) => (
                <div
                  key={f.id}
                  className="grid grid-cols-[5fr_2fr_2fr_1fr] items-center px-6 py-4 bg-white border border-[#dbe4ff] rounded-[8px] mb-3 shadow-sm"
                >
                  {/* File Name */}
                  <div>
                    <p className="mb-0 font-16-400 text-[#1a1a1a]">
                      {f.original_name}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="text-center">
                    <p className="text-[13px] font-semibold text-[#2c3e66] mb-0">
                      {new Date(f.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>

                  {/* Type + Size */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[#1d3f91] text-[20px]">
                      draft
                    </span>

                    <div className="flex flex-col leading-tight">

                      <small className="text-[#1d3f91] font-semibold">
                        {f.file_size
                          ? `${(f.file_size / 1024 > 1024
                            ? (f.file_size / 1024 / 1024).toFixed(2) + ' MB'
                            : (f.file_size / 1024).toFixed(2) + ' KB'
                          )}`
                          : '-'}
                      </small>
                    </div>
                  </div>

                  {/* View Button */}
                  <div className="flex justify-end">
                    <a
                      href={f.file_url || '#'}
                      target={f.file_url ? '_blank' : undefined}
                      rel={f.file_url ? 'noreferrer' : undefined}
                      className="inline-flex items-center gap-2 uppercase px-4 py-2 rounded bg-[#dfe8ff] text-[#163d8f] hover:bg-[#cfdbff] font-semibold text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined"
                      >
                        visibility
                      </span>

                      VIEW
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
