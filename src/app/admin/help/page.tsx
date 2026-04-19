'use client';
import { useState } from 'react';

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const helpSections = [
    { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
    { id: 'user-management', label: 'User Management', icon: '👥' },
    { id: 'shop-management', label: 'Shop Management', icon: '🏪' },
    { id: 'payments', label: 'Payments & Billing', icon: '💰' },
    { id: 'kyc', label: 'KYC Process', icon: '📋' },
    { id: 'analytics', label: 'Analytics & Reports', icon: '📊' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔧' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
  ];

  const faqs = [
    {
      question: 'How do I add a new shop to the platform?',
      answer: 'Navigate to the Shops section from the sidebar, click "Add New Shop", fill in the required details including shop name, location, and owner information, then submit for approval.'
    },
    {
      question: 'What documents are required for KYC verification?',
      answer: 'Users need to submit: 1) Government-issued ID (Aadhaar/PAN), 2) Address proof, 3) Bank account details, and 4) Shop registration documents if applicable.'
    },
    {
      question: 'How are payments processed on the platform?',
      answer: 'Payments are processed through UPI and bank transfers. The platform charges a 2.5% fee on each transaction. Funds are settled to shop owners within 1-2 business days.'
    },
    {
      question: 'What should I do if I suspect fraudulent activity?',
      answer: 'Go to the Fraud Detection section, review the flagged transactions, and use the investigation tools. You can block suspicious accounts and initiate refunds if necessary.'
    },
    {
      question: 'How do I generate reports?',
      answer: 'Visit the Analytics section to view real-time dashboards. You can export reports in PDF or CSV format for custom date ranges and metrics.'
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", color: '#0F172A' }}>
      <style>{`
        .act-btn { padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; }
        .act-btn:hover { transform: translateY(-1px); }
        .help-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #E2E8F0; margin-bottom: 24px; }
        .search-input { width: 100%; padding: 12px 16px; border: 1.5px solid #E2E8F0; border-radius: 12px; font-size: 14px; font-family: inherit; margin-bottom: 20px; }
        .search-input:focus { outline: none; border-color: #6366F1; }
        .tab-btn { padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; margin-right: 8px; margin-bottom: 8px; }
        .tab-btn.active { background: '#6366F1'; color: white; }
        .tab-btn:not(.active) { background: '#F1F5F9'; color: '#64748B'; }
        .faq-item { border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 12px; overflow: hidden; }
        .faq-question { padding: 16px 20px; background: white; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
        .faq-answer { padding: 0 20px 16px; background: '#F8FAFC'; color: '#64748B'; line-height: 1.6; }
        .step-card { background: '#F8FAFC'; border-radius: 12px; padding: 20px; margin-bottom: 16px; border-left: 4px solid #6366F1; }
        .step-number { background: '#6366F1'; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 12px; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Help Center</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>Documentation and support resources for BAPS admin panel</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="act-btn" style={{ background: '#F1F5F9', color: '#475569', border: '1.5px solid #E2E8F0' }}>📞 Contact Support</button>
          <button className="act-btn" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>📖 View Full Docs</button>
        </div>
      </div>

      {/* Search */}
      <div className="help-card">
        <input
          type="text"
          className="search-input"
          placeholder="Search help articles, FAQs, and documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 24, borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
        {helpSections.map(section => (
          <button
            key={section.id}
            className={`tab-btn ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span style={{ marginRight: 8 }}>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeSection === 'getting-started' && (
        <div>
          <div className="help-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Welcome to BAPS Admin Panel</h3>
            <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>
              The BAPS (Businesses Accepting Payments Securely) admin panel is designed to help you manage offline shopping businesses,
              process payments, verify identities, and monitor platform activity. This guide will help you get started with the key features.
            </p>

            <div className="step-card">
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className="step-number">1</span>
                <div>
                  <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Dashboard Overview</h4>
                  <p style={{ margin: 0, color: '#64748B' }}>
                    Start by exploring the dashboard to understand key metrics, recent activity, and pending tasks.
                    The dashboard provides real-time insights into platform performance and user activity.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className="step-number">2</span>
                <div>
                  <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>User Management</h4>
                  <p style={{ margin: 0, color: '#64748B' }}>
                    Learn to manage user accounts, review KYC submissions, and handle user verification processes.
                    This is crucial for maintaining platform security and compliance.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className="step-number">3</span>
                <div>
                  <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Shop Management</h4>
                  <p style={{ margin: 0, color: '#64748B' }}>
                    Understand how to onboard new shops, manage existing businesses, and monitor their performance.
                    This includes reviewing shop applications and managing shop status.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className="step-number">4</span>
                <div>
                  <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Payment Processing</h4>
                  <p style={{ margin: 0, color: '#64748B' }}>
                    Learn about payment flows, withdrawal requests, and bill verification processes.
                    Understanding these workflows is essential for smooth financial operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'user-management' && (
        <div>
          <div className="help-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>User Management Guide</h3>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Viewing User Accounts</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Navigate to the Users section to view all registered users. Use filters to search by status,
                registration date, or location. Click on any user to view detailed profile information.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Managing User Status</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                You can activate, suspend, or deactivate user accounts based on their activity and compliance status.
                Suspended users cannot access the platform until their status is restored.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>KYC Verification Process</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Review submitted KYC documents in the KYC section. Verify document authenticity and completeness
                before approving or rejecting applications. Approved users gain full platform access.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'shop-management' && (
        <div>
          <div className="help-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Shop Management Guide</h3>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Adding New Shops</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Use the "Add New Shop" button in the Shops section. Collect essential information including
                business details, owner information, and location data for proper verification.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Shop Verification</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Review shop applications thoroughly. Check business registration, owner verification,
                and compliance with platform policies before approving shop onboarding.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Performance Monitoring</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Monitor shop performance through transaction volumes, customer ratings, and compliance metrics.
                Use this data to identify top-performing shops and address any issues.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'payments' && (
        <div>
          <div className="help-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Payment Processing Guide</h3>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Understanding Payment Flow</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Payments are processed through UPI and bank transfers. The platform deducts a 2.5% fee from each transaction.
                Funds are held in escrow until services are completed satisfactorily.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Withdrawal Requests</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Review withdrawal requests in the Withdrawals section. Verify account details and available balance
                before approving payouts. Processing typically takes 1-2 business days.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Bill Verification</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                All bills must be verified before payment release. Review bill images, amounts, and service completion
                status to ensure legitimate transactions.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'kyc' && (
        <div>
          <div className="help-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>KYC Verification Process</h3>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Required Documents</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Users must submit: Government ID (Aadhaar/PAN), address proof, bank account details,
                and business registration documents for shop owners.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Verification Steps</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                1. Review submitted documents for completeness. 2. Verify document authenticity through
                visual inspection and cross-referencing. 3. Check for any red flags or inconsistencies.
                4. Approve or reject with detailed feedback.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Rejection Handling</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                When rejecting KYC, provide clear reasons and instructions for resubmission.
                Users can appeal rejections with additional documentation.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'analytics' && (
        <div>
          <div className="help-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Analytics & Reporting</h3>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Dashboard Metrics</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                The Analytics dashboard shows real-time metrics including transaction volume, user growth,
                revenue trends, and geographic distribution of activity.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Custom Reports</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Generate custom reports by selecting date ranges, metrics, and filters.
                Export reports in PDF or CSV format for external analysis.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Performance Insights</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Use analytics to identify trends, top-performing shops, peak usage times,
                and areas for platform improvement.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'troubleshooting' && (
        <div>
          <div className="help-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Common Issues & Solutions</h3>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Payment Failures</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Check UPI ID validity, ensure sufficient balance, and verify bank account details.
                Contact payment gateway support for technical issues.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Document Upload Issues</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Ensure files are under 5MB, in supported formats (PDF, JPG, PNG), and contain clear, readable text.
                Check internet connection and try again.
              </p>
            </div>

            <div className="step-card">
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>Account Access Problems</h4>
              <p style={{ margin: 0, color: '#64748B' }}>
                Verify email and password. Check if account is suspended. Reset password if needed.
                Contact support if issues persist.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'faq' && (
        <div>
          <div className="help-card">
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Frequently Asked Questions</h3>

            {filteredFaqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question">
                  <span>{faq.question}</span>
                  <span style={{ fontSize: 18, color: '#64748B' }}>▼</span>
                </div>
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <p style={{ textAlign: 'center', color: '#64748B', padding: 40 }}>
                No FAQs match your search. Try different keywords or browse other help sections.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}