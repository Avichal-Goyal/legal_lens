'use client';
import { useState } from 'react';

export default function TestUpload() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData(e.target);
      
      const res = await fetch('/api/ingest', { 
        method: 'POST', 
        body: formData 
      });
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', color: 'white' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Legal Lens Parser Test</h2>
      
      <form onSubmit={handleUpload} style={{ marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <input 
          type="file" 
          name="file" 
          required 
          style={{ color: 'white' }} 
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            backgroundColor: loading ? '#4b5563' : '#2563eb',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? "Extracting..." : "Upload & Parse"}
        </button>
      </form>

      {result && (
        <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '8px', border: '1px solid #374151' }}>
          <h3 style={{ marginBottom: '15px', color: '#93c5fd' }}>Response from PyMuPDF4LLM:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: '#d1d5db', overflowX: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}