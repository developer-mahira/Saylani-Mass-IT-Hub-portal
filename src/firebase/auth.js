import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config";
import { createUserDoc, getUserDoc } from "./firestore";

const AUTH_CACHE_KEY = "smit-hub-auth-cache";

const normalizeRole = (role) => {
  const safeRole = typeof role === "string" ? role.trim().toLowerCase() : "";
  return safeRole === "admin" ? "admin" : "student";
};

const saveAuthCache = (profile) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(profile));
};

const clearAuthCache = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(AUTH_CACHE_KEY);
};

export const signupUser = async ({ name, email, password, role, rollNumber, campus, phone }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const normalizedRole = normalizeRole(role);

    await createUserDoc(user.uid, {
      name,
      email,
      role: normalizedRole,
      rollNumber: rollNumber || "",
      campus: campus || "",
      phone: phone || "",
      profilePhoto: "",
      isActive: true,
    });

    clearAuthCache();
    await signOut(auth);

    return { success: true, user };
  } catch (error) {
    console.log("Firebase error code:", error.code);
    console.log("Firebase error message:", error.message);
    return { success: false, error: getAuthError(error.code) };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getUserDoc(userCredential.user.uid);

    if (!userDoc) {
      await signOut(auth);
      clearAuthCache();
      return { success: false, error: "User profile not found. Please sign up first." };
    }

    const profile = {
      id: userCredential.user.uid,
      ...userDoc,
      role: normalizeRole(userDoc.role),
    };

    saveAuthCache(profile);

    return {
      success: true,
      user: userCredential.user,
      role: profile.role,
      profile,
    };
  } catch (error) {
    console.error("Login error:", error);

    if (error?.code?.startsWith("auth/")) {
      return { success: false, error: getAuthError(error.code) };
    }

    return {
      success: false,
      error: "Unable to load your account right now. Please try again.",
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    clearAuthCache();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

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

  return errors[code] || "Unable to log in right now. Please try again.";
};
