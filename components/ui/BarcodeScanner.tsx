'use client';
import { useState } from 'react';
import BarcodeScanner from '@yudiel/react-barcode-scanner';
import { createBrowserClient } from '@/lib/supabase';
import type { PantryItem } from '@/lib/types';

export default function BarcodeScanner({ onAdd }: { onAdd: (item: PantryItem) => void }) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const supabase = createBrowserClient();

  const handleScan = async (barcode: string) => {
    if (!barcode) return;
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-barcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ barcode })
      });
      if (!res.ok) throw new Error('Failed to process barcode');
      const item = await res.json();
      onAdd(item);
      setScanning(false);
    } catch (err) {
      setError('Failed to process barcode. Please try again.');
    }
  };

  return (
    <div>
      {scanning ? (
        <div className="relative">
          <BarcodeScanner
            onDetected={(codes) => {
              if (codes?.[0]?.rawValue) handleScan(codes[0].rawValue);
            }}
            className="w-full h-64 bg-gray-100 rounded-lg"
          />
          <button
            onClick={() => setScanning(false)}
            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full text-sm"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setScanning(true)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
        >
          Start Scanning
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
