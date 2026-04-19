'use client';
import { useState } from 'react';

export default function FraudPage() {
  const [filter, setFilter] = useState('active');

  const fraudAlerts = [
    { id: 1, type: 'Multiple transactions in short time', user: 'Deepak Singh', shop: 'Quick Electronics', amount: 3200, risk: 'high', status: 'active', detected: '1h ago' },
    { id: 2, type: 'Unusual amount pattern', user: 'Priya Sharma', shop: 'FreshMart Grocery', amount: 850, risk: 'medium', status: 'investigating', detected: '2h ago' },
    { id: 3, type: 'Same device multiple users', user: 'Multiple Users', shop: 'Various', amount: 0, risk: 'high', status: 'resolved', detected: '1d ago' },
    { id: 4, type: 'Bill image manipulation', user: 'Suresh Kumar', shop: 'MediCare Pharmacy', amount: 450, risk: 'high', status: 'active', detected: '3h ago' },
    { id: 5, type: 'Location mismatch', user: 'Rahul Verma', shop: 'Spice Garden Restaurant', amount: 1200, risk: 'medium', status: 'investigating', detected: '4h ago' },
  ];

  const filteredAlerts = filter === 'all' ? fraudAlerts : fraudAlerts.filter(a => a.status === filter);

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
        .status-active { background: #FEE2E2; color: #991B1B; }
        .status-investigating { background: #FEF9C3; color: #92400E; }
        .status-resolved { background: #DCFCE7; color: #166534; }
        .risk-badge { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
        .risk-low { background: #DCFCE7; color: #166534; }
        .risk-medium { background: #FEF9C3; color: #92400E; }
        .risk-high { background: #FEE2E2; color: #991B1B; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Fraud Detection</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Monitor and investigate suspicious activities</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="act-btn" style={{ background: '#F1F5F9', color: '#475569', border: '1.5px solid #E2E8F0' }}>📊 Generate Report</button>
          <button className="act-btn" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>🔧 Configure Rules</button>
        </div>
      </div>

      {/* Alert Banner */}
      <div style={{ background: 'linear-gradient(135deg,#FEE2E2,#FEF9C3)', border: '1px solid #FCD34D', borderRadius: 12, padding: '12px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>🚨</span>
        <span style={{ color: '#991B1B', fontSize: 14, fontWeight: 500 }}>
          <strong>High Priority:</strong> 2 active fraud alerts require immediate attention
        </span>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚨</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#991B1B' }}>{fraudAlerts.filter(a => a.status === 'active').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Active Alerts</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔍</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#92400E' }}>{fraudAlerts.filter(a => a.status === 'investigating').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Investigating</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#166534' }}>{fraudAlerts.filter(a => a.status === 'resolved').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Resolved</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚠️</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#991B1B' }}>{fraudAlerts.filter(a => a.risk === 'high').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>High Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {['all', 'active', 'investigating', 'resolved'].map(status => (
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
            {status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? fraudAlerts.length : fraudAlerts.filter(a => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Fraud Alerts Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Fraud Detection Alerts ({filteredAlerts.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Alert Type</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>User</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Shop</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Amount</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Risk Level</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Detected</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="trow">
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 500 }}>{alert.type}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B' }}>{alert.user}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B' }}>{alert.shop}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: alert.amount > 0 ? '#059669' : '#64748B' }}>
                    {alert.amount > 0 ? `₹${alert.amount}` : 'N/A'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`risk-badge risk-${alert.risk}`}>
                      {alert.risk.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`status-badge status-${alert.status}`}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B' }}>{alert.detected}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button className="qbtn" style={{ background: '#E0F2FE', color: '#0369A1' }}>👁️ Details</button>
                      {alert.status === 'active' && (
                        <>
                          <button className="qbtn" style={{ background: '#FEF9C3', color: '#92400E' }}>🔍 Investigate</button>
                          <button className="qbtn" style={{ background: '#DCFCE7', color: '#166534' }}>✅ Resolve</button>
                        </>
                      )}
                      {alert.status === 'investigating' && (
                        <button className="qbtn" style={{ background: '#DCFCE7', color: '#166534' }}>✅ Resolve</button>
                      )}
                      {alert.status === 'resolved' && (
                        <button className="qbtn" style={{ background: '#DCFCE7', color: '#166534' }}>✅ Resolved</button>
                      )}
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