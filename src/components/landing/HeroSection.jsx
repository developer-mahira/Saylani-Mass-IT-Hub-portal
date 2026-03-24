import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

function CounterItem({ end, label, suffix = "" }) {
  const { count, ref } = useCounter(end);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-white/80 text-sm mt-1">{label}</div>
    </div>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();

  const stats = [
    { end: 12400, label: "Students", suffix: "+" },
    { end: 3820, label: "Issues Resolved", suffix: "+" },
    { end: 940, label: "Volunteers", suffix: "+" },
    { end: 80, label: "Courses", suffix: "+" },
  ];

  const handleAdminClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleStudentClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f9e8] via-white to-[#e8f3fd]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2366b032\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6"
          >
            <span className="w-2 h-2 bg-green-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-600">Pakistan's Largest IT Training Program</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#66b032] to-[#0057a8] bg-clip-text text-transparent">
              Saylani Mass IT Hub
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Your complete campus management solution. Report issues, find lost items, volunteer, and stay connected
            all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <button
              onClick={handleAdminClick}
              className="px-8 py-4 bg-[#0057a8] text-white font-bold rounded-xl hover:bg-[#004a8f] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              Admin Portal
            </button>
            <button
              onClick={handleStudentClick}
              className="px-8 py-4 bg-[#66b032] text-white font-bold rounded-xl hover:bg-[#4a9020] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              Student Portal
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-gradient-to-br from-[#66b032] to-[#0057a8] rounded-2xl p-6 text-center"
            >
              <CounterItem {...stat} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
