import { useState, useRef } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function UploadCertificates() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError('');
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setError(''); setResult(null); setLoading(true);
    const formData = new FormData();
    formData.append('certificate', file);
    try {
      const { data } = await api.post('/api/student/upload-certificate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data);
      setFile(null); setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Upload Certificates">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 flex items-center justify-center text-xl">📎</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Upload Achievement Certificate</h2>
              <p className="text-slate-400 text-sm">Upload your course or co-curricular certificates.</p>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Drop Zone */}
            <div
              onClick={() => inputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
                ${dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-blue-500/60 hover:bg-slate-800/50'}`}
            >
              <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              <div className="text-4xl mb-3">{file ? '📄' : '☁️'}</div>
              {file ? (
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-slate-400 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-white font-medium">Drag & drop or click to upload</p>
                  <p className="text-slate-400 text-sm mt-1">PDF, JPG, PNG (max 5 MB)</p>
                </div>
              )}
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="rounded-xl overflow-hidden border border-slate-700">
                <img src={preview} alt="Preview" className="w-full max-h-48 object-cover" />
              </div>
            )}

            <button type="submit" disabled={!file || loading} className="btn-primary w-full">
              {loading ? 'Uploading...' : '⬆️ Upload Certificate'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✅</span>
              <h3 className="text-emerald-400 font-semibold text-lg">Certificate Uploaded!</h3>
            </div>
            <p className="text-slate-300 text-sm">{result.message}</p>
            <p className="text-slate-400 text-xs mt-1">Saved as: {result.filename}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
