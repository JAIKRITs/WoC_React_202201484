import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import app from '../firebase'; // Make sure this is correctly pointing to your firebase.js

class FirebaseAuthService {
    auth;

    constructor() {
        this.auth = getAuth(app); // Initialize the auth service with your firebase app
    }

    // Sign up with email and password
    async signUp({ email, password }) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error; // You can handle specific errors here if needed
        }
    }

    // Log in with email and password
    async logIn({ email, password }) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    // Log out
    async logOut() {
        try {
            await signOut(this.auth);
        } catch (error) {
            console.log("Error signing out: ", error);
        }
    }

    // Sign up/login via Google
    async signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(this.auth, provider);
            return result.user;
        } catch (error) {
            throw error;
        }
    }

    // Get the current user
    getCurrentUser() {
        return new Promise((resolve, reject) => {
            onAuthStateChanged(this.auth, (user) => {
                if (user) {
                    resolve(user);
                } else {
                    reject("No user is signed in");
                }
            });
        });
    }
}

const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
