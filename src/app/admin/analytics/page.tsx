'use client';
import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data for charts
  const revenueData = [
    { date: '2024-01-01', revenue: 45000, transactions: 120, users: 85 },
    { date: '2024-01-02', revenue: 52000, transactions: 145, users: 92 },
    { date: '2024-01-03', revenue: 48000, transactions: 132, users: 88 },
    { date: '2024-01-04', revenue: 61000, transactions: 168, users: 105 },
    { date: '2024-01-05', revenue: 55000, transactions: 152, users: 98 },
    { date: '2024-01-06', revenue: 67000, transactions: 189, users: 112 },
    { date: '2024-01-07', revenue: 72000, transactions: 201, users: 118 },
  ];

  const categoryData = [
    { name: 'Restaurant', value: 35, color: '#6366F1' },
    { name: 'Grocery', value: 28, color: '#10B981' },
    { name: 'Salon', value: 18, color: '#F59E0B' },
    { name: 'Pharmacy', value: 12, color: '#EF4444' },
    { name: 'Others', value: 7, color: '#8B5CF6' },
  ];

  const topShops = [
    { name: 'Spice Garden Restaurant', revenue: 45000, transactions: 89 },
    { name: 'FreshMart Grocery', revenue: 38000, transactions: 76 },
    { name: 'Glamour Salon', revenue: 25000, transactions: 45 },
    { name: 'MediCare Pharmacy', revenue: 22000, transactions: 38 },
    { name: 'City Electronics', revenue: 18000, transactions: 32 },
  ];

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", color: '#0F172A' }}>
      <style>{`
        .act-btn { padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; }
        .act-btn:hover { transform: translateY(-1px); }
        .metric-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #E2E8F0; }
        .chart-container { background: white; border-radius: 16px; padding: 24px; border: 1px solid #E2E8F0; margin-bottom: 24px; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Analytics</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Comprehensive platform insights and performance metrics</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '8px 12px', fontSize: 14, background: 'white' }}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="act-btn" style={{ background: '#F1F5F9', color: '#475569', border: '1.5px solid #E2E8F0' }}>📊 Export Report</button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💰</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#7C3AED' }}>₹3.2L</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Total Revenue</div>
              <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600, marginTop: 2 }}>↑ 12.5% from last period</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📈</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#166534' }}>1,247</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Total Transactions</div>
              <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600, marginTop: 2 }}>↑ 8.3% from last period</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👥</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#92400E' }}>892</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Active Users</div>
              <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600, marginTop: 2 }}>↑ 15.2% from last period</div>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏪</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0369A1' }}>89</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Active Shops</div>
              <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600, marginTop: 2 }}>↑ 5.7% from last period</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="chart-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Revenue Trends</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94A3B8' }}>Daily revenue and transaction volume</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['revenue', 'transactions', 'users'].map(metric => (
              <button key={metric} className="act-btn" style={{
                background: '#6366F1', color: 'white', fontSize: 12, padding: '6px 12px'
              }}>
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0' }} />
            <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Category Distribution */}
        <div className="chart-container">
          <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>Shop Categories</h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Revenue distribution by category</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 16 }}>
            {categoryData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }}></div>
                <span style={{ fontSize: 12, color: '#64748B' }}>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Shops */}
        <div className="chart-container">
          <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>Top Performing Shops</h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#94A3B8' }}>Highest revenue generating shops</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topShops.map((shop, index) => (
              <div key={index} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: '#6366F1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 14, fontWeight: 700
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{shop.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{shop.transactions} transactions</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>₹{shop.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}