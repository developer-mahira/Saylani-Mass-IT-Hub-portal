import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Users, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { 
  getAllComplaints, 
  getAllLostFoundItems, 
  getAllVolunteers, 
  getAllUsersRealtime 
} from "../../firebase/firestore";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    complaints: { total: 0, pending: 0, resolved: 0 },
    lostFound: { total: 0, pending: 0, matched: 0 },
    volunteers: { total: 0, pending: 0, approved: 0 },
    users: { total: 0, students: 0, admins: 0 },
  });
  useEffect(() => {
    const unsubscribeComplaints = getAllComplaints((complaints) => {
      setStats(prev => ({
        ...prev,
        complaints: {
          total: complaints.length,
          pending: complaints.filter(c => c.status === "Submitted" || c.status === "In Progress").length,
          resolved: complaints.filter(c => c.status === "Resolved").length,
        }
      }));
    });

    const unsubscribeLostFound = getAllLostFoundItems((items) => {
      setStats(prev => ({
        ...prev,
        lostFound: {
          total: items.length,
          pending: items.filter(i => i.status === "Pending").length,
          matched: items.filter(i => i.status === "Matched" || i.status === "Resolved").length,
        }
      }));
    });

    const unsubscribeVolunteers = getAllVolunteers((volunteers) => {
      setStats(prev => ({
        ...prev,
        volunteers: {
          total: volunteers.length,
          pending: volunteers.filter(v => v.status === "Pending").length,
          approved: volunteers.filter(v => v.status === "Approved").length,
        }
      }));
    });

    const unsubscribeUsers = getAllUsersRealtime((users) => {
      setStats(prev => ({
        ...prev,
        users: {
          total: users.length,
          students: users.filter(u => u.role === "student").length,
          admins: users.filter(u => u.role === "admin").length,
        }
      }));
    });

    return () => {
      if (unsubscribeComplaints && typeof unsubscribeComplaints === 'function') {
        unsubscribeComplaints();
      }
      if (unsubscribeLostFound && typeof unsubscribeLostFound === 'function') {
        unsubscribeLostFound();
      }
      if (unsubscribeVolunteers && typeof unsubscribeVolunteers === 'function') {
        unsubscribeVolunteers();
      }
      if (unsubscribeUsers && typeof unsubscribeUsers === 'function') {
        unsubscribeUsers();
      }
    };
  }, []);

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.complaints.total,
      icon: FileText,
      color: "bg-red-100 text-red-600",
      subtext: `${stats.complaints.pending} pending, ${stats.complaints.resolved} resolved`,
    },
    {
      title: "Lost & Found",
      value: stats.lostFound.total,
      icon: Search,
      color: "bg-blue-100 text-blue-600",
      subtext: `${stats.lostFound.pending} pending, ${stats.lostFound.matched} matched`,
    },
    {
      title: "Volunteers",
      value: stats.volunteers.total,
      icon: Users,
      color: "bg-green-100 text-green-600",
      subtext: `${stats.volunteers.pending} pending, ${stats.volunteers.approved} approved`,
    },
    {
      title: "Total Users",
      value: stats.users.total,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
      subtext: `${stats.users.students} students, ${stats.users.admins} admins`,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#0057a8] to-[#003d73] rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="opacity-90">Welcome to the SMIT Hub Admin Portal</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 mt-1">{stat.title}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.subtext}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-5 shadow-sm"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="text-red-500" size={20} />
                <span>View Pending Complaints</span>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                {stats.complaints.pending}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Search className="text-blue-500" size={20} />
                <span>Review Lost & Found</span>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                {stats.lostFound.pending}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="text-green-500" size={20} />
                <span>Approve Volunteers</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                {stats.volunteers.pending}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-5 shadow-sm"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle size={16} /> Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Authentication</span>
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle size={16} /> Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage</span>
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle size={16} /> Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Sync</span>
              <span className="flex items-center gap-2 text-gray-600">
                <Clock size={16} /> Just now
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

