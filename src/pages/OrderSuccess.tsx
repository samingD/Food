import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const method = location.state?.method;
  const orderId = location.state?.orderId;
  const isBankTransfer = method === 'Bank Transfer';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      {isBankTransfer ? (
        <Clock className="w-20 h-20 text-yellow-500 mb-6" />
      ) : (
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      )}
      
      <h1 className="text-4xl font-display font-bold mb-4">
        {isBankTransfer ? "Order Pending Payment" : "Order Successful!"}
      </h1>
      
      {isBankTransfer ? (
        <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded p-8 mb-8 text-left">
          <p className="text-lg text-gray-800 mb-4">
            Thank you for your order! Your order has been placed successfully but is pending payment. 
            Please use your Order ID <strong>#{orderId || "from your email"}</strong> as the payment reference when making the bank transfer.
          </p>
          
          <div className="bg-white p-6 border rounded shadow-sm">
             <h4 className="font-bold text-black mb-4 text-base uppercase tracking-widest text-sm">Bank Account Details</h4>
             <div className="space-y-3">
               <div className="flex justify-between border-b pb-2">
                 <span className="font-semibold text-gray-600">Bank Name:</span>
                 <span className="font-medium">Mercury Bank</span>
               </div>
               <div className="flex justify-between border-b pb-2">
                 <span className="font-semibold text-gray-600">Account Name:</span>
                 <span className="font-medium">Imani Global LLC</span>
               </div>
               <div className="flex justify-between border-b pb-2">
                 <span className="font-semibold text-gray-600">Account Number:</span>
                 <span className="font-medium">1234567890</span>
               </div>
               <div className="flex justify-between pb-2">
                 <span className="font-semibold text-gray-600">Routing Number:</span>
                 <span className="font-medium">098765432</span>
               </div>
             </div>
          </div>
          
          <p className="mt-6 text-sm text-gray-500 text-center">
            Your order will be processed and shipped as soon as we confirm the transferred funds in our account. This usually takes 1-3 business days.
          </p>
        </div>
      ) : (
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Thank you for your purchase. We have received your order and will process it shortly. 
          You will receive an email confirmation soon.
          {orderId && <span className="block mt-2 font-semibold">Order ID: #{orderId}</span>}
        </p>
      )}

      <Link 
        to="/" 
        className="bg-primary text-white py-3 px-8 rounded-lg font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-md"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default OrderSuccess;
