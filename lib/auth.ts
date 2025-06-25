import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";

// Create a user with email and password
export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with email and password
export const doSignInWithEmailAndPassword = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign in with Google
export const doSignInWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // TODO: Add user to Firestore if needed
};

// Sign out
export const doSignOut = (): Promise<void> => {
  return auth.signOut();
};

// Send password reset email
export const doPasswordReset = (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

// Change current user's password
export const doPasswordChange = (password: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    return Promise.reject(new Error("No authenticated user found."));
  }
  return updatePassword(user, password);
};

// Send email verification
export const doSendEmailVerification = (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    return Promise.reject(new Error("No authenticated user found."));
  }
  return sendEmailVerification(user, {
    url: `${window.location.origin}/home`,
  });
};
