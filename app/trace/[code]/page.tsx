'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { j, Trace, imgUrl } from '@/lib/api';
const icon: Record<string, string> = { Harvested: '🌱', 'Quality Check': '🔍', Processing: '⚙️', Packaged: '📦', Warehouse: '🏭', Transported: '🚚', Sold: '🛒', Shipped: '📬', Delivered: '🏠' };

export default function TracePage() {
  const { code } = useParams<{ code: string }>();
  const [t, setT] = useState<Trace | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { j<Trace>(`/trace/${code}`).then(setT).catch((e) => setErr(e.message)); }, [code]);
  if (err) return <p className="rounded-xl bg-red-100 p-4 text-red-800">❌ {err}. Check the batch code and try again.</p>;
  if (!t) return <p>Loading passport…</p>;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : code)}`;
  return (
    <>
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-leaf to-fern p-6 text-cream sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sun">Produce passport · {t.code}</p>
        <div className="mt-3 flex flex-wrap items-center gap-5">
          {t.image ? <img src={imgUrl(t.image)} alt={t.crop} className="h-28 w-28 rounded-2xl border-4 border-white/30 object-cover" /> : <span className="text-7xl">{t.emoji}</span>}
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold">{t.crop}</h1>
            <p className="opacity-85">Grown by <b>{t.farmer}</b> · 📍 {t.farmLocation} · {t.quantityKg}kg harvested</p>
            <span className={`mt-3 inline-block -rotate-2 rounded-lg border-2 px-4 py-1 font-bold ${t.verified ? 'border-lime bg-lime/20 text-lime' : 'border-red-300 bg-red-500/30 text-red-100'}`}>
              {t.verified ? '🔒 CHAIN VERIFIED' : '⚠️ TAMPERING DETECTED'}
            </span>
          </div>
          <div className="rounded-xl bg-white p-2 text-center text-xs text-soil"><img src={qr} alt="QR" className="h-28 w-28" />Scan to share</div>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-bold">The journey · {t.events.length} sealed steps</h2>
      <ol className="relative ml-5 space-y-5 border-l-4 border-dashed border-fern/40 pl-8">
        {t.events.map((e, i) => (
          <li key={e.hash} className="relative animate-fade-up rounded-2xl border border-leaf/10 bg-white p-4 shadow-sm" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="absolute -left-[3.15rem] top-3 flex h-9 w-9 items-center justify-center rounded-full bg-sun text-lg ring-4 ring-cream">{icon[e.stage] || '📍'}</span>
            <p className="font-bold">{e.stage} <span className="text-sm font-normal text-soil/50">· {new Date(e.at).toLocaleString()}</span></p>
            <p className="text-sm">{e.actor} · {e.location}</p>
            {e.note && <p className="text-sm text-soil/70">{e.note}</p>}
            <p className="mt-2 inline-block rounded-md bg-leaf/10 px-2 py-0.5 font-mono text-[11px] text-leaf">seal #{i} {e.hash.slice(0, 16)}…</p>
          </li>
        ))}
      </ol>
    </>
  );
}
