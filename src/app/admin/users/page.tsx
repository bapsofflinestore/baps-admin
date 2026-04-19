'use client';
import { useState } from 'react';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const users = [
    { id: 1, name: 'Priya Sharma', email: 'priya@gmail.com', phone: '+91 9876543210', status: 'active', joined: '2024-01-15', transactions: 45, balance: 2500 },
    { id: 2, name: 'Rahul Verma', email: 'rahul.verma@email.com', phone: '+91 8765432109', status: 'active', joined: '2024-02-20', transactions: 32, balance: 1800 },
    { id: 3, name: 'Anita Patel', email: 'anita.patel@outlook.com', phone: '+91 7654321098', status: 'suspended', joined: '2024-01-10', transactions: 28, balance: 0 },
    { id: 4, name: 'Suresh Kumar', email: 'suresh.kumar@gmail.com', phone: '+91 6543210987', status: 'active', joined: '2024-03-05', transactions: 67, balance: 4200 },
    { id: 5, name: 'Meena Joshi', email: 'meena.joshi@email.com', phone: '+91 5432109876', status: 'active', joined: '2024-02-28', transactions: 19, balance: 950 },
  ];

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.status === filter);

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
        .status-suspended { background: #FEE2E2; color: #991B1B; }
        .status-inactive { background: #F1F5F9; color: #64748B; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Users</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Manage user accounts and profiles</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="act-btn" style={{ background: '#F1F5F9', color: '#475569', border: '1.5px solid #E2E8F0' }}>📊 Export Users</button>
          <button className="act-btn" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>➕ Add User</button>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>🔍</span>
          <input
            placeholder="Search users by name, email, or phone..."
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
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '8px 12px', fontSize: 14, background: 'white' }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👥</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#7C3AED' }}>{users.length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Total Users</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#166534' }}>{users.filter(u => u.status === 'active').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Active</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💰</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#92400E' }}>
                ₹{users.reduce((sum, u) => sum + u.balance, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Total Balance</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📈</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0369A1' }}>
                {Math.round(users.reduce((sum, u) => sum + u.transactions, 0) / users.length)}
              </div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Avg Transactions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>User Management ({filteredUsers.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Email</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Phone</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Transactions</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Balance</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Joined</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="trow">
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 500 }}>{user.name}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B' }}>{user.email}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B', fontFamily: 'monospace' }}>{user.phone}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`status-badge status-${user.status}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#059669' }}>{user.transactions}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#059669' }}>₹{user.balance}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B' }}>{user.joined}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button className="qbtn" style={{ background: '#E0F2FE', color: '#0369A1' }}>👁️ View</button>
                      <button className="qbtn" style={{ background: '#DCFCE7', color: '#166534' }}>✏️ Edit</button>
                      <button className="qbtn" style={{
                        background: user.status === 'active' ? '#FEF9C3' : '#DCFCE7',
                        color: user.status === 'active' ? '#92400E' : '#166534'
                      }}>
                        {user.status === 'active' ? '🚫 Suspend' : '✅ Activate'}
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