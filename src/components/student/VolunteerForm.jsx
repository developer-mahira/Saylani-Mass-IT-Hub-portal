import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { addVolunteer } from "../../firebase/firestore";

const SKILLS = [
  "Web Development", "Mobile App", "UI/UX Design", "Graphic Design",
  "Content Writing", "Video Editing", "Social Media", "Event Management",
  "Teaching", "Public Speaking", "Photography", "Other"
];

export default function VolunteerForm() {
  const { userProfile, currentUser } = useAuth();
  const [form, setForm] = useState({
    eventName: "",
    eventDate: "",
    availability: "",
    experience: "",
    skills: [],
  });
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async () => {
    if (!form.eventName.trim()) return toast.error("Event name is required");
    if (!form.eventDate) return toast.error("Event date is required");
    if (!form.availability.trim()) return toast.error("Availability is required");
    if (form.skills.length === 0) return toast.error("Select at least one skill");

    setLoading(true);
    try {
      await addVolunteer({
        userId: currentUser.uid,
        userName: userProfile?.name,
        email: userProfile?.email,
        phone: userProfile?.phone,
        campus: userProfile?.campus,
        rollNumber: userProfile?.rollNumber,
        skills: form.skills,
        eventName: form.eventName.trim(),
        eventDate: form.eventDate,
        availability: form.availability.trim(),
        experience: form.experience.trim(),
      });

      toast.success("Volunteer application submitted successfully!");
      setForm({ eventName: "", eventDate: "", availability: "", experience: "", skills: [] });
    } catch (error) {
      toast.error(error.message || "Failed to submit application");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-2">Volunteer Application</h2>
      <p className="text-gray-500 text-sm mb-6">Join our volunteer community and make a difference!</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event/Program Name *</label>
          <input
            type="text"
            value={form.eventName}
            onChange={(e) => setForm({ ...form, eventName: e.target.value })}
            placeholder="Which event would you like to volunteer for?"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability *</label>
          <input
            type="text"
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value })}
            placeholder="e.g., Weekends only, Full time"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills *</label>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  form.skills.includes(skill)
                    ? "bg-green-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Previous Experience</label>
          <textarea
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            placeholder="Tell us about your previous volunteer experience..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-primary resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-green-primary hover:bg-green-dark text-white font-bold transition-all disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </motion.div>
  );
}

