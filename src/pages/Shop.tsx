import React, { useState, useEffect } from 'react';
import { useStore, getProductUnitDetails } from '../store';
import { ShoppingCart } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

export default function Shop() {
  const { products, fetchProducts, addToCart } = useStore();
  const [kgSelection, setKgSelection] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    <div className="min-h-screen bg-bg py-12 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-black uppercase">PRODUCTS</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            Browse our selection of premium agricultural products. We ensure the highest quality standards for all our exports.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div 
              key={product.id} 
              onClick={(e) => {
                // Prevent navigation if an input or button (or child of button) was clicked
                if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('button')) {
                  return;
                }
                navigate(`/product/${product.id}`);
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-300 block cursor-pointer"
            >
              <div 
                className="w-full aspect-square bg-gray-100 relative overflow-hidden"
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
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-bold uppercase mb-2 text-black">{product.name}</h3>
                <p className="text-xs text-text-muted italic mb-4 flex-1">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-bold text-primary">
                    ${product.price.toFixed(2)} 
                    <span className="text-xs text-text-muted font-normal">
                      {(() => {
                        const unit = getProductUnitDetails(product.name);
                        return unit.type === 'bag' ? ` / bag (${unit.kg}kg)` : ' / kg';
                      })()}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      min="1"
                      value={getKg(product.id)}
                      onChange={(e) => handleKgChange(product.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-12 h-8 text-center bg-gray-50 border border-gray-200 rounded focus:outline-none text-sm font-semibold"
                    />
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="text-white bg-black hover:bg-primary transition-colors p-2 rounded hover:shadow-md flex items-center justify-center"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
