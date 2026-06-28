import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, Plus, Trash2, Edit3, Settings, Eye, 
  LayoutDashboard, MessageSquare, BarChart3, ShoppingCart, Receipt, 
  Package, FolderTree, Ticket, Users, RefreshCw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStoredProducts, saveStoredProducts, getStoredOrders, saveStoredOrders } from '../utils/store';
import type { Product, Order } from '../utils/store';

export interface Coupon {
  code: string;
  discount: number;
  minOrder: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function AdminPortal() {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  
  // Set passcode bypassed (authenticated by default) as requested: "remove pass for now"
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Tabs matching the reference image
  const [activeTab, setActiveTab] = useState<'dashboard' | 'whatsapp' | 'pos_billing' | 'analytics' | 'orders' | 'products' | 'categories' | 'coupons' | 'users'>('whatsapp');

  // POS Billing states
  const [billingCustomerName, setBillingCustomerName] = useState('');
  const [billingCustomerPhone, setBillingCustomerPhone] = useState('');
  const [billingSource, setBillingSource] = useState<'OFFLINE' | 'ONLINE'>('OFFLINE');
  const [billingItems, setBillingItems] = useState<{ id: string; name: string; size: string; price: number; quantity: number; isCustom?: boolean }[]>([]);
  const [billingCoupon, setBillingCoupon] = useState('');
  const [billingDiscountType, setBillingDiscountType] = useState<'₹' | '%'>('₹');
  const [billingDiscountValue, setBillingDiscountValue] = useState<number>(0);
  const [billingDeliveryFee, setBillingDeliveryFee] = useState<number>(0);
  const [billingAmountReceived, setBillingAmountReceived] = useState<number>(0);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [activeCatalogRowId, setActiveCatalogRowId] = useState<string | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Form states for product
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Hair Care');
  const [prodDesc, setProdDesc] = useState('');
  const [prodHerbs, setProdHerbs] = useState('');
  const [prodBenefits, setProdBenefits] = useState('');
  const [prodSizes, setProdSizes] = useState<{ size: string; price: number }[]>([{ size: '', price: 0 }]);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filter state for dashboard/whatsapp center
  const [periodFilter, setPeriodFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Filters for Orders Hub tab (Bills)
  const [ordersSourceFilter, setOrdersSourceFilter] = useState<'ALL' | 'OFFLINE' | 'ONLINE' | 'MANUAL'>('ALL');
  const [ordersDateFilter, setOrdersDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'CUSTOM'>('ALL');
  const [ordersSearchInvoice, setOrdersSearchInvoice] = useState('');
  const [ordersSearchName, setOrdersSearchName] = useState('');
  const [ordersSearchPhone, setOrdersSearchPhone] = useState('');
  const [ordersStartDate, setOrdersStartDate] = useState('');
  const [ordersEndDate, setOrdersEndDate] = useState('');

  // Category and Coupon list state
  const [categories, setCategories] = useState<string[]>(['Hair Care', 'Skin Care', 'Nutrition', 'Pooja Items']);
  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: 'VILLAGES', discount: 15, minOrder: 1, expiryDate: '2026-06-19', usageLimit: 20, usedCount: 0, status: 'ACTIVE' },
    { code: 'MNMKL', discount: 10, minOrder: 1, expiryDate: '2026-07-31', usageLimit: 100, usedCount: 0, status: 'ACTIVE' },
    { code: 'WELCOME', discount: 10, minOrder: 10, expiryDate: '2026-12-31', usageLimit: 50, usedCount: 1, status: 'ACTIVE' },
    { code: 'SAVE10', discount: 10, minOrder: 1, expiryDate: '', usageLimit: 0, usedCount: 0, status: 'ACTIVE' }
  ]);
  const [adminUsers, setAdminUsers] = useState<{ name: string; role: string }[]>([
    { name: 'Anand Sivaram', role: 'System Owner' },
    { name: 'Organic Sisterz', role: 'Store Administrator' }
  ]);

  // Form states for category/coupon
  const [newCatName, setNewCatName] = useState('');
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(10);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<number>(1);
  const [newCouponExpiryDate, setNewCouponExpiryDate] = useState('');
  const [newCouponUsageLimit, setNewCouponUsageLimit] = useState<number>(20);
  const [editingCouponCode, setEditingCouponCode] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
  }, []);

  const handleRefresh = () => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    alert('Dashboard data refreshed successfully!');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '9940088786') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Admin Passcode');
      setPasscode('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
  };

  // Add/Remove size fields in form
  const addSizeField = () => {
    setProdSizes([...prodSizes, { size: '', price: 0 }]);
  };

  const removeSizeField = (index: number) => {
    const newSizes = [...prodSizes];
    newSizes.splice(index, 1);
    setProdSizes(newSizes);
  };

  const handleSizeChangeInForm = (index: number, field: 'size' | 'price', value: string | number) => {
    const newSizes = [...prodSizes];
    if (field === 'size') {
      newSizes[index].size = value as string;
    } else {
      newSizes[index].price = Number(value);
    }
    setProdSizes(newSizes);
  };

  // Open Edit Product form
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdDesc(prod.description);
    setProdHerbs(prod.herbs);
    setProdBenefits(prod.benefits.join('\n'));
    setProdSizes(prod.sizes.length > 0 ? [...prod.sizes] : [{ size: '', price: 0 }]);
    setIsAddingProduct(false);
  };

  // Open Add Product form
  const startAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Hair Care');
    setProdDesc('');
    setProdHerbs('');
    setProdBenefits('');
    setProdSizes([{ size: '', price: 0 }]);
    setIsAddingProduct(true);
  };

  // Save product (Add or Edit)
  const saveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSizes = prodSizes.filter(s => s.size.trim() !== '' && s.price > 0);
    if (cleanSizes.length === 0) {
      alert('Please add at least one valid size option with a price.');
      return;
    }

    const benefitsArray = prodBenefits.split('\n').filter(b => b.trim() !== '');

    let updatedList = [...products];

    if (editingProduct) {
      // Edit mode
      updatedList = updatedList.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: prodName,
            category: prodCategory,
            description: prodDesc,
            herbs: prodHerbs,
            benefits: benefitsArray,
            sizes: cleanSizes
          };
        }
        return p;
      });
      setEditingProduct(null);
    } else {
      // Add mode
      const newProd: Product = {
        id: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: prodName,
        category: prodCategory,
        description: prodDesc,
        image: '/herbal-hair-oil.jpeg', // default fallback asset
        herbs: prodHerbs,
        benefits: benefitsArray,
        sizes: cleanSizes
      };
      updatedList.push(newProd);
      setIsAddingProduct(false);
    }

    saveStoredProducts(updatedList);
    setProducts(updatedList);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const filtered = products.filter(p => p.id !== id);
      saveStoredProducts(filtered);
      setProducts(filtered);
    }
  };

  // Order status updates
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const updatedOrder = { ...o, status: newStatus };
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        return updatedOrder;
      }
      return o;
    });
    saveStoredOrders(updated);
    setOrders(updated);
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const filtered = orders.filter(o => o.id !== orderId);
      saveStoredOrders(filtered);
      setOrders(filtered);
      setSelectedOrder(null);
    }
  };

  // Category additions
  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    if (categories.includes(newCatName.trim())) {
      alert('Category already exists.');
      return;
    }
    setCategories([...categories, newCatName.trim()]);
    setNewCatName('');
  };

  const deleteCategory = (cat: string) => {
    if (window.confirm(`Are you sure you want to delete category "${cat}"?`)) {
      setCategories(categories.filter(c => c !== cat));
    }
  };

  // Coupon additions
  const addCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || newCouponDiscount <= 0) return;
    
    const formattedCode = newCouponCode.trim().toUpperCase();
    
    if (editingCouponCode) {
      // Update existing coupon
      setCoupons(prev => prev.map(c => c.code === editingCouponCode ? {
        ...c,
        code: formattedCode,
        discount: newCouponDiscount,
        minOrder: newCouponMinOrder,
        expiryDate: newCouponExpiryDate,
        usageLimit: newCouponUsageLimit
      } : c));
      setEditingCouponCode(null);
    } else {
      // Create new coupon
      if (coupons.some(c => c.code.toUpperCase() === formattedCode)) {
        alert('Coupon code already exists.');
        return;
      }
      const newCp: Coupon = {
        code: formattedCode,
        discount: newCouponDiscount,
        minOrder: newCouponMinOrder,
        expiryDate: newCouponExpiryDate,
        usageLimit: newCouponUsageLimit,
        usedCount: 0,
        status: 'ACTIVE'
      };
      setCoupons([...coupons, newCp]);
    }
    
    // Reset form states
    setNewCouponCode('');
    setNewCouponDiscount(10);
    setNewCouponMinOrder(1);
    setNewCouponExpiryDate('');
    setNewCouponUsageLimit(20);
  };

  const startEditCoupon = (cp: Coupon) => {
    setEditingCouponCode(cp.code);
    setNewCouponCode(cp.code);
    setNewCouponDiscount(cp.discount);
    setNewCouponMinOrder(cp.minOrder);
    setNewCouponExpiryDate(cp.expiryDate || '');
    setNewCouponUsageLimit(cp.usageLimit || 0);
  };

  const deleteCoupon = (code: string) => {
    setCoupons(coupons.filter(c => c.code !== code));
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : c));
  };

  const formatCouponExpiry = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const isCouponExpired = (dateStr?: string) => {
    if (!dateStr) return false;
    const expiry = new Date(dateStr);
    if (isNaN(expiry.getTime())) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    return expiry < today;
  };

  const handleGenerateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCouponCode(code);
  };

  // WhatsApp message builder and dynamic formatter matching the screenshot
  const formatWhatsAppMessage = (order: Order) => {
    const itemsText = order.items.map(it => {
      const sizeStr = it.size && it.size !== '—' ? ` - ${it.size}` : '';
      return `• ${it.name}${sizeStr} x ${it.quantity} - ₹${it.price * it.quantity}`;
    }).join('\n');
    return `🌿 *Order Request - Naatu Marundhu*\n👤 ${order.customerName}\n📞 ${order.customerPhone}\n📍 ${order.customerAddress}\n📦 *Items:*\n${itemsText}\n💰 *Estimated Total: ₹${order.totalPrice}*`;
  };

  const generateWhatsAppLink = (order: Order) => {
    const msg = formatWhatsAppMessage(order);
    return `https://wa.me/917904199050?text=${encodeURIComponent(msg)}`;
  };

  // POS Billing Helper Functions
  const getSubtotal = () => billingItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  
  const getCouponDiscount = (subtotal: number) => {
    if (!billingCoupon) return 0;
    const found = coupons.find(c => c.code === billingCoupon);
    if (!found) return 0;
    return (subtotal * found.discount) / 100;
  };

  const getManualDiscount = (subtotal: number) => {
    if (billingDiscountType === '₹') {
      return billingDiscountValue;
    } else {
      return (subtotal * billingDiscountValue) / 100;
    }
  };

  const getGrandTotal = () => {
    const subtotal = getSubtotal();
    const couponDisc = getCouponDiscount(subtotal);
    const manualDisc = getManualDiscount(subtotal);
    const delivery = billingDeliveryFee;
    return Math.max(0, subtotal - couponDisc - manualDisc + delivery);
  };

  const addCustomItem = () => {
    setBillingItems([
      ...billingItems,
      { id: Math.random().toString(), name: '', size: '', price: 0, quantity: 1, isCustom: true }
    ]);
  };

  const removeBillingItem = (id: string) => {
    setBillingItems(billingItems.filter(it => it.id !== id));
  };

  const updateBillingItem = (id: string, field: string, value: any) => {
    setBillingItems(billingItems.map(it => {
      if (it.id === id) {
        return { ...it, [field]: value };
      }
      return it;
    }));
  };

  const selectCatalogProductForActiveRow = (prod: Product, sz: { size: string; price: number }) => {
    if (activeCatalogRowId) {
      setBillingItems(billingItems.map(it => {
        if (it.id === activeCatalogRowId) {
          return {
            ...it,
            name: prod.name,
            size: sz.size,
            price: sz.price,
            isCustom: false
          };
        }
        return it;
      }));
      setActiveCatalogRowId(null);
      setShowCatalogModal(false);
    }
  };

  const generateNextInvoiceId = (currentOrders: Order[]) => {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;
    
    // Find all orders starting with the current prefix or the legacy POS- prefix
    const invoiceNumbers = currentOrders
      .filter(o => o.id.startsWith(prefix) || o.id.startsWith('POS-'))
      .map(o => {
        // If it starts with legacy prefix, treat as 0 or attempt to parse last part
        if (o.id.startsWith('POS-')) {
          const numPart = o.id.replace('POS-', '');
          const parsed = parseInt(numPart.slice(-5), 10);
          return isNaN(parsed) ? 0 : parsed;
        }
        const numPart = o.id.replace(prefix, '');
        const parsed = parseInt(numPart, 10);
        return isNaN(parsed) ? 0 : parsed;
      });
      
    const maxNum = invoiceNumbers.length > 0 ? Math.max(...invoiceNumbers) : 0;
    const nextNum = maxNum + 1;
    const paddedNum = String(nextNum).padStart(5, '0');
    return `${prefix}${paddedNum}`;
  };

  const handleCheckoutPOS = () => {
    const subtotal = getSubtotal();
    const couponDisc = getCouponDiscount(subtotal);
    const manualDisc = getManualDiscount(subtotal);
    const grandTotal = getGrandTotal();
    const balance = billingAmountReceived >= grandTotal ? billingAmountReceived - grandTotal : 0;

    const nextInvoiceId = generateNextInvoiceId(orders);

    // Create the order object to append to stored orders database
    const newOrder: Order = {
      id: nextInvoiceId,
      customerName: billingCustomerName || 'Walk-in Customer',
      customerPhone: billingCustomerPhone || '7904199050',
      customerEmail: '', // Not required for offline POS checkout
      customerAddress: billingSource === 'OFFLINE' ? 'Offline POS Shop' : 'Online Shipping Address',
      source: billingSource === 'OFFLINE'
        ? (billingItems.some(it => it.isCustom) ? 'MANUAL' : 'OFFLINE')
        : 'ONLINE',
      items: billingItems.map(it => ({
        productId: it.isCustom ? 'custom' : 'catalog',
        name: it.name || 'Unnamed Item',
        size: it.size || '—',
        quantity: it.quantity,
        price: it.price
      })),
      totalPrice: grandTotal,
      status: 'Completed', // POS orders are completed immediately on checkout
      createdAt: new Date().toISOString()
    };

    // Save order
    const updatedOrders = [newOrder, ...orders];
    saveStoredOrders(updatedOrders);
    setOrders(updatedOrders);

    // Format WhatsApp invoice
    const dateStr = new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
    const itemsText = billingItems.map(it => {
      const sizeStr = it.size && it.size !== '—' ? ` - ${it.size}` : '';
      return `• ${it.name || 'Item'}${sizeStr} x ${it.quantity} - ₹${it.price * it.quantity}`;
    }).join('\n');

    const discountText = couponDisc > 0 ? `🏷️ *Coupon:* ${billingCoupon} (-₹${couponDisc.toFixed(2)})\n` : '';
    const manualDiscText = manualDisc > 0 ? `💸 *Discount:* -₹${manualDisc.toFixed(2)}\n` : '';
    const deliveryText = billingDeliveryFee > 0 ? `🚚 *Delivery:* ₹${billingDeliveryFee.toFixed(2)}\n` : '';

    const invoiceMessage = `🌿 *POS BILLING INVOICE - ORGANIC SISTERZ*\n----------------------------------\n👤 *Customer:* ${billingCustomerName || 'Walk-in Customer'}\n📞 *Phone:* ${billingCustomerPhone || '-'}\n🛒 *Type:* ${billingSource}\n📅 *Date:* ${dateStr}\n\n📦 *Items:*\n${itemsText}\n\n💵 *Subtotal:* ₹${subtotal.toFixed(2)}\n${discountText}${manualDiscText}${deliveryText}----------------------------------\n💰 *GRAND TOTAL:* ₹${grandTotal.toFixed(2)}\n----------------------------------\n💵 *Cash Paid:* ₹${billingAmountReceived.toFixed(2)}\n🔄 *Change Return:* ₹${balance.toFixed(2)}\n\nThank you for shopping at Organic Sisterz! 🌿`;

    // Copy to clipboard
    navigator.clipboard.writeText(invoiceMessage);

    // Open WhatsApp Web targeting 7904199050 as requested
    window.open(`https://wa.me/917904199050?text=${encodeURIComponent(invoiceMessage)}`, '_blank');

    // Reset POS input fields
    setBillingCustomerName('');
    setBillingCustomerPhone('');
    setBillingItems([]);
    setBillingCoupon('');
    setBillingDiscountValue(0);
    setBillingDeliveryFee(0);
    setBillingAmountReceived(0);
  };

  // Filter storefront orders (WhatsApp requests) by time period
  const getFilteredOrders = () => {
    const now = new Date();
    // Only show storefront requests (ID starting with ORD-)
    const storefrontOrders = orders.filter(o => o.id.startsWith('ORD-'));
    return storefrontOrders.filter(o => {
      const oDate = new Date(o.createdAt);
      if (periodFilter === 'today') {
        return oDate.toDateString() === now.toDateString();
      }
      if (periodFilter === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return oDate >= oneWeekAgo;
      }
      if (periodFilter === 'month') {
        return oDate.getMonth() === now.getMonth() && oDate.getFullYear() === now.getFullYear();
      }
      return true; // all
    });
  };

  const filteredOrdersList = getFilteredOrders();

  // Helper for filtering POS Bills in the Orders Hub tab
  const getFilteredBills = () => {
    // 1. Only show POS bills (ID starting with POS-)
    let list = orders.filter(o => o.id.startsWith('POS-'));

    // 2. Filter by source (OFFLINE, ONLINE, MANUAL)
    if (ordersSourceFilter !== 'ALL') {
      list = list.filter(o => {
        const src = o.source || (o.items.some(it => it.productId === 'custom') ? 'MANUAL' : (o.customerAddress.includes('Offline') ? 'OFFLINE' : 'ONLINE'));
        return src === ordersSourceFilter;
      });
    }

    // 3. Filter by Date range
    const now = new Date();
    if (ordersDateFilter === 'TODAY') {
      list = list.filter(o => new Date(o.createdAt).toDateString() === now.toDateString());
    } else if (ordersDateFilter === 'WEEK') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter(o => new Date(o.createdAt) >= oneWeekAgo);
    } else if (ordersDateFilter === 'MONTH') {
      list = list.filter(o => {
        const oDate = new Date(o.createdAt);
        return oDate.getMonth() === now.getMonth() && oDate.getFullYear() === now.getFullYear();
      });
    } else if (ordersDateFilter === 'CUSTOM') {
      if (ordersStartDate) {
        const start = new Date(ordersStartDate);
        start.setHours(0, 0, 0, 0);
        list = list.filter(o => new Date(o.createdAt) >= start);
      }
      if (ordersEndDate) {
        const end = new Date(ordersEndDate);
        end.setHours(23, 59, 59, 999);
        list = list.filter(o => new Date(o.createdAt) <= end);
      }
    }

    // 4. Search text matches
    if (ordersSearchInvoice) {
      list = list.filter(o => o.id.toLowerCase().includes(ordersSearchInvoice.toLowerCase()));
    }
    if (ordersSearchName) {
      list = list.filter(o => o.customerName.toLowerCase().includes(ordersSearchName.toLowerCase()));
    }
    if (ordersSearchPhone) {
      list = list.filter(o => o.customerPhone.toLowerCase().includes(ordersSearchPhone.toLowerCase()));
    }

    return list;
  };

  const filteredBills = getFilteredBills();

  // Calculated stats metrics for WhatsApp center (storefront ORD- orders only)
  const totalRevenue = orders
    .filter(o => o.id.startsWith('ORD-') && o.status === 'Completed')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const totalRequestsCount = orders.filter(o => o.id.startsWith('ORD-')).length;
  const pendingOrdersCount = orders.filter(o => o.id.startsWith('ORD-') && o.status === 'Pending').length;
  const contactedOrdersCount = orders.filter(o => o.id.startsWith('ORD-') && o.status === 'Processing').length;
  const completedOrdersCount = orders.filter(o => o.id.startsWith('ORD-') && o.status === 'Completed').length;

  return (
    <div className="min-h-screen md:h-screen bg-[#FAF9F5] flex flex-col md:flex-row font-poppins text-primary antialiased md:overflow-hidden">
      
      {/* AUTHENTICATION VIEW */}
      {!isAuthenticated ? (
        <div className="flex-grow flex items-center justify-center p-6 bg-[#FAF9F5] min-h-screen">
          <motion.div 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white border border-outline-variant/30 rounded-2xl p-10 max-w-lg w-full shadow-xl text-center space-y-8"
          >
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto border border-outline-variant/20">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold text-primary tracking-tight">Passcode Verification</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed px-2">
              Access to the Organic Sisterz admin ERP portal requires authentication. Please input your passcode to enter.
            </p>
            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="password"
                placeholder="••••••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full border border-outline-variant/50 rounded-2xl py-4.5 px-6 text-lg text-center tracking-widest text-primary focus:outline-none focus:border-secondary transition-all"
                required
              />
              {errorMsg && (
                <p className="text-error text-xs font-semibold">{errorMsg}</p>
              )}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-1/3 border border-outline-variant/40 text-primary hover:bg-[#FAF9F5] text-xs font-bold tracking-widest uppercase py-4 rounded-xl transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold tracking-widest uppercase py-4 rounded-xl shadow transition-colors cursor-pointer"
                >
                  Authenticate
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : (
        <>
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-outline-variant/25 flex flex-col p-8 shrink-0 shadow-sm justify-between md:h-full">
            <div>
              {/* Branding Section */}
              <div className="flex items-center gap-3.5 mb-10 pb-6 border-b border-outline-variant/10">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                  <Settings className="w-6 h-6 text-primary animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-primary tracking-wide">Business ERP</h2>
                  <span className="text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold block">Organic Sisterz</span>
                </div>
              </div>

              {/* Sidebar Tabs */}
              <div className="space-y-1.5">
                <button
                  onClick={() => { setActiveTab('dashboard'); }}
                  className={`w-full flex items-center gap-3.5 text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-[#2B3E2F] text-white shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                  <span>Control Center</span>
                </button>

                <button
                  onClick={() => { setActiveTab('whatsapp'); }}
                  className={`w-full flex items-center justify-between text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'whatsapp'
                      ? 'bg-[#2B3E2F] text-white shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <MessageSquare className="w-4.5 h-4.5 text-green-500" />
                    <span>WhatsApp</span>
                  </div>
                  {pendingOrdersCount > 0 && (
                    <span className="bg-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {pendingOrdersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { setActiveTab('pos_billing'); }}
                  className={`w-full flex items-center gap-3.5 text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'pos_billing'
                      ? 'bg-[#2B3E2F] text-white shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <Receipt className="w-4.5 h-4.5 text-orange-500" />
                  <span>POS Billing</span>
                </button>

                <button
                  onClick={() => { setActiveTab('analytics'); }}
                  className={`w-full flex items-center gap-3.5 text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'bg-[#2B3E2F] text-white shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <BarChart3 className="w-4.5 h-4.5" />
                  <span>POS Analytics</span>
                </button>

                <button
                  onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
                  className={`w-full flex items-center justify-between text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#2B3E2F] text-white shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <ShoppingCart className="w-4.5 h-4.5" />
                    <span>Orders</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('products'); setEditingProduct(null); setIsAddingProduct(false); }}
                  className={`w-full flex items-center gap-3.5 text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-[#2B3E2F] text-white shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <Package className="w-4.5 h-4.5" />
                  <span>Inventory</span>
                </button>

                <button
                  onClick={() => { setActiveTab('categories'); }}
                  className={`w-full flex items-center gap-3.5 text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-[#2B3E2F] text-white shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <FolderTree className="w-4.5 h-4.5" />
                  <span>Categories</span>
                </button>

                <button
                  onClick={() => { setActiveTab('coupons'); }}
                  className={`w-full flex items-center gap-3.5 text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'coupons'
                      ? 'bg-[#2B3E2F] text-white shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <Ticket className="w-4.5 h-4.5" />
                  <span>Coupons</span>
                </button>

                <button
                  onClick={() => { setActiveTab('users'); }}
                  className={`w-full flex items-center gap-3.5 text-xs font-bold tracking-wider uppercase py-4 px-4.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-[#2B3E2F] text-white shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <Users className="w-4.5 h-4.5" />
                  <span>Users</span>
                </button>
              </div>
            </div>

            {/* Logout and Exit Console Actions */}
            <div className="pt-8 border-t border-outline-variant/15 space-y-3 mt-10">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 text-xs font-bold text-primary uppercase tracking-wider hover:bg-surface-container-low py-3 px-4 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Exit Console</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-xs font-bold text-error uppercase tracking-wider hover:bg-red-50 py-3 px-4 rounded-xl transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* MAIN DASHBOARD CONTENT AREA */}
          <div className="flex-grow pt-5 px-6 pb-6 md:pt-6 md:px-10 md:pb-8 overflow-y-auto w-full">
            
            {/* TAB 1: WHATSAPP CENTER (Matches Vercel Screenshot layout) */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-10">
                {/* Header Title Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">WhatsApp Center</h1>
                    <span className="bg-[#FEF3C7] text-[#D97706] text-xs font-bold px-3 py-1.5 rounded-full border border-[#FDE68A]">
                      {pendingOrdersCount} pending
                    </span>
                  </div>
                  
                  {/* Period selection filters and Refresh button */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="bg-[#ECEEEB] p-1.5 rounded-full flex gap-1">
                      {(['all', 'today', 'week', 'month'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setPeriodFilter(f)}
                          className={`text-xs font-semibold py-2 px-4 rounded-full transition-all cursor-pointer uppercase ${
                            periodFilter === f
                              ? 'bg-[#2B3E2F] text-white shadow-sm'
                              : 'text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          {f === 'all' ? 'All' : f === 'today' ? 'Today' : f === 'week' ? 'Week' : 'Month'}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleRefresh}
                      className="bg-white border border-outline-variant/35 hover:border-secondary text-primary font-bold text-xs py-3 px-4 rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                  </div>
                </div>

                {/* Metrics Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-3 flex flex-col justify-between">
                    <span className="block text-[11px] font-bold text-[#4B5563] uppercase tracking-widest text-center">Total Requests</span>
                    <span className="block text-4xl font-extrabold text-primary text-center">{totalRequestsCount}</span>
                  </div>
                  <div className="bg-[#FEFCE8] border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-3 flex flex-col justify-between">
                    <span className="block text-[11px] font-bold text-[#D97706] uppercase tracking-widest text-center">Pending</span>
                    <span className="block text-4xl font-extrabold text-[#D97706] text-center">{pendingOrdersCount}</span>
                  </div>
                  <div className="bg-[#EFF6FF] border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-3 flex flex-col justify-between">
                    <span className="block text-[11px] font-bold text-[#2563EB] uppercase tracking-widest text-center">Contacted</span>
                    <span className="block text-4xl font-extrabold text-[#2563EB] text-center">{contactedOrdersCount}</span>
                  </div>
                  <div className="bg-[#F0FDF4] border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-3 flex flex-col justify-between">
                    <span className="block text-[11px] font-bold text-[#16A34A] uppercase tracking-widest text-center">Completed</span>
                    <span className="block text-4xl font-extrabold text-[#16A34A] text-center">{completedOrdersCount}</span>
                  </div>
                </div>

                {/* Customer Requests Panel */}
                <div className="bg-white border border-outline-variant/20 rounded-3xl overflow-hidden shadow-md">
                  <div className="p-6 md:p-8 bg-[#FAF9F5]/30 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-bold text-primary">Customer Requests</h3>
                      <span className="text-xs text-on-surface-variant font-semibold bg-surface-container py-1 px-3 rounded-full">
                        ₹{totalRevenue} revenue - status updates only
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#4B5563]">
                      {filteredOrdersList.length} requests
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    {filteredOrdersList.length === 0 ? (
                      <div className="p-16 text-center text-on-surface-variant text-sm italic">
                        No requests found in this period filter.
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm min-w-[900px]">
                        <thead>
                          <tr className="bg-surface-container-low text-primary font-bold border-b border-outline-variant/25">
                            <th className="px-6 py-5">Customer</th>
                            <th className="px-6 py-5">Phone</th>
                            <th className="px-6 py-5">Address</th>
                            <th className="px-6 py-5 text-center">Products</th>
                            <th className="px-6 py-5">Est. Total</th>
                            <th className="px-6 py-5">Date & Time</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5 text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                          {filteredOrdersList.map(o => (
                            <Fragment key={o.id}>
                              <tr className="hover:bg-[#FAF9F5]/20 transition-colors">
                                <td className="px-6 py-5 font-semibold text-primary">{o.customerName}</td>
                                <td className="px-6 py-5 font-medium">{o.customerPhone}</td>
                                <td className="px-6 py-5 max-w-xs truncate text-on-surface-variant">{o.customerAddress}</td>
                                <td className="px-6 py-5 text-center">
                                  <span className="bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded-full font-bold text-xs">
                                    {o.items.reduce((sum, it) => sum + it.quantity, 0)}
                                  </span>
                                </td>
                                <td className="px-6 py-5 font-bold text-primary">₹{o.totalPrice}</td>
                                <td className="px-6 py-5 text-on-surface-variant font-medium">
                                  {new Date(o.createdAt).toLocaleDateString(undefined, { 
                                    day: '2-digit', 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })} {new Date(o.createdAt).toLocaleTimeString(undefined, { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </td>
                                <td className="px-6 py-5">
                                  <select
                                    value={o.status}
                                    onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border bg-white focus:outline-none transition-all cursor-pointer ${
                                      o.status === 'Completed'
                                        ? 'text-green-700 border-green-200 bg-green-50'
                                        : o.status === 'Processing'
                                        ? 'text-blue-700 border-blue-200 bg-[#EFF6FF]'
                                        : o.status === 'Cancelled'
                                        ? 'text-red-700 border-red-200 bg-red-50'
                                        : 'text-yellow-700 border-yellow-200 bg-[#FEFCE8]'
                                    }`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="px-6 py-5 text-right">
                                  <button
                                    onClick={() => {
                                      setExpandedOrderId(expandedOrderId === o.id ? null : o.id);
                                    }}
                                    className={`font-bold text-xs px-5 py-2.5 rounded-xl transition-all inline-block cursor-pointer ${
                                      expandedOrderId === o.id
                                        ? 'bg-[#1F2937] text-white hover:bg-black'
                                        : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                                    }`}
                                  >
                                    {expandedOrderId === o.id ? 'Close' : 'View'}
                                  </button>
                                </td>
                              </tr>
                              {expandedOrderId === o.id && (
                                <tr className="bg-white">
                                  <td colSpan={8} className="px-8 py-6 border-b border-outline-variant/20 bg-white">
                                    <div className="border border-outline-variant/30 rounded-2xl p-6 space-y-6 text-left">
                                      {/* Row 1: Name, Phone, Address */}
                                      <div className="text-sm font-semibold text-[#1F2937] flex flex-wrap gap-x-6 gap-y-2 pb-4 border-b border-outline-variant/10">
                                        <span>Name: <strong className="text-primary font-bold">{o.customerName}</strong></span>
                                        <span>Phone: <strong className="text-primary font-bold">{o.customerPhone}</strong></span>
                                        <span>Address: <strong className="text-primary font-bold">{o.customerAddress}</strong></span>
                                      </div>

                                      {/* Products Table */}
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs font-medium">
                                          <thead>
                                            <tr className="bg-[#FAF9F6] text-primary border-b border-outline-variant/20 font-bold uppercase tracking-wider">
                                              <th className="px-4 py-3">Product</th>
                                              <th className="px-4 py-3">Variant</th>
                                              <th className="px-4 py-3">Size / Weight</th>
                                              <th className="px-4 py-3 text-center">Qty</th>
                                              <th className="px-4 py-3">Unit Price</th>
                                              <th className="px-4 py-3 text-right">Line Total</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-outline-variant/10">
                                            {o.items.map((it, idx) => (
                                              <tr key={idx} className="hover:bg-[#FAF9F5]/20">
                                                <td className="px-4 py-3 font-semibold text-primary">{it.name}</td>
                                                <td className="px-4 py-3 text-on-surface-variant">{it.size || '—'}</td>
                                                <td className="px-4 py-3 text-on-surface-variant">{it.size ? `${it.quantity} ${it.size}` : '—'}</td>
                                                <td className="px-4 py-3 text-center font-bold">{it.quantity}</td>
                                                <td className="px-4 py-3">₹{it.price}</td>
                                                <td className="px-4 py-3 text-right font-bold text-primary">₹{it.price * it.quantity}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* Grand Total */}
                                      <div className="flex justify-between items-center bg-[#FAF9F6]/50 p-4 rounded-xl border border-outline-variant/15">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Grand Total</span>
                                        <span className="text-xl font-bold text-primary">₹{o.totalPrice}</span>
                                      </div>

                                      {/* WhatsApp message block */}
                                      <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                          <span className="block text-xs font-bold text-primary uppercase tracking-wider">WhatsApp Message</span>
                                          <button
                                            onClick={() => {
                                              const msg = formatWhatsAppMessage(o);
                                              navigator.clipboard.writeText(msg);
                                              alert('Message copied to clipboard!');
                                              // Open WhatsApp Web using the override phone number "7904199050"
                                              window.open(`https://wa.me/917904199050?text=${encodeURIComponent(msg)}`, '_blank');
                                            }}
                                            className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                                          >
                                            Copy Message
                                          </button>
                                        </div>
                                        <div className="bg-[#FAF9F6] border border-outline-variant/30 rounded-2xl p-6 font-mono text-sm text-[#374151] whitespace-pre-wrap leading-relaxed shadow-inner">
                                          {formatWhatsAppMessage(o)}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: POS BILLING PANEL */}
            {activeTab === 'pos_billing' && (
              <div className="space-y-6 text-left">
                {/* Header Title Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-outline-variant/15">
                  <div className="flex items-center gap-3">
                    <div className="border-l-4 border-[#2B3E2F] pl-3">
                      <h1 className="text-3xl font-extrabold tracking-tight text-primary font-poppins">POS Billing Panel</h1>
                      <p className="text-xs text-on-surface-variant font-medium mt-1">
                        Quick invoice generator & database synced checkout
                      </p>
                    </div>
                  </div>
                  
                  {/* Toggle switches offline/online */}
                  <div className="flex items-center bg-[#FAF9F5] border border-outline-variant/35 rounded-full p-1 self-start sm:self-auto shadow-sm">
                    <button
                      onClick={() => setBillingSource('OFFLINE')}
                      className={`text-xs font-bold py-2.5 px-5 rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                        billingSource === 'OFFLINE'
                          ? 'bg-[#2B3E2F] text-white shadow-sm'
                          : 'text-[#4B5563] hover:text-primary'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      OFFLINE (POS)
                    </button>
                    <button
                      onClick={() => setBillingSource('ONLINE')}
                      className={`text-xs font-bold py-2.5 px-5 rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                        billingSource === 'ONLINE'
                          ? 'bg-[#C27D38] text-white shadow-sm'
                          : 'text-[#4B5563] hover:text-primary'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      ONLINE ORDER
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Details and items (2/3 width) */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Customer Details Card */}
                    <div className="bg-white border border-outline-variant/20 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <Users className="w-4.5 h-4.5 text-[#2B3E2F]" />
                        <span>Customer Details</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Customer Name</label>
                          <input
                            type="text"
                            placeholder="Enter name"
                            value={billingCustomerName}
                            onChange={(e) => setBillingCustomerName(e.target.value)}
                            className="w-full bg-[#FAF9F6] border border-outline-variant/35 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-[#1F2937] font-semibold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Mobile Number (WhatsApp)</label>
                          <input
                            type="tel"
                            placeholder="Enter 10-digit number"
                            value={billingCustomerPhone}
                            onChange={(e) => setBillingCustomerPhone(e.target.value)}
                            className="w-full bg-[#FAF9F6] border border-outline-variant/35 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-[#1F2937] font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Order Items Card */}
                    <div className="bg-white border border-outline-variant/20 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                          <Receipt className="w-4.5 h-4.5 text-[#2B3E2F]" />
                          <span>Order Items</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setBillingItems([])}
                            className="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                          >
                            Clear Order
                          </button>
                          <button
                            onClick={addCustomItem}
                            className="bg-white hover:bg-[#2B3E2F] hover:text-white text-[#2B3E2F] border border-[#2B3E2F]/20 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                          >
                            + Add Custom Item
                          </button>
                        </div>
                      </div>

                      {/* Items List Rows */}
                      <div className="space-y-3">
                        {billingItems.length === 0 ? (
                          <div className="text-center py-10 text-on-surface-variant text-sm italic">
                            No items added to this bill. Add custom items or select from catalog.
                          </div>
                        ) : (
                          billingItems.map((it) => (
                            <div key={it.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-[#FAF9F6]/40 p-4 rounded-xl border border-outline-variant/15">
                              {/* Item Description */}
                              <div className="md:col-span-6 space-y-1.5">
                                <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Item Name / Description</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Type custom product description..."
                                    value={it.name}
                                    onChange={(e) => updateBillingItem(it.id, 'name', e.target.value)}
                                    className="flex-grow bg-white border border-outline-variant/35 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary transition-all text-[#1F2937] font-semibold"
                                  />
                                  <button
                                    onClick={() => {
                                      setActiveCatalogRowId(it.id);
                                      setShowCatalogModal(true);
                                    }}
                                    className="bg-white border border-outline-variant/30 hover:bg-[#FAF9F6] text-primary font-bold text-[10px] uppercase px-3 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B3E2F]"></span>
                                    Catalog
                                  </button>
                                </div>
                              </div>

                              {/* Price */}
                              <div className="md:col-span-3 space-y-1.5">
                                <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Price (₹)</label>
                                <input
                                  type="number"
                                  placeholder="0"
                                  value={it.price || ''}
                                  onChange={(e) => updateBillingItem(it.id, 'price', Number(e.target.value))}
                                  className="w-full bg-white border border-outline-variant/35 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary transition-all text-[#1F2937] font-semibold"
                                />
                              </div>

                              {/* Qty Counter */}
                              <div className="md:col-span-2 space-y-1.5">
                                <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Qty</label>
                                <div className="flex items-center border border-outline-variant/35 rounded-xl bg-white overflow-hidden">
                                  <button
                                    onClick={() => updateBillingItem(it.id, 'quantity', Math.max(1, it.quantity - 1))}
                                    className="px-3 py-2.5 hover:bg-[#FAF9F6] font-bold text-xs text-[#4B5563] cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="flex-grow text-center font-bold text-xs text-primary">{it.quantity}</span>
                                  <button
                                    onClick={() => updateBillingItem(it.id, 'quantity', it.quantity + 1)}
                                    className="px-3 py-2.5 hover:bg-[#FAF9F6] font-bold text-xs text-[#4B5563] cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Delete Action */}
                              <div className="md:col-span-1 flex justify-center pb-2.5">
                                <button
                                  onClick={() => removeBillingItem(it.id)}
                                  className="text-red-500 hover:text-red-700 p-2.5 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Invoice Receipt Box (1/3 width) */}
                  <div className="space-y-6">
                    <div className="bg-white border border-outline-variant/20 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between h-full">
                      
                      {/* Receipt Header details block */}
                      <div className="border border-outline-variant/30 rounded-xl p-4 bg-[#FAF9F6]/40 space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-[#4B5563]">
                          <span>Source</span>
                          <span className={`px-2.5 py-0.5 rounded-md font-bold text-[9px] ${
                            billingSource === 'OFFLINE' 
                              ? 'bg-[#FAF9F5] text-[#2B3E2F] border border-[#2B3E2F]/20' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {billingSource}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-semibold text-primary">
                          <span className="text-[#4B5563]">Customer</span>
                          <span>{billingCustomerName || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-semibold text-primary">
                          <span className="text-[#4B5563]">Phone</span>
                          <span>{billingCustomerPhone || '-'}</span>
                        </div>
                      </div>

                      {/* Receipt Items scrollable breakdown */}
                      <div className="flex-grow min-h-[120px] border-b border-dashed border-outline-variant/30 py-3">
                        {billingItems.length === 0 ? (
                          <div className="text-center py-10 text-[#9CA3AF] text-xs font-semibold">
                            No items added yet
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                            {billingItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs font-semibold text-primary">
                                <span>
                                  {item.name || 'Unnamed Item'}
                                  {item.size ? ` (${item.size})` : ''}
                                  <span className="text-[#6B7280] font-medium ml-1">x{item.quantity}</span>
                                </span>
                                <span>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Form calculations (Discounts, Coupons, Delivery, Total) */}
                      <div className="space-y-4 pt-1">
                        
                        {/* Coupon Selection */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Apply Coupon</label>
                          <select
                            value={billingCoupon}
                            onChange={(e) => setBillingCoupon(e.target.value)}
                            className="w-full bg-white border border-outline-variant/35 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-all text-[#1F2937] font-semibold cursor-pointer"
                          >
                            <option value="">No Coupon</option>
                            {coupons.map((c, i) => (
                              <option key={i} value={c.code}>{c.code} ({c.discount}% off)</option>
                            ))}
                          </select>
                        </div>

                        {/* Manual Discount */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Manual Discount</label>
                          <div className="flex rounded-xl border border-outline-variant/35 bg-white overflow-hidden">
                            <select
                              value={billingDiscountType}
                              onChange={(e) => setBillingDiscountType(e.target.value as '₹' | '%')}
                              className="bg-[#FAF9F6] border-r border-outline-variant/35 px-3.5 py-2 text-xs focus:outline-none font-bold text-primary cursor-pointer"
                            >
                              <option value="₹">₹</option>
                              <option value="%">%</option>
                            </select>
                            <input
                              type="number"
                              placeholder="0"
                              value={billingDiscountValue || ''}
                              onChange={(e) => setBillingDiscountValue(Number(e.target.value))}
                              className="flex-grow px-3 py-2 text-xs focus:outline-none text-[#1F2937] font-semibold"
                            />
                          </div>
                        </div>

                        {/* Delivery */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-[#4B5563]">Delivery</span>
                          <div className="w-24">
                            <input
                              type="number"
                              placeholder="0"
                              value={billingDeliveryFee || ''}
                              onChange={(e) => setBillingDeliveryFee(Number(e.target.value))}
                              className="w-full bg-white border border-outline-variant/35 rounded-xl px-3 py-1.5 text-xs text-right focus:outline-none text-[#1F2937] font-semibold"
                            />
                          </div>
                        </div>

                        {/* Calculation Summary Row */}
                        <div className="space-y-1.5 border-t border-outline-variant/10 pt-3">
                          <div className="flex justify-between text-xs font-medium text-[#4B5563]">
                            <span>Subtotal ({billingItems.reduce((sum, it) => sum + it.quantity, 0)} items)</span>
                            <span>₹{getSubtotal()}</span>
                          </div>
                          {billingCoupon && (
                            <div className="flex justify-between text-xs font-medium text-green-600">
                              <span>Coupon Discount</span>
                              <span>-₹{getCouponDiscount(getSubtotal()).toFixed(2)}</span>
                            </div>
                          )}
                          {billingDiscountValue > 0 && (
                            <div className="flex justify-between text-xs font-medium text-green-600">
                              <span>Manual Discount</span>
                              <span>-₹{getManualDiscount(getSubtotal()).toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        {/* Grand Total */}
                        <div className="flex justify-between items-center border-t border-outline-variant/20 pt-4">
                          <span className="text-sm font-extrabold text-primary uppercase tracking-wider">Grand Total</span>
                          <span className="text-2xl font-extrabold text-primary">₹{getGrandTotal().toFixed(2)}</span>
                        </div>

                        {/* Cash Amount Received & Change Balance */}
                        <div className="border border-outline-variant/30 rounded-xl p-4 bg-[#FAF9F6]/40 space-y-3 mt-3">
                          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#4B5563]">Cash Payment</span>
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Amount Received (₹)</label>
                            <input
                              type="number"
                              placeholder="0.00"
                              value={billingAmountReceived || ''}
                              onChange={(e) => setBillingAmountReceived(Number(e.target.value))}
                              className="w-full bg-white border border-outline-variant/35 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary transition-all text-[#1F2937] font-semibold"
                            />
                          </div>
                          {billingAmountReceived > 0 && billingAmountReceived >= getGrandTotal() && (
                            <div className="flex justify-between items-center text-xs font-semibold text-green-700 bg-green-50 p-2 rounded-lg border border-green-200">
                              <span>Change Return</span>
                              <span>₹{(billingAmountReceived - getGrandTotal()).toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        {/* Checkout Send Button */}
                        <button
                          onClick={handleCheckoutPOS}
                          disabled={billingItems.length === 0}
                          className={`w-full font-bold text-xs py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                            billingItems.length === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-[#2B3E2F] hover:bg-[#1E2B21] text-white'
                          }`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>SEND BILL VIA WHATSAPP</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Catalog Popover Modal */}
                {showCatalogModal && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
                      <div className="flex justify-between items-center pb-3 border-b border-outline-variant/15">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-[#2B3E2F]" />
                          <h3 className="text-lg font-bold text-primary uppercase tracking-wider font-poppins">Select Product Variant</h3>
                        </div>
                        <button
                          onClick={() => {
                            setShowCatalogModal(false);
                            setActiveCatalogRowId(null);
                          }}
                          className="p-1 hover:bg-slate-100 rounded-full cursor-pointer text-gray-400 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Search Catalog Input */}
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-outline-variant/35 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-[#1F2937] font-semibold"
                      />

                      {/* Products List scrollable wrapper */}
                      <div className="max-h-[350px] overflow-y-auto space-y-4 pr-1">
                        {products
                          .filter(p => p.name.toLowerCase().includes(catalogSearch.toLowerCase()))
                          .map((prod) => (
                            <div key={prod.id} className="border border-outline-variant/20 rounded-xl p-4 space-y-3 bg-[#FAF9F6]/20">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-primary text-sm">{prod.name}</h4>
                                  <span className="text-[10px] font-bold text-on-surface-variant uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                                    {prod.category}
                                  </span>
                                </div>
                              </div>

                              {/* Pack sizes grid */}
                              <div className="flex flex-wrap gap-2 pt-1">
                                {prod.sizes.map((sz, sIdx) => (
                                  <button
                                    key={sIdx}
                                    onClick={() => {
                                      if (activeCatalogRowId) {
                                        selectCatalogProductForActiveRow(prod, sz);
                                      } else {
                                        // fallback to normal add if row was not set
                                        setBillingItems([
                                          ...billingItems,
                                          {
                                            id: Math.random().toString(),
                                            name: prod.name,
                                            size: sz.size,
                                            price: sz.price,
                                            quantity: 1
                                          }
                                        ]);
                                        setShowCatalogModal(false);
                                      }
                                    }}
                                    className="bg-white border border-outline-variant/30 hover:border-primary hover:bg-[#FAF9F5] text-primary text-xs font-bold py-2 px-3.5 rounded-xl shadow-sm transition-all cursor-pointer"
                                  >
                                    {sz.size} — ₹{sz.price}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: GENERAL CONTROL CENTER OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-primary">Control Center</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Admin dashboard metrics overview.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-2">
                    <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Inventory Items</span>
                    <span className="block text-3xl font-bold text-primary">{products.length} Products</span>
                  </div>
                  <div className="bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-2">
                    <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Discount Coupons Active</span>
                    <span className="block text-3xl font-bold text-[#16A34A]">{coupons.length} Active</span>
                  </div>
                  <div className="bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-2">
                    <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Authorized Staff Admin Users</span>
                    <span className="block text-3xl font-bold text-[#2563EB]">{adminUsers.length} Users</span>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white border border-outline-variant/20 rounded-2xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-primary uppercase tracking-wider">Product Categories</h3>
                    <ul className="divide-y divide-outline-variant/10">
                      {categories.map((c, i) => (
                        <li key={i} className="py-2.5 flex justify-between text-sm">
                          <span>{c}</span>
                          <span className="font-semibold text-primary">
                            {products.filter(p => p.category === c).length} formulations
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-outline-variant/20 rounded-2xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-primary uppercase tracking-wider">Active Promotional Coupons</h3>
                    <ul className="divide-y divide-outline-variant/10">
                      {coupons.map((cp, i) => (
                        <li key={i} className="py-2.5 flex justify-between text-sm">
                          <span className="font-bold text-secondary">{cp.code}</span>
                          <span className="font-semibold text-primary">{cp.discount}% Discount</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: POS ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-primary">POS Analytics</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Revenue performance analytics and charts.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
                    <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Average Checkout Value</span>
                    <span className="block text-3xl font-bold text-primary mt-2">
                      ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}.00
                    </span>
                  </div>
                  <div className="bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
                    <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Completed Sales Ratio</span>
                    <span className="block text-3xl font-bold text-primary mt-2">
                      {orders.length > 0 ? Math.round((completedOrdersCount / orders.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
                    <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Active Store Catalog SKUs</span>
                    <span className="block text-3xl font-bold text-primary mt-2">
                      {products.reduce((acc, curr) => acc + curr.sizes.length, 0)} SKUs
                    </span>
                  </div>
                </div>

                {/* Sales Breakdown simulation */}
                <div className="bg-white border border-outline-variant/20 rounded-3xl p-8 space-y-6 shadow-sm">
                  <h3 className="text-lg font-bold text-primary">Formulation-Wise Revenue Breakdown</h3>
                  <div className="space-y-4">
                    {products.map(p => {
                      const prodOrders = orders.filter(o => o.items.some(i => i.productId === p.id));
                      const prodSales = prodOrders.reduce((sum, o) => {
                        const it = o.items.find(i => i.productId === p.id);
                        return sum + (it ? it.price * it.quantity : 0);
                      }, 0);
                      const percent = totalRevenue > 0 ? Math.round((prodSales / totalRevenue) * 100) : 0;

                      return (
                        <div key={p.id} className="space-y-2">
                          <div className="flex justify-between text-sm font-semibold">
                            <span>{p.name}</span>
                            <span>₹{prodSales} ({percent}%)</span>
                          </div>
                          <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                            <div className="bg-secondary h-full rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ORDERS HUB */}
            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Orders List */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary font-poppins">Billing & Invoice Hub</h1>
                    <p className="text-sm text-on-surface-variant mt-1 font-medium">
                      Filter POS sales records, track offline/online sources, and manage transactions.
                    </p>
                  </div>

                  {/* Filter controls row 1: Source classification */}
                  <div className="flex flex-wrap gap-2">
                    {(['ALL', 'OFFLINE', 'ONLINE', 'MANUAL'] as const).map(src => (
                      <button
                        key={src}
                        onClick={() => setOrdersSourceFilter(src)}
                        className={`text-xs font-bold py-2 px-4 rounded-full transition-all cursor-pointer ${
                          ordersSourceFilter === src
                            ? 'bg-[#2B3E2F] text-white shadow-sm'
                            : 'bg-white border border-outline-variant/35 text-primary hover:bg-[#FAF9F5]'
                        }`}
                      >
                        {src === 'ALL' ? 'All Bills' : src === 'OFFLINE' ? 'Offline' : src === 'ONLINE' ? 'Online' : 'Manual'}
                      </button>
                    ))}
                  </div>

                  {/* Filter controls row 2: Date presets */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(['TODAY', 'WEEK', 'MONTH', 'CUSTOM'] as const).map(dt => (
                      <button
                        key={dt}
                        onClick={() => setOrdersDateFilter(dt)}
                        className={`text-xs font-bold py-2 px-4 rounded-full transition-all cursor-pointer ${
                          ordersDateFilter === dt
                            ? 'bg-[#2B3E2F] text-white shadow-sm'
                            : 'bg-white border border-outline-variant/35 text-primary hover:bg-[#FAF9F5]'
                        }`}
                      >
                        {dt === 'TODAY' ? 'Today' : dt === 'WEEK' ? 'This Week' : dt === 'MONTH' ? 'This Month' : 'Custom Range'}
                      </button>
                    ))}
                    
                    {(ordersDateFilter !== 'ALL' || ordersStartDate || ordersEndDate || ordersSearchInvoice || ordersSearchName || ordersSearchPhone) && (
                      <button
                        onClick={() => {
                          setOrdersSourceFilter('ALL');
                          setOrdersDateFilter('ALL');
                          setOrdersSearchInvoice('');
                          setOrdersSearchName('');
                          setOrdersSearchPhone('');
                          setOrdersStartDate('');
                          setOrdersEndDate('');
                        }}
                        className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors cursor-pointer ml-2"
                      >
                        Clear Dates
                      </button>
                    )}
                  </div>

                  {/* Filter controls row 3: Search inputs & Date pickers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#FAF9F6]/40 p-4 rounded-2xl border border-outline-variant/15">
                    {/* Invoice/Bill No */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-[#4B5563] uppercase tracking-wider">Invoice / Bill No</label>
                      <input
                        type="text"
                        placeholder="Invoice / Bill No"
                        value={ordersSearchInvoice}
                        onChange={(e) => setOrdersSearchInvoice(e.target.value)}
                        className="w-full bg-white border border-outline-variant/35 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-all text-[#1F2937] font-semibold"
                      />
                    </div>
                    
                    {/* Customer Name */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-[#4B5563] uppercase tracking-wider">Customer Name</label>
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={ordersSearchName}
                        onChange={(e) => setOrdersSearchName(e.target.value)}
                        className="w-full bg-white border border-outline-variant/35 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-all text-[#1F2937] font-semibold"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-[#4B5563] uppercase tracking-wider">Mobile Number</label>
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        value={ordersSearchPhone}
                        onChange={(e) => setOrdersSearchPhone(e.target.value)}
                        className="w-full bg-white border border-outline-variant/35 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-all text-[#1F2937] font-semibold"
                      />
                    </div>

                    {/* Custom range start date */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-[#4B5563] uppercase tracking-wider">Start Date</label>
                      <input
                        type="date"
                        value={ordersStartDate}
                        onChange={(e) => {
                          setOrdersStartDate(e.target.value);
                          setOrdersDateFilter('CUSTOM');
                        }}
                        className="w-full bg-white border border-outline-variant/35 rounded-xl px-3 py-1.5 text-xs text-primary font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Custom range end date picker */}
                  {(ordersDateFilter === 'CUSTOM' || ordersStartDate) && (
                    <div className="w-full sm:w-1/2 md:w-1/4 bg-[#FAF9F6]/40 p-4 rounded-2xl border border-outline-variant/15 mt-2">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-[#4B5563] uppercase tracking-wider">End Date</label>
                        <input
                          type="date"
                          value={ordersEndDate}
                          onChange={(e) => {
                            setOrdersEndDate(e.target.value);
                            setOrdersDateFilter('CUSTOM');
                          }}
                          className="w-full bg-white border border-outline-variant/35 rounded-xl px-3 py-1.5 text-xs text-primary font-semibold focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Bills List Table */}
                  <div className="bg-white border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
                    {filteredBills.length === 0 ? (
                      <div className="p-12 text-center text-on-surface-variant text-sm italic">
                        No billing records found matching the active filters.
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-surface-container-low text-primary font-bold border-b border-outline-variant/25">
                            <th className="px-6 py-4">Bill ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Source</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                          {filteredBills.map(o => {
                            const src = o.source || (o.items.some(it => it.productId === 'custom') ? 'MANUAL' : (o.customerAddress.includes('Offline') ? 'OFFLINE' : 'ONLINE'));
                            return (
                              <tr 
                                key={o.id} 
                                className={`hover:bg-[#FAF9F5]/40 transition-colors cursor-pointer ${
                                  selectedOrder && selectedOrder.id === o.id ? 'bg-[#2B3E2F]/5' : ''
                                }`}
                                onClick={() => setSelectedOrder(o)}
                              >
                                <td className="px-6 py-4 font-bold text-primary">{o.id}</td>
                                <td className="px-6 py-4">
                                  <div className="font-semibold">{o.customerName}</div>
                                  <div className="text-xs text-on-surface-variant mt-0.5">{o.customerPhone}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    src === 'MANUAL' 
                                      ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                                      : src === 'OFFLINE' 
                                      ? 'bg-[#FAF9F5] text-[#2B3E2F] border border-[#2B3E2F]/20' 
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}>
                                    {src}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-primary">₹{o.totalPrice}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                                    o.status === 'Completed'
                                      ? 'bg-green-50 text-green-700 border-green-200'
                                      : o.status === 'Processing'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : o.status === 'Cancelled'
                                      ? 'bg-red-50 text-red-700 border-red-200'
                                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  }`}>
                                    {o.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <Eye className="w-5 h-5 text-on-surface-variant hover:text-primary ml-auto transition-colors" />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Order Details Panel */}
                <div className="lg:col-span-5">
                  <AnimatePresence mode="wait">
                    {selectedOrder ? (
                      <motion.div
                        key={selectedOrder.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="bg-white border border-outline-variant/20 rounded-2xl p-8 shadow-md space-y-6 sticky top-4"
                      >
                        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                          <div>
                            <h4 className="text-lg font-bold text-primary">{selectedOrder.id}</h4>
                            <span className="text-xs text-on-surface-variant">
                              Placed: {new Date(selectedOrder.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteOrder(selectedOrder.id)}
                            className="text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Status Controls */}
                        <div className="space-y-2.5">
                          <span className="block text-xs font-bold text-primary uppercase tracking-wider">Order Status</span>
                          <div className="flex flex-wrap gap-2">
                            {(['Pending', 'Processing', 'Completed', 'Cancelled'] as Order['status'][]).map(st => (
                              <button
                                key={st}
                                onClick={() => updateOrderStatus(selectedOrder.id, st)}
                                className={`flex-grow py-2.5 px-2 rounded-xl text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                                  selectedOrder.status === st
                                    ? st === 'Completed'
                                      ? 'bg-green-700 text-white border-green-700'
                                      : st === 'Processing'
                                      ? 'bg-blue-700 text-white border-blue-700'
                                      : st === 'Cancelled'
                                      ? 'bg-error text-white border-error'
                                      : 'bg-[#D97706] text-white border-[#D97706]'
                                    : 'bg-white text-on-surface-variant border-outline-variant/30 hover:border-secondary'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Customer Details */}
                        <div className="space-y-3 bg-[#FAF9F5] p-5 rounded-xl border border-outline-variant/20">
                          <span className="block text-xs font-bold text-primary uppercase tracking-wider">Shipping details</span>
                          <div className="space-y-2 text-sm text-primary">
                            <div className="font-bold">{selectedOrder.customerName}</div>
                            <div>Phone: {selectedOrder.customerPhone}</div>
                            <div>Email: {selectedOrder.customerEmail}</div>
                            <div className="text-on-surface-variant italic leading-relaxed pt-2 border-t border-outline-variant/10 mt-2">
                              {selectedOrder.customerAddress}
                            </div>
                          </div>
                        </div>

                        {/* Items Purchased */}
                        <div className="space-y-4">
                          <span className="block text-xs font-bold text-primary uppercase tracking-wider">Items Summary</span>
                          <div className="space-y-3.5">
                            {selectedOrder.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm text-primary">
                                <div>
                                  <span className="font-bold">{it.name}</span>
                                  <div className="text-xs text-on-surface-variant mt-0.5">{it.size} × {it.quantity}</div>
                                </div>
                                <span className="font-semibold">₹{it.price * it.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-outline-variant/20 pt-5 flex justify-between items-center text-lg font-bold text-primary">
                            <span>Grand Total :</span>
                            <span>₹{selectedOrder.totalPrice}</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="bg-white border border-outline-variant/20 rounded-2xl p-12 text-center text-on-surface-variant text-sm italic">
                        Select an order from the list to manage customer details, address logs, and delivery status.
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* TAB 5: INVENTORY (PRODUCTS) */}
            {activeTab === 'products' && (
              <div className="space-y-8">
                
                {/* List Products View */}
                {!isAddingProduct && !editingProduct ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Inventory Manager</h1>
                        <p className="text-sm text-on-surface-variant mt-1">Maintain formulation names, botanical ingredients, size configurations, and price lists.</p>
                      </div>
                      <button
                        onClick={startAddProduct}
                        className="bg-secondary hover:bg-secondary-container text-white font-body text-xs font-bold tracking-widest uppercase py-3.5 px-6 rounded-full flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Product
                      </button>
                    </div>

                    <div className="bg-white border border-outline-variant/20 rounded-3xl overflow-hidden shadow-md">
                      <table className="w-full text-left text-sm min-w-[700px]">
                        <thead>
                          <tr className="bg-surface-container-low text-primary font-bold border-b border-outline-variant/25">
                            <th className="px-6 py-5">Product Details</th>
                            <th className="px-6 py-5">Category</th>
                            <th className="px-6 py-5">Size Packs & Prices</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                          {products.map(p => (
                            <tr key={p.id} className="hover:bg-[#FAF9F5]/40 transition-colors">
                              <td className="px-6 py-5 max-w-md">
                                <div className="text-base font-bold text-primary">{p.name}</div>
                                <div className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">{p.description}</div>
                              </td>
                              <td className="px-6 py-5">
                                <span className="bg-primary/5 text-primary border border-primary/10 px-3 py-1.5 rounded-full font-semibold text-xs">
                                  {p.category}
                                </span>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex flex-wrap gap-2">
                                  {p.sizes.map((s, idx) => (
                                    <span key={idx} className="bg-secondary/10 text-secondary border border-secondary/15 px-3 py-1 rounded text-xs font-bold">
                                      {s.size}: ₹{s.price}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <div className="flex justify-end gap-3">
                                  <button
                                    onClick={() => startEditProduct(p)}
                                    className="w-10 h-10 rounded-full border border-outline-variant/35 hover:border-primary flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteProduct(p.id)}
                                    className="w-10 h-10 rounded-full border border-outline-variant/35 hover:border-error flex items-center justify-center text-on-surface-variant hover:text-error transition-all cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* ADD / EDIT PRODUCT FORM VIEW */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-outline-variant/20 rounded-3xl p-8 md:p-10 shadow-md space-y-8"
                  >
                    <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                      <h3 className="text-xl font-bold text-primary">
                        {editingProduct ? `Edit Formulation: ${editingProduct.name}` : 'Create New Formulation'}
                      </h3>
                      <button
                        onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }}
                        className="text-xs font-bold text-on-surface-variant hover:underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <form onSubmit={saveProductSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-primary uppercase tracking-wider">Product Name</label>
                          <input
                            type="text"
                            value={prodName}
                            onChange={(e) => setProdName(e.target.value)}
                            className="w-full border border-outline-variant/40 rounded-xl py-3.5 px-4 text-xs text-primary focus:outline-none focus:border-secondary"
                            placeholder="e.g. Herbal Shikakai Powder"
                            required
                          />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-primary uppercase tracking-wider">Category</label>
                          <select
                            value={prodCategory}
                            onChange={(e) => setProdCategory(e.target.value)}
                            className="w-full border border-outline-variant/40 rounded-xl py-3.5 px-4 text-xs text-primary focus:outline-none focus:border-secondary bg-white"
                          >
                            {categories.map((c, i) => (
                              <option key={i} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-primary uppercase tracking-wider">Description</label>
                        <textarea
                          value={prodDesc}
                          onChange={(e) => setProdDesc(e.target.value)}
                          rows={4}
                          className="w-full border border-outline-variant/40 rounded-xl py-3.5 px-4 text-xs text-primary focus:outline-none focus:border-secondary"
                          placeholder="Describe the formulation's purpose and highlights..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Herbs count/label */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-primary uppercase tracking-wider">Botanical Herbs Count</label>
                          <input
                            type="text"
                            value={prodHerbs}
                            onChange={(e) => setProdHerbs(e.target.value)}
                            className="w-full border border-outline-variant/40 rounded-xl py-3.5 px-4 text-xs text-primary focus:outline-none focus:border-secondary"
                            placeholder="e.g. 40 Herbs or 45 Ingredients"
                            required
                          />
                        </div>

                        {/* Benefits */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-primary uppercase tracking-wider">Benefits (One per line)</label>
                          <textarea
                            value={prodBenefits}
                            onChange={(e) => setProdBenefits(e.target.value)}
                            rows={4}
                            className="w-full border border-outline-variant/40 rounded-xl py-3.5 px-4 text-xs text-primary focus:outline-none focus:border-secondary"
                            placeholder="* Controls premature greying&#10;* Boosts volume and hair growth"
                            required
                          />
                        </div>
                      </div>

                      {/* Sizes List manager */}
                      <div className="space-y-4 border-t border-outline-variant/20 pt-6">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-bold text-primary uppercase tracking-wider">Pack Sizes & Pricing</label>
                          <button
                            type="button"
                            onClick={addSizeField}
                            className="text-secondary hover:text-secondary-container text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Size Option
                          </button>
                        </div>

                        <div className="space-y-3">
                          {prodSizes.map((sizeObj, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="flex-grow grid grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  value={sizeObj.size}
                                  onChange={(e) => handleSizeChangeInForm(idx, 'size', e.target.value)}
                                  className="w-full border border-outline-variant/40 rounded-xl py-3 px-4 text-xs text-primary focus:outline-none focus:border-secondary"
                                  placeholder="e.g. 100ml or 250g"
                                  required
                                />
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">₹</span>
                                  <input
                                    type="number"
                                    value={sizeObj.price || ''}
                                    onChange={(e) => handleSizeChangeInForm(idx, 'price', e.target.value)}
                                    className="w-full border border-outline-variant/40 rounded-xl py-3 pl-8 pr-4 text-xs text-primary focus:outline-none focus:border-secondary"
                                    placeholder="Price in INR"
                                    required
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSizeField(idx)}
                                disabled={prodSizes.length === 1}
                                className="w-10 h-10 rounded-full border border-outline-variant/30 hover:border-error flex items-center justify-center text-on-surface-variant hover:text-error disabled:opacity-40 disabled:hover:border-outline-variant/30 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-outline-variant/20 pt-6 flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }}
                          className="border border-outline-variant/40 text-primary hover:bg-[#FAF9F5] text-xs font-bold tracking-widest uppercase py-4 px-8 rounded-full transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold tracking-widest uppercase py-4 px-10 rounded-full shadow transition-colors cursor-pointer"
                        >
                          {editingProduct ? 'Save Changes' : 'Create Product'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            )}

            {/* TAB 6: CATEGORIES MANAGER */}
            {activeTab === 'categories' && (
              <div className="space-y-8 max-w-3xl">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-primary">Categories</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Organize catalog formulations into groups.</p>
                </div>

                <div className="bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-6">
                  <form onSubmit={addCategory} className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Enter new category name..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="flex-grow border border-outline-variant/40 rounded-xl py-3 px-4 text-xs text-primary focus:outline-none focus:border-secondary"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-6 py-3 rounded-xl uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </form>

                  <div className="space-y-3">
                    <span className="block text-xs font-bold text-primary uppercase tracking-wider">Active Categories</span>
                    <div className="divide-y divide-outline-variant/10">
                      {categories.map((c, i) => (
                        <div key={i} className="py-3.5 flex justify-between items-center">
                          <span className="font-semibold text-sm">{c}</span>
                          <button
                            onClick={() => deleteCategory(c)}
                            className="text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: COUPONS MANAGER */}
            {activeTab === 'coupons' && (
              <div className="space-y-6 max-w-6xl">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-primary font-poppins">Coupon Management</h1>
                </div>

                {/* Top Alert banner */}
                <div className="bg-[#EBF5FF] text-[#1E40AF] border border-[#BFDBFE] px-5 py-3 rounded-xl text-xs font-semibold">
                  Coupon discount applies to product subtotal only — not delivery charge.
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: + New Coupon Form */}
                  <div className="lg:col-span-5 bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider font-poppins">
                      {editingCouponCode ? 'Edit Coupon' : '+ New Coupon'}
                    </h3>
                    
                    <form onSubmit={addCoupon} className="space-y-4">
                      {/* Coupon Code Input and Generate Button */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Coupon Code *</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. PILLOW"
                            value={newCouponCode}
                            onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                            className="flex-grow border border-outline-variant/35 rounded-xl py-3 px-4 text-xs text-primary focus:outline-none focus:border-primary uppercase font-bold"
                            required
                          />
                          <button
                            type="button"
                            onClick={handleGenerateCouponCode}
                            className="bg-[#2B3E2F] hover:bg-[#1E2B21] text-white text-[10px] font-bold px-4 py-3 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Generate
                          </button>
                        </div>
                      </div>

                      {/* Discount % and Min Order in 2 columns */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Discount % *</label>
                          <input
                            type="number"
                            value={newCouponDiscount || ''}
                            onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                            className="w-full border border-outline-variant/35 rounded-xl py-3 px-4 text-xs text-primary focus:outline-none focus:border-primary font-semibold"
                            min={1}
                            max={100}
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Min Order (₹)</label>
                          <input
                            type="number"
                            value={newCouponMinOrder || ''}
                            onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                            className="w-full border border-outline-variant/35 rounded-xl py-3 px-4 text-xs text-primary focus:outline-none focus:border-primary font-semibold"
                            min={0}
                            required
                          />
                        </div>
                      </div>

                      {/* Expiry Date and Usage Limit in 2 columns */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Expiry Date</label>
                          <input
                            type="date"
                            value={newCouponExpiryDate}
                            onChange={(e) => setNewCouponExpiryDate(e.target.value)}
                            className="w-full border border-outline-variant/35 rounded-xl py-2.5 px-4 text-xs text-primary focus:outline-none focus:border-primary font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Usage Limit</label>
                          <input
                            type="number"
                            value={newCouponUsageLimit || ''}
                            onChange={(e) => setNewCouponUsageLimit(Number(e.target.value))}
                            className="w-full border border-outline-variant/35 rounded-xl py-3 px-4 text-xs text-primary focus:outline-none focus:border-primary font-semibold"
                            min={0}
                            required
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex gap-3">
                        {editingCouponCode && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCouponCode(null);
                              setNewCouponCode('');
                              setNewCouponDiscount(10);
                              setNewCouponMinOrder(1);
                              setNewCouponExpiryDate('');
                              setNewCouponUsageLimit(20);
                            }}
                            className="w-1/3 border border-outline-variant/40 hover:bg-[#FAF9F5] text-primary text-[10px] font-bold py-3 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className={`bg-[#2B3E2F] hover:bg-[#1E2B21] text-white text-[10px] font-bold py-3.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer ${
                            editingCouponCode ? 'w-2/3' : 'w-full'
                          }`}
                        >
                          {editingCouponCode ? 'Update Coupon' : 'Create Coupon'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Column: All Coupons List */}
                  <div className="lg:col-span-7 bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wider font-poppins">
                        All Coupons ({coupons.length})
                      </h3>
                      <button
                        onClick={handleRefresh}
                        className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {coupons.length === 0 ? (
                        <div className="p-8 text-center text-on-surface-variant text-xs italic">
                          No coupons configured yet.
                        </div>
                      ) : (
                        coupons.map((cp) => {
                          const expired = isCouponExpired(cp.expiryDate);
                          return (
                            <div
                              key={cp.code}
                              className="bg-[#FAF9F6]/50 border border-outline-variant/15 rounded-xl p-4 space-y-2 flex flex-col justify-between hover:bg-[#FAF9F6] transition-colors relative"
                            >
                              {/* Header info */}
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-primary text-base tracking-wide font-poppins">{cp.code}</span>
                                  <span 
                                    onClick={() => toggleCouponStatus(cp.code)}
                                    className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider cursor-pointer border ${
                                      cp.status === 'ACTIVE'
                                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                    }`}
                                  >
                                    {cp.status}
                                  </span>
                                </div>
                                <div className="flex gap-3 text-[10px] font-bold">
                                  <button
                                    onClick={() => startEditCoupon(cp)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteCoupon(cp.code)}
                                    className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                                  >
                                    Del
                                  </button>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="space-y-1">
                                <div className="text-xs font-semibold text-primary">
                                  {cp.discount}% off <span className="text-on-surface-variant/70 font-medium">· min ₹{cp.minOrder}</span>
                                </div>
                                <div className="text-[11px] text-on-surface-variant flex flex-wrap items-center gap-1.5 font-medium">
                                  <span>Used {cp.usedCount} times</span>
                                  {cp.expiryDate && (
                                    <>
                                      <span>•</span>
                                      <span>expires {formatCouponExpiry(cp.expiryDate)}</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Expired badge */}
                              {expired && (
                                <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mt-1">
                                  Expired
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 8: USERS MANAGER */}
            {activeTab === 'users' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-primary">ERP User Profiles</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Authorized personnel with credentials to control inventory and fulfill sales.</p>
                </div>

                <div className="bg-white border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-surface-container-low text-primary font-bold border-b border-outline-variant/25">
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Console Permissions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {adminUsers.map((u, i) => (
                        <tr key={i} className="hover:bg-[#FAF9F5]/40 transition-colors">
                          <td className="px-6 py-4 font-semibold text-primary">{u.name}</td>
                          <td className="px-6 py-4">
                            <span className="bg-secondary/15 text-secondary px-3 py-1 rounded-full font-bold text-xs">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant font-medium">Read / Write CRUD Admin Console Full Access</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}
