import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCAMlpyntqRwfDYQQssgfYkcYvCO5lYTvk",
  authDomain: "tenant-1b9f9.firebaseapp.com",
  projectId: "tenant-1b9f9",
  storageBucket: "tenant-1b9f9.firebasestorage.app",
  messagingSenderId: "756536734157",
  appId: "1:756536734157:web:f3baa10d26b9af75561484"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
