import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiTruck, FiArrowRight, FiCheck, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const directBuyItem = location.state?.directBuyItem;

  // Use direct buy item if present, otherwise use full cart
  const checkoutItems = directBuyItem ? [directBuyItem] : cartItems;
  
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [selectedAddress, setSelectedAddress] = useState(userInfo?.addresses?.find(a => a.isDefault) || userInfo?.addresses?.[0] || null);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = checkoutItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  const shipping = subtotal > 50 ? 0 : 10;
  
  const discountAmount = appliedCoupon ? (Number(subtotal) * appliedCoupon.discountPercentage) / 100 : 0;
  const total = (Number(subtotal) + shipping - discountAmount).toFixed(2);

  const applyCouponHandler = async () => {
    if (!couponCode) return;
    try {
      setIsApplying(true);
      const { data } = await api.post('/coupons/validate', { code: couponCode, cartTotal: Number(subtotal) });
      setAppliedCoupon(data);
      toast.success('Coupon applied successfully!');
      setIsApplying(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
      setIsApplying(false);
    }
  };

  const placeOrderHandler = async () => {
    try {
      setIsPlacingOrder(true);
      const orderData = {
        orderItems: checkoutItems,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          street: selectedAddress.street,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone
        },
        paymentMethod,
        itemsPrice: Number(subtotal),
        taxPrice: 0,
        shippingPrice: shipping,
        totalPrice: Number(total),
        discountPrice: discountAmount,
        couponCode: appliedCoupon?.code || '',
      };

      const { data } = await api.post('/orders', orderData);
      toast.success('Order placed successfully!');
      navigate(`/order/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setIsPlacingOrder(false);
    }
  };

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
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-50"
            >
              <h2 className="text-2xl font-black mb-8">Shipping Information</h2>
              
              <div className="space-y-4 mb-8">
                {!userInfo?.addresses?.length ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-4 font-medium">You don't have any saved addresses.</p>
                    <a href="/profile#addresses" className="btn-primary py-3 px-8 text-sm inline-block">Add Address in Profile</a>
                  </div>
                ) : (
                  userInfo.addresses.map((addr, idx) => (
                    <label key={idx} className={`flex items-start p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                      <input 
                        type="radio" 
                        name="address" 
                        className="mt-1 w-5 h-5 text-primary focus:ring-primary mr-4"
                        checked={selectedAddress === addr}
                        onChange={() => setSelectedAddress(addr)}
                      />
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-black text-lg text-accent">{addr.fullName}</h4>
                          {addr.isDefault && <span className="bg-primary text-white text-[9px] font-black uppercase tracking-[2px] px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <p className="text-gray-500 font-medium text-sm">{addr.street}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}</p>
                        <p className="text-gray-400 font-bold text-xs mt-1">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>

              <div className="flex justify-between items-center">
                <a href="/profile#addresses" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">Manage Addresses</a>
                <button 
                  type="button"
                  disabled={!selectedAddress}
                  onClick={() => setStep(2)}
                  className={`btn-primary h-14 px-8 flex items-center justify-center space-x-2 ${!selectedAddress && 'opacity-50 cursor-not-allowed'}`}
                >
                  <span>Continue to Payment</span>
                  <FiArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-50"
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
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-50"
            >
              <h2 className="text-2xl font-black mb-8">Confirm Your Order</h2>
              <div className="p-6 bg-gray-50 rounded-2xl mb-8">
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Shipping To:</h4>
                <p className="font-bold">{selectedAddress?.fullName}</p>
                <p className="text-gray-500">{selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.postalCode}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl mb-10">
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Payment Method:</h4>
                <p className="font-bold">{paymentMethod}</p>
              </div>
              <button 
                onClick={placeOrderHandler}
                disabled={isPlacingOrder}
                className="w-full btn-primary h-16 text-lg font-black uppercase tracking-widest flex items-center justify-center space-x-2"
              >
                {isPlacingOrder ? <FiLoader className="animate-spin text-2xl" /> : <span>Place Order - ${total}</span>}
              </button>
            </motion.div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-xl shadow-premium border border-gray-50 sticky top-28">
            <h3 className="text-xl font-black mb-6">In Your Bag</h3>
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
              {checkoutItems.map((item) => (
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
            
            {/* Promo Code */}
            <div className="mb-6 pt-6 border-t border-gray-100">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Promo Code" 
                  className="input-premium flex-grow h-12 text-sm"
                  disabled={!!appliedCoupon}
                />
                {!appliedCoupon ? (
                  <button 
                    onClick={applyCouponHandler} 
                    disabled={isApplying || !couponCode}
                    className="btn-primary px-6 text-xs h-12 flex items-center justify-center min-w-[80px]"
                  >
                    {isApplying ? <FiLoader className="animate-spin" /> : 'Apply'}
                  </button>
                ) : (
                  <button 
                    onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} 
                    className="btn-secondary px-6 text-xs h-12 text-red-500 hover:text-white hover:bg-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p className="text-green-500 text-xs font-bold mt-2">
                  {appliedCoupon.code} applied! ({appliedCoupon.discountPercentage}% off)
                </p>
              )}
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
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-500 font-bold">
                  <span>Discount ({appliedCoupon.discountPercentage}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
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


