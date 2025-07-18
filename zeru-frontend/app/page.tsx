'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

export default function Home() {
  const [form, setForm] = useState({
    token: '',
    network: 'ethereum',
    timestamp: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await axios.post('http://localhost:5000/schedule', {
        token: form.token,
        network: form.network,
        timestamp: parseInt(form.timestamp)
      });
      setStatus(res.data.message || 'Job scheduled successfully!');
    } catch (err: any) {
      setStatus(err.response?.data?.message || 'Error scheduling job');
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
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
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Schedule Job
          </button>
          {status && <p className="text-center text-sm mt-2 text-gray-700">{status}</p>}
        </form>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
