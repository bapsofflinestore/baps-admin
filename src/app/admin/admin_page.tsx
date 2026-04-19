'use client';

import { useEffect, useState, useRef } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  addDoc, collection, onSnapshot, query, orderBy,
  doc, limit, serverTimestamp, updateDoc,
} from 'firebase/firestore';

// ── Types ─────────────────────────────────────────────────────────────────────
interface User {
  uid: string; name: string; email: string; phone: string;
  coinBalance: number; currentStreak: number; totalEarned: number;
  totalSpent: number; referralCount: number; isOnline: boolean;
  isActive: boolean; role: string; hasSpunWheel: boolean;
  createdAt: any; lastSeen: any;
}

interface Retailer {
  uid: string; ownerName: string; storeName: string; firmName: string;
  email: string; phone: string; address: string; city: string;
  state: string; category: string; isVerified: boolean; isOnline: boolean;
  isActive: boolean; totalOrders: number; totalRevenue: number;
  totalProducts: number; rating: number; storeDetailsComplete: boolean;
  gstNo: string; panNo: string; aadhaarNo: string;
  gstBillUrl: string; panCardUrl: string; aadhaarUrl: string;
  createdAt: any; lastSeen: any;
}

interface Transaction {
  id: string; uid: string; userName: string; userEmail: string;
  title: string; subtitle: string; amount: number; type: string;
  createdAt: any;
}

interface Order {
  id: string; retailerUid: string; customerName: string;
  customerUid: string; amount: number; status: string;
  items: any[]; createdAt: any;
}

type Tab = 'overview' | 'users' | 'retailers' | 'transactions' | 'orders';

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(ts: any): string {
  if (!ts) return '—';
  const sec = Math.floor(Date.now() / 1000) - ts.seconds;
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}
function fmtDate(ts: any): string {
  if (!ts) return '—';
  return new Date(ts.seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtNum(n: number): string {
  return n.toLocaleString('en-IN');
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab]               = useState<Tab>('overview');
  const [users, setUsers]           = useState<User[]>([]);
  const [retailers, setRetailers]   = useState<Retailer[]>([]);
  const [transactions, setTx]       = useState<Transaction[]>([]);
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [toast, setToast]           = useState('');
  const [docModal, setDocModal]     = useState<Retailer | null>(null);
  const toastRef                    = useRef<ReturnType<typeof setTimeout>>();

  function showToast(msg: string) {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(''), 3000);
  }

  // ── Real-time listeners ───────────────────────────────────────────────────
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(onSnapshot(query(collection(db, 'users'), orderBy('createdAt', 'desc')), snap => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() } as User)));
      setLoading(false);
    }));

    unsubs.push(onSnapshot(query(collection(db, 'retailers'), orderBy('createdAt', 'desc')), snap => {
      setRetailers(snap.docs.map(d => ({ uid: d.id, ...d.data() } as Retailer)));
    }));

    unsubs.push(onSnapshot(query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(200)), snap => {
      setTx(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
    }));

    unsubs.push(onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(200)), snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    }));

    return () => unsubs.forEach(u => u());
  }, []);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalCoins      = users.reduce((s, u) => s + (u.coinBalance || 0), 0);
  const onlineUsers     = users.filter(u => u.isOnline).length;
  const onlineRetailers = retailers.filter(r => r.isOnline).length;
  const pendingVerify   = retailers.filter(r => !r.isVerified).length;
  const todayUsers      = users.filter(u => {
    if (!u.createdAt) return false;
    return new Date(u.createdAt.seconds * 1000).toDateString() === new Date().toDateString();
  }).length;
  const totalRevenue = retailers.reduce((s, r) => s + (r.totalRevenue || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // ── Actions ───────────────────────────────────────────────────────────────
  async function verifyRetailer(uid: string) {
    await updateDoc(doc(db, 'retailers', uid), { isVerified: true });
    showToast('✅ Retailer verified!');
  }
  async function suspendUser(uid: string, type: 'users' | 'retailers') {
    await updateDoc(doc(db, type, uid), { isActive: false });
    showToast('🚫 Account suspended');
  }
  async function activateUser(uid: string, type: 'users' | 'retailers') {
    await updateDoc(doc(db, type, uid), { isActive: true });
    showToast('✅ Account activated');
  }

    // ── Filter ────────────────────────────────────────────────────────────────────
  async function shareItem(type: 'user' | 'retailer', id: string) {
    const shareUrl = `${window.location.origin}/admin/${type}?share=${id}`;
    try {
      await addDoc(collection(db, 'shares'), {
        type,
        entityId: id,
        shareUrl,
        sharedAt: serverTimestamp(),
        sharedBy: auth.currentUser?.uid || 'admin',
      });
      await navigator.clipboard.writeText(shareUrl);
      showToast('✅ Share link copied and logged to Firebase');
    } catch (error) {
      console.error(error);
      showToast('⚠️ Unable to share the profile. Try again.');
    }
  }

  const q = search.toLowerCase();
  const filtUsers     = users.filter(u =>
    u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q));
  const filtRetailers = retailers.filter(r =>
    r.storeName?.toLowerCase().includes(q) || r.ownerName?.toLowerCase().includes(q) ||
    r.email?.toLowerCase().includes(q) || r.phone?.includes(q));
  const filtTx        = transactions.filter(t =>
    t.userName?.toLowerCase().includes(q) || t.title?.toLowerCase().includes(q));
  const filtOrders    = orders.filter(o =>
    o.customerName?.toLowerCase().includes(q));

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#0f0f14', color: '#e8e8f0' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#1a1a2e', border: '1px solid #7b5cf0',
          padding: '12px 20px', borderRadius: 12, zIndex: 9999, fontSize: 14, fontWeight: 600, color: '#e8e8f0',
          boxShadow: '0 8px 32px rgba(123,92,240,0.3)' }}>
          {toast}
        </div>
      )}

      {/* Doc Modal */}
      {docModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9998,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setDocModal(null)}>
          <div style={{ background: '#1a1a2e', borderRadius: 20, padding: 28, maxWidth: 680, width: '100%',
            border: '1px solid #2a2a40', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{docModal.storeName || docModal.firmName} — Documents</h2>
              <button onClick={() => setDocModal(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 22, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { label: 'GST Bill', url: docModal.gstBillUrl },
                { label: 'PAN Card', url: docModal.panCardUrl },
                { label: 'Aadhaar',  url: docModal.aadhaarUrl },
              ].map(doc => (
                <div key={doc.label}>
                  <p style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{doc.label}</p>
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noreferrer">
                      <img src={doc.url} alt={doc.label} style={{ width: '100%', borderRadius: 10, border: '1px solid #2a2a40' }} />
                    </a>
                  ) : (
                    <div style={{ background: '#0f0f14', borderRadius: 10, height: 120, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 13 }}>Not uploaded</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                ['GST No', docModal.gstNo], ['PAN No', docModal.panNo],
                ['Aadhaar No', docModal.aadhaarNo], ['Phone', docModal.phone],
              ].map(([k, v]) => (
                <div key={k as string} style={{ background: '#0f0f14', padding: '10px 14px', borderRadius: 10 }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#666' }}>{k}</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, fontFamily: 'DM Mono' }}>{v || '—'}</p>
                </div>
              ))}
            </div>
            {!docModal.isVerified && (
              <button onClick={() => { verifyRetailer(docModal.uid); setDocModal(null); }}
                style={{ marginTop: 20, width: '100%', padding: '14px', background: 'linear-gradient(135deg,#7b5cf0,#9b59d4)',
                  border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                ✅ Verify This Retailer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: 220, background: '#0a0a10', borderRight: '1px solid #1e1e2e',
          padding: '24px 12px', flexShrink: 0, position: 'fixed', top: 0, bottom: 0, left: 0, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 24px', borderBottom: '1px solid #1e1e2e' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#7b5cf0,#9b59d4)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🪙</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#e8e8f0' }}>Baps Admin</div>
              <div style={{ fontSize: 11, color: '#666' }}>Control Panel</div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            {([
              ['overview',     '📊', 'Overview'],
              ['users',        '👥', 'Clients'],
              ['retailers',    '🏪', 'Retailers'],
              ['transactions', '💳', 'Transactions'],
              ['orders',       '📦', 'Orders'],
            ] as [Tab, string, string][]).map(([id, icon, label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px',
                  borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 4, textAlign: 'left',
                  background: tab === id ? 'linear-gradient(135deg,rgba(123,92,240,0.2),rgba(155,89,212,0.1))' : 'transparent',
                  color: tab === id ? '#c4b5fd' : '#666',
                  borderLeft: tab === id ? '2px solid #7b5cf0' : '2px solid transparent',
                  fontFamily: 'DM Sans', fontSize: 14, fontWeight: tab === id ? 600 : 400,
                }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Live indicator */}
          <div style={{ position: 'absolute', bottom: 20, left: 12, right: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
              background: '#0f0f14', borderRadius: 10, border: '1px solid #1e1e2e' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34c759',
                boxShadow: '0 0 8px #34c759', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, color: '#666' }}>Live • Real-time</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ marginLeft: 220, flex: 1, padding: 28, minWidth: 0 }}>
          <style>{`
            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
            ::-webkit-scrollbar{width:6px;height:6px}
            ::-webkit-scrollbar-track{background:#0f0f14}
            ::-webkit-scrollbar-thumb{background:#2a2a40;border-radius:3px}
            table{border-collapse:collapse;width:100%}
            thead th{background:#0f0f14;padding:10px 14px;text-align:left;font-size:11px;
              font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.8px;border-bottom:1px solid #1e1e2e}
            tbody td{padding:12px 14px;font-size:13px;border-bottom:1px solid #1a1a28;vertical-align:middle}
            tbody tr:hover td{background:rgba(123,92,240,0.04)}
            .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
            .btn{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;
              border:none;font-family:'DM Sans',sans-serif;transition:opacity 0.15s}
            .btn:hover{opacity:0.85}
            input{background:#1a1a28;border:1px solid #2a2a40;color:#e8e8f0;padding:10px 14px;
              border-radius:10px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;width:100%;box-sizing:border-box}
            input:focus{border-color:#7b5cf0}
          `}</style>

          {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
          {tab === 'overview' && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>Dashboard Overview</h1>
              <p style={{ color: '#666', fontSize: 14, margin: '0 0 28px' }}>
                All data updates in real-time from Firebase
              </p>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 28 }}>
                {[
                  { label: 'Total Clients',   value: fmtNum(users.length),       icon: '👥', color: '#7b5cf0' },
                  { label: 'Online Now',       value: fmtNum(onlineUsers),         icon: '🟢', color: '#34c759' },
                  { label: 'New Today',        value: fmtNum(todayUsers),          icon: '✨', color: '#4facfe' },
                  { label: 'Total Coins',      value: fmtNum(totalCoins),          icon: '🪙', color: '#ffd700' },
                  { label: 'Retailers',        value: fmtNum(retailers.length),    icon: '🏪', color: '#ff6b35' },
                  { label: 'Pending Verify',   value: fmtNum(pendingVerify),       icon: '⏳', color: '#ff9500' },
                  { label: 'Total Revenue',    value: `₹${fmtNum(totalRevenue)}`,  icon: '💰', color: '#34c759' },
                  { label: 'Pending Orders',   value: fmtNum(pendingOrders),       icon: '📦', color: '#ff3b5c' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#1a1a28', borderRadius: 14, padding: '18px 16px',
                    border: '1px solid #2a2a40' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent users + Recent transactions side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Recent signups */}
                <div style={{ background: '#1a1a28', borderRadius: 16, border: '1px solid #2a2a40', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 18px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Signups</span>
                    <button onClick={() => setTab('users')} style={{ background: 'none', border: 'none', color: '#7b5cf0', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>View all →</button>
                  </div>
                  {loading ? <SkeletonRows /> : users.slice(0, 5).map(u => (
                    <div key={u.uid} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: '1px solid #1a1a28' }}>
                      <Avatar name={u.name} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: '#666' }}>{u.email}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#c4b5fd' }}>🪙 {u.coinBalance}</div>
                        <OnlineBadge online={u.isOnline} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent transactions */}
                <div style={{ background: '#1a1a28', borderRadius: 16, border: '1px solid #2a2a40', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 18px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Transactions</span>
                    <button onClick={() => setTab('transactions')} style={{ background: 'none', border: 'none', color: '#7b5cf0', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>View all →</button>
                  </div>
                  {transactions.slice(0, 5).map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: '1px solid #1a1a28' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: txColor(t.type) + '22',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {txEmoji(t.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                        <div style={{ fontSize: 11, color: '#666' }}>{t.userName}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: t.amount > 0 ? '#34c759' : '#ff3b5c', flexShrink: 0 }}>
                        {t.amount > 0 ? '+' : ''}{t.amount}🪙
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retailers needing verification */}
              {pendingVerify > 0 && (
                <div style={{ background: '#1a1a28', borderRadius: 16, border: '1px solid #ff950044', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 18px', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>⚠️</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{pendingVerify} Retailer{pendingVerify > 1 ? 's' : ''} Pending Verification</span>
                  </div>
                  {retailers.filter(r => !r.isVerified).slice(0, 5).map(r => (
                    <div key={r.uid} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: '1px solid #1a1a28' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{r.storeName || r.firmName}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{r.ownerName} · {r.category} · {fmtDate(r.createdAt)}</div>
                      </div>
                      <button onClick={() => setDocModal(r)} className="btn"
                        style={{ background: '#1e1e2e', color: '#aaa', marginRight: 8 }}>View Docs</button>
                      <button onClick={() => verifyRetailer(r.uid)} className="btn"
                        style={{ background: 'linear-gradient(135deg,#34c759,#30d158)', color: '#fff' }}>✓ Verify</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── USERS / CLIENTS ──────────────────────────────────────────── */}
          {tab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Clients</h1>
                  <p style={{ color: '#666', fontSize: 14, margin: 0 }}>{filtUsers.length} total · {onlineUsers} online now</p>
                </div>
                <input placeholder="Search name, email, phone..." value={search}
                  onChange={e => setSearch(e.target.value)} style={{ width: 300 }} />
              </div>

              <div style={{ background: '#1a1a28', borderRadius: 16, border: '1px solid #2a2a40', overflow: 'hidden' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Client</th><th>Phone</th><th>Coins</th>
                      <th>Streak</th><th>Referrals</th><th>Spun</th>
                      <th>Status</th><th>Joined</th><th>Last Seen</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array(6).fill(0).map((_, i) => (
                        <tr key={i}>{Array(10).fill(0).map((_, j) => (
                          <td key={j}><div style={{ height: 14, background: '#2a2a40', borderRadius: 4, width: '70%' }} /></td>
                        ))}</tr>
                      ))
                    ) : filtUsers.map(u => (
                      <tr key={u.uid}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar name={u.name} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                              <div style={{ fontSize: 11, color: '#666' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{u.phone || '—'}</td>
                        <td><span style={{ fontWeight: 700, color: '#c4b5fd' }}>🪙 {u.coinBalance ?? 0}</span></td>
                        <td><span style={{ color: '#ff6b35', fontWeight: 600 }}>🔥 {u.currentStreak ?? 0}d</span></td>
                        <td style={{ textAlign: 'center' }}>{u.referralCount ?? 0}</td>
                        <td><span className="badge" style={{ background: u.hasSpunWheel ? '#34c75922' : '#ff950022', color: u.hasSpunWheel ? '#34c759' : '#ff9500' }}>
                          {u.hasSpunWheel ? '✓ Spun' : '⏳ No'}
                        </span></td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <OnlineBadge online={u.isOnline} />
                            {!u.isActive && <span className="badge" style={{ background: '#ff3b5c22', color: '#ff3b5c' }}>Suspended</span>}
                          </div>
                        </td>
                        <td style={{ fontSize: 12, color: '#888' }}>{fmtDate(u.createdAt)}</td>
                        <td style={{ fontSize: 12, color: '#888' }}>{timeAgo(u.lastSeen)}</td>
                        <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {u.isActive
                            ? <button onClick={() => suspendUser(u.uid, 'users')} className="btn"
                                style={{ background: '#ff3b5c22', color: '#ff3b5c' }}>Suspend</button>
                            : <button onClick={() => activateUser(u.uid, 'users')} className="btn"
                                style={{ background: '#34c75922', color: '#34c759' }}>Activate</button>
                          }
                          <button onClick={() => shareItem('user', u.uid)} className="btn"
                            style={{ background: '#7b5cf022', color: '#c4b5fd' }}>Share</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── RETAILERS ────────────────────────────────────────────────── */}
          {tab === 'retailers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Retailers</h1>
                  <p style={{ color: '#666', fontSize: 14, margin: 0 }}>{filtRetailers.length} total · {pendingVerify} pending verification</p>
                </div>
                <input placeholder="Search store, owner, email..." value={search}
                  onChange={e => setSearch(e.target.value)} style={{ width: 300 }} />
              </div>

              <div style={{ background: '#1a1a28', borderRadius: 16, border: '1px solid #2a2a40', overflow: 'hidden' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Store</th><th>Owner</th><th>Category</th>
                      <th>Orders</th><th>Revenue</th><th>Rating</th>
                      <th>Verified</th><th>Setup</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtRetailers.map(r => (
                      <tr key={r.uid}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#4facfe,#00f2fe)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>
                              {(r.storeName || r.firmName || '?')[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{r.storeName || r.firmName}</div>
                              <div style={{ fontSize: 11, color: '#666' }}>{r.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: 13 }}>{r.ownerName}</div>
                          <div style={{ fontSize: 11, color: '#666', fontFamily: 'DM Mono' }}>{r.phone}</div>
                        </td>
                        <td><span className="badge" style={{ background: '#7b5cf022', color: '#c4b5fd' }}>{r.category || '—'}</span></td>
                        <td style={{ fontWeight: 600 }}>{r.totalOrders ?? 0}</td>
                        <td style={{ fontWeight: 700, color: '#34c759' }}>₹{fmtNum(r.totalRevenue ?? 0)}</td>
                        <td style={{ color: '#ffd700' }}>⭐ {r.rating > 0 ? r.rating.toFixed(1) : 'N/A'}</td>
                        <td>
                          {r.isVerified
                            ? <span className="badge" style={{ background: '#34c75922', color: '#34c759' }}>✓ Verified</span>
                            : <span className="badge" style={{ background: '#ff950022', color: '#ff9500' }}>⏳ Pending</span>
                          }
                        </td>
                        <td>
                          {r.storeDetailsComplete
                            ? <span className="badge" style={{ background: '#34c75922', color: '#34c759' }}>Complete</span>
                            : <span className="badge" style={{ background: '#ff3b5c22', color: '#ff3b5c' }}>Incomplete</span>
                          }
                        </td>
                        <td>
                          <OnlineBadge online={r.isOnline} />
                          {!r.isActive && <span className="badge" style={{ background: '#ff3b5c22', color: '#ff3b5c', marginTop: 4, display: 'block' }}>Suspended</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button onClick={() => shareItem('retailer', r.uid)} className="btn" style={{ background: '#7b5cf022', color: '#c4b5fd' }}>Share</button>
                            <button onClick={() => setDocModal(r)} className="btn" style={{ background: '#2a2a40', color: '#aaa' }}>Docs</button>
                            {!r.isVerified && (
                              <button onClick={() => verifyRetailer(r.uid)} className="btn"
                                style={{ background: 'linear-gradient(135deg,#34c759,#30d158)', color: '#fff' }}>Verify</button>
                            )}
                            {r.isActive
                              ? <button onClick={() => suspendUser(r.uid, 'retailers')} className="btn" style={{ background: '#ff3b5c22', color: '#ff3b5c' }}>Suspend</button>
                              : <button onClick={() => activateUser(r.uid, 'retailers')} className="btn" style={{ background: '#34c75922', color: '#34c759' }}>Activate</button>
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TRANSACTIONS ─────────────────────────────────────────────── */}
          {tab === 'transactions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Transactions</h1>
                  <p style={{ color: '#666', fontSize: 14, margin: 0 }}>{filtTx.length} total coin events</p>
                </div>
                <input placeholder="Search user or title..." value={search}
                  onChange={e => setSearch(e.target.value)} style={{ width: 300 }} />
              </div>

              <div style={{ background: '#1a1a28', borderRadius: 16, border: '1px solid #2a2a40', overflow: 'hidden' }}>
                <table>
                  <thead>
                    <tr><th>Type</th><th>Client</th><th>Title</th><th>Amount</th><th>Time</th></tr>
                  </thead>
                  <tbody>
                    {filtTx.map(t => (
                      <tr key={t.id}>
                        <td>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: txColor(t.type) + '22',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                            {txEmoji(t.type)}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{t.userName || '—'}</div>
                          <div style={{ fontSize: 11, color: '#666' }}>{t.userEmail}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
                          <div style={{ fontSize: 11, color: '#666' }}>{t.subtitle}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: 15, fontWeight: 800, color: t.amount > 0 ? '#34c759' : '#ff3b5c' }}>
                            {t.amount > 0 ? '+' : ''}{t.amount} 🪙
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: '#666' }}>{timeAgo(t.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ORDERS ───────────────────────────────────────────────────── */}
          {tab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Orders</h1>
                  <p style={{ color: '#666', fontSize: 14, margin: 0 }}>{filtOrders.length} total · {pendingOrders} pending</p>
                </div>
                <input placeholder="Search customer..." value={search}
                  onChange={e => setSearch(e.target.value)} style={{ width: 300 }} />
              </div>

              {filtOrders.length === 0 ? (
                <div style={{ background: '#1a1a28', borderRadius: 16, border: '1px solid #2a2a40', padding: 60, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No orders yet</div>
                  <div style={{ color: '#666', fontSize: 14 }}>Orders placed by clients will appear here in real-time</div>
                </div>
              ) : (
                <div style={{ background: '#1a1a28', borderRadius: 16, border: '1px solid #2a2a40', overflow: 'hidden' }}>
                  <table>
                    <thead>
                      <tr><th>Customer</th><th>Retailer</th><th>Items</th><th>Amount</th><th>Status</th><th>Time</th></tr>
                    </thead>
                    <tbody>
                      {filtOrders.map(o => {
                        const retailer = retailers.find(r => r.uid === o.retailerUid);
                        return (
                          <tr key={o.id}>
                            <td style={{ fontSize: 13, fontWeight: 600 }}>{o.customerName || '—'}</td>
                            <td style={{ fontSize: 13 }}>{retailer?.storeName || o.retailerUid?.slice(0, 8) + '...' || '—'}</td>
                            <td style={{ fontSize: 13 }}>{(o.items || []).length} item{(o.items || []).length !== 1 ? 's' : ''}</td>
                            <td style={{ fontWeight: 700, color: '#34c759' }}>₹{fmtNum(o.amount || 0)}</td>
                            <td><StatusBadge status={o.status} /></td>
                            <td style={{ fontSize: 12, color: '#666' }}>{timeAgo(o.createdAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const colors = ['#7b5cf0','#ff6b35','#34c759','#4facfe','#ff3b5c','#ffd700'];
  const i = (name?.charCodeAt(0) || 0) % colors.length;
  return (
    <div style={{ width: 34, height: 34, borderRadius: 10, background: colors[i],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

function OnlineBadge({ online }: { online: boolean }) {
  return (
    <span className="badge" style={{ background: online ? '#34c75922' : '#2a2a40', color: online ? '#34c759' : '#666' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: online ? '#34c759' : '#555',
        display: 'inline-block', marginRight: 5 }} />
      {online ? 'Online' : 'Offline'}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    pending:   { bg: '#ff950022', color: '#ff9500' },
    confirmed: { bg: '#4facfe22', color: '#4facfe' },
    delivered: { bg: '#34c75922', color: '#34c759' },
    cancelled: { bg: '#ff3b5c22', color: '#ff3b5c' },
  };
  const s = map[status] || { bg: '#2a2a40', color: '#888' };
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{status}</span>;
}

function SkeletonRows() {
  return (
    <>
      {Array(4).fill(0).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid #1a1a28' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#2a2a40' }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 12, background: '#2a2a40', borderRadius: 4, width: '50%', marginBottom: 6 }} />
            <div style={{ height: 10, background: '#2a2a40', borderRadius: 4, width: '70%' }} />
          </div>
        </div>
      ))}
    </>
  );
}

function txEmoji(type: string) {
  return { bonus: '🎁', earned: '🛍️', spent: '💸', referral: '👥', streak: '🔥', spin: '🎡' }[type] || '🪙';
}
function txColor(type: string) {
  return { bonus: '#7b5cf0', earned: '#34c759', spent: '#ff3b5c', referral: '#4facfe', streak: '#ff6b35', spin: '#ffd700' }[type] || '#888';
}