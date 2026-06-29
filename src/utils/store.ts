export interface ProductSize {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  herbs: string;
  benefits: string[];
  sizes: ProductSize[];
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  createdAt: string;
  source?: 'OFFLINE' | 'ONLINE' | 'MANUAL' | 'STOREFRONT';
  couponCode?: string;
  couponDiscount?: number;
  manualDiscount?: number;
  deliveryCharge?: number;
  cashReceived?: number;
  changeReturned?: number;
  isGift?: boolean;
  giftMessage?: string;
}

// Exact product details and text from the packaging labels, plus the handwritten pricing
const initialProducts: Product[] = [
  {
    id: 'herbal-hair-oil',
    name: 'Herbal Hair Oil',
    category: 'Hair Care',
    description: 'An ancient lipid formula infused with 40 premium traditional herbs including Amla, Neem, Vetiver, and Karisalankanni to arrest hair fall, stimulate growth, and cool the scalp.',
    image: '/herbal-hair-oil.jpeg',
    herbs: '40 Herbs',
    benefits: [
      '* Controls premature greying',
      '* Boosts volume and hair growth',
      '* Protects from UV Rays',
      '* Reduce dandruff',
      '* Suitable for all ages'
    ],
    sizes: [
      { size: '100ml', price: 180 },
      { size: '200ml', price: 350 },
      { size: '500ml', price: 850 },
      { size: '1000ml', price: 1650 }
    ]
  },
  {
    id: 'shikakai-powder',
    name: 'Herbal Shikakai Powder (Bio Hair Wash)',
    category: 'Hair Care',
    description: 'A 100% natural, chemical-free foaming cleanser made from 40 select herbs like Shikakai, Arappu, Methi, and Hibiscus. Preserves natural oils and strengthens hair roots.',
    image: '/herbal shikakai powder.jpeg',
    herbs: '40 Herbs',
    benefits: [
      '*Strengthens hair root and healthy scalp.',
      '* Prevents hair loss and pre-mature greying.',
      '* Act as a anti-dandruff agent.'
    ],
    sizes: [
      { size: '100g', price: 120 },
      { size: '250g', price: 280 },
      { size: '500g', price: 540 }
    ]
  },
  {
    id: 'face-pack-bath-powder',
    name: 'Face Pack & Bath Powder',
    category: 'Skin Care',
    description: 'A botanical daily bath powder blending 50 luxury herbs like Aavaram Senna, Wild Turmeric, Vetiver, and Red Sandalwood. Cleanses and softens skin without stripping lipids.',
    image: '/face-pack-and-bath-powder.jpeg',
    herbs: '50 Herbs',
    benefits: [
      '* Controls Acne Pimples, Blackheads.',
      '* Removes dead Skin, Sunburn, Tan and softness skin.',
      '* Improves skin complexion.',
      '* Ideal for daily usage instead of soap.',
      '* Prevents white scaling, germs and rashes in the skin.'
    ],
    sizes: [
      { size: '100g', price: 150 },
      { size: '250g', price: 360 },
      { size: '500g', price: 700 }
    ]
  },
  {
    id: 'multi-millet-mix',
    name: 'Wellness Mix',
    category: 'Nutrition',
    description: 'A nutrient-dense traditional health drink compounding 45 natural ingredients, roasted millets, and enriched with 15% nuts. Perfect daily energy porridge for all age groups.',
    image: '/multi-millet-health-mix.jpeg',
    herbs: '45 Ingredients',
    benefits: [
      'Note : You can also use this Powder to make Yummy Ladoo, Dosa & Adai.'
    ],
    sizes: [
      { size: '250g', price: 200 },
      { size: '500g', price: 380 }
    ]
  }
];

const initialOrders: Order[] = [
  {
    id: 'ORD-8293',
    customerName: 'Anand Sivaram',
    customerPhone: '9940088786',
    customerEmail: 'anand.sivaram@gmail.com',
    customerAddress: 'No 45, Gandhi Street, T. Nagar, Chennai - 600017',
    items: [
      { productId: 'herbal-hair-oil', name: 'Herbal Hair Oil', size: '200ml', price: 350, quantity: 2 },
      { productId: 'shikakai-powder', name: 'Herbal Shikakai Powder (Bio Hair Wash)', size: '250g', price: 280, quantity: 1 }
    ],
    totalPrice: 980,
    status: 'Processing',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  },
  {
    id: 'ORD-1209',
    customerName: 'Priya Sundar',
    customerPhone: '9876543210',
    customerEmail: 'priya.sundar@yahoo.com',
    customerAddress: 'Flat A, Gokulam Apartments, Adyar, Chennai - 600020',
    items: [
      { productId: 'face-pack-bath-powder', name: 'Face Pack & Bath Powder', size: '100g', price: 150, quantity: 1 },
      { productId: 'multi-millet-mix', name: 'Wellness Mix', size: '500g', price: 380, quantity: 2 }
    ],
    totalPrice: 910,
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
  }
];

// Helper functions for Local Storage
export function getStoredProducts(): Product[] {
  const data = localStorage.getItem('mahizham_products');
  if (!data) {
    localStorage.setItem('mahizham_products', JSON.stringify(initialProducts));
    return initialProducts;
  }
  return JSON.parse(data);
}

export function saveStoredProducts(products: Product[]): void {
  localStorage.setItem('mahizham_products', JSON.stringify(products));
  // Dispatch custom event to notify components about state updates
  window.dispatchEvent(new Event('mahizham_products_updated'));
}

export function getStoredOrders(): Order[] {
  const data = localStorage.getItem('mahizham_orders');
  if (!data) {
    localStorage.setItem('mahizham_orders', JSON.stringify(initialOrders));
    return initialOrders;
  }
  return JSON.parse(data);
}

export function saveStoredOrders(orders: Order[]): void {
  localStorage.setItem('mahizham_orders', JSON.stringify(orders));
  // Dispatch custom event to notify components about state updates
  window.dispatchEvent(new Event('mahizham_orders_updated'));
}

export function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
  const orders = getStoredOrders();
  const newOrder: Order = {
    ...order,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    source: 'STOREFRONT'
  };
  orders.unshift(newOrder);
  saveStoredOrders(orders);
  return newOrder;
}
