import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#66b032] to-[#0057a8] flex items-center justify-center text-white font-black text-sm">
                SMIT
              </div>
              <div>
                <div className="font-bold text-white">Saylani Mass</div>
                <div className="font-semibold text-[#66b032] text-xs">IT Hub Portal</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Saylani Mass IT Training is Pakistan's largest free IT training program, 
              committed to empowering youth with technical skills for a brighter future.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#66b032] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#66b032] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#66b032] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#66b032] transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-[#66b032] transition-colors">Home</Link></li>
              <li><Link to="/#features" className="text-gray-400 hover:text-[#66b032] transition-colors">Features</Link></li>
              <li><Link to="/#how-it-works" className="text-gray-400 hover:text-[#66b032] transition-colors">How It Works</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-[#66b032] transition-colors">Login</Link></li>
              <li><Link to="/signup" className="text-gray-400 hover:text-[#66b032] transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} className="text-[#66b032]" />
                <span className="text-sm">SMIT Head Office, Karachi</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={16} className="text-[#66b032]" />
                <span className="text-sm">info@smit.edu.pk</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={16} className="text-[#66b032]" />
                <span className="text-sm">+92 21 111 111 111</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2026 Saylani Mass IT Hub. All rights reserved. Created by Mahira Noor.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#66b032] text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-[#66b032] text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

