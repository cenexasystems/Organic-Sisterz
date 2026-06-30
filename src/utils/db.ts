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
  const { error } = await supabase.from('whatsapp_requests').insert({
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
  return data.map(o => ({
    id: o.id,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    customerEmail: o.customer_email,
    customerAddress: o.customer_address,
    items: o.items,
    totalPrice: o.total_price,
    status: o.status,
    createdAt: o.created_at
  }));
}

export async function updateWhatsappRequestStatus(id: string, status: string) {
  const { error } = await supabase.from('whatsapp_requests').update({ status }).eq('id', id);
  if (error) throw error;
}

// Gift Requests
export async function insertGiftRequest(senderName: string, recipientName: string, phone: string, message: string, items: any[], totalPrice: number) {
  const { data: { session } } = await supabase.auth.getSession();
  const { error } = await supabase.from('gift_requests').insert({
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
  return data.map(o => ({
    id: o.id,
    senderName: o.sender_name,
    recipientName: o.recipient_name,
    recipientPhone: o.customer_phone,
    giftMessage: o.message,
    items: o.items,
    totalPrice: o.total_price,
    status: o.status,
    createdAt: o.created_at
  }));
}

export async function updateGiftRequestStatus(id: string, status: string) {
  const { error } = await supabase.from('gift_requests').update({ status }).eq('id', id);
  if (error) throw error;
}

// Official Orders (POS Bills)
export async function fetchOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(o => ({
    id: o.id,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    customerEmail: "",
    customerAddress: o.source === 'OFFLINE' ? 'Offline POS Shop' : 'Online Shipping Address',
    source: o.source,
    items: o.items,
    subtotal: o.subtotal,
    couponCode: o.coupon_code,
    couponDiscount: o.coupon_discount,
    manualDiscount: o.manual_discount,
    deliveryCharge: o.delivery_charge,
    totalPrice: o.total_price,
    cashReceived: o.cash_received,
    changeReturned: o.change_returned,
    status: o.status,
    createdAt: o.created_at
  }));
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
