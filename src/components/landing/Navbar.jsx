import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Testimonials", href: "/#testimonials" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#66b032] to-[#0057a8] flex items-center justify-center text-white font-black text-sm">
              SMIT
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-[#0057a8] text-sm leading-tight">Saylani Mass</div>
              <div className="font-semibold text-[#66b032] text-xs leading-tight">IT Hub Portal</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-[#66b032] font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-700 font-medium hover:text-[#66b032] transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 bg-[#66b032] text-white font-semibold rounded-lg hover:bg-[#4a9020] transition-all transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-white border-t border-gray-100"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-gray-600 hover:text-[#66b032] font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => { navigate("/login"); setIsOpen(false); }}
                className="w-full py-2 text-gray-700 font-medium border border-gray-200 rounded-lg"
              >
                Login
              </button>
              <button
                onClick={() => { navigate("/signup"); setIsOpen(false); }}
                className="w-full py-2 bg-[#66b032] text-white font-semibold rounded-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

