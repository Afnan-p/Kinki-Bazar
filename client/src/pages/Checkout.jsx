import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiMapPin, FiCreditCard, FiTruck, FiArrowRight, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = (Number(subtotal) + shipping).toFixed(2);

  const steps = [
    { id: 1, name: 'Shipping', icon: <FiMapPin /> },
    { id: 2, name: 'Payment', icon: <FiCreditCard /> },
    { id: 3, name: 'Confirm', icon: <FiCheck /> },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      {/* Progress Stepper */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                step >= s.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-400 border-2 border-gray-100'
              }`}>
                {s.icon}
              </div>
              <span className={`text-xs font-black uppercase tracking-widest mt-3 ${
                step >= s.id ? 'text-primary' : 'text-gray-400'
              }`}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        <div className="lg:col-span-2">
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50"
            >
              <h2 className="text-2xl font-black mb-8">Shipping Information</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Address</label>
                  <input type="text" placeholder="123 Street Name" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">City</label>
                  <input type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Postal Code</label>
                  <input type="text" placeholder="123456" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all" />
                </div>
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="md:col-span-2 btn-primary h-14 mt-4 flex items-center justify-center space-x-2"
                >
                  <span>Continue to Payment</span>
                  <FiArrowRight />
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50"
            >
              <h2 className="text-2xl font-black mb-8">Payment Method</h2>
              <div className="space-y-4 mb-10">
                {[
                  { id: 'Razorpay', name: 'Razorpay (Cards, UPI, Netbanking)', img: 'https://img.icons8.com/color/48/000000/razorpay.png' },
                  { id: 'Stripe', name: 'Stripe (Credit/Debit Card)', img: 'https://img.icons8.com/color/48/000000/visa.png' },
                  { id: 'COD', name: 'Cash on Delivery', img: 'https://img.icons8.com/ios-filled/50/000000/cash-on-delivery.png' },
                ].map((m) => (
                  <label 
                    key={m.id}
                    className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === m.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                        className="w-5 h-5 text-primary" 
                      />
                      <span className="font-bold">{m.name}</span>
                    </div>
                    <img src={m.img} className="h-8 grayscale opacity-50" alt="" />
                  </label>
                ))}
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setStep(1)} className="flex-1 btn-secondary h-14">Back</button>
                <button onClick={() => setStep(3)} className="flex-[2] btn-primary h-14">Final Review</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50"
            >
              <h2 className="text-2xl font-black mb-8">Confirm Your Order</h2>
              <div className="p-6 bg-gray-50 rounded-2xl mb-8">
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Shipping To:</h4>
                <p className="font-bold">John Doe</p>
                <p className="text-gray-500">123 Street Name, City, 123456</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl mb-10">
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Payment Method:</h4>
                <p className="font-bold">{paymentMethod}</p>
              </div>
              <button className="w-full btn-primary h-16 text-lg font-black uppercase tracking-widest">
                Place Order - ${total}
              </button>
            </motion.div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[32px] shadow-premium border border-gray-50 sticky top-28">
            <h3 className="text-xl font-black mb-6">In Your Bag</h3>
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400">{item.qty} x ${item.price}</p>
                  </div>
                  <span className="font-bold text-sm">${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-accent">${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="font-bold text-accent">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-4 border-t border-gray-50">
                <span>Total</span>
                <span className="text-primary">${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
