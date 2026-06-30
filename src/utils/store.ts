export interface ProductSize {
  size: string;
  price: number;
  isAvailable?: boolean;
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
  isAvailable?: boolean;
  howToUse?: string;
  tamilName?: string;
  details?: string;
  nutritionalInfo?: { label: string; value: string }[];
}

export interface Coupon {
  code: string;
  discount: number;
  minOrder: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  joinedDate: string;
  role: 'Admin' | 'Customer';
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
  subtotal: number;
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
    herbs: 'Hibiscus, Rosemary, Rose Petals, Jatamansi Flax Seeds, Bhringraj, Amla, Alovera, Henna, Avuri, Fenugreek with unique & rare herbs.',
    tamilName: 'மூலிகை கூந்தல் எண்ணெய்',
    details: 'NO Chemicals\nArtificial Scents\nArtificial Flavours\n\nMRP : 220/-\nBest before 6 months from the Mfd.\nPacked & Marketed by :\nMahizham Natural Products Pvt. Ltd., Chennai\nEmail : caremahizham@gmail.com',
    howToUse: 'Suggested Use :\n* Apply Mahizham Herbal Hair oil on your scalp and massage with finger tips its regular usage.\n* Apply Hair Oil to the scalp gently massage few mins soak for an hour, then wash it with shikakai or mild shampoo ensure effectiveness.',
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
    herbs: 'Shitakai, Methi Reetha, Avuri, Hibiscus, Green Garam, Vetiver, Aloe, Curry Leaves, Bringaraj, Neem,Amla, Kadukkai, Poolankizhangu, Avaram Flower,Rose Flower, Henna, Karisalankani With Unique and rare Herbs.',
    tamilName: 'சிகைக்காய் பொடி',
    details: 'Net Weight : 100 gm\nMRP : 140/-\nPacked & Marketed by :\nMahizham Natural Products\nEmail : caremahizham@gmail.com\nBest before 6 months from the date of packing',
    howToUse: 'Usage :\nTake Little Quantity of Shikakai Powder Mix with water apply to hair & wash it or\nHair Pack : Apply with your hair Leave it with 10 minutes then rinse off with water',
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
    herbs: 'Green Gram, Uraddhal, Wheat, Rosemary, Hibiscus,Manjista, Dhriviya Pattai, Neeradi Muthu, Badham, Kadukaai, Mahizham Flower, Shenbaga Flower, Dry Aloevera, Red Sandal, Beetroot Dry with unique & rare herbs.',
    tamilName: 'குளியல் பொடி & ஃபேஸ் பேக்',
    details: 'Net Weight : 100gm\nMRP : 180/-\nPacked & Marketed by :\nMahizham Natural Products Pvt. Ltd., Chennai\nEmail : caremahizham@gmail.com\nBest before 6 months from the date of packing',
    howToUse: 'Usage :\nBath Powder : Apply Coconut oil or Ghee & take the required amount of Bath Powder mixed with water to form a paste. Apply For Face and entire body, Scrub well & wash it\n\nFace Pack : Apply the paste and leave it to dry or 10 minutes and rinse off.',
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
    herbs: 'Moongil Rice, Raagi, Red Rice, Thooyamalli Rice, Naattu Kambu, Saamai, Thinai, Kaatu Yanam, Mappillai Samba, Black Kavuni , Navara Rice, Kuthiraivaali, Moongdhal, Black Urad Dhal, Kuzhiadichan Rice, Kadaikani Rice, Panivaragu, Samba Wheat, Badham, Pista, Cashew, Black Channa, White Channa, Rajma,Kollu, Red Aval, Red Corn,Red Karamani, Makka Cholam, Elachi, Sukku, Fried Gram, Varagu, Barley, Javarasi, Flax Seed, Poongaar Rice, Karunkuravai Rice,Neelam Zamba, Pumpkin Seed, Kullakaar Rice, Soya Beans, Valan Zamba, Double Beans, Kudavazhai Rice',
    tamilName: 'சத்து மாவு',
    details: 'MRP : 220/-\nNET WEIGHT : 250gm\nBEST BEFORE : 6 Months\nBATCH NO. 13.06.2026\nPacked & Marketed by :\nMahizham Natural Products\nChennai\nContact : 87783 11671 / 98406 23527\nSTORAGE INSTRUCTION : Transfer the contents Into a clean dry airtight container & Refrigerate.',
    howToUse: 'HOW TO PREPARE ?\n* Add Little water to a Spoonful of Mahizham Multi Millet Health Mix\n* Boil a Glass of Water. Add the mixture & cook for 10 mins on a medium flame.\n* Turn off flame. add Required milk & Jaggery Powder (or) buttermilk & salt.',
    benefits: [
      'Note : You can also use this Powder to make Yummy Ladoo, Dosa & Adai.'
    ],
    sizes: [
      { size: '250g', price: 200 },
      { size: '500g', price: 380 }
    ],
    nutritionalInfo: [
      { label: 'Energy', value: '431 Kcal' },
      { label: 'Carbohydrates', value: '63.9 g' },
      { label: 'Total Fat', value: '13.3 g' },
      { label: 'Protein', value: '13.8 g' },
      { label: 'Dietary Fiber', value: '9.80 g' },
      { label: 'Total Sugars', value: 'BDL' },
      { label: 'Sodium', value: '74.9 mg' }
    ]
  }
];

const initialOrders: Order[] = [
  {
    id: 'ORD-8293',
    customerName: 'Sarah Jenkins',
    customerPhone: '9000000000',
    customerEmail: 'sarah.j@example.com',
    customerAddress: 'No 45, Gandhi Street, T. Nagar, Chennai - 600017',
    items: [
      { productId: 'herbal-hair-oil', name: 'Herbal Hair Oil', size: '200ml', price: 350, quantity: 2 },
      { productId: 'shikakai-powder', name: 'Herbal Shikakai Powder (Bio Hair Wash)', size: '250g', price: 280, quantity: 1 }
    ],
    subtotal: 980,
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
    subtotal: 910,
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

// Global Cart Storage Helpers
export const getStoredCart = (): OrderItem[] => {
  const saved = localStorage.getItem('mahizham_cart');
  return saved ? JSON.parse(saved) : [];
};

export const saveStoredCart = (items: OrderItem[]) => {
  localStorage.setItem('mahizham_cart', JSON.stringify(items));
};

export function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
  const orders = getStoredOrders();
  
  // Generate incremental Invoice ID
  const currentYear = new Date().getFullYear();
  let nextNumber = 1;
  const yearOrders = orders.filter(o => o.id.startsWith(`INV_${currentYear}_`));
  if (yearOrders.length > 0) {
    const highestNumber = Math.max(...yearOrders.map(o => {
      const parts = o.id.split('_');
      return parseInt(parts[2]) || 0;
    }));
    nextNumber = highestNumber + 1;
  }
  const paddedNumber = nextNumber.toString().padStart(4, '0');
  const newOrderId = `INV_${currentYear}_${paddedNumber}`;

  const newOrder: Order = {
    ...order,
    id: newOrderId,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    source: order.source || 'STOREFRONT'
  };
  orders.unshift(newOrder);
  saveStoredOrders(orders);
  return newOrder;
}
