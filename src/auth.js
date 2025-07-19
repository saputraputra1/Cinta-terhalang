import { auth } from './firebase.js';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const users = {
  'user1@game.com': { password: 'putra', username: 'user1' },
  'user2@game.com': { password: 'Bella', username: 'user2' }
};

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logout() {
  await signOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}
