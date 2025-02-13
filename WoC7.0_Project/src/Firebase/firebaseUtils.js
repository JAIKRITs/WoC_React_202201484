import { db } from '../firebase'; // Ensure you import the Firestore instance
import { collection, doc, setDoc } from 'firebase/firestore';

export const createUserFilesCollection = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId); // Corrected path
      await setDoc(userDocRef, { files: [] }); // Initialize with an empty files array
      console.log('User file collection created');
    } catch (error) {
      console.error('Error creating user files collection:', error);
      throw error;
    }
};