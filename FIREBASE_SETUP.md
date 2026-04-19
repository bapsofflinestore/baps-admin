## Firebase Setup Guide for BAPS Admin Dashboard

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Name it "baps-offline" (or your preferred name)
4. Enable Google Analytics (optional)
5. Choose your Google account

### Step 2: Enable Firestore Database
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development) or "Start in production mode"
4. Select a location for your database (choose the closest region)

### Step 3: Set Firestore Security Rules
Go to "Firestore Database" → "Rules" and update the rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all collections for development
    // In production, restrict these rules based on authentication
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 4: Enable Authentication (Optional but Recommended)
1. Go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" and any other providers you need

### Step 5: Update Firebase Config
In your `src/lib/firebase.ts`, make sure the config matches your project:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### Step 6: Create Required Collections
Your dashboard expects these collections:
- `users` - User data
- `retailers` - Shop/retailer data
- `transactions` - Transaction records
- `orders` - Order data

### Step 7: Add Sample Data (Optional)
You can add sample data manually in Firestore or use the Firebase Admin SDK to seed data.

### Step 8: Test Connection
1. Start your Next.js app: `npm run dev`
2. Check browser console for any Firebase errors
3. If you see "Dashboard loading timed out", check:
   - Firebase config is correct
   - Firestore security rules allow reads
   - Collections exist (even if empty)
   - Network connectivity

### Common Issues:
- **Loading forever**: Check Firestore rules and collection existence
- **Permission denied**: Update Firestore security rules
- **Config errors**: Verify API keys in firebase.ts
- **Network errors**: Check internet connection and Firebase status

### Production Security Rules Example:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Admin can read all data
    match /{document=**} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```