import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "./config";
import { createUserDoc, getUserDoc } from "./firestore";

// SIGNUP — works with ANY email format
export const signupUser = async ({ name, email, password, role, rollNumber, campus, phone }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Firestore
    await createUserDoc(user.uid, {
      name,
      email,
      role,          // "student" or "admin"
      rollNumber: rollNumber || "",
      campus: campus || "",
      phone: phone || "",
      profilePhoto: "",
      isActive: true,
    });

    return { success: true, user };
  } catch (error) {
    console.log("Firebase error code:", error.code);
    console.log("Firebase error message:", error.message);
    return { success: false, error: getAuthError(error.code) };
  }
};

// LOGIN — works with ANY valid email, role detected from Firestore
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getUserDoc(userCredential.user.uid);

    if (!userDoc) {
      await signOut(auth);
      return { success: false, error: "User profile not found. Please sign up first." };
    }

    return { success: true, user: userCredential.user, role: userDoc.role };
  } catch (error) {
    console.log("Firebase error code:", error.code);
    console.log("Firebase error message:", error.message);
    return { success: false, error: getAuthError(error.code) };
  }
};

// LOGOUT
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// AUTH STATE LISTENER
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// HUMAN-READABLE ERROR MESSAGES - Firebase v10+ compatible
const getAuthError = (code) => {
  const errors = {
    "auth/invalid-credential": "Incorrect email or password. Please try again.",
    "auth/user-not-found": "No account found with this email. Please sign up.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "This email is already registered. Please login.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
    "auth/too-many-attempts": "Too many attempts. Please wait and try again.",
    "auth/network-request-failed": "No internet. Please check your connection.",
    "auth/user-disabled": "This account has been disabled. Contact support.",
    "auth/operation-not-allowed": "Email login is not enabled. Contact admin.",
    "auth/popup-closed-by-user": "Login window closed. Please try again.",
    "auth/cancelled-popup-request": "Only one popup allowed. Please try again.",
    "auth/expired-action-code": "Action code expired. Please request a new one.",
    "auth/invalid-action-code": "Invalid action code. Please try again.",
    "auth/invalid-phone-number": "Please enter a valid phone number.",
    "auth/quota-exceeded": "SMS quota exceeded. Please try again later.",
  };
  return errors[code] || "Something went wrong. Please try again.";
};

