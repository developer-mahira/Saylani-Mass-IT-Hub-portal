import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getUserComplaints } from "../../firebase/firestore";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";

const PRIORITY_COLORS = {
  Urgent: "text-red-600",
  High: "text-red-500",
  Medium: "text-yellow-600",
  Low: "text-gray-500",
};

export default function ComplaintList() {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = getUserComplaints(currentUser.uid, (data) => {
      setComplaints(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredComplaints = filter === "all"
    ? complaints
    : complaints.filter(c => c.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 border-4 border-green-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Complaints</h2>
          <p className="text-gray-500 text-sm">{complaints.length} total complaints</p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap bg-gray-100 rounded-lg p-1 gap-1">
          {["all", "Submitted", "In Progress", "Resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === status
                  ? "bg-white text-green-primary shadow-sm"
                  : "text-gray-500"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length > 0 ? (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={complaint.status} />
                    <span className={`text-xs font-medium ${PRIORITY_COLORS[complaint.priority]}`}>
                      {complaint.priority} Priority
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{complaint.description}</p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{complaint.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {complaint.createdAt?.toDate ? complaint.createdAt.toDate().toLocaleDateString() : "N/A"}
                    </span>
                    {complaint.campus && <span>{complaint.campus}</span>}
                  </div>

                  {complaint.adminNote && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-xs font-medium text-yellow-700 mb-1">Admin Note:</p>
                      <p className="text-sm text-yellow-800">{complaint.adminNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No complaints found"
          description={filter === "all"
            ? "You haven't submitted any complaints yet."
            : `You don't have any ${filter} complaints.`}
        />
      )}
    </motion.div>
  );
}

