import { motion } from "framer-motion";

export default function VisionBanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#003d7a] to-[#0057a8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Building Pakistan's Tech Future
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
            Saylani Mass IT Training is committed to empowering youth with technical skills.
            Join thousands of students transforming their careers and the nation's future.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-white">10M+</div>
              <div className="text-white/70 text-sm mt-1">Trained Experts</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-white">$100B</div>
              <div className="text-white/70 text-sm mt-1">IT Economy</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="text-white/70 text-sm mt-1">Cities Covered</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-white">100%</div>
              <div className="text-white/70 text-sm mt-1">Free Education</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

