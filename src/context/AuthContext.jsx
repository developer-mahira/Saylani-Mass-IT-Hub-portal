import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

// Create context with default values
const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  userRole: null,
  loading: true,
  initialized: false,
  isStudent: false,
  isAdmin: false,
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth safety timeout triggered - forcing loading to false");
        setLoading(false);
        setInitialized(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  // Create default user document if it doesn't exist
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

  // Fetch user role from Firestore
  const fetchUserRole = useCallback(async (uid) => {
    try {
      console.log("Fetching user doc for:", uid);
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const profileData = userDocSnap.data();
        console.log("User doc found:", profileData);
        return {
          profile: { id: userDocSnap.id, ...profileData },
          role: profileData.role || "student"
        };
      } else {
        console.log("User doc does not exist - this might be causing the issue");
        // Don't create automatically - just return null role
        return { profile: null, role: null };
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      return { profile: null, role: null };
    }
  }, []);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      
      if (user) {
        // User is authenticated, fetch their role from Firestore
        const { profile, role } = await fetchUserRole(user.uid);
        setCurrentUser(user);
        setUserProfile(profile);
        setUserRole(role);
        console.log("User profile set:", profile);
        console.log("User role set:", role);
      } else {
        // No user authenticated
        setCurrentUser(null);
        setUserProfile(null);
        setUserRole(null);
      }
      
      // ALWAYS set loading to false - this is critical!
      console.log("Setting loading to false");
      setLoading(false);
      setInitialized(true);
    });

    return () => {
      console.log("Cleaning up auth listener");
      unsubscribe();
    };
  }, [fetchUserRole]);

  const value = {
    currentUser,
    userProfile,
    userRole,
    loading,
    initialized,
    isStudent: userRole === "student",
    isAdmin: userRole === "admin",
  };

  console.log("AuthContext render - loading:", loading, "initialized:", initialized);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

