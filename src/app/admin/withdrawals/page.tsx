'use client';
import { useState } from 'react';

export default function WithdrawalsPage() {
  const [filter, setFilter] = useState('all');

  const withdrawals = [
    { id: 1, user: 'Kavya Reddy', amount: 1200, upi: 'kavya@okicici', status: 'pending', risk: 'low', time: '2h ago' },
    { id: 2, user: 'Mohan Das', amount: 850, upi: 'mohan@ybl', status: 'approved', risk: 'medium', time: '4h ago' },
    { id: 3, user: 'Ritu Agarwal', amount: 2500, upi: 'ritu@okhdfc', status: 'processing', risk: 'low', time: '6h ago' },
    { id: 4, user: 'Arjun Patel', amount: 500, upi: 'arjun@paytm', status: 'rejected', risk: 'high', time: '1d ago' },
    { id: 5, user: 'Sneha Gupta', amount: 1800, upi: 'sneha@okaxis', status: 'pending', risk: 'low', time: '8h ago' },
  ];

  const filteredWithdrawals = filter === 'all' ? withdrawals : withdrawals.filter(w => w.status === filter);

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
        .status-pending { background: #FEF9C3; color: #92400E; }
        .status-approved { background: #DCFCE7; color: #166534; }
        .status-processing { background: #E0F2FE; color: #0369A1; }
        .status-rejected { background: #FEE2E2; color: #991B1B; }
        .risk-badge { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
        .risk-low { background: #DCFCE7; color: #166534; }
        .risk-medium { background: #FEF9C3; color: #92400E; }
        .risk-high { background: #FEE2E2; color: #991B1B; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Withdrawal Requests</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Manage user withdrawal requests and payouts</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="act-btn" style={{ background: '#F1F5F9', color: '#475569', border: '1.5px solid #E2E8F0' }}>📊 Export Report</button>
          <button className="act-btn" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>💰 Process Payments</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⏳</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#92400E' }}>{withdrawals.filter(w => w.status === 'pending').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Pending</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔄</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0369A1' }}>{withdrawals.filter(w => w.status === 'processing').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Processing</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#166534' }}>{withdrawals.filter(w => w.status === 'approved').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Approved</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>❌</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#991B1B' }}>{withdrawals.filter(w => w.status === 'rejected').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {['all', 'pending', 'processing', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className="act-btn"
            style={{
              background: filter === status ? '#6366F1' : '#F1F5F9',
              color: filter === status ? 'white' : '#64748B',
              border: filter === status ? 'none' : '1.5px solid #E2E8F0'
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? withdrawals.length : withdrawals.filter(w => w.status === status).length})
          </button>
        ))}
      </div>

      {/* Withdrawals Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Withdrawal Requests ({filteredWithdrawals.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>User</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Amount</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>UPI ID</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Risk</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Time</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="trow">
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 500 }}>{withdrawal.user}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#059669' }}>₹{withdrawal.amount}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B', fontFamily: 'monospace' }}>{withdrawal.upi}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`status-badge status-${withdrawal.status}`}>
                      {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`risk-badge risk-${withdrawal.risk}`}>
                      {withdrawal.risk.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B' }}>{withdrawal.time}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      {withdrawal.status === 'pending' && (
                        <>
                          <button className="qbtn" style={{ background: '#DCFCE7', color: '#166534' }}>✅ Approve</button>
                          <button className="qbtn" style={{ background: '#FEE2E2', color: '#991B1B' }}>❌ Reject</button>
                        </>
                      )}
                      {withdrawal.status === 'processing' && (
                        <button className="qbtn" style={{ background: '#E0F2FE', color: '#0369A1' }}>🔄 Processing</button>
                      )}
                      {withdrawal.status === 'approved' && (
                        <button className="qbtn" style={{ background: '#DCFCE7', color: '#166534' }}>✅ Completed</button>
                      )}
                      {withdrawal.status === 'rejected' && (
                        <button className="qbtn" style={{ background: '#FEE2E2', color: '#991B1B' }}>❌ Rejected</button>
                      )}
                      <button className="qbtn" style={{ background: '#F1F5F9', color: '#475569' }}>👁️ Details</button>
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