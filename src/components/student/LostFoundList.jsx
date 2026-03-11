import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Image } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getUserLostFoundItems } from "../../firebase/firestore";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";

export default function LostFoundList() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = getUserLostFoundItems(currentUser.uid, (data) => {
      setItems(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredItems = filter === "all" 
    ? items 
    : items.filter(item => item.type === filter);

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
          <h2 className="text-xl font-bold text-gray-900">My Lost & Found Items</h2>
          <p className="text-gray-500 text-sm">{items.length} total items</p>
        </div>

        {/* Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {["all", "lost", "found"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === type 
                  ? "bg-white text-green-primary shadow-sm" 
                  : "text-gray-500"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <Image className="text-gray-400" size={24} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          item.type === "lost" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {item.location}
                    </span>
                    <span>{item.category}</span>
                    {item.createdAt?.toDate && (
                      <span>{item.createdAt.toDate().toLocaleDateString()}</span>
                    )}
                  </div>

                  {item.status === "Matched" && item.matchedWith && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                      🎉 Match found! Check notifications for details.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No items found"
          description={filter === "all" 
            ? "You haven't reported any lost or found items yet." 
            : `You haven't reported any ${filter} items yet.`}
        />
      )}
    </motion.div>
  );
}

