'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard',         href: '/admin/dashboard',  badge: null },
  { icon: '🏪', label: 'Add Shop',           href: '/admin/shops',      badge: null },
  { icon: '💸', label: 'Withdrawal Request', href: '/admin/withdrawals',badge: 5    },
  { icon: '🪪', label: 'KYC Approval',       href: '/admin/kyc',        badge: 3    },
  { icon: '🧾', label: 'Bill Verification',  href: '/admin/bills',      badge: 12   },
  { icon: '⚠️', label: 'Fraud Flags',        href: '/admin/fraud',      badge: 2    },
  { icon: '👥', label: 'Users',              href: '/admin/users',      badge: null },
  { icon: '📊', label: 'Analytics',          href: '/admin/analytics',  badge: null },
];

const BOTTOM_ITEMS = [
  { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
  { icon: '🧪', label: 'Testing',  href: '/admin/testing'  },
  { icon: '❓', label: 'Get Help', href: '/admin/help'     },
];

const NOTIFICATIONS = [
  { icon: '💸', text: 'New withdrawal request from Priya S.',   time: '2m ago',  color: '#FEF3C7' },
  { icon: '🪪', text: 'KYC document pending: Raj Motors',       time: '15m ago', color: '#EDE9FE' },
  { icon: '⚠️', text: 'Fraud alert: 5 txns in 1hr flagged',    time: '1h ago',  color: '#FEE2E2' },
  { icon: '✅', text: 'Shop "FreshMart" approved successfully', time: '3h ago',  color: '#DCFCE7' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('Admin');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        router.replace('/login');
      } else {
        setUserEmail(user.email || 'Admin');
      }
    });
    return unsubscribe;
  }, [router]);

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const sideW = collapsed ? 72 : 240;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        .nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border-radius: 10px; text-decoration: none;
          color: rgba(255,255,255,0.55); font-size: 14px; font-weight: 500;
          transition: all 0.15s; position: relative; cursor: pointer;
          border: none; background: none; width: 100%;
        }
        .nav-link:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); }
        .nav-link.active {
          background: linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.2));
          color: #A5B4FC; border: 1px solid rgba(99,102,241,0.25);
        }
        .nav-link.active .nav-indicator { opacity: 1; }
        .nav-indicator {
          position: absolute; left: -14px; top: 50%; transform: translateY(-50%);
          width: 3px; height: 20px; border-radius: 0 2px 2px 0;
          background: linear-gradient(#6366F1,#8B5CF6); opacity: 0; transition: opacity 0.15s;
        }
        .sidebar-badge {
          padding: 2px 7px; border-radius: 20px; font-size: 11px; font-weight: 700;
          background: rgba(239,68,68,0.2); color: #FCA5A5;
          border: 1px solid rgba(239,68,68,0.3); margin-left: auto; flex-shrink: 0;
        }
        .notif-row { padding: 12px 20px; border-bottom: 1px solid #F8FAFC; display: flex; gap: 12px; cursor: pointer; transition: background 0.15s; background: white; }
        .notif-row:hover { background: #F8FAFC; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sideW, minHeight: '100vh',
        background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
      }}>

        {/* Logo row */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
                <Image
                  src="/assets/logo.svg"
                  alt="BAPS Offline Shopping"
                  width={40}
                  height={40}
                  style={{ borderRadius: 10, objectFit: 'contain' }}
                />
              </div>
              {!collapsed && (
                <div>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px', lineHeight: 1.2 }}>BAPS</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 500 }}>Offline Rewards</div>
                </div>
              )}
            </Link>
            <button onClick={() => setCollapsed(!collapsed)} style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
              width: 28, height: 28, cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
              fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.15s', fontFamily: 'inherit',
            }}>
              {collapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Admin badge */}
        {!collapsed && (
          <div style={{ margin: '16px 12px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>S</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: 'white', fontSize: 13, fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Suraj Kumar</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Super Admin</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', flexShrink: 0 }} />
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
          {!collapsed && (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '8px 4px 6px' }}>
              Applications
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`nav-link ${active ? 'active' : ''}`} title={collapsed ? item.label : undefined} style={{ fontFamily: 'inherit' }}>
                  <div className="nav-indicator" />
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom nav */}
        <div style={{ padding: '8px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '8px 4px 6px' }}>
              System
            </div>
          )}
          {BOTTOM_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className="nav-link" style={{ marginBottom: 2, fontFamily: 'inherit' }} title={collapsed ? item.label : undefined}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}

          {/* User row at very bottom */}
          <div style={{ marginTop: 8, padding: '10px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 12, flexShrink: 0,
            }}>S</div>
            {!collapsed && (
              <>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Super Admin</div>
                </div>
                <button onClick={logout} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#A5B4FC', fontSize: 12, cursor: 'pointer', padding: '8px 10px' }}>Sign Out</button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{
        marginLeft: sideW, flex: 1, minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Topbar */}
        <header style={{
          height: 64, background: 'white', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>🔍</span>
              <input
                placeholder="Search users, shops, transactions..."
                style={{
                  border: '1.5px solid #E2E8F0', borderRadius: 10,
                  padding: '8px 16px 8px 36px', fontSize: 14, width: 320,
                  outline: 'none', color: '#334155', background: '#F8FAFC',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = 'white'; }}
                onBlur={e  => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* System status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#F0FDF4', borderRadius: 20, border: '1px solid #BBF7D0' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
              <span style={{ color: '#065F46', fontSize: 12, fontWeight: 600 }}>All systems operational</span>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                style={{
                  width: 40, height: 40, borderRadius: 10, background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, position: 'relative', fontFamily: 'inherit',
                }}>
                🔔
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#EF4444', border: '2px solid white' }} />
              </button>
              {notifOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 48, width: 320,
                  background: 'white', border: '1px solid #E2E8F0',
                  borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  zIndex: 100, overflow: 'hidden',
                }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Notifications</span>
                    <span style={{ fontSize: 12, color: '#6366F1', cursor: 'pointer', fontWeight: 600 }}>Mark all read</span>
                  </div>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className="notif-row">
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 6px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 12, cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>S</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Suraj Kumar</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: '24px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
