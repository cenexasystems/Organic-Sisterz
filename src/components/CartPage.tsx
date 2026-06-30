import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Trash2, MessageSquare, Plus, Minus, ShoppingBag } from 'lucide-react';
import { getStoredCart, saveStoredCart, addOrder } from '../utils/store';
import Navbar from './Navbar';
import type { OrderItem } from '../utils/store';

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");

  useEffect(() => {
    setCartItems(getStoredCart());
  }, []);

  const updateQuantity = (idx: number, delta: number) => {
    const updated = [...cartItems];
    updated[idx].quantity += delta;
    if (updated[idx].quantity <= 0) {
      updated.splice(idx, 1);
    }
    setCartItems(updated);
    saveStoredCart(updated);
    window.dispatchEvent(new Event('cart_updated'));
  };

  const removeItem = (idx: number) => {
    const updated = [...cartItems];
    updated.splice(idx, 1);
    setCartItems(updated);
    saveStoredCart(updated);
    window.dispatchEvent(new Event('cart_updated'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal > 0 && subtotal < 1000 ? 50 : 0;
  const totalAmount = subtotal + deliveryCharge;

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const orderData = {
      customerName: custName,
      customerPhone: custPhone,
      customerEmail: "WhatsApp Web Order",
      customerAddress: custAddress,
      items: cartItems,
      totalPrice: totalAmount,
    };

    const newOrder = addOrder(orderData);
    
    const whatsappNumber = import.meta.env.VITE_ADMIN_WHATSAPP_1 || "917904199050";
    const orderLines = cartItems.map(it => `${it.quantity}x ${it.name} (${it.size}) - ₹${it.price * it.quantity}`).join("\n");
    const text = `*New Store Order!* (${newOrder.id})\n\n*Customer:* ${custName}\n*Phone:* ${custPhone}\n*Address:* ${custAddress}\n\n*Products:*\n${orderLines}\n\n*Subtotal:* ₹${subtotal}\n*Delivery:* ₹${deliveryCharge}\n*Total:* ₹${totalAmount}`;
    
    // Bulletproof Redirect
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    const a = document.createElement('a');
    a.href = whatsappLink;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setCartItems([]);
    saveStoredCart([]);
    window.dispatchEvent(new Event('cart_updated'));
    
    // Reset fields
    setCustName("");
    setCustPhone("");
    setCustAddress("");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B3022] font-body flex flex-col items-center">
      <Navbar 
        onConsultationClick={() => navigate('/')} 
        onAdminClick={() => navigate('/admin')}
        onGiftClick={() => navigate('/gift')}
      />
      
      {/* Main Content */}
      <main className="w-full max-w-7xl px-4 py-8 md:py-12 mt-20 flex-grow flex flex-col">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary">Secure Checkout</h1>
        </div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center flex flex-col items-center bg-white rounded-3xl border border-outline-variant/30 shadow-sm"
          >
            <ShoppingBag className="w-16 h-16 text-outline-variant/50 mb-4" />
            <p className="text-on-surface-variant font-medium text-lg">Your cart is currently empty.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 bg-primary text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Side: Cart Items */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 space-y-6"
            >
              <h2 className="text-xl font-display font-bold text-primary border-b border-outline-variant/30 pb-4">
                Order Summary ({cartItems.length} items)
              </h2>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-sm hover:border-primary/20 transition-colors">
                    <div className="flex-grow">
                      <h4 className="font-bold text-primary text-sm md:text-base">{item.name}</h4>
                      <span className="text-xs text-on-surface-variant uppercase tracking-widest mt-1 block">{item.size} • ₹{item.price}</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 bg-[#FAF9F5] border border-outline-variant/50 rounded-full p-1 shadow-sm">
                        <button onClick={() => updateQuantity(idx, -1)} className="w-7 h-7 rounded-full hover:bg-outline-variant flex items-center justify-center transition-colors cursor-pointer">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(idx, 1)} className="w-7 h-7 rounded-full hover:bg-outline-variant flex items-center justify-center transition-colors cursor-pointer">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1 min-w-[80px]">
                        <span className="font-bold text-base text-primary">₹{item.price * item.quantity}</span>
                        <button onClick={() => removeItem(idx)} className="text-[10px] text-error hover:text-red-700 font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side: Customer Details & Total */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 bg-white rounded-3xl border border-outline-variant/30 shadow-lg overflow-hidden sticky top-24"
            >
              <div className="bg-[#1B3022] text-white p-6 text-center">
                <h3 className="font-display font-bold text-lg tracking-wide uppercase">Shipping Details</h3>
              </div>
              
              <form onSubmit={handlePlaceOrderSubmit} className="p-6 md:p-8 space-y-6">
                
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Full Name</label>
                    <input required type="text" value={custName} onChange={e => setCustName(e.target.value)} className="w-full border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm bg-[#FAF9F5] outline-none transition-all" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Phone Number (WhatsApp)</label>
                    <input required type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} className="w-full border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm bg-[#FAF9F5] outline-none transition-all" placeholder="Enter your mobile number" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Delivery Address</label>
                    <textarea required value={custAddress} onChange={e => setCustAddress(e.target.value)} rows={3} className="w-full border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-sm bg-[#FAF9F5] outline-none transition-all resize-none" placeholder="Flat, Street, Landmark, Pincode" />
                  </div>
                </div>

                <hr className="border-outline-variant/30" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-on-surface-variant">
                    <span>Delivery Charge</span>
                    <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between items-end pt-3 border-t border-outline-variant/30">
                    <span className="font-bold text-sm text-primary uppercase tracking-widest">Total Amount</span>
                    <span className="font-display font-extrabold text-2xl text-primary">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-2">
                  <button type="submit" className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold tracking-widest uppercase text-xs py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer">
                    <MessageSquare className="w-4 h-4" />
                    Place Order via WhatsApp
                  </button>
                  <p className="text-center text-[10px] text-on-surface-variant mt-3 uppercase tracking-wider">
                    You will be redirected securely
                  </p>
                </div>

              </form>
            </motion.div>
            
          </div>
        )}
      </main>
    </div>
  );
}
