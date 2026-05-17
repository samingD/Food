import React, { useState, useEffect } from 'react';
import { useStore, getProductUnitDetails } from '../store';
import { Trash2, Plus, Minus, ArrowRight, Plane, Ship, Search, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, products, removeFromCart, updateCartQuantity, shippingRates, fetchShippingRates, selectedCountryId, setCheckoutCountry, shippingType, setShippingType } = useStore();
  const [countrySearch, setCountrySearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchShippingRates();
  }, [fetchShippingRates]);

  useEffect(() => {
    if (shippingRates.length > 0 && !selectedCountryId) {
      setCheckoutCountry(shippingRates[0].id);
    }
  }, [shippingRates, selectedCountryId, setCheckoutCountry]);

  const activeRate = shippingRates.find(r => r.id === selectedCountryId) || shippingRates[0];
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalKg = cart.reduce((acc, item) => {
    const unitInfo = getProductUnitDetails(item.name);
    return acc + (item.quantity * unitInfo.kg);
  }, 0);
  const rawShippingCost = activeRate ? (shippingType === 'cargo' ? activeRate.cargo : activeRate.shipping) : 0;
  
  // Rate is defined for 20kg. Cost = (Rate / 20) * total_kg
  const shippingCost = (rawShippingCost / 20) * totalKg; 
  const total = (subtotal + shippingCost).toFixed(2);

  const filteredCountries = shippingRates.filter(r => r.country.toLowerCase().includes(countrySearch.toLowerCase()));

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="font-display text-3xl font-bold mb-4 text-black">Your Cart is Empty</h2>
        <p className="text-text-muted mb-8 text-center">Looks like you haven't added any commodities to your cart yet.</p>
        <Link to="/shop" className="px-8 py-4 bg-primary text-white font-semibold text-sm rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          Browse Commodities
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-12 px-8 md:px-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8 text-black">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div 
                  className="w-24 h-24 bg-gray-100 rounded relative shrink-0 overflow-hidden"
                >
                  <img src={products.find(p => p.id === item.id)?.image || item.image || ''} alt={item.name} className="w-full h-full object-cover object-center absolute inset-0" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-black uppercase text-sm mb-1">{item.name}</h3>
                  <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded">
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50 text-black"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-20 text-center font-medium text-sm">
                      {item.quantity} {getProductUnitDetails(item.name).type === 'bag' ? 'bag(s)' : 'kg'}
                    </span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 text-black"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-bold text-lg mb-6 text-black uppercase tracking-wider">Order Summary</h3>
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="space-y-3 py-4 border-y border-gray-100">
                  <h4 className="font-bold text-black uppercase text-xs tracking-wider">Destination Country</h4>
                  <div className="relative">
                      <div 
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-sm flex justify-between items-center cursor-pointer"
                        onClick={() => {
                          setIsDropdownOpen(!isDropdownOpen);
                          setCountrySearch(''); // Reset search when opening/closing
                        }}
                      >
                        <span className="truncate">{activeRate?.country || "Select destination..."}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </div>
                      
                      {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 flex flex-col overflow-hidden">
                          <div className="p-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input 
                              type="text" 
                              placeholder="Search country alphabetically..."
                              className="w-full bg-transparent border-none focus:outline-none text-sm"
                              value={countrySearch}
                              onChange={e => setCountrySearch(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map(rate => (
                                <div 
                                  key={rate.id}
                                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${selectedCountryId === rate.id ? 'bg-black text-white hover:bg-black/90' : 'text-gray-800'}`}
                                  onClick={() => {
                                    setCheckoutCountry(rate.id);
                                    setIsDropdownOpen(false);
                                    setCountrySearch('');
                                  }}
                                >
                                  {rate.country}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">No country found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-black uppercase text-xs tracking-wider mt-4">Select Method (Based on {totalKg} kg)</h4>
                    <div className="text-xs text-text-muted mb-2 font-medium">Fixed base rates apply per 20kg.</div>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value="cargo" checked={shippingType === 'cargo'} onChange={() => setShippingType('cargo')} className="text-primary focus:ring-primary h-4 w-4" />
                        <div>
                          <div className="flex items-center gap-2">
                            <Plane className="w-4 h-4 text-text-muted group-hover:text-black transition-colors" />
                            <span className="text-black font-medium">Cargo Delivery</span>
                          </div>
                          <p className="text-xs text-text-muted mt-1 ml-6">Takes up to 5 working days</p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">${activeRate ? ((activeRate.cargo / 20) * totalKg).toFixed(2) : '0.00'}</span>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group mt-2">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value="shipping" checked={shippingType === 'shipping'} onChange={() => setShippingType('shipping')} className="text-primary focus:ring-primary h-4 w-4" />
                        <div>
                          <div className="flex items-center gap-2">
                            <Ship className="w-4 h-4 text-text-muted group-hover:text-black transition-colors" />
                            <span className="text-black font-medium">Standard Shipping</span>
                          </div>
                          <p className="text-xs text-text-muted mt-1 ml-6">Takes up to 21 working days</p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">${activeRate ? ((activeRate.shipping / 20) * totalKg).toFixed(2) : '0.00'}</span>
                    </label>
                  </div>

                <div className="flex justify-between text-text-muted">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-black">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-semibold text-sm hover:bg-green-700 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-text-muted mt-4 text-center">
                Secure checkout. You'll confirm shipping and billing details on the next page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
