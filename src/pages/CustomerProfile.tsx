import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, LogOut, Leaf, ShoppingBag, Settings } from 'lucide-react';
import { getStoredOrders } from '../utils/store';
import type { Order } from '../utils/store';

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    // Fetch orders to display in the dummy profile
    // Filtering out gifts just to show standard purchases
    setOrders(getStoredOrders().filter(o => !o.isGift).reverse());
  }, []);

  const handleLogout = () => {
    // Dummy logout
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B3022] font-body flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-outline-variant/25 flex flex-col p-8 shrink-0 shadow-sm md:min-h-screen">
        <div className="flex flex-col gap-8 mb-10 border-b border-outline-variant/10 pb-8">
          
          <button 
            onClick={() => navigate('/')}
            className="self-start text-[#6B7280] hover:text-[#1B3022] transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </button>

          <div className="flex items-center gap-4 mt-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-primary">Guest User</h2>
              <span className="text-xs text-on-surface-variant font-medium">VIP Member</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 flex-grow">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3.5 text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#1B3022] text-white shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <span>My Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3.5 text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#1B3022] text-white shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <Settings className="w-4.5 h-4.5" />
            <span>Account Details</span>
          </button>
        </div>

        <div className="pt-8 border-t border-outline-variant/15 mt-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 text-xs font-bold text-error uppercase tracking-wider hover:bg-red-50 py-3.5 px-4 rounded-xl transition-all cursor-pointer border border-red-200/50"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 md:p-12 overflow-y-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {activeTab === 'orders' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-display font-bold text-primary tracking-tight">Order History</h1>
                <p className="text-sm text-on-surface-variant mt-2">Track the status of your recent botanical formulations.</p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-outline-variant/20 shadow-sm flex flex-col items-center justify-center h-64">
                  <Package className="w-12 h-12 text-outline-variant/50 mb-4" />
                  <p className="text-on-surface-variant text-sm font-medium">You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/')} className="mt-6 bg-primary text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-primary-container transition-all">Start Shopping</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      {/* Order Header */}
                      <div className="bg-surface-container-low px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/20 gap-4">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
                          <div>
                            <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Order Placed</span>
                            <span className="text-sm font-semibold text-primary">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total</span>
                            <span className="text-sm font-bold text-primary">₹{order.totalPrice.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Ship To</span>
                            <span className="text-sm font-semibold text-primary">{order.customerName || 'Guest'}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Order #</span>
                          <span className="text-sm font-bold text-primary">{order.id}</span>
                        </div>
                      </div>

                      {/* Order Body */}
                      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between items-start">
                        <div className="flex-grow space-y-6 w-full">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <h3 className="font-bold text-lg text-primary">{order.status === 'Processing' ? 'Preparing your blend...' : order.status}</h3>
                          </div>
                          
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-[#FAF9F5] border border-outline-variant/30 flex items-center justify-center shrink-0">
                                  <Leaf className="w-6 h-6 text-[#2B3E2F]/40" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-primary text-sm">{item.name}</h4>
                                  <p className="text-xs text-on-surface-variant mt-1">{item.size} • Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="w-full md:w-48 shrink-0 flex flex-col gap-3">
                          <button className="w-full bg-[#FAF9F5] border border-outline-variant/50 hover:bg-[#1B3022] hover:text-white hover:border-[#1B3022] text-[#1B3022] text-xs font-bold tracking-widest uppercase py-3 rounded-xl transition-all cursor-pointer">
                            Reorder
                          </button>
                          <button className="w-full bg-white border border-outline-variant/30 hover:border-primary text-primary text-xs font-bold tracking-widest uppercase py-3 rounded-xl transition-all cursor-pointer">
                            View Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-display font-bold text-primary tracking-tight">Account Details</h1>
                <p className="text-sm text-on-surface-variant mt-2">Manage your personal information and shipping addresses.</p>
              </div>

              <div className="bg-white rounded-3xl border border-outline-variant/20 shadow-sm p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" value="Guest User" readOnly className="w-full border border-outline-variant/40 rounded-xl py-3.5 px-4 text-sm text-primary bg-[#FAF9F5]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" value="guest@example.com" readOnly className="w-full border border-outline-variant/40 rounded-xl py-3.5 px-4 text-sm text-primary bg-[#FAF9F5]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Primary Shipping Address</label>
                    <textarea readOnly className="w-full border border-outline-variant/40 rounded-xl py-3.5 px-4 text-sm text-primary bg-[#FAF9F5] min-h-[100px]" value="123 Herbal Garden Road, Chennai, Tamil Nadu, 600001" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-outline-variant/20">
                  <button className="bg-[#1B3022] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-[#0C1510] transition-all cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
