import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, getProductUnitDetails } from '../store';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const { products, fetchProducts, addToCart } = useStore();
  const [kgSelection, setKgSelection] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.slice(0, 5);

  const handleKgChange = (id: string, value: string) => {
    const cleanValue = value.replace(/^0+/, '');
    setKgSelection({
      ...kgSelection,
      [id]: cleanValue
    });
  };

  const getKg = (id: string) => {
    const val = parseInt(kgSelection[id], 10);
    return isNaN(val) ? 0 : val;
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const qty = getKg(product.id);
    if (qty <= 0) {
      alert('Please select a quantity greater than 0 before adding to cart.');
      return;
    }
    const unit = getProductUnitDetails(product.name);
    addToCart(product, qty);
    alert(`Added ${qty} ${unit.type === 'bag' ? 'bag(s)' : 'kg'} of ${product.name} to cart`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="relative flex-1 min-h-[600px] md:min-h-[750px] flex items-center justify-center bg-cover bg-center" style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.65)), url('https://i.ibb.co/R4Ms1c0h/Agriculture-Insert.jpg')"
        }}>
        <section className="p-8 md:p-16 flex flex-col justify-center items-center text-center relative z-10 w-full max-w-4xl">
          <span className="font-sans text-primary uppercase font-bold text-xs md:text-sm tracking-[0.2em] mb-6 block drop-shadow-md">
            Global Export Excellence
          </span>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.1] font-bold mb-6 tracking-tight text-white drop-shadow-lg">
            Premium Agricultural Commodities You Can Trust
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl drop-shadow-sm font-medium"
          >
            We supply high-quality charcoal, cashew nuts, shea butter, cola nuts, and hibiscus flower to businesses and bulk buyers worldwide.
          </motion.p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/shop" className="px-8 py-4 bg-primary text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 uppercase">
              SHOP NOW
            </Link>
            <a href="https://api.whatsapp.com/send?phone=447379352882" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-black font-semibold text-sm rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 uppercase">
              BULK INQUIRY
            </a>
          </div>
        </section>
      </main>

      {/* Products Shelf */}
      <section className="bg-white p-8 md:p-16 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-center items-center mb-8 relative">
          <h2 className="font-display text-3xl font-bold text-black text-center">PRODUCTS</h2>
          <Link to="/shop" className="mt-4 sm:mt-0 sm:absolute sm:right-0 text-sm font-semibold uppercase tracking-wider text-primary hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {featuredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={(e) => {
                if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('button')) {
                  return;
                }
                navigate(`/product/${product.id}`);
              }}
              className="text-left group p-4 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-gray-100 block cursor-pointer"
            >
              <div 
                className="w-full aspect-square bg-gray-100 mb-3 rounded-xl relative overflow-hidden"
              >
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center absolute inset-0" referrerPolicy="no-referrer" />
                ) : null}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-10">
                  <div className="bg-white rounded-full flex items-center pr-1 pl-3 py-1 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xs font-bold mr-2 text-gray-700 capitalize">
                      {getProductUnitDetails(product.name).type}:
                    </span>
                    <input 
                      type="number"
                      min="1"
                      value={kgSelection[product.id] !== undefined ? kgSelection[product.id] : ''}
                      placeholder="0"
                      onChange={(e) => handleKgChange(product.id, e.target.value)}
                      className="w-16 h-8 text-center bg-gray-100 rounded focus:outline-none text-xs font-semibold mr-2"
                      onClick={e => e.stopPropagation()}
                    />
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="bg-black text-white p-2 rounded-full hover:bg-primary transition-colors flex items-center justify-center shrink-0"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-sm font-bold uppercase mb-1 text-black truncate">{product.name}</div>
              <div className="text-xs text-text-muted italic mb-2 line-clamp-2">{product.description}</div>
              <div className="text-sm font-semibold text-primary">
                ${product.price.toFixed(2)} 
                <span className="text-xs text-text-muted font-normal">
                  {(() => {
                    const unit = getProductUnitDetails(product.name);
                    return unit.type === 'bag' ? ` / bag (${unit.kg}kg)` : ' / kg';
                  })()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews & Ratings */}
      <section className="py-20 px-8 md:px-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-black">Customer Reviews & Ratings</h2>
            <p className="text-text-muted max-w-2xl mx-auto">See what our global partners and bulk buyers have to say about our premium agricultural commodities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "David O.",
                company: "Global Imports Ltd",
                review: "IMANIGLOBAL has been our primary supplier for hardwood charcoal. The quality is unmatched and delivery is always on schedule. Highly recommended for bulk buyers.",
                rating: 5
              },
              {
                name: "Sarah M.",
                company: "Natural Cosmetics Co.",
                review: "The unrefined shea butter we received was of exceptional grade. Perfect for our organic skincare line. Their customer service via WhatsApp is incredibly responsive.",
                rating: 5
              },
              {
                name: "Ahmed K.",
                company: "AgroTrade International",
                review: "We ordered a large shipment of raw cashew nuts and hibiscus flowers. The packaging was secure and the quality exceeded our expectations. Will definitely order again.",
                rating: 5
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-bg p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex gap-1 mb-4 text-[#FFD700]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-text-muted italic mb-6 flex-1">"{review.review}"</p>
                <div>
                  <h4 className="font-bold text-black text-sm uppercase tracking-wider">{review.name}</h4>
                  <p className="text-xs text-primary font-semibold">{review.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-8 md:px-16 bg-bg border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-black">Why Choose IMANIGLOBAL?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "High Quality", desc: "Premium grade commodities sourced directly from trusted farms." },
              { title: "Reliable Supply", desc: "Consistent and dependable supply chain for bulk orders." },
              { title: "Competitive Pricing", desc: "Direct sourcing ensures the best market rates for our clients." },
              { title: "Fast Response", desc: "Dedicated support team ready to handle your inquiries." }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <h3 className="font-bold text-lg mb-3 text-black">{feature.title}</h3>
                <p className="text-sm text-text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
