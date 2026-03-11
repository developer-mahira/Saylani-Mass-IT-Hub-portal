import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { addLostFoundItem } from "../../firebase/firestore";
import { uploadImage } from "../../firebase/storage";

const CATEGORIES = [
  "Electronics", "Documents", "Clothing", "Keys", "Bag", "Wallet", "Phone", "Laptop", "Other"
];

export default function LostFoundForm() {
  const { userProfile, currentUser } = useAuth();
  const [form, setForm] = useState({
    type: "lost",
    title: "",
    description: "",
    category: "",
    location: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (!form.category) return toast.error("Please select a category");
    if (!form.location.trim()) return toast.error("Location is required");

    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image, `lost_found/${currentUser.uid}/${Date.now()}`);
      }

      await addLostFoundItem({
        userId: currentUser.uid,
        userName: userProfile?.name,
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim(),
        imageUrl,
      });

      toast.success(`${form.type === "lost" ? "Lost" : "Found"} item reported successfully!`);
      setForm({ type: "lost", title: "", description: "", category: "", location: "" });
      setImage(null);
    } catch (error) {
      toast.error(error.message || "Failed to submit");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Report {form.type === "lost" ? "Lost" : "Found"} Item
      </h2>

      {/* Type Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setForm({ ...form, type: "lost" })}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            form.type === "lost" ? "bg-red-500 text-white" : "text-gray-600"
          }`}
        >
          🔍 I Lost Something
        </button>
        <button
          onClick={() => setForm({ ...form, type: "found" })}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            form.type === "found" ? "bg-green-500 text-white" : "text-gray-600"
          }`}
        >
          ✅ I Found Something
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={form.type === "lost" ? "What did you lose?" : "What did you find?"}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary bg-white"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Where did you lose/find it?"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Provide detailed description..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-green-primary file:text-white file:cursor-pointer"
          />
          {image && <p className="text-xs text-gray-500 mt-1">{image.name}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-green-primary hover:bg-green-dark text-white font-bold transition-all disabled:opacity-60"
        >
          {loading ? "Submitting..." : `Report ${form.type === "lost" ? "Lost" : "Found"} Item`}
        </button>
      </div>
    </motion.div>
  );
}

