'use client';
import { useState } from 'react';
import { testFirebaseConnection, testRealtimeConnection, addSampleData } from '@/lib/firebase-test';

export default function FirebaseTestPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    setStatus('Testing Firebase Firestore connection...');

    const connected = await testFirebaseConnection();
    if (connected) {
      setStatus('✅ Firestore connected successfully!');
    } else {
      setStatus('❌ Firestore connection failed. Check console for details.');
    }
    setLoading(false);
  };

  const handleTestRealtimeConnection = async () => {
    setLoading(true);
    setStatus('Testing Firebase Realtime Database connection...');

    const connected = await testRealtimeConnection();
    if (connected) {
      setStatus('✅ Realtime Database connected successfully!');
    } else {
      setStatus('❌ Realtime Database connection failed. Check console for details.');
    }
    setLoading(false);
  };

  const handleAddSampleData = async () => {
    setLoading(true);
    setStatus('Adding sample data...');

    await addSampleData();
    setStatus('✅ Sample data added! Check your dashboard now.');
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Firebase Connection Test</h1>
      <p>Use this page to test your Firebase setup and add sample data.</p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleTestConnection}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test Firebase Firestore'}
        </button>

        <button
          onClick={handleTestRealtimeConnection}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#fbbc05',
            color: '#111',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test Realtime Database'}
        </button>

        <button
          onClick={handleAddSampleData}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#34a853',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Adding...' : 'Add Sample Data'}
        </button>
      </div>

      <div style={{
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '5px',
        minHeight: '30px',
        whiteSpace: 'pre-wrap'
      }}>
        {status}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Next Steps:</h3>
        <ol>
          <li>Click "Test Firebase Connection" to verify setup</li>
          <li>If successful, click "Add Sample Data" to populate your dashboard</li>
          <li>Go back to your dashboard to see the data</li>
          <li>Check the FIREBASE_SETUP.md file for detailed setup instructions</li>
        </ol>
      </div>
    </div>
  );
}