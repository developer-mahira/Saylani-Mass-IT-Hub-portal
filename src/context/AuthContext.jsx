import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AUTH_CACHE_KEY = "smit-hub-auth-cache";

const readCachedProfile = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(AUTH_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCachedProfile = (profile) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(profile));
};

const clearCachedProfile = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(AUTH_CACHE_KEY);
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(() => readCachedProfile());
  const [userRole, setUserRole] = useState(() => readCachedProfile()?.role || null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const normalizeRole = useCallback((role) => {
    const safeRole = typeof role === "string" ? role.trim().toLowerCase() : "";
    return safeRole === "admin" ? "admin" : "student";
  }, []);

  const normalizeOptionalRole = useCallback((role) => {
    if (typeof role !== "string") return null;
    const safeRole = role.trim().toLowerCase();
    if (safeRole === "admin") return "admin";
    if (safeRole === "student") return "student";
    return null;
  }, []);

  const createDefaultUserDoc = useCallback(async (uid, email) => {
    try {
      const defaultData = {
        name: "User",
        email: email || "",
        role: "student",
        createdAt: serverTimestamp(),
        isActive: true,
      };

      await setDoc(doc(db, "users", uid), defaultData);
      return defaultData;
    } catch (error) {
      console.error("Error creating default user doc:", error);
      return null;
    }
  }, []);

  const fetchUserRole = useCallback(
    async (uid, email = "") => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const profileData = userDocSnap.data();
          const normalizedRole = normalizeRole(profileData.role);
          return {
            profile: { id: userDocSnap.id, ...profileData, role: normalizedRole },
            role: normalizedRole,
          };
        }

        const defaultProfile = await createDefaultUserDoc(uid, email);
        if (defaultProfile) {
          return {
            profile: { id: uid, ...defaultProfile, role: "student" },
            role: "student",
          };
        }

        return { profile: null, role: null };
      } catch (error) {
        console.error("Error fetching user role:", error);
        return { profile: null, role: null };
      }
    },
    [createDefaultUserDoc, normalizeRole]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        clearCachedProfile();
        setCurrentUser(null);
        setUserProfile(null);
        setUserRole(null);
        setLoading(false);
        setInitialized(true);
        return;
      }

      setCurrentUser(user);

      const cachedProfile = readCachedProfile();
      if (cachedProfile?.id === user.uid) {
        setUserProfile(cachedProfile);
        setUserRole(normalizeOptionalRole(cachedProfile.role));
        setLoading(false);
        setInitialized(true);
      }

      const { profile, role } = await fetchUserRole(user.uid, user.email);

      if (profile) {
        writeCachedProfile(profile);
      }

      setUserProfile(profile);
      setUserRole(role);
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [fetchUserRole, normalizeOptionalRole]);

  const value = {
    currentUser,
    userProfile,
    userRole,
    loading,
    initialized,
    isStudent: userRole === "student",
    isAdmin: userRole === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
