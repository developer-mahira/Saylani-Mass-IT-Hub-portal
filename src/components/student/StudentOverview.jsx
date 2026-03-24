import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Users, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getUserComplaints, getUserLostFoundItems, getUserVolunteers } from "../../firebase/firestore";

export default function StudentOverview() {
  const { userProfile, currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [lostFound, setLostFound] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    if (!currentUser) return undefined;

    const unsubComplaints = getUserComplaints(currentUser.uid, (data) => {
      setComplaints(data);
    });

    const unsubLostFound = getUserLostFoundItems(currentUser.uid, (data) => {
      setLostFound(data);
    });

    const unsubVolunteers = getUserVolunteers(currentUser.uid, (data) => {
      setVolunteers(data);
    });

    return () => {
      unsubComplaints();
      unsubLostFound();
      unsubVolunteers();
    };
  }, [currentUser]);

  const stats = [
    {
      title: "Total Complaints",
      value: complaints.length,
      icon: FileText,
      color: "bg-red-100 text-red-600",
      subtext: `${complaints.filter((item) => item.status === "Resolved").length} resolved`,
    },
    {
      title: "Lost & Found",
      value: lostFound.length,
      icon: Search,
      color: "bg-blue-100 text-blue-600",
      subtext: `${lostFound.filter((item) => item.status === "Matched").length} matched`,
    },
    {
      title: "Volunteer Applications",
      value: volunteers.length,
      icon: Users,
      color: "bg-green-100 text-green-600",
      subtext: `${volunteers.filter((item) => item.status === "Approved").length} approved`,
    },
    {
      title: "Success Rate",
      value:
        complaints.length > 0
          ? Math.round((complaints.filter((item) => item.status === "Resolved").length / complaints.length) * 100)
          : 0,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
      suffix: "%",
      subtext: "Resolution rate",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#66b032] to-[#0057a8] rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {userProfile?.name || "Student"}!</h1>
        <p className="opacity-90">Here&apos;s an overview of your activities on the SMIT Hub Portal.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
              {stat.suffix || ""}
            </div>
            <div className="text-sm text-gray-500 mt-1">{stat.title}</div>
            <div className="text-xs text-[#66b032] mt-1">{stat.subtext}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-sm min-h-[220px]"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Complaints</h3>
          {complaints.slice(0, 3).length > 0 ? (
            <div className="space-y-3">
              {complaints.slice(0, 3).map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{complaint.title}</p>
                    <p className="text-xs text-gray-500">{complaint.category}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      complaint.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : complaint.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-12">No complaints yet</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl p-5 shadow-sm min-h-[220px]"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Lost &amp; Found</h3>
          {lostFound.slice(0, 3).length > 0 ? (
            <div className="space-y-3">
              {lostFound.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.type} • {item.category}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Resolved" || item.status === "Matched"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-12">No items yet</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
