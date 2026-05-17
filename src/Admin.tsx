import React, { useState, useEffect } from 'react';
import { useStore, CountryRate } from './store';
import { Plus, Edit2, Trash2, LogOut, Image as ImageIcon, Home as HomeIcon, Settings, Plane, Ship } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const { isAdmin, loginAdmin, logoutAdmin, products, fetchProducts, addProduct, updateProduct, deleteProduct, shippingRates, fetchShippingRates, updateShippingRates, paymentKeys, fetchPaymentKeys, updatePaymentKeys, orders, fetchOrders, updateOrderStatus } = useStore();
  
  const [email, setEmail] = useState('admin@imaniglobal.com');
  const [password, setPassword] = useState('sammy1122');
  const [loginError, setLoginError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: '', name: '', description: '', price: 0, image: '' });

  const [editingRates, setEditingRates] = useState<CountryRate[]>([]);
  const [newCountryName, setNewCountryName] = useState('');
  const [newCargoRate, setNewCargoRate] = useState(0);
  const [newShippingRate, setNewShippingRate] = useState(0);

  const [isSavingShipping, setIsSavingShipping] = useState(false);
  const [shippingSaved, setShippingSaved] = useState(false);

  const [editingKeys, setEditingKeys] = useState(paymentKeys);
  const [isSavingKeys, setIsSavingKeys] = useState(false);
  const [keysSaved, setKeysSaved] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchShippingRates();
      fetchPaymentKeys();
      fetchOrders();
    }
  }, [isAdmin, fetchProducts, fetchShippingRates, fetchPaymentKeys, fetchOrders]);

  useEffect(() => {
    if (shippingRates) {
      setEditingRates(shippingRates);
    }
  }, [shippingRates]);

  useEffect(() => {
    setEditingKeys({
      stripePublishableKey: paymentKeys?.stripePublishableKey || '',
      stripeSecretKey: paymentKeys?.stripeSecretKey || '',
      paypalClientId: paymentKeys?.paypalClientId || '',
      paypalSecretKey: paymentKeys?.paypalSecretKey || ''
    });
  }, [paymentKeys]);

  const handleSavePaymentKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingKeys(true);
    await updatePaymentKeys(editingKeys);
    setIsSavingKeys(false);
    setKeysSaved(true);
    setTimeout(() => setKeysSaved(false), 3000);
  };

  const handleAddCountryRate = () => {
    if (!newCountryName) return;

    const existingIndex = editingRates.findIndex(r => r.country.toLowerCase() === newCountryName.toLowerCase());

    const newRate: CountryRate = {
      id: existingIndex >= 0 ? editingRates[existingIndex].id : Date.now().toString(),
      country: existingIndex >= 0 ? editingRates[existingIndex].country : newCountryName,
      cargo: newCargoRate,
      shipping: newShippingRate
    };

    if (existingIndex >= 0) {
      const updatedRates = [...editingRates];
      updatedRates[existingIndex] = newRate;
      setEditingRates(updatedRates);
    } else {
      setEditingRates([...editingRates, newRate]);
    }
    
    setNewCountryName('');
    setNewCargoRate(0);
    setNewShippingRate(0);
  };

  const handleRemoveCountryRate = (id: string) => {
    setEditingRates(editingRates.filter(r => r.id !== id));
  };

  const handleSaveShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingShipping(true);
    await updateShippingRates(editingRates);
    setIsSavingShipping(false);
    setShippingSaved(true);
    setTimeout(() => setShippingSaved(false), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        loginAdmin(data.token);
        setLoginError('');
      } else {
        setLoginError(data.error || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setLoginError('Failed to connect to the server.');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct.id) {
      await updateProduct(currentProduct.id, currentProduct);
    } else {
      await addProduct({
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        image: currentProduct.image
      });
    }
    setIsEditing(false);
    setCurrentProduct({ id: '', name: '', description: '', price: 0, image: '' });
  };

  const handleEditClick = (product: any) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleAddNewClick = () => {
    setCurrentProduct({ id: '', name: '', description: '', price: 0, image: '' });
    setIsEditing(true);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors">
          <HomeIcon className="w-4 h-4" /> Back to Website
        </Link>
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 w-full max-w-md hover:shadow-xl transition-shadow duration-300">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-black mb-2">Admin Login</h1>
            <p className="text-text-muted text-sm">Secure access to IMANIGLOBAL dashboard</p>
          </div>
          
          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-6 text-center border border-red-100">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-primary shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <h1 className="font-bold text-xl text-black flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Admin Dashboard
          </h1>
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors">
            <HomeIcon className="w-4 h-4" /> <span className="hidden sm:inline">Go to Website</span>
          </Link>
        </div>
        <button 
          onClick={logoutAdmin}
          className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-black transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto p-8 space-y-12">
        {/* Order Management Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-3xl font-bold text-black border-b border-gray-200 pb-2 w-full">Orders Management</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {(!orders || !Array.isArray(orders) || orders.length === 0) ? (
              <div className="p-8 text-center text-gray-500">No orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm tracking-wider text-gray-500 font-semibold uppercase">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-mono text-xs">{order.id}</td>
                        <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <div className="font-bold">{order.billingInfo?.firstName} {order.billingInfo?.lastName}</div>
                          <div className="text-xs text-gray-500">{order.billingInfo?.address}, {order.billingInfo?.city}</div>
                        </td>
                        <td className="p-4">{order.paymentMethod || 'Unknown'}</td>
                        <td className="p-4 font-semibold">${order.total}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            order.status === 'paid' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status === 'pending_payment' ? 'Pending' : order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {order.status === 'pending_payment' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'paid')}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition"
                            >
                              Mark as Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Product Management Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-3xl font-bold text-black border-b border-gray-200 pb-2 w-full flex-1">Product Management</h2>
          {!isEditing && (
            <button 
              onClick={handleAddNewClick}
              className="bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-opacity-90 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ml-4 shrink-0"
            >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            )}
          </div>

        {isEditing ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-bold text-xl mb-6 text-black">{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Product Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary"
                    value={currentProduct.name}
                    onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Price ($)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary"
                    value={currentProduct.price}
                    onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary resize-none"
                  value={currentProduct.description}
                  onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Product Image</label>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <input 
                      type="url" 
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary"
                      placeholder="https://example.com/image.jpg (or upload below)"
                      value={currentProduct.image}
                      onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})}
                    />
                    {currentProduct.image && (
                      <div className="w-12 h-12 rounded bg-cover bg-center border border-gray-200 shrink-0" style={{ backgroundImage: `url(${currentProduct.image})` }}></div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-muted font-semibold uppercase tracking-wider">OR</span>
                    <label className="cursor-pointer bg-gray-100 text-black px-4 py-2 rounded text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2 border border-gray-200">
                      <ImageIcon className="w-4 h-4" /> Upload from Gallery
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement("canvas");
                                const maxWidth = 800;
                                let scaleSize = maxWidth / img.width;
                                if (scaleSize > 1) scaleSize = 1; // don't upscale
                                canvas.width = img.width * scaleSize;
                                canvas.height = img.height * scaleSize;
                                const ctx = canvas.getContext("2d");
                                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                                const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                                setCurrentProduct({ ...currentProduct, image: dataUrl });
                              };
                              img.src = reader.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-primary shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  Save Product
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-100 text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-text-muted">Product</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-text-muted">Price</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-text-muted">Description</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${product.image})` }}></div>
                          <span className="font-bold text-sm text-black">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-primary">${product.price.toFixed(2)}</td>
                      <td className="p-4 text-sm text-text-muted max-w-xs truncate">{product.description}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(product)}
                            className="p-2 text-gray-400 hover:text-black transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if(window.confirm('Are you sure you want to delete this product?')) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-muted">No products found. Add some!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-16 mb-8 border-t border-gray-200 pt-16">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="w-6 h-6 text-black" />
            <h2 className="font-display text-3xl font-bold text-black">Shipping Settings By Country</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-bold text-xl mb-6 text-black">Active Shipping Destinations</h3>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-text-muted">Country</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-text-muted">Cargo Rate ($)</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-text-muted">Standard Shipping ($)</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-text-muted text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {editingRates.map(rate => (
                    <tr key={rate.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-sm text-black">{rate.country}</td>
                      <td className="p-4 font-semibold text-primary">${rate.cargo.toFixed(2)}</td>
                      <td className="p-4 font-semibold text-primary">${rate.shipping.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleRemoveCountryRate(rate.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove Country"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {editingRates.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-muted">No countries configured.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
              <h4 className="font-bold text-sm text-black mb-4 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Destination
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-black mb-1">Country Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. United States"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                    value={newCountryName}
                    onChange={e => setNewCountryName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">Cargo ($)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                    value={newCargoRate}
                    onChange={e => setNewCargoRate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">Shipping ($)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                    value={newShippingRate}
                    onChange={e => setNewShippingRate(Number(e.target.value))}
                  />
                </div>
              </div>
              <button 
                onClick={handleAddCountryRate}
                className="mt-4 bg-gray-900 text-white px-6 py-2 rounded font-semibold text-sm hover:bg-black transition-colors"
              >
                Add to List
              </button>
            </div>

            <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-100">
              <button 
                onClick={handleSaveShipping}
                disabled={isSavingShipping}
                className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-primary shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
              >
                {isSavingShipping ? 'Saving...' : 'Save All Shipping Rates'}
              </button>
              {shippingSaved && (
                <span className="text-sm font-semibold text-primary">Rates saved successfully!</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-16 mb-8 border-t border-gray-200 pt-16">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="w-6 h-6 text-black" />
            <h2 className="font-display text-3xl font-bold text-black">Payment Gateways Configuration</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <p className="text-sm text-text-muted mb-6">Manage your Stripe and PayPal keys securely. Secret keys will be hidden after saving.</p>
            <form onSubmit={handleSavePaymentKeys} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100 pb-8">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-black flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Stripe Configuration
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Publishable Key</label>
                      <input 
                        type="text" 
                        placeholder="pk_live_..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                        value={editingKeys.stripePublishableKey}
                        onChange={e => setEditingKeys({...editingKeys, stripePublishableKey: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Secret Key</label>
                      <input 
                        type="password" 
                        placeholder="sk_live_..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                        value={editingKeys.stripeSecretKey}
                        onChange={e => setEditingKeys({...editingKeys, stripeSecretKey: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-4 text-black flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span> PayPal Configuration
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Client ID</label>
                      <input 
                        type="text" 
                        placeholder="PayPal Client ID"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                        value={editingKeys.paypalClientId}
                        onChange={e => setEditingKeys({...editingKeys, paypalClientId: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Secret Key</label>
                      <input 
                        type="password" 
                        placeholder="PayPal Secret Key"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                        value={editingKeys.paypalSecretKey}
                        onChange={e => setEditingKeys({...editingKeys, paypalSecretKey: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  type="submit"
                  disabled={isSavingKeys}
                  className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-primary shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                >
                  {isSavingKeys ? 'Saving...' : 'Save Payment Keys'}
                </button>
                {keysSaved && (
                  <span className="text-sm font-semibold text-primary">Keys saved successfully!</span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
