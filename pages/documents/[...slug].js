import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

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
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600 text-center py-8">Error: {error}</div>
      </div>
    );
  }

  const pageTitle = slug && slug[0] 
    ? slug[0].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Document';

  return (
    <>
      <Head>
        <title>{pageTitle} | Document Details</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.length > 0 ? (
            files.map((file, index) => (
              <div key={index} className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <span className="truncate" title={file.original_name}>
                    {file.original_name || `File ${index + 1}`}
                  </span>
                  <a 
                    href={file.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm whitespace-nowrap"
                  >
                    View
                  </a>
                </div>
                {file.file_size && (
                  <div className="mt-2 text-xs text-gray-500">
                    {formatFileSize(file.file_size)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No files found for this document.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}