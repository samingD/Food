import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-8 md:px-16 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="font-extrabold text-xl tracking-tight mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm overflow-hidden flex items-center justify-center p-1">
              <img 
                src="https://i.ibb.co/Y4pqNnfb/IMG-20260406-WA0014-removebg-preview.png" 
                alt="IMANIGLOBAL AGRO Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span>IMANIGLOBAL<span className="text-primary">AGRO</span></span>
          </div>
          <p className="text-gray-400 text-sm max-w-xs mb-6">
            Premium agricultural commodities sourced directly from the best farms. Quality, reliability, and customer satisfaction.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/share/182QY7mfht/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/imaniglobalfarmofficialllc?utm_source=qr&igsh=MWFhNjcwdTJxcm9mdw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-wider text-sm mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/shop" className="hover:text-primary transition-colors">Shop Commodities</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-wider text-sm mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="hover:text-primary transition-colors">Refund / Return Policy</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-wider text-sm mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Email: <a href="mailto:contact.imaniglobal@gmail.com" className="hover:text-primary transition-colors">contact.imaniglobal@gmail.com</a></li>
            <li>Phone: <a href="https://api.whatsapp.com/send?phone=447379352882" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+44 7379 352882</a></li>
            <li>Address: 1 Bromfield Crescent Grampound Road Truro</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} IMANIGLOBAL AGRO LIMITED. All rights reserved.
      </div>
    </footer>
  );
}
