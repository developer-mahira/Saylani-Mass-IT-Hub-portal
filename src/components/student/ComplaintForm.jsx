import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { addComplaint } from "../../firebase/firestore";

const CATEGORIES = [
  "Internet", "Electricity", "Water", "Maintenance", "Cleanliness", 
  "Security", "AC", "Furniture", "Other"
];

const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

export default function ComplaintForm() {
  const { userProfile, currentUser } = useAuth();
  const [form, setForm] = useState({
    category: "",
    priority: "Medium",
    title: "",
    description: "",
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.category) return toast.error("Please select a category");
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.description.trim()) return toast.error("Description is required");

    setLoading(true);
    try {
      await addComplaint({
        userId: currentUser.uid,
        userName: userProfile?.name,
        campus: userProfile?.campus,
        category: form.category,
        priority: form.priority,
        title: form.title.trim(),
        description: form.description.trim(),
        attachmentUrl: "",
      });

      toast.success("Complaint submitted successfully!");
      setForm({ category: "", priority: "Medium", title: "", description: "" });
      setAttachment(null);
    } catch (error) {
      toast.error(error.message || "Failed to submit complaint");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Submit a Complaint</h2>

      <div className="space-y-4">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
          <div className="grid grid-cols-4 gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => setForm({ ...form, priority: p })}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  form.priority === p
                    ? p === "Urgent" || p === "High" 
                      ? "bg-red-500 text-white" 
                      : "bg-green-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Brief description of the issue"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Provide detailed description of the issue..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (optional)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-green-primary file:text-white file:cursor-pointer"
          />
          {attachment && <p className="text-xs text-gray-500 mt-1">{attachment.name}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-green-primary hover:bg-green-dark text-white font-bold transition-all disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </div>
    </motion.div>
  );
}

