'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [form, setForm] = useState({
    token: '',
    network: 'ethereum',
    timestamp: ''
  });

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTimestamp = parseInt(form.timestamp);
    if (!form.token || !form.network || isNaN(parsedTimestamp)) {
      setStatus('⚠️ Please fill all fields with valid values.');
      return;
    }

    setLoading(true);
    setStatus('Sending...');

    try {
      console.log('Sending request:', {
        token: form.token,
        network: form.network,
        timestamp: parsedTimestamp
      });

      const res = await axios.post('http://localhost:5000/schedule', {
        token: form.token,
        network: form.network,
        timestamp: parsedTimestamp
      });

      setStatus(`✅ ${res.data.message || 'Job scheduled successfully!'}`);
    } catch (err: any) {
      console.error('Error response:', err.response?.data);
      setStatus(`❌ ${err.response?.data?.message || 'Error scheduling job'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-50">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1
          className="text-5xl font-extrabold text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(135deg, #d1d5db, #9ca3af, #6b7280)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Zeru
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4 text-gray-800">
          <input
            type="text"
            name="token"
            placeholder="Token Address"
            value={form.token}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded placeholder-gray-500 text-gray-900 bg-gray-50"
            required
          />
          <select
            name="network"
            value={form.network}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-gray-900 bg-gray-50"
          >
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
          </select>
          <input
            type="number"
            name="timestamp"
            placeholder="Unix Timestamp"
            value={form.timestamp}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded placeholder-gray-500 text-gray-900 bg-gray-50"
            required
          />
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Scheduling...' : 'Schedule Job'}
          </button>

          {loading && (
            <div className="flex justify-center items-center mt-2">
              <svg
                className="animate-spin h-4 w-4 mr-2 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <p className="text-sm text-blue-600">Scheduling in progress...</p>
            </div>
          )}

          {status && !loading && (
            <p
              className={`text-center text-sm mt-2 ${
                status.includes('✅') ? 'text-green-600 font-medium' :
                status.includes('❌') ? 'text-red-600 font-medium' :
                'text-gray-700'
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500">© Zeru</p>
      </footer>
    </div>
  );
}
