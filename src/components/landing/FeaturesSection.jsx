import { motion } from "framer-motion";
import { Search, FileText, Users, Bell } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: "Lost & Found",
      description: "Report lost items or submit found belongings. Our smart matching system connects items automatically.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: FileText,
      title: "Complaint System",
      description: "Submit campus complaints regarding internet, electricity, maintenance, and more. Track status in real-time.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Users,
      title: "Volunteer Program",
      description: "Join our volunteer community. Register for events and contribute to the Saylani mission.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Stay informed with instant notifications about your complaints, matches, and announcements.",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 bg-green-light text-green-dark rounded-full text-sm font-semibold mb-4"
          >
            FEATURES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            Everything You Need in One Place
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 mt-4 max-w-2xl mx-auto"
          >
            A complete portal designed to streamline campus operations and enhance student experience.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg card-hover"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

