
import React, { useEffect, useState } from 'react';
import { getAuthorityData } from '../db';
import { Party, User, Folder, Card } from '../types';

const AuthorityTable: React.FC = () => {
  const [data, setData] = useState<{
    parties: Party[];
    users: User[];
    folders: Folder[];
    cards: Card[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuthorityData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-emerald-500 font-black uppercase tracking-widest animate-pulse">
        Initializing Authority Tables...
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="mb-8">
        <h2 className="text-4xl font-black text-emerald-400 tracking-tighter uppercase">Authority Dashboard</h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Global Resource Visualization</p>
      </header>

      {/* Parties Table */}
      <section className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-6 bg-emerald-500/10 border-b border-slate-800">
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-sm">Parties & Communities ({data?.parties.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-500 uppercase">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data?.parties.map(p => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="p-4 font-mono text-emerald-500">{p.id}</td>
                  <td className="p-4 font-bold text-white">{p.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Users Table */}
      <section className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-6 bg-emerald-500/10 border-b border-slate-800">
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-sm">Members & Admins ({data?.users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-500 uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Party ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data?.users.map(u => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="p-4 font-bold text-white">{u.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                      u.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-500' : 
                      u.role === 'DEV' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-indigo-500/20 text-indigo-500'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{u.partyId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Folders Table */}
      <section className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-6 bg-emerald-500/10 border-b border-slate-800">
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-sm">Folders ({data?.folders.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-500 uppercase">
              <tr>
                <th className="p-4">Folder Name</th>
                <th className="p-4">Party ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data?.folders.map(f => (
                <tr key={f.id} className="hover:bg-white/5">
                  <td className="p-4 font-bold text-white">{f.name}</td>
                  <td className="p-4 text-slate-400">{f.partyId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AuthorityTable;
