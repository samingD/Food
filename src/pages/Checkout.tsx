import React, { useState, useEffect, useMemo } from 'react';
import { useStore, getProductUnitDetails } from '../store';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripeCheckoutForm = ({ total, onSuccess }: { total: string, onSuccess: (id: string) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message || 'Payment failed');
      setProcessing(false);
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      onSuccess(result.paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <button 
        disabled={!stripe || processing} 
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-md mt-4 disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${total}`}
      </button>
    </form>
  );
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart, shippingRates, selectedCountryId, shippingType, paymentKeys, fetchPaymentKeys } = useStore();

  useEffect(() => {
    fetchPaymentKeys();
  }, [fetchPaymentKeys]);

  const [billingInfo, setBillingInfo] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: ''
  });
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '', lastName: '', address: '', city: '', postalCode: ''
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe' | 'bank_transfer'>('stripe');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeSetupError, setStripeSetupError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
        <h2 className="font-bold text-2xl mb-4">Your cart is empty</h2>
        <Link to="/shop" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const activeRate = shippingRates.find(r => r.id === selectedCountryId);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalKg = cart.reduce((acc, item) => {
    const unitInfo = getProductUnitDetails(item.name);
    return acc + (item.quantity * unitInfo.kg);
  }, 0);
  const rawShippingCost = activeRate ? (shippingType === 'cargo' ? activeRate.cargo : activeRate.shipping) : 0;
  const shippingCost = (rawShippingCost / 20) * totalKg; 
  const total = (subtotal + shippingCost).toFixed(2);

  useEffect(() => {
    if (paymentMethod === 'stripe' && paymentKeys?.stripePublishableKey && total && isFormValid) {
      if (!isFormValid) return; // Prevent creating intent before form is ready if possible
      
      setStripeSetupError(null);
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total: Number(total) })
      })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else if (data.error) {
          setStripeSetupError(data.error);
        }
      })
      .catch(err => setStripeSetupError("Failed to connect to payment server."));
    } else {
        setClientSecret(null);
        setStripeSetupError(null);
    }
  }, [paymentMethod, total, isFormValid, cart, paymentKeys]);

  const stripePromise = useMemo(() => {
    return paymentKeys?.stripePublishableKey ? loadStripe(paymentKeys.stripePublishableKey) : null;
  }, [paymentKeys?.stripePublishableKey]);

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({...billingInfo, [e.target.name]: e.target.value});
    validateForm({...billingInfo, [e.target.name]: e.target.value}, shippingInfo, sameAsBilling);
  };

  const handleShipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({...shippingInfo, [e.target.name]: e.target.value});
    validateForm(billingInfo, {...shippingInfo, [e.target.name]: e.target.value}, sameAsBilling);
  };

  const handleSameAsBillingChange = () => {
    const newVal = !sameAsBilling;
    setSameAsBilling(newVal);
    validateForm(billingInfo, shippingInfo, newVal);
  };

  const validateForm = (billInfo: any, shipInfo: any, sameAs: boolean) => {
    const billValid = Object.values(billInfo).every(val => (val as string).trim() !== '');
    if (sameAs) {
      setIsFormValid(billValid);
    } else {
      const shipValid = Object.values(shipInfo).every(val => (val as string).trim() !== '');
      setIsFormValid(billValid && shipValid);
    }
  };

  const handleOrderSuccess = async (paymentId: string, paymentMethodName: string) => {
    try {
      const orderStatus = paymentMethodName === 'Bank Transfer' ? 'pending_payment' : 'paid';
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: Number(total),
          shippingInfo,
          billingInfo,
          status: orderStatus,
          paymentId,
          paymentMethod: paymentMethodName
        })
      });
      if (response.ok) {
        const orderData = await response.json();
        clearCart();
        navigate('/order-success', { 
          state: { 
            method: paymentMethodName, 
            orderId: orderData.id || paymentId 
          } 
        });
      }
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Payment successful, but we had trouble saving your order. Please contact support.");
    }
  };

  return (
    <div className="bg-bg min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-8 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          
          <h1 className="font-display text-4xl font-bold mb-8 text-black">Checkout</h1>
          <form id="checkoutForm" className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            {/* Billing Details */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Billing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">First Name</label>
                  <input required name="firstName" value={billingInfo.firstName} onChange={handleBillChange} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Last Name</label>
                  <input required name="lastName" value={billingInfo.lastName} onChange={handleBillChange} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address</label>
                  <input required type="email" name="email" value={billingInfo.email} onChange={handleBillChange} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input required type="tel" name="phone" value={billingInfo.phone} onChange={handleBillChange} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Address</label>
                  <input required name="address" value={billingInfo.address} onChange={handleBillChange} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">City</label>
                  <input required name="city" value={billingInfo.city} onChange={handleBillChange} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Postal Code</label>
                  <input required name="postalCode" value={billingInfo.postalCode} onChange={handleBillChange} className="w-full border border-gray-300 rounded-lg p-3" />
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Shipping Address</h2>
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer font-semibold max-w-max">
                  <input 
                    type="checkbox" 
                    checked={sameAsBilling} 
                    onChange={handleSameAsBillingChange}
                    className="w-4 h-4 text-primary"
                  />
                  Same as billing address
                </label>
              </div>

              {!sameAsBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name</label>
                    <input required name="firstName" value={shippingInfo.firstName} onChange={handleShipChange} className="w-full border border-gray-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name</label>
                    <input required name="lastName" value={shippingInfo.lastName} onChange={handleShipChange} className="w-full border border-gray-300 rounded-lg p-3" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <input required name="address" value={shippingInfo.address} onChange={handleShipChange} className="w-full border border-gray-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input required name="city" value={shippingInfo.city} onChange={handleShipChange} className="w-full border border-gray-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Postal Code</label>
                    <input required name="postalCode" value={shippingInfo.postalCode} onChange={handleShipChange} className="w-full border border-gray-300 rounded-lg p-3" />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider border-b pb-4">Your Order</h3>
            
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-semibold">{item.name} x {item.quantity} {getProductUnitDetails(item.name).type}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 py-4 border-y border-gray-100 text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-black">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Shipping ({activeRate?.country})</span>
                <span className="font-semibold text-black">${shippingCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 mb-8">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-primary">${total}</span>
            </div>

            <div className="mt-6">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex gap-6 mb-6 pb-6 border-b border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="paypal" 
                        checked={paymentMethod === 'paypal'} 
                        onChange={() => setPaymentMethod('paypal')}
                        className="w-4 h-4 text-primary"
                      />
                      PayPal
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="stripe" 
                        checked={paymentMethod === 'stripe'} 
                        onChange={() => setPaymentMethod('stripe')}
                        className="w-4 h-4 text-primary"
                      />
                      Credit Card (Stripe)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="bank_transfer" 
                        checked={paymentMethod === 'bank_transfer'} 
                        onChange={() => setPaymentMethod('bank_transfer')}
                        className="w-4 h-4 text-primary"
                      />
                      Direct Bank Transfer
                    </label>
                  </div>

                    <div className="pt-2">
                       {!isFormValid && (
                          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 text-orange-800 rounded text-sm text-center font-medium">
                            Please fill in your billing & shipping address above to enable payment.
                          </div>
                      )}
                      
                      <div className={!isFormValid ? "opacity-50 pointer-events-none" : ""}>
                        {paymentMethod === 'bank_transfer' ? (
                          <div className="bg-gray-50 border border-gray-200 p-6 rounded text-sm text-gray-700">
                             <h4 className="font-bold text-black mb-2 text-base">Bank Account Details</h4>
                             <p className="mb-4">Please transfer the exact amount of <strong>${total}</strong> to the following account. Your order will be processed once payment is confirmed.</p>
                             
                             <div className="space-y-2 mb-6">
                               <div className="flex justify-between border-b pb-2">
                                 <span className="font-semibold">Bank Name:</span>
                                 <span>Mercury Bank</span>
                               </div>
                               <div className="flex justify-between border-b pb-2">
                                 <span className="font-semibold">Account Name:</span>
                                 <span>Imani Global LLC</span>
                               </div>
                               <div className="flex justify-between border-b pb-2">
                                 <span className="font-semibold">Account Number:</span>
                                 <span>1234567890</span>
                               </div>
                               <div className="flex justify-between pb-2">
                                 <span className="font-semibold">Routing Number:</span>
                                 <span>098765432</span>
                               </div>
                             </div>
                             
                             <button 
                              disabled={!isFormValid}
                              onClick={() => handleOrderSuccess(`BT-${Date.now()}`, 'Bank Transfer')}
                              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-md mt-4 disabled:opacity-50"
                             >
                               I have completed the transfer
                             </button>
                          </div>
                        ) : paymentMethod === 'paypal' ? (
                          paymentKeys?.paypalClientId ? (
                          <PayPalScriptProvider options={{ clientId: paymentKeys.paypalClientId, currency: "USD" }}>
                            <PayPalButtons 
                              disabled={!isFormValid}
                              createOrder={async () => {
                                const res = await fetch("/api/paypal/create-order", {
                                   method: "POST",
                                   headers: { "Content-Type": "application/json" },
                                   body: JSON.stringify({ total })
                                });
                                if (!res.ok) {
                                    const errorData = await res.json();
                                    alert(errorData.error || "Failed to create Paypal order.");
                                    throw new Error(errorData.error);
                                }
                                const orderData = await res.json();
                                return orderData.id;
                              }}
                              onApprove={async (data, actions) => {
                                const res = await fetch("/api/paypal/capture-order", {
                                   method: "POST",
                                   headers: { "Content-Type": "application/json" },
                                   body: JSON.stringify({ orderID: data.orderID })
                                });
                                if (!res.ok) {
                                    alert("Failed to capture Paypal payment");
                                    return;
                                }
                                const details = await res.json();
                                if (details.status === "COMPLETED") {
                                  await handleOrderSuccess(details.id, 'PayPal');
                                } else {
                                  alert("Payment wasn't completed.");
                                }
                              }}
                            />
                          </PayPalScriptProvider>
                          ) : (
                            <div className="text-center p-4 text-gray-500">PayPal is currently not configured</div>
                          )
                        ) : paymentMethod === 'stripe' ? (
                           stripeSetupError ? (
                             <div className="text-center p-4 text-red-600 bg-red-50 border border-red-200 rounded font-medium text-sm">
                               {stripeSetupError}
                             </div>
                           ) : clientSecret && stripePromise ? (
                              <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <StripeCheckoutForm total={total} onSuccess={(id) => handleOrderSuccess(id, 'Credit Card')} />
                              </Elements>
                           ) : isFormValid && paymentKeys?.stripePublishableKey ? (
                             <div className="flex justify-center p-4">Loading secure checkout...</div>
                           ) : (
                             <div className="text-center p-4 text-gray-500">Stripe securely configured or form is incomplete</div>
                           )
                        ) : null}
                      </div>
                    </div>
                </div>
              </div>
            </div>

      </div>
        </div>
      </div>
    </div>
  );
}
