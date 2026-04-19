import { db, rtdb } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, set, get, child } from 'firebase/database';

export async function testFirebaseConnection() {
  try {
    console.log('Testing Firebase Firestore connection...');

    // Test by trying to add a test document
    const testRef = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: serverTimestamp(),
    });

    console.log('✅ Firestore connected successfully! Test document ID:', testRef.id);
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return false;
  }
}

export async function testRealtimeConnection() {
  try {
    console.log('Testing Firebase Realtime Database connection...');
    const rootRef = ref(rtdb, 'test-connection');
    await set(rootRef, {
      status: 'ok',
      timestamp: Date.now(),
    });

    const snapshot = await get(child(ref(rtdb), 'test-connection'));
    const exists = snapshot.exists();
    console.log('✅ Realtime DB connected successfully!', { exists, data: snapshot.val() });
    return exists;
  } catch (error) {
    console.error('❌ Realtime DB connection failed:', error);
    return false;
  }
}

export async function addSampleData() {
  try {
    console.log('Adding sample data...');

    // Add sample user
    await addDoc(collection(db, 'users'), {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      coinBalance: 150,
      currentStreak: 5,
      totalEarned: 500,
      totalSpent: 350,
      referralCount: 3,
      isOnline: true,
      isActive: true,
      role: 'user',
      hasSpunWheel: false,
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    });

    // Add sample retailer
    await addDoc(collection(db, 'retailers'), {
      ownerName: 'Rajesh Kumar',
      storeName: 'Rajesh General Store',
      firmName: 'RK Enterprises',
      email: 'rajesh@store.com',
      phone: '+91 8765432109',
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      category: 'General Store',
      isVerified: true,
      isOnline: true,
      isActive: true,
      totalOrders: 45,
      totalRevenue: 25000,
      totalProducts: 120,
      rating: 4.2,
      storeDetailsComplete: true,
      gstNo: 'GST123456789',
      panNo: 'PAN1234567',
      aadhaarNo: '123456789012',
      gstBillUrl: '',
      panCardUrl: '',
      aadhaarUrl: '',
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    });

    // Add sample transaction
    await addDoc(collection(db, 'transactions'), {
      uid: 'sample-user-id',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      title: 'Cashback Earned',
      subtitle: 'From Rajesh General Store',
      amount: 25,
      type: 'earned',
      createdAt: serverTimestamp(),
    });

    console.log('✅ Sample data added successfully!');
  } catch (error) {
    console.error('❌ Failed to add sample data:', error);
  }
}