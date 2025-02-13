import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firestore functions
export const saveFile = async (userId, fileId, data) => {
  try {
    if (!userId || !fileId || !data) {
      console.error("Missing required parameters for saveFile");
      return false;
    }
    const fileRef = doc(db, 'users', userId, 'files', fileId);
    await setDoc(fileRef, data);
    return true;
  } catch (error) {
    console.error("Error saving file:", error);
    return false;
  }
};

export const getFile = async (userId, fileId) => {
  try {
    if (!userId || !fileId) {
      console.error("Missing required parameters for getFile");
      return null;
    }
    const fileRef = doc(db, 'users', userId, 'files', fileId);
    const docSnap = await getDoc(fileRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting file:", error);
    return null;
  }
};

export const updateFile = async (userId, fileId, data) => {
  try {
    if (!userId || !fileId || !data) {
      console.error("Missing required parameters for updateFile");
      return false;
    }
    const fileRef = doc(db, 'users', userId, 'files', fileId);
    await updateDoc(fileRef, data);
    return true;
  } catch (error) {
    console.error("Error updating file:", error);
    return false;
  }
};

export const deleteFile = async (userId, fileId) => {
  try {
    if (!userId || !fileId) {
      console.error("Missing required parameters for deleteFile");
      return false;
    }
    const fileRef = doc(db, 'users', userId, 'files', fileId);
    await deleteDoc(fileRef);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

export const getFiles = async (userId) => {
  try {
    if (!userId) {
      console.error("Missing userId for getFiles");
      return [];
    }

    // Check if the user is authenticated before querying Firestore
    const auth = getAuth();
    if (!auth.currentUser) {
      console.error("User is not authenticated");
      return [];
    }

    const filesRef = collection(db, 'users', userId, 'files');
    const querySnapshot = await getDocs(filesRef);
    if (!querySnapshot || querySnapshot.empty) return [];
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting files:", error);
    return [];
  }
};


export { auth, db };
export default app;