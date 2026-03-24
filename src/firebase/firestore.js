import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "./config";

// ─── USERS ───────────────────────────────────────────

export const createUserDoc = async (uid, data) => {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getUserDoc = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Real-time version for admin dashboards
export const getAllUsersRealtime = (callback) => {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const updateUserDoc = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
};

// ─── COMPLAINTS ──────────────────────────────────────

export const addComplaint = async (data) => {
  return await addDoc(collection(db, "complaints"), {
    ...data,
    status: "Submitted",
    adminNote: "",
    assignedTo: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    resolvedAt: null,
    isDeleted: false,
  });
};

export const getUserComplaints = (userId, callback) => {
  const q = query(
    collection(db, "complaints"),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const getAllComplaints = (callback) => {
  const q = query(
    collection(db, "complaints"),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const updateComplaintStatus = async (id, status, adminNote = "") => {
  const updates = {
    status,
    adminNote,
    updatedAt: serverTimestamp(),
  };
  if (status === "Resolved") updates.resolvedAt = serverTimestamp();
  await updateDoc(doc(db, "complaints", id), updates);
};

export const softDeleteComplaint = async (id) => {
  await updateDoc(doc(db, "complaints", id), { isDeleted: true });
};

// ─── LOST & FOUND ─────────────────────────────────────

export const addLostFoundItem = async (data) => {
  return await addDoc(collection(db, "lost_found_items"), {
    ...data,
    status: "Pending",
    matchedWith: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isDeleted: false,
  });
};

export const getUserLostFoundItems = (userId, callback) => {
  const q = query(
    collection(db, "lost_found_items"),
    where("userId", "==", userId),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const getAllLostFoundItems = (callback) => {
  const q = query(
    collection(db, "lost_found_items"),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const updateLostFoundStatus = async (id, status, matchedWith = null) => {
  await updateDoc(doc(db, "lost_found_items", id), {
    status,
    matchedWith,
    updatedAt: serverTimestamp(),
  });
};

// ─── VOLUNTEERS ───────────────────────────────────────

export const addVolunteer = async (data) => {
  return await addDoc(collection(db, "volunteers"), {
    ...data,
    status: "Pending",
    adminNote: "",
    createdAt: serverTimestamp(),
  });
};

export const getUserVolunteers = (userId, callback) => {
  const q = query(
    collection(db, "volunteers"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const getAllVolunteers = (callback) => {
  const q = query(collection(db, "volunteers"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const updateVolunteerStatus = async (id, status, adminNote = "") => {
  await updateDoc(doc(db, "volunteers", id), {
    status,
    adminNote,
    updatedAt: serverTimestamp(),
  });
};

// ─── NOTIFICATIONS ────────────────────────────────────

export const addNotification = async (userId, type, title, message, relatedId = "") => {
  await addDoc(collection(db, "notifications"), {
    userId,
    type,
    title,
    message,
    relatedId,
    isRead: false,
    createdAt: serverTimestamp(),
  });
};

export const getUserNotifications = (userId, callback) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const markNotificationRead = async (id) => {
  await updateDoc(doc(db, "notifications", id), { isRead: true });
};

// ─── ANNOUNCEMENTS ────────────────────────────────────

export const addAnnouncement = async (data) => {
  return await addDoc(collection(db, "announcements"), {
    ...data,
    pinned: false,
    createdAt: serverTimestamp(),
  });
};

export const getAnnouncements = (callback) => {
  const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

