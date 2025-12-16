import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

export default function DocumentDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug || !slug[1]) {
            setError('Invalid document ID');
            setLoading(false);
            return;
        }

        const fetchFiles = async () => {
            try {
                const response = await fetch(`/api/documents/${slug[1]}/files`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch files');
                }

                setFiles(data.files || []);
            } catch (err) {
                console.error('Error fetching files:', err);
                setError(err.message || 'Failed to load files');
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [slug]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="px-4 py-6 text-center text-gray-500">Loading files...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="px-4 py-6 text-center text-red-600">{error}</div>
            </div>
        );
    }

    const documentTitle = slug && slug[0]
        ? slug[0].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'Document';

    return (
        <>
            <main id="main">

                <PageHeader pagePath={`/documents/${documentTitle}`} />

                {/* Tabs (DB-driven for current route) */}
                <SubNavTabs />


                  <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>

                 <div className="gi-container">
                    <h1 className="text-2xl font-bold mb-6">{documentTitle}</h1>

                    <div className="divide-y border border-t-0 rounded-b-md">
                        {files.length === 0 ? (
                            <div className="px-4 py-6 text-center text-gray-500">No files found.</div>
                        ) : (
                            files.map((file) => (
                                <div key={file.id} className="grid grid-cols-[7fr_2fr_3fr] items-center px-4 py-3 bg-white">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-gray-700">draft</span>
                                        <p className="mb-0 text-sm text-gray-800 truncate" title={file.original_name}>
                                            {file.original_name}
                                        </p>
                                    </div>
                                    <div className="text-center text-sm text-gray-700">
                                        {new Date(file.created_at).getFullYear() || '-'}
                                    </div>
                                    <div className="flex items-center gap-2 justify-between w-full">
                                        <div className="flex items-center gap-2 mx-auto">
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100">
                                                {file.file_type?.toUpperCase() || 'FILE'}
                                            </span>
                                            <small className="text-gray-700">
                                                {file.file_size ? formatFileSize(file.file_size) : ''}
                                            </small>
                                        </div>
                                        <a
                                            href={file.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 uppercase text-sm px-3 py-1.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                                        >
                                            <span aria-hidden="true" className="material-symbols-outlined">visibility</span>
                                            View
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                </section>
                <Footer />
            </main>
        </>
    );
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}