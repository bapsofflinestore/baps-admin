'use client';
import { useState } from 'react';

export default function ShopsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const shops = [
    { id: 1, name: 'FreshMart Grocery', owner: 'Rajesh Kumar', location: 'Delhi', status: 'active', revenue: '₹45,000' },
    { id: 2, name: 'Spice Garden Restaurant', owner: 'Priya Sharma', location: 'Mumbai', status: 'pending', revenue: '₹32,000' },
    { id: 3, name: 'MediCare Pharmacy', owner: 'Dr. Amit Patel', location: 'Bangalore', status: 'active', revenue: '₹28,000' },
    { id: 4, name: 'City Electronics', owner: 'Vikram Singh', location: 'Chennai', status: 'suspended', revenue: '₹15,000' },
  ];

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", color: '#0F172A' }}>
      <style>{`
        .act-btn { padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; }
        .act-btn:hover { transform: translateY(-1px); }
        .trow { border-top: 1px solid #F1F5F9; transition: background 0.1s; }
        .trow:hover { background: #F8FAFC; }
        .qbtn { border: none; border-radius: 7px; padding: 5px 11px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .qbtn:hover { transform: scale(1.05); }
        .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-active { background: #DCFCE7; color: #166534; }
        .status-pending { background: #FEF9C3; color: #92400E; }
        .status-suspended { background: #FEE2E2; color: #991B1B; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Shops</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Manage all registered shops and their status</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="act-btn" style={{ background: '#F1F5F9', color: '#475569', border: '1.5px solid #E2E8F0' }}>📊 Export Data</button>
          <button className="act-btn" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>＋ Add New Shop</button>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>🔍</span>
          <input
            placeholder="Search shops by name, owner, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: '1.5px solid #E2E8F0', borderRadius: 10,
              padding: '8px 16px 8px 36px', fontSize: 14, width: '100%',
              outline: 'none', color: '#334155', background: '#F8FAFC',
              transition: 'all 0.2s', fontFamily: 'inherit',
            }}
          />
        </div>
        <select style={{ border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '8px 12px', fontSize: 14, background: 'white' }}>
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Shops Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Registered Shops ({shops.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Shop Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Owner</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Location</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Revenue</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} className="trow">
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 500 }}>{shop.name}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B' }}>{shop.owner}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B' }}>{shop.location}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`status-badge status-${shop.status}`}>
                      {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#059669' }}>{shop.revenue}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button className="qbtn" style={{ background: '#E0F2FE', color: '#0369A1' }}>👁️ View</button>
                      <button className="qbtn" style={{ background: '#DCFCE7', color: '#166534' }}>✏️ Edit</button>
                      <button className="qbtn" style={{ background: '#FEF9C3', color: '#92400E' }}>
                        {shop.status === 'active' ? '🚫 Suspend' : '✅ Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}