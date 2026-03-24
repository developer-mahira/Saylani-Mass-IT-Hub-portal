import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getUserNotifications, markNotificationRead } from "../../firebase/firestore";
import EmptyState from "../common/EmptyState";

const NOTIFICATION_ICONS = {
  complaint_update: AlertCircle,
  lost_found_match: CheckCircle,
  volunteer_update: Info,
  announcement: Bell,
};

const NOTIFICATION_COLORS = {
  complaint_update: "bg-red-100 text-red-600",
  lost_found_match: "bg-green-100 text-green-600",
  volunteer_update: "bg-blue-100 text-blue-600",
  announcement: "bg-purple-100 text-purple-600",
};

export default function NotificationFeed() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return undefined;

    const unsubscribe = getUserNotifications(currentUser.uid, (data) => {
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-500 text-sm">{unreadCount} unread notifications</p>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
            const iconColor = NOTIFICATION_COLORS[notification.type] || "bg-gray-100 text-gray-600";

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => !notification.isRead && handleMarkRead(notification.id)}
                className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all ${
                  !notification.isRead ? "border-l-4 border-green-primary" : ""
                } hover:shadow-md`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && <span className="w-2 h-2 bg-green-primary rounded-full flex-shrink-0 mt-2" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {notification.createdAt?.toDate ? notification.createdAt.toDate().toLocaleString() : "Recently"}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="You're all caught up! Check back later for updates."
        />
      )}
    </motion.div>
  );
}
