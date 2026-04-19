'use client';
import { useState } from 'react';

export default function TestingPage() {
  const [activeTest, setActiveTest] = useState('api');
  const [testResults, setTestResults] = useState<Array<{
    id: number;
    name: string;
    status: string;
    duration: number;
    timestamp: string;
  }>>([]);

  const testCategories = [
    { id: 'api', label: 'API Tests', icon: '🔗', count: 12 },
    { id: 'payment', label: 'Payment Tests', icon: '💳', count: 8 },
    { id: 'database', label: 'Database Tests', icon: '🗄️', count: 6 },
    { id: 'ui', label: 'UI Tests', icon: '🖥️', count: 4 },
    { id: 'performance', label: 'Performance Tests', icon: '⚡', count: 5 },
  ];

  const runTest = (testName: string) => {
    const newResult = {
      id: Date.now(),
      name: testName,
      status: Math.random() > 0.2 ? 'success' : 'failed',
      duration: Math.floor(Math.random() * 2000) + 500,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTestResults(prev => [newResult, ...prev.slice(0, 9)]);
  };

  const clearResults = () => setTestResults([]);

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", color: '#0F172A' }}>
      <style>{`
        .act-btn { padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; }
        .act-btn:hover { transform: translateY(-1px); }
        .test-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #E2E8F0; margin-bottom: 24px; }
        .test-btn { padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; margin: 4px; }
        .test-btn.primary { background: 'linear-gradient(135deg,#6366F1,#8B5CF6)'; color: white; box-shadow: '0 4px 14px rgba(99,102,241,0.35)'; }
        .test-btn.secondary { background: '#F1F5F9'; color: '#475569'; border: '1.5px solid #E2E8F0'; }
        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-success { background: '#DCFCE7'; color: '#166534'; }
        .status-failed { background: '#FEE2E2'; color: '#991B1B'; }
        .status-running { background: '#FEF3C7'; color: '#92400E'; }
        .tab-btn { padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; margin-right: 8px; }
        .tab-btn.active { background: '#6366F1'; color: white; }
        .tab-btn:not(.active) { background: '#F1F5F9'; color: '#64748B'; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Testing Suite</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Run automated tests and debug platform functionality</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="act-btn" style={{ background: '#F1F5F9', color: '#475569', border: '1.5px solid #E2E8F0' }} onClick={clearResults}>🗑️ Clear Results</button>
          <button className="act-btn" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>🚀 Run All Tests</button>
        </div>
      </div>

      {/* Test Categories */}
      <div style={{ display: 'flex', marginBottom: 24, borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
        {testCategories.map(category => (
          <button
            key={category.id}
            className={`tab-btn ${activeTest === category.id ? 'active' : ''}`}
            onClick={() => setActiveTest(category.id)}
          >
            <span style={{ marginRight: 8 }}>{category.icon}</span>
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Test Content */}
      {activeTest === 'api' && (
        <div>
          <div className="test-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>API Endpoint Tests</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Authentication API</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test login, logout, and token validation</p>
                <button className="test-btn primary" onClick={() => runTest('Authentication API')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>User Management API</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test user CRUD operations</p>
                <button className="test-btn primary" onClick={() => runTest('User Management API')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Shop API</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test shop registration and management</p>
                <button className="test-btn primary" onClick={() => runTest('Shop API')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Payment API</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test payment processing and webhooks</p>
                <button className="test-btn primary" onClick={() => runTest('Payment API')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>KYC API</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test document upload and verification</p>
                <button className="test-btn primary" onClick={() => runTest('KYC API')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Analytics API</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test data aggregation and reporting</p>
                <button className="test-btn primary" onClick={() => runTest('Analytics API')}>▶️ Run Test</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTest === 'payment' && (
        <div>
          <div className="test-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Payment Flow Tests</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>UPI Payment</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test UPI transaction processing</p>
                <button className="test-btn primary" onClick={() => runTest('UPI Payment')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Bank Transfer</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test bank transfer validation</p>
                <button className="test-btn primary" onClick={() => runTest('Bank Transfer')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Refund Processing</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test refund workflows</p>
                <button className="test-btn primary" onClick={() => runTest('Refund Processing')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Webhook Validation</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test payment gateway webhooks</p>
                <button className="test-btn primary" onClick={() => runTest('Webhook Validation')}>▶️ Run Test</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTest === 'database' && (
        <div>
          <div className="test-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Database Integrity Tests</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Connection Test</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Verify database connectivity</p>
                <button className="test-btn primary" onClick={() => runTest('Connection Test')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Data Migration</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test schema migrations</p>
                <button className="test-btn primary" onClick={() => runTest('Data Migration')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Backup Verification</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Verify backup integrity</p>
                <button className="test-btn primary" onClick={() => runTest('Backup Verification')}>▶️ Run Test</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTest === 'ui' && (
        <div>
          <div className="test-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>UI Component Tests</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Responsive Design</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test mobile and desktop layouts</p>
                <button className="test-btn primary" onClick={() => runTest('Responsive Design')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Form Validation</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test input validation and error handling</p>
                <button className="test-btn primary" onClick={() => runTest('Form Validation')}>▶️ Run Test</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTest === 'performance' && (
        <div>
          <div className="test-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Performance Tests</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Load Testing</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Test system under high load</p>
                <button className="test-btn primary" onClick={() => runTest('Load Testing')}>▶️ Run Test</button>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>API Response Time</h4>
                <p style={{ color: '#64748B', fontSize: 14, margin: '0 0 16px' }}>Measure API performance</p>
                <button className="test-btn primary" onClick={() => runTest('API Response Time')}>▶️ Run Test</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="test-card">
          <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Recent Test Results</h3>

          <div style={{ display: 'grid', gap: 12 }}>
            {testResults.map(result => (
              <div key={result.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid #E2E8F0', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>
                    {result.status === 'success' ? '✅' : result.status === 'failed' ? '❌' : '⏳'}
                  </span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{result.name}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{result.timestamp}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{result.duration}ms</span>
                  <span className={`status-badge ${result.status === 'success' ? 'status-success' : result.status === 'failed' ? 'status-failed' : 'status-running'}`}>
                    {result.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}