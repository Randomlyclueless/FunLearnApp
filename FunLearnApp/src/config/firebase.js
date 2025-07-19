import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBGcaI4XfnXSub3HsgYmLV05psFQcOE3kY",
  authDomain: "funlearn-18878.firebaseapp.com",
  projectId: "funlearn-18878",
  storageBucket: "funlearn-18878.appspot.com",
  messagingSenderId: "910256201380",
  appId: "1:910256201380:web:c8b5b50872105f59bf5031",
  measurementId: "G-5G52FM366W"
};

// For web platform compatibility
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('Running on localhost - using emulator settings');
  // You can add emulator settings here if needed
}

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  app = initializeApp(firebaseConfig, 'FunLearnApp'); // Try with a unique name as fallback
}

// Initialize services with error handling
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// For web testing, you can use this to bypass authentication
// Uncomment for testing only
// export const bypassAuth = async (email) => {
//   return { user: { uid: 'test-user-id', email } };
// };