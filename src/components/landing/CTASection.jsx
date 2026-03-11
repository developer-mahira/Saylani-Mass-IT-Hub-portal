import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-[#66b032] to-[#4a9020]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Be Part of This Vision
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of students who are already benefiting from our comprehensive IT training program. 
            Your journey to a successful tech career starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-white text-green-primary font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-primary transition-all"
            >
              Login to Portal
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

