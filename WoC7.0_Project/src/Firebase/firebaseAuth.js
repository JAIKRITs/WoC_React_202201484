import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    signInWithRedirect
  } from 'firebase/auth';

import { createUserFilesCollection } from '../Firebase/firebaseUtils';
import { auth } from '../firebase'; // Import the auth instance from firebase.js
  
class FirebaseAuthService {

async signUp({ email, password }) {
  try {
    console.log("Attempting to create user with email:", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created, UID:", userCredential.user.uid);
    await createUserFilesCollection(userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}

// Log in with email and password
async logIn({ email, password }) {
    try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
    } catch (error) {
    throw error;
    }
}

// Log out
async logOut() {
    try {
    await signOut(auth);
    } catch (error) {
    console.log('Error signing out: ', error);
    }
}

// Sign up/login via Google
async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      window.location.href = "/ide"; // Redirect manually instead of closing window
      return user;
    } catch (error) {
      throw error;
    }
}

// Get the current user
getCurrentUser() {
    return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
        resolve(user);
        } else {
        reject('No user is signed in');
        }
    });
    });
}
}

const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;