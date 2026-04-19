// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey:            'AIzaSyC9r12ATrJnLc5P0twyjzmjEsnLAFYASIM',
  authDomain:        'baps-offline.firebaseapp.com',
  projectId:         'baps-offline',
  storageBucket:     'baps-offline.firebasestorage.app',
  messagingSenderId: '408999130355',
  appId:             '1:408999130355:web:5e3988ec04267cbaf33386',
  measurementId:     'G-MYVJBYHBTT',
  databaseURL:       'https://baps-offline-default-rtdb.firebaseio.com',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);
export const rtdb    = getDatabase(app);
export default app;