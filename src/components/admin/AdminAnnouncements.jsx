import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getAnnouncements, addAnnouncement } from "../../firebase/firestore";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "normal"
  });

  useEffect(() => {
    const unsubscribe = getAnnouncements((data) => {
      setAnnouncements(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await addAnnouncement({
        title: formData.title.trim(),
        message: formData.message.trim(),
        priority: formData.priority,
        createdBy: "Admin"
      });
      toast.success("Announcement published successfully");
      setFormData({ title: "", message: "", priority: "normal" });
    } catch (error) {
      toast.error("Failed to publish announcement");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      normal: "bg-blue-100 text-blue-800",
    };
    return colors[priority] || colors.normal;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Announcements</h1>
        <p className="opacity-90">Publish announcements to all students</p>
      </motion.div>

      {/* Create Announcement Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Announcement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter announcement title"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter your message"
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032]"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#66b032] hover:bg-[#4a9020] text-white font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Publishing..." : "Publish Announcement"}
          </button>
        </form>
      </motion.div>

      {/* Previous Announcements */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Previous Announcements</h2>
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No announcements yet</p>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{announcement.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{announcement.message}</p>
                <div className="text-xs text-gray-400">
                  {announcement.createdAt?.toDate ? announcement.createdAt.toDate().toLocaleString() : "N/A"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

