import { supabase } from './supabase';
import type { Product, Order, Coupon, UserProfile } from './store';

// Products
export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    image: p.image_url,
    herbs: p.herbs,
    benefits: p.benefits,
    sizes: p.sizes,
    isAvailable: p.is_available,
    howToUse: p.how_to_use,
    tamilName: p.tamil_name,
    details: p.details,
    nutritionalInfo: p.nutritional_info,
  })) as Product[];
}

export async function upsertProduct(product: Product, imageFile?: File) {
  let imageUrl = product.image;

  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${product.id}-${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile);
      
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    imageUrl = data.publicUrl;
  }

  const { error } = await supabase.from('products').upsert({
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    image_url: imageUrl,
    herbs: product.herbs,
    benefits: product.benefits,
    sizes: product.sizes,
    is_available: product.isAvailable,
    how_to_use: product.howToUse,
    tamil_name: product.tamilName,
    details: product.details,
    nutritional_info: product.nutritionalInfo,
  });

  if (error) throw error;
  return imageUrl;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// Categories
export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('name');
  if (error) throw error;
  return data.map(c => c.name);
}

export async function insertCategory(name: string) {
  const { error } = await supabase.from('categories').insert({ name });
  if (error) throw error;
}

export async function deleteCategory(name: string) {
  const { error } = await supabase.from('categories').delete().eq('name', name);
  if (error) throw error;
}

// Coupons
export async function fetchCoupons() {
  const { data, error } = await supabase.from('coupons').select('*');
  if (error) throw error;
  return data.map(c => ({
    code: c.code,
    discount: c.discount_percentage,
    minOrder: c.min_order,
    expiryDate: c.expiry_date,
    usageLimit: c.usage_limit,
    usedCount: c.used_count,
    status: c.status
  })) as Coupon[];
}

export async function upsertCoupon(coupon: Coupon) {
  const { error } = await supabase.from('coupons').upsert({
    code: coupon.code,
    discount_percentage: coupon.discount,
    min_order: coupon.minOrder,
    expiry_date: coupon.expiryDate || null,
    usage_limit: coupon.usageLimit,
    used_count: coupon.usedCount,
    status: coupon.status
  });
  if (error) throw error;
}

export async function deleteCoupon(code: string) {
  const { error } = await supabase.from('coupons').delete().eq('code', code);
  if (error) throw error;
}

// Users/Profiles
export async function fetchProfiles() {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data.map(p => ({
    id: p.id,
    name: p.name || '',
    email: p.email,
    mobile: p.phone || '—',
    joinedDate: p.created_at,
    role: p.role
  })) as (UserProfile & { id: string })[];
}

export async function updateUserRole(id: string, role: 'Admin' | 'Customer') {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
  if (error) throw error;
}

// WhatsApp Requests
export async function insertWhatsappRequest(order: Omit<Order, 'id' | 'createdAt' | 'status' | 'source' | 'couponCode' | 'couponDiscount' | 'manualDiscount' | 'deliveryCharge' | 'cashReceived' | 'changeReturned' | 'subtotal'>) {
  const { data: { session } } = await supabase.auth.getSession();
  
  // Securely generate sequential ORD-YYYY-NNNN via a Postgres function
  // This bypasses RLS restrictions so guests can get the correct next ID.
  let { data: orderId, error: rpcError } = await supabase.rpc('generate_whatsapp_order_id');
  
  if (rpcError || !orderId) {
    console.error("RPC failed, falling back to random ID", rpcError);
    // Fallback just in case the SQL script hasn't been run yet
    orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const { error } = await supabase.from('whatsapp_requests').insert({
    order_id: orderId,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    customer_email: order.customerEmail,
    customer_address: order.customerAddress,
    items: order.items,
    total_price: order.totalPrice,
    user_id: session?.user?.id || null
  });
  if (error) throw error;
}

export async function fetchWhatsappRequests() {
  const { data, error } = await supabase.from('whatsapp_requests').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(o => {
    let parsedItems: any[] = [];
    try {
      if (Array.isArray(o.items)) {
        parsedItems = o.items;
      } else if (typeof o.items === 'string') {
        parsedItems = JSON.parse(o.items);
      }
    } catch (e) {
      console.error("Failed to parse whatsapp request items:", e);
    }
    return {
      id: o.id,
      orderId: o.order_id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerEmail: o.customer_email,
      customerAddress: o.customer_address,
      items: parsedItems,
      totalPrice: typeof o.total_price === 'number' ? o.total_price : parseFloat(o.total_price || '0'),
      status: o.status || 'Pending',
      createdAt: o.created_at,
      userId: o.user_id
    };
  });
}

export async function updateWhatsappRequestStatus(id: string, status: string) {
  const { error } = await supabase.from('whatsapp_requests').update({ status }).eq('id', id);
  if (error) throw error;
}

// Gift Requests
export async function insertGiftRequest(senderName: string, recipientName: string, phone: string, message: string, items: any[], totalPrice: number) {
  const { data: { session } } = await supabase.auth.getSession();

  // Generate GIFT-YYYY-NNNN
  const currentYear = new Date().getFullYear();
  const { data: latest } = await supabase
    .from('gift_requests')
    .select('gift_id')
    .ilike('gift_id', `GIFT-${currentYear}-%`)
    .order('created_at', { ascending: false })
    .limit(1);
    
  let nextNum = 1;
  if (latest && latest.length > 0 && latest[0].gift_id) {
    const parts = latest[0].gift_id.split('-');
    if (parts.length === 3) {
      nextNum = parseInt(parts[2], 10) + 1;
    }
  }
  const giftId = `GIFT-${currentYear}-${String(nextNum).padStart(4, '0')}`;

  const { error } = await supabase.from('gift_requests').insert({
    gift_id: giftId,
    sender_name: senderName,
    recipient_name: recipientName,
    customer_phone: phone,
    message,
    items,
    total_price: totalPrice,
    user_id: session?.user?.id || null
  });
  if (error) throw error;
}

export async function fetchGiftRequests() {
  const { data, error } = await supabase.from('gift_requests').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(o => {
    let parsedItems: any[] = [];
    let senderMobile = '';
    let recipientAddress = '';
    
    try {
      if (Array.isArray(o.items)) {
        parsedItems = o.items;
      } else if (typeof o.items === 'string') {
        parsedItems = JSON.parse(o.items);
      }
      
      const metaItem = parsedItems.find((it: any) => it.__metadata);
      if (metaItem) {
        senderMobile = metaItem.senderMobile || '';
        recipientAddress = metaItem.recipientAddress || '';
        parsedItems = parsedItems.filter((it: any) => !it.__metadata);
      }
    } catch (e) {
      console.error("Failed to parse gift request items:", e);
    }
    return {
      id: o.id,
      giftId: o.gift_id,
      senderName: o.sender_name,
      recipientName: o.recipient_name,
      recipientPhone: o.customer_phone,
      senderMobile,
      recipientAddress,
      giftMessage: o.message,
      items: parsedItems,
      totalPrice: typeof o.total_price === 'number' ? o.total_price : parseFloat(o.total_price || '0'),
      status: o.status || 'Pending',
      createdAt: o.created_at,
      userId: o.user_id
    };
  });
}

export async function updateGiftRequestStatus(id: string, status: string) {
  const { error } = await supabase.from('gift_requests').update({ status }).eq('id', id);
  if (error) throw error;
}

// Official Orders (POS Bills)
export async function fetchOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(o => {
    let parsedItems: any[] = [];
    try {
      if (Array.isArray(o.items)) {
        parsedItems = o.items;
      } else if (typeof o.items === 'string') {
        parsedItems = JSON.parse(o.items);
      }
    } catch (e) {
      console.error("Failed to parse official order items:", e);
    }
    return {
      id: o.id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerEmail: "",
      customerAddress: o.source === 'OFFLINE' ? 'Offline POS Shop' : 'Online Shipping Address',
      source: o.source,
      items: parsedItems,
      subtotal: typeof o.subtotal === 'number' ? o.subtotal : parseFloat(o.subtotal || '0'),
      couponCode: o.coupon_code,
      couponDiscount: typeof o.coupon_discount === 'number' ? o.coupon_discount : parseFloat(o.coupon_discount || '0'),
      manualDiscount: typeof o.manual_discount === 'number' ? o.manual_discount : parseFloat(o.manual_discount || '0'),
      deliveryCharge: typeof o.delivery_charge === 'number' ? o.delivery_charge : parseFloat(o.delivery_charge || '0'),
      totalPrice: typeof o.total_price === 'number' ? o.total_price : parseFloat(o.total_price || '0'),
      cashReceived: typeof o.cash_received === 'number' ? o.cash_received : parseFloat(o.cash_received || '0'),
      changeReturned: typeof o.change_returned === 'number' ? o.change_returned : parseFloat(o.change_returned || '0'),
      status: o.status || 'Completed',
      createdAt: o.created_at,
      userId: o.user_id
    };
  });
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
  
  if (error || !data) {
    if (error?.code !== 'PGRST116') { // PGRST116 is "Row not found"
      console.error("Error fetching order by ID:", error);
    }
    return null;
  }
  
  let parsedItems: any[] = [];
  try {
    if (Array.isArray(data.items)) {
      parsedItems = data.items;
    } else if (typeof data.items === 'string') {
      parsedItems = JSON.parse(data.items);
    }
  } catch (e) {
    console.error("Failed to parse official order items:", e);
  }

  return {
    id: data.id,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    customerEmail: "",
    customerAddress: data.source === 'OFFLINE' ? 'Offline POS Shop' : 'Online Shipping Address',
    source: data.source,
    items: parsedItems,
    subtotal: typeof data.subtotal === 'number' ? data.subtotal : parseFloat(data.subtotal || '0'),
    couponCode: data.coupon_code,
    couponDiscount: typeof data.coupon_discount === 'number' ? data.coupon_discount : parseFloat(data.coupon_discount || '0'),
    manualDiscount: typeof data.manual_discount === 'number' ? data.manual_discount : parseFloat(data.manual_discount || '0'),
    deliveryCharge: typeof data.delivery_charge === 'number' ? data.delivery_charge : parseFloat(data.delivery_charge || '0'),
    totalPrice: typeof data.total_price === 'number' ? data.total_price : parseFloat(data.total_price || '0'),
    cashReceived: typeof data.cash_received === 'number' ? data.cash_received : parseFloat(data.cash_received || '0'),
    changeReturned: typeof data.change_returned === 'number' ? data.change_returned : parseFloat(data.change_returned || '0'),
    status: data.status || 'Completed',
    createdAt: data.created_at,
    userId: data.user_id
  } as Order;
}


export async function insertOrder(order: any) {
  const { data: { session } } = await supabase.auth.getSession();
  const { error } = await supabase.from('orders').insert({
    id: order.id,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    source: order.source,
    items: order.items,
    subtotal: order.subtotal,
    coupon_code: order.couponCode,
    coupon_discount: order.couponDiscount,
    manual_discount: order.manualDiscount,
    delivery_charge: order.deliveryCharge,
    total_price: order.totalPrice,
    cash_received: order.cashReceived,
    change_returned: order.changeReturned,
    status: order.status,
    created_by: session?.user?.id || null
  });
  if (error) throw error;
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}
