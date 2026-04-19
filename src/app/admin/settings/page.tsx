'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'billing', label: 'Billing', icon: '💳' },
  ];

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", color: '#0F172A' }}>
      <style>{`
        .act-btn { padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; }
        .act-btn:hover { transform: translateY(-1px); }
        .setting-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #E2E8F0; margin-bottom: 24px; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 14px; font-weight: 600; color: '#374151'; margin-bottom: 8px; }
        .form-input { width: 100%; padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 14px; font-family: inherit; }
        .form-input:focus { outline: none; border-color: #6366F1; }
        .toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #ccc; transition: 0.3s; border-radius: 24px; }
        .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; transition: 0.3s; border-radius: 50%; }
        .toggle input:checked + .toggle-slider { background: #6366F1; }
        .toggle input:checked + .toggle-slider:before { transform: translateX(20px); }
        .tab-btn { padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; margin-right: 8px; }
        .tab-btn.active { background: #6366F1; color: white; }
        .tab-btn:not(.active) { background: #F1F5F9; color: #64748B; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Settings</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Configure your admin preferences and system settings</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="act-btn" style={{ background: '#F1F5F9', color: '#475569', border: '1.5px solid #E2E8F0' }}>🔄 Reset to Defaults</button>
          <button className="act-btn" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>💾 Save Changes</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: 24, borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ marginRight: 8 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div>
          <div className="setting-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>General Settings</h3>

            <div className="form-group">
              <label className="form-label">Platform Name</label>
              <input type="text" className="form-input" defaultValue="BAPS Offline Shopping" />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input type="email" className="form-input" defaultValue="admin@bapsoffline.com" />
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select className="form-input" style={{ background: 'white' }}>
                <option>Asia/Kolkata (IST)</option>
                <option>UTC</option>
                <option>America/New_York</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Default Currency</label>
              <select className="form-input" style={{ background: 'white' }}>
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>

          <div className="setting-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Display Preferences</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Dark Mode</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Enable dark theme for the admin panel</div>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Compact View</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Show more data in tables and lists</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Auto-refresh Dashboard</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Automatically refresh dashboard data every 5 minutes</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div>
          <div className="setting-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Security Settings</h3>

            <div className="form-group">
              <label className="form-label">Session Timeout (minutes)</label>
              <input type="number" className="form-input" defaultValue="60" />
            </div>

            <div className="form-group">
              <label className="form-label">Password Policy</label>
              <select className="form-input" style={{ background: 'white' }}>
                <option>Strong (8+ chars, mixed case, numbers, symbols)</option>
                <option>Medium (8+ chars, mixed case)</option>
                <option>Basic (6+ chars)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Two-Factor Authentication</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Require 2FA for all admin accounts</div>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>IP Whitelisting</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Restrict access to specific IP addresses</div>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>API Security</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>API Rate Limiting</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Limit API requests per minute</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">API Key Rotation</label>
              <select className="form-input" style={{ background: 'white' }}>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div>
          <div className="setting-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Notification Preferences</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Email Notifications</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Receive email alerts for important events</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>SMS Alerts</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Receive SMS for critical system alerts</div>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Push Notifications</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Browser push notifications for real-time alerts</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Alert Types</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>New User Registrations</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Alert when new users join the platform</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Fraud Alerts</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>High-priority fraud detection alerts</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>System Maintenance</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Scheduled maintenance notifications</div>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div>
          <div className="setting-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Payment Integrations</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>UPI Integration</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Enable UPI payment processing</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Bank Transfer</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Support direct bank transfers</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Third-party Services</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>SMS Gateway</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Send SMS notifications to users</div>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Email Service</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Send transactional emails</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div>
          <div className="setting-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Billing Configuration</h3>

            <div className="form-group">
              <label className="form-label">Platform Fee (%)</label>
              <input type="number" className="form-input" defaultValue="2.5" step="0.1" />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Transaction Amount</label>
              <input type="number" className="form-input" defaultValue="10" />
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Transaction Amount</label>
              <input type="number" className="form-input" defaultValue="50000" />
            </div>
          </div>

          <div className="setting-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Payout Settings</h3>

            <div className="form-group">
              <label className="form-label">Minimum Payout Amount</label>
              <input type="number" className="form-input" defaultValue="100" />
            </div>

            <div className="form-group">
              <label className="form-label">Payout Processing Time</label>
              <select className="form-input" style={{ background: 'white' }}>
                <option>Instant (same day)</option>
                <option>1-2 business days</option>
                <option>3-5 business days</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}