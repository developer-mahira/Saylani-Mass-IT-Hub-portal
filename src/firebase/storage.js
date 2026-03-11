import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

// Upload image with progress callback
export const uploadImage = (file, path, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject("No file provided");

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) return reject("Only JPEG, PNG, WEBP allowed.");
    if (file.size > 5 * 1024 * 1024) return reject("File must be under 5MB.");

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => reject(error.message),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};

export const deleteImage = async (path) => {
  try {
    await deleteObject(ref(storage, path));
  } catch (e) {
    console.warn("Storage delete failed:", e.message);
  }
};

