import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { getStoredCart, saveStoredCart } from '../utils/store';
import { fetchProducts, insertWhatsappRequest } from '../utils/db';
import type { Product } from '../utils/store';
import Navbar from '../components/layout/Navbar';
import type { OrderItem } from '../utils/store';
import { useAuth } from '../hooks/useAuth';

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {
    setCartItems(getStoredCart());
    fetchProducts().then(setProductsList).catch(console.error);
  }, [user]);

  const updateQuantity = (idx: number, delta: number) => {
    const updated = [...cartItems];
    updated[idx].quantity += delta;
    if (updated[idx].quantity <= 0) {
      updated.splice(idx, 1);
    }
    setCartItems(updated);
    saveStoredCart(updated);
    window.dispatchEvent(new Event("cart_updated"));
  };

  const removeItem = (idx: number) => {
    const updated = [...cartItems];
    updated.splice(idx, 1);
    setCartItems(updated);
    saveStoredCart(updated);
    window.dispatchEvent(new Event("cart_updated"));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalAmount = subtotal;

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }
    if (cartItems.length === 0) return;

    // Strict 10-digit phone number check
    const digits = custPhone.replace(/\D/g, '');
    const cleanDigits = (digits.length === 12 && digits.startsWith('91')) ? digits.substring(2) : digits;
    if (cleanDigits.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const orderData = {
      customerName: custName,
      customerPhone: cleanDigits,
      customerEmail: user.email || "",
      customerAddress: custAddress,
      items: cartItems,
      totalPrice: totalAmount,
    };

    insertWhatsappRequest(orderData).catch(console.error);
    
    let whatsappNumber = import.meta.env.VITE_ADMIN_WHATSAPP_1 || "917904199050";
    whatsappNumber = whatsappNumber.replace(/\D/g, '');
    if (whatsappNumber.length === 10) {
      whatsappNumber = `91${whatsappNumber}`;
    }

    const emojiSeedling = String.fromCodePoint(0x1F33F);
    const emojiUser = String.fromCodePoint(0x1F464);
    const emojiPhone = String.fromCodePoint(0x1F4DE);
    const emojiPin = String.fromCodePoint(0x1F4CD);
    const emojiBox = String.fromCodePoint(0x1F4E6);
    const emojiMoney = String.fromCodePoint(0x1F4B0);
    const emojiSparkles = String.fromCodePoint(0x2728);
    const bullet = String.fromCodePoint(0x2022);
    const rupee = String.fromCodePoint(0x20B9);

    const orderLines = cartItems.map(it => `${bullet} ${it.quantity}x *${it.name}* (${it.size}) - ${rupee}${it.price * it.quantity}`).join("\n");
    const text = `${emojiSeedling} *ORGANIC SISTERZ - NEW ORDER* ${emojiSeedling}\n----------------------------------\n${emojiUser} *Customer:* ${custName}\n${emojiPhone} *Phone:* ${custPhone}\n${emojiPin} *Delivery Address:* ${custAddress}\n\n${emojiBox} *Products Ordered:*\n${orderLines}\n\n${emojiMoney} *Total Amount:* *${rupee}${totalAmount}*\n----------------------------------\n${emojiSparkles} Thank you for choosing organic, clean, botanical solutions! ${emojiSparkles}`;
    
    // Bulletproof Redirect
    const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
    const a = document.createElement("a");
    a.href = whatsappLink;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setCartItems([]);
    saveStoredCart([]);
    window.dispatchEvent(new Event("cart_updated"));

    // Reset fields
    setCustName("");
    setCustPhone("");
    setCustAddress("");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B3022] font-body flex flex-col items-center selection:bg-primary/10">
      <Navbar
        onConsultationClick={() => navigate("/")}
        onAdminClick={() => navigate("/admin")}
        onGiftClick={() => navigate("/gift")}
      />

      {/* Main Content */}
      <main className="w-full max-w-6xl px-6 py-8 md:py-16 mt-20 flex-grow flex flex-col">
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-outline-variant/20 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1B3022]/10 rounded-2xl flex items-center justify-center border border-[#1B3022]/10 shadow-sm">
              <ShoppingBag className="w-5 h-5 text-[#1B3022]" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-medium tracking-tight text-[#1B3022]">
                Secure Checkout
              </h1>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Complete your organic order via WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#4A5D52] hover:text-[#1B3022] transition-colors font-display uppercase tracking-widest text-[10px] font-bold self-start sm:self-center"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center flex flex-col items-center bg-white rounded-3xl border border-outline-variant/20 shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-[#FAF9F5] border border-outline-variant/20 flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-outline-variant/60" />
            </div>
            <h2 className="text-xl font-display font-bold text-primary mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-on-surface-variant/80 text-sm max-w-sm">
              Looks like you haven't added any clinical botanical solutions to
              your cart yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Explore Collection
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Side: Cart Items */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 space-y-6"
            >
              <h2 className="font-display text-sm font-bold text-[#1B3022] uppercase tracking-wider">
                Order Summary ({cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"})
              </h2>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, idx) => {
                  const product = productsList.find(
                    (p) => p.id === item.productId,
                  );
                  const productImage = product?.image || "/placeholder.jpg";
                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-outline-variant/20 shadow-sm hover:border-[#1B3022]/20 hover:shadow-md transition-all duration-300"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-3.5 sm:gap-4 flex-grow min-w-0">
                        {/* Product Thumbnail */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center border border-outline-variant/20 shrink-0 shadow-sm">
                          <img
                            src={productImage}
                            alt={item.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="min-w-0 flex-grow">
                          <h4 className="font-display font-bold text-[#1B3022] text-sm sm:text-base leading-snug break-words">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-on-surface-variant/80 font-bold uppercase tracking-wider mt-1 block">
                            Size: {item.size} • Unit Price: ₹{item.price}
                          </span>
                        </div>
                      </div>

                      {/* Right: Quantity & Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t border-outline-variant/10 pt-3 sm:pt-0 sm:border-t-0 shrink-0 w-full sm:w-auto">
                        <div className="flex items-center gap-3 bg-[#FAF9F5] border border-outline-variant/30 rounded-full p-1 shadow-sm">
                          <button
                            type="button"
                            onClick={() => updateQuantity(idx, -1)}
                            className="w-7 h-7 rounded-full bg-white border border-outline-variant/20 hover:border-[#1B3022] flex items-center justify-center transition-all cursor-pointer shadow-sm text-primary"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-body font-bold text-xs w-4 text-center text-[#1B3022]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(idx, 1)}
                            className="w-7 h-7 rounded-full bg-white border border-outline-variant/20 hover:border-[#1B3022] flex items-center justify-center transition-all cursor-pointer shadow-sm text-primary"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 min-w-[80px] justify-end">
                          <span className="font-display font-extrabold text-base text-[#1B3022]">
                            ₹{item.price * item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-[9px] text-error hover:text-red-700 font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Side: Customer Details & Total */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5 bg-white rounded-3xl border border-outline-variant/20 shadow-lg overflow-hidden sticky top-28"
            >
              <div className="px-8 py-6 border-b border-outline-variant/15 text-center">
                <h3 className="font-display font-bold text-sm tracking-[0.15em] uppercase text-[#1B3022]">
                  Shipping & Billing
                </h3>
              </div>

              <form onSubmit={handlePlaceOrderSubmit} className="p-8 space-y-6">
                {/* Form Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3022]/80 uppercase tracking-widest mb-2">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full border border-outline-variant/40 focus:border-[#1B3022] rounded-xl px-4 py-3.5 text-sm bg-[#FAF9F5] text-[#1B3022] outline-none transition-all shadow-inner focus:bg-white"
                      placeholder="E.g., Jane Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3022]/80 uppercase tracking-widest mb-2">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      required
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={custPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setCustPhone(val);
                      }}
                      className="w-full border border-outline-variant/40 focus:border-[#1B3022] rounded-xl px-4 py-3.5 text-sm bg-[#FAF9F5] text-[#1B3022] outline-none transition-all shadow-inner focus:bg-white"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#1B3022]/80 uppercase tracking-widest mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      required
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      rows={3}
                      className="w-full border border-outline-variant/40 focus:border-[#1B3022] rounded-xl px-4 py-3.5 text-sm bg-[#FAF9F5] text-[#1B3022] outline-none transition-all shadow-inner focus:bg-white resize-none"
                      placeholder="Flat/House No., Street Name, Landmark, City & Pincode"
                    />
                  </div>
                </div>

                <hr className="border-outline-variant/20" />

                {/* Totals */}
                <div className="space-y-3.5">
                  <div className="text-right text-xs text-on-surface-variant italic mb-2">
                    *Delivery charges may apply depending upon your location
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="font-display font-bold text-xs text-[#1B3022] uppercase tracking-widest">
                      Total Amount
                    </span>
                    <span className="font-display font-extrabold text-2xl text-[#1B3022]">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  {user ? (
                    <button
                      type="submit"
                      className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-display text-xs font-bold tracking-[0.2em] uppercase py-4.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer select-none"
                    >
                      <svg
                        className="w-4 h-4 fill-current shrink-0"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.887-6.963C16.486 1.928 14.011.904 11.39.903c-5.44 0-9.863 4.42-9.867 9.852-.001 1.814.48 3.59 1.39 5.168l-.934 3.41 3.498-.918zm11.517-5.69c-.297-.15-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      </svg>
                      Place Order via WhatsApp
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="w-full bg-[#1B3022] hover:bg-[#2C4835] text-white font-display text-xs font-bold tracking-[0.2em] uppercase py-4.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer select-none"
                    >
                      Log In to Place Order
                    </button>
                  )}
                  <p className="text-center text-[9px] text-on-surface-variant mt-3 uppercase tracking-wider font-semibold opacity-75">
                    Your shopping cart is fully secure
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
