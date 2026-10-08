'use client';
import { useEffect, useState } from 'react';
export type User = { id: string; name: string; role: 'buyer' | 'seller' | 'admin' };
const read = (): User | null => { try { return JSON.parse(localStorage.getItem('agc_user') || 'null'); } catch { return null; } };
export const saveSession = (token: string, user: User) => { localStorage.setItem('agc_token', token); localStorage.setItem('agc_user', JSON.stringify(user)); window.dispatchEvent(new Event('agc')); };
export const logout = () => { localStorage.clear(); window.dispatchEvent(new Event('agc')); };
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { const f = () => { setUser(read()); setReady(true); }; f(); window.addEventListener('agc', f); return () => window.removeEventListener('agc', f); }, []);
  return { user, ready };
}
