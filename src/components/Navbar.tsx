import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const cart = useStore(state => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center py-6 px-8 md:px-16 border-b border-gray-200 bg-gray-100 sticky top-0 z-50">
      <Link to="/" className="font-extrabold text-2xl tracking-tight flex items-center gap-4 group">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center p-1">
          <img 
            src="https://i.ibb.co/Y4pqNnfb/IMG-20260406-WA0014-removebg-preview.png" 
            alt="IMANIGLOBAL AGRO Logo" 
            className="w-full h-full object-contain scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="hidden sm:block text-primary">IMANIGLOBAL</span>
      </Link>

      {/* Desktop Nav */}
      <ul className="hidden md:flex items-center gap-10 list-none">
        <li>
          <Link to="/" className="text-black text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors">Home</Link>
        </li>
        <li>
          <Link to="/shop" className="text-black text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors">Product</Link>
        </li>
        <li>
          <Link to="/about" className="text-black text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors">About us</Link>
        </li>
        <li>
          <Link to="/contact" className="text-black text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors">Contact us</Link>
        </li>
        <li>
          <Link to="/cart" className="relative text-black hover:text-primary transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </li>
      </ul>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden flex items-center gap-4">
        <Link to="/cart" className="relative text-black">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-100 border-b border-gray-200 p-4 flex flex-col gap-4 md:hidden shadow-lg">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-black text-sm font-medium uppercase tracking-wider">Home</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-black text-sm font-medium uppercase tracking-wider">Product</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-black text-sm font-medium uppercase tracking-wider">About us</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-black text-sm font-medium uppercase tracking-wider">Contact us</Link>
        </div>
      )}
    </nav>
  );
}
