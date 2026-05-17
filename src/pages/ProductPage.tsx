import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useStore, getProductUnitDetails } from '../store';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, fetchProducts, addToCart, isLoading } = useStore();
  const [quantity, setQuantity] = useState<string>('0');

  useEffect(() => {
    if (products.length === 0 && !isLoading) {
      fetchProducts();
    }
  }, [products.length]);

  const product = products.find(p => String(p.id) === String(id));

  if (!product) {
    if (isLoading) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <p className="text-xl text-gray-500 mb-4 animate-pulse">Loading product...</p>
        </div>
      );
    }
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-xl text-gray-500 mb-4">Product not found.</p>
        <Link to="/shop" className="text-primary hover:underline font-semibold flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const handleQtyChange = (value: string) => {
    // Prevent non-numeric characters from causing weird state issues
    if (value === '') {
      setQuantity('');
      return;
    }
    const cleanValue = value.replace(/^0+/, '');
    setQuantity(cleanValue || '0');
  };

  const getQty = () => {
    const val = parseInt(quantity, 10);
    return isNaN(val) ? 0 : val;
  };

  const handleAddToCart = () => {
    const qty = getQty();
    if (qty <= 0) {
      alert('Please select a quantity greater than 0 before adding to cart.');
      return;
    }
    const unit = getProductUnitDetails(product.name);
    addToCart(product, qty);
    alert(`Added ${qty} ${unit.type === 'bag' ? 'bag(s)' : 'kg'} of ${product.name} to cart`);
    navigate('/cart');
  };

  const unit = getProductUnitDetails(product.name);

  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <Link to="/shop" className="text-primary hover:underline font-semibold flex items-center gap-2 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative shadow-inner">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-sans text-primary uppercase font-bold text-xs tracking-[0.2em] mb-4 block">
              Premium Commodity
            </span>
            <h1 className="font-display text-4xl font-bold text-black mb-4">
              {product.name}
            </h1>
            
            <p className="text-3xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
              <span className="text-sm text-text-muted font-normal ml-2">
                per {unit.type === 'bag' ? `${unit.kg}kg bag` : 'kg'}
              </span>
            </p>

            <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
              <p className="leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
              <label className="block text-sm font-bold text-black uppercase tracking-wider mb-3">
                Select Quantity ({unit.type === 'bag' ? 'Bags' : 'Kg'})
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="number"
                  min="0"
                  value={quantity || ''}
                  placeholder="0"
                  onChange={(e) => handleQtyChange(e.target.value)}
                  className="w-24 h-12 px-4 text-lg bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black font-semibold"
                />
                <span className="text-sm font-medium text-gray-500">
                  {unit.type === 'bag' ? 'bags' : 'kg'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-bold rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl uppercase tracking-wider"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
