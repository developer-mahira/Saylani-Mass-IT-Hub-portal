import { motion } from "framer-motion";

export default function StatsBar() {
  const stats = [
    { icon: "🎓", value: "12,400+", label: "Active Students" },
    { icon: "✅", value: "3,820+", label: "Issues Resolved" },
    { icon: "🙋", value: "940+", label: "Volunteers" },
    { icon: "📚", value: "80+", label: "Courses Offered" },
  ];

  return (
    <div className="bg-gradient-to-r from-[#66b032] to-[#0057a8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

