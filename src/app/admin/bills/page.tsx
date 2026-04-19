'use client';
import { useState } from 'react';

export default function BillsPage() {
  const [filter, setFilter] = useState('pending');

  const bills = [
    { id: 1, user: 'Priya Sharma', shop: 'FreshMart Grocery', amount: 850, status: 'pending', submitted: '2h ago', image: 'bill1.jpg' },
    { id: 2, user: 'Rahul Verma', shop: 'Spice Garden Restaurant', amount: 1200, status: 'approved', submitted: '4h ago', image: 'bill2.jpg' },
    { id: 3, user: 'Anita Patel', shop: 'Glamour Salon', amount: 600, status: 'rejected', submitted: '6h ago', image: 'bill3.jpg' },
    { id: 4, user: 'Suresh Kumar', shop: 'MediCare Pharmacy', amount: 450, status: 'flagged', submitted: '8h ago', image: 'bill4.jpg' },
    { id: 5, user: 'Meena Joshi', shop: 'City Bakehouse', amount: 320, status: 'pending', submitted: '10h ago', image: 'bill5.jpg' },
    { id: 6, user: 'Deepak Singh', shop: 'Quick Electronics', amount: 3200, status: 'under_review', submitted: '12h ago', image: 'bill6.jpg' },
  ];

  const filteredBills = filter === 'all' ? bills : bills.filter(b => b.status === filter);

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
        .status-rejected { background: #FEE2E2; color: #991B1B; }
        .status-flagged { background: #FEE2E2; color: #991B1B; }
        .status-under_review { background: #E0F2FE; color: #0369A1; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Bill Verification</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Review and verify user submitted bills</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="act-btn" style={{ background: '#F1F5F9', color: '#475569', border: '1.5px solid #E2E8F0' }}>📊 Export Report</button>
          <button className="act-btn" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>📋 Bulk Actions</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⏳</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#92400E' }}>{bills.filter(b => b.status === 'pending').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Pending</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔍</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0369A1' }}>{bills.filter(b => b.status === 'under_review').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Under Review</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#166534' }}>{bills.filter(b => b.status === 'approved').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Approved</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚩</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#991B1B' }}>{bills.filter(b => b.status === 'flagged').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Flagged</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>❌</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#991B1B' }}>{bills.filter(b => b.status === 'rejected').length}</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {['all', 'pending', 'under_review', 'approved', 'flagged', 'rejected'].map(status => (
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
            {status === 'under_review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? bills.length : bills.filter(b => b.status === status).length})
          </button>
        ))}
      </div>

      {/* Bills Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Bill Verification Queue ({filteredBills.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>User</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Shop</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Amount</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Submitted</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#64748B' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="trow">
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 500 }}>{bill.user}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B' }}>{bill.shop}</td>
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#059669' }}>₹{bill.amount}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`status-badge status-${bill.status}`}>
                      {bill.status === 'under_review' ? 'Under Review' : bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 14, color: '#64748B' }}>{bill.submitted}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button className="qbtn" style={{ background: '#E0F2FE', color: '#0369A1' }}>🖼️ View Bill</button>
                      {bill.status === 'pending' && (
                        <>
                          <button className="qbtn" style={{ background: '#DCFCE7', color: '#166534' }}>✅ Approve</button>
                          <button className="qbtn" style={{ background: '#FEE2E2', color: '#991B1B' }}>❌ Reject</button>
                        </>
                      )}
                      {bill.status === 'under_review' && (
                        <button className="qbtn" style={{ background: '#FEF9C3', color: '#92400E' }}>🔄 Review</button>
                      )}
                      {bill.status === 'approved' && (
                        <button className="qbtn" style={{ background: '#DCFCE7', color: '#166534' }}>✅ Approved</button>
                      )}
                      {bill.status === 'flagged' && (
                        <button className="qbtn" style={{ background: '#FEE2E2', color: '#991B1B' }}>🚩 Flagged</button>
                      )}
                      {bill.status === 'rejected' && (
                        <button className="qbtn" style={{ background: '#FEE2E2', color: '#991B1B' }}>❌ Rejected</button>
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