import { Product, Category, Brand, Voucher } from './types';

export const CATEGORIES: Category[] = [
  { id: 'mobile-phones-accessories', name: 'Mobile Phones & Accessories', iconName: 'Smartphone', color: 'bg-orange-100 text-[#F85606]', itemCount: 58 },
  { id: 'electronics-gadgets', name: 'Electronics & Gadgets', iconName: 'Cpu', color: 'bg-purple-100 text-purple-600', itemCount: 130 },
  { id: 'pet-supplies-accessories', name: 'Pet Supplies & Accessories', iconName: 'Dog', color: 'bg-green-100 text-green-600', itemCount: 7 },
  { id: 'home-kitchen', name: 'Home & Kitchen', iconName: 'Home', color: 'bg-amber-100 text-amber-600', itemCount: 1291 },
  { id: 'beauty-personal-care', name: 'Beauty & Personal Care', iconName: 'Sparkles', color: 'bg-pink-100 text-pink-600', itemCount: 252 },
  { id: 'clothing-fashion', name: 'Clothing & Fashion', iconName: 'Shirt', color: 'bg-blue-100 text-blue-600', itemCount: 483 },
  { id: 'groceries-daily-essentials', name: 'Groceries & Daily Essentials', iconName: 'ShoppingBasket', color: 'bg-emerald-100 text-emerald-600', itemCount: 3 },
  { id: 'sports-outdoors', name: 'Sports & Outdoors', iconName: 'Activity', color: 'bg-red-100 text-red-600', itemCount: 91 },
  { id: 'perfumes-fragrances', name: 'Perfumes & Fragrances', iconName: 'Droplet', color: 'bg-violet-100 text-violet-600', itemCount: 12 },
  { id: 'health-wellness', name: 'Health & Wellness', iconName: 'HeartPulse', color: 'bg-rose-100 text-rose-600', itemCount: 42 },
  { id: 'books-media', name: 'Books & Media', iconName: 'BookOpen', color: 'bg-yellow-100 text-yellow-600', itemCount: 11 },
  { id: 'automotive-motorbike', name: 'Automotive & Motorbike', iconName: 'Car', color: 'bg-slate-100 text-slate-600', itemCount: 26 },
  { id: 'sunglasses-eyewear', name: 'Sunglasses & Eyewear', iconName: 'Glasses', color: 'bg-cyan-100 text-cyan-600', itemCount: 114 },
];

export const BRANDS: Brand[] = [
  { id: 'samsung', name: 'Samsung', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&fit=crop' },
  { id: 'apple', name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&fit=crop' },
  { id: 'xiaomi', name: 'Xiaomi', logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&fit=crop' },
  { id: 'nike', name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&fit=crop' },
  { id: 'unilever', name: 'Unilever', logo: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=100&fit=crop' },
  { id: 'loreal', name: "L'Oreal", logo: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&fit=crop' },
  { id: 'panasonic', name: 'Panasonic', logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&fit=crop' },
  { id: 'damro', name: 'Damro', logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&fit=crop' },
];

export const VOUCHERS: Voucher[] = [
  { id: 'v1', code: 'DARAZ1000', discountAmount: 1000, minSpend: 5000, isCollected: false, expiryDate: '2026-07-15' },
  { id: 'v2', code: 'WELCOMELKR', discountAmount: 500, minSpend: 2000, isCollected: false, expiryDate: '2026-08-01' },
  { id: 'v3', code: 'SUPERDEAL', discountAmount: 2500, minSpend: 15000, isCollected: false, expiryDate: '2026-07-10' },
  { id: 'v4', code: 'FREESHIP', discountAmount: 350, minSpend: 1500, isCollected: false, expiryDate: '2026-07-20' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    title: 'Samsung Galaxy A55 5G - 8GB RAM - 256GB Storage - Official Warranty',
    description: 'The Samsung Galaxy A55 5G delivers cutting-edge performance with an Exynos 1480 processor, a stunning 120Hz Super AMOLED display, and a powerful 50MP triple-camera system. Designed with a sleek glass back and aluminum frame, this phone offers IP67 water and dust resistance, long-lasting 5000mAh battery, and 25W fast charging support.',
    price: 114900,
    originalPrice: 129900,
    discount: 12,
    rating: 4.8,
    reviewCount: 42,
    soldCount: 158,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'mobile-phones-accessories',
    subCategory: 'Mobiles',
    brand: 'Samsung',
    stock: 24,
    specifications: {
      'Display': '6.6-inch Super AMOLED 120Hz',
      'Processor': 'Exynos 1480 (4nm)',
      'RAM': '8GB',
      'Storage': '256GB',
      'Rear Camera': '50MP (OIS) + 12MP + 5MP',
      'Front Camera': '32MP',
      'Battery': '5000mAh with 25W Charging',
      'OS': 'Android 14, One UI 6.1'
    },
    colors: ['Awesome Navy', 'Awesome Iceblue', 'Awesome Lilac'],
    sizes: ['256GB'],
    vendor: {
      id: 'v-samsung-sl',
      name: 'Samsung Authorized Retailer',
      ratingPercent: 96,
      responseTime: 'Within 2 hours',
      isFollowed: false
    },
    reviews: [
      { id: 'r1', userName: 'Kamal P.', rating: 5, comment: 'Excellent phone! Battery lasts easily 2 days. Fast delivery in Colombo. Recommended seller.', date: '2026-06-15', verifiedPurchase: true },
      { id: 'r2', userName: 'Nishantha S.', rating: 4, comment: 'Camera is good, especially in daylight. No charger in the box which is sad. Otherwise perfect.', date: '2026-06-20', verifiedPurchase: true }
    ],
    qna: [
      { id: 'q1', question: 'Does it come with official company warranty?', answer: 'Yes, this comes with 1 Year Official Softlogic / John Keells Samsung Sri Lanka Warranty.', askedBy: 'Suresh K.', answeredBy: 'Samsung Authorized Retailer', date: '2026-06-18' }
    ]
  },
  {
    id: 'prod-002',
    title: 'Nike Air Max Excee Mens Sneakers - Dynamic Cushioning Running Shoes',
    description: 'Get inspired by the Nike Air Max 90, the Nike Air Max Excee is a celebration of a classic through a new lens. Elongated design lines and distorted proportions on the upper bring an icon into a modern space.',
    price: 38500,
    originalPrice: 48000,
    discount: 20,
    rating: 4.6,
    reviewCount: 28,
    soldCount: 84,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'sports-outdoors',
    subCategory: 'Shoes',
    brand: 'Nike',
    stock: 12,
    specifications: {
      'Upper Material': 'Mesh, Leather and Suede',
      'Sole Material': 'Rubber Traction Outsole',
      'Cushioning': 'Visible Air Max Unit',
      'Weight': '340g (Size 9)'
    },
    colors: ['Red/Black', 'White/Blue', 'All Black'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
    vendor: {
      id: 'v-sportshub-sl',
      name: 'SportsHub Sri Lanka',
      ratingPercent: 92,
      responseTime: 'Within 4 hours',
      isFollowed: false
    },
    reviews: [
      { id: 'r3', userName: 'Mervin J.', rating: 5, comment: '100% genuine Nike shoes. Extremely comfortable for daily walks and gym sessions. Box was in perfect condition.', date: '2026-06-10', verifiedPurchase: true }
    ],
    qna: [
      { id: 'q2', question: 'Are these authentic?', answer: 'Yes, all our Nike products are 100% authentic sourced directly from authorized global channels.', askedBy: 'Ranga B.', answeredBy: 'SportsHub Sri Lanka', date: '2026-06-12' }
    ]
  },
  {
    id: 'prod-003',
    title: 'Apple iPhone 15 Pro Max - 256GB - Titanium Gray (TRCSL Approved)',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever. Experience 5x optical zoom and extreme gaming performance.',
    price: 365000,
    originalPrice: 399000,
    discount: 9,
    rating: 4.9,
    reviewCount: 56,
    soldCount: 210,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'mobile-phones-accessories',
    subCategory: 'Mobiles',
    brand: 'Apple',
    stock: 5,
    specifications: {
      'Material': 'Grade 5 Titanium Design',
      'Processor': 'A17 Pro (3nm)',
      'Display': '6.7-inch Super Retina XDR ProMotion',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto',
      'Charging': 'USB-C (supports USB 3)',
      'TRCSL Status': 'Approved with Genunity Certificate'
    },
    colors: ['Natural Titanium', 'Blue Titanium', 'Black Titanium'],
    sizes: ['256GB', '512GB'],
    vendor: {
      id: 'v-apple-store-sl',
      name: 'Apple Genius Lanka',
      ratingPercent: 98,
      responseTime: 'Within 1 hour',
      isFollowed: false
    },
    reviews: [
      { id: 'r4', userName: 'Danushka T.', rating: 5, comment: 'Amazing device. Titanium design feels so premium and lightweight. TRCSL registration was complete. Seller called to confirm before shipping.', date: '2026-05-28', verifiedPurchase: true }
    ],
    qna: [
      { id: 'q3', question: 'Is this TRCSL approved?', answer: 'Yes, 100% TRCSL registered with proof of custom clearance.', askedBy: 'Dilshan M.', answeredBy: 'Apple Genius Lanka', date: '2026-06-01' }
    ]
  },
  {
    id: 'prod-004',
    title: 'Xiaomi Redmi Note 13 - 8GB RAM - 256GB - 108MP Camera - 120Hz AMOLED',
    description: 'Capture iconic moments with the super-clear 108MP triple camera. Featuring an ultra-slim bezel 120Hz FHD+ AMOLED display, 33W fast charging, and Snapdragon processor.',
    price: 64900,
    originalPrice: 79900,
    discount: 18,
    rating: 4.5,
    reviewCount: 33,
    soldCount: 120,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'mobile-phones-accessories',
    subCategory: 'Mobiles',
    brand: 'Xiaomi',
    stock: 18,
    specifications: {
      'Display': '6.67-inch FHD+ 120Hz AMOLED',
      'Camera': '108MP + 8MP + 2MP Triple Camera',
      'RAM': '8GB',
      'Storage': '256GB',
      'Battery': '5000mAh with 33W Fast Charger',
      'Processor': 'Snapdragon 685 (6nm)'
    },
    colors: ['Midnight Black', 'Mint Green', 'Ice Blue'],
    sizes: ['256GB'],
    vendor: {
      id: 'v-xiaomi-lanka',
      name: 'Xiaomi Sri Lanka Store',
      ratingPercent: 94,
      responseTime: 'Within 2 hours',
      isFollowed: false
    },
    reviews: [
      { id: 'r5', userName: 'Thilina K.', rating: 5, comment: 'Budget friendly beast. The AMOLED screen is bright and beautiful. Fast charging works like a charm. Recommended.', date: '2026-06-21', verifiedPurchase: true }
    ],
    qna: []
  },
  {
    id: 'prod-005',
    title: 'L\'Oreal Paris Elvital Total Repair 5 Shampoo - 400ml for Damaged Hair',
    description: 'Enriched with Pro-Keratin and Ceramide, the Total Repair 5 Shampoo fights 5 signs of damage: hair fall, dryness, roughness, dullness, and split ends. Restores strength and shine.',
    price: 1850,
    originalPrice: 2450,
    discount: 24,
    rating: 4.7,
    reviewCount: 112,
    soldCount: 540,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'beauty-personal-care',
    subCategory: 'Hair Care',
    brand: 'L\'Oreal',
    stock: 120,
    specifications: {
      'Volume': '400ml',
      'Hair Type': 'Damaged / Dry Hair',
      'Formulation': 'Liquid Shampoo',
      'Key Ingredients': 'Pro-Keratin & Ceramide-R'
    },
    colors: ['Standard Pack'],
    sizes: ['400ml'],
    vendor: {
      id: 'v-unilever-lanka',
      name: 'Beauty & Co. Sri Lanka',
      ratingPercent: 91,
      responseTime: 'Within 3 hours',
      isFollowed: false
    },
    reviews: [
      { id: 'r6', userName: 'Anusha P.', rating: 5, comment: 'Best shampoo for colored hair. It makes hair soft and manageable. Genuine product.', date: '2026-06-18', verifiedPurchase: true }
    ],
    qna: []
  },
  {
    id: 'prod-006',
    title: 'Harischandra Pure Coconut Oil - 1 Litre Bottle - Pure & Natural Cold Pressed',
    description: 'Harischandra Coconut Oil is manufactured from 100% natural dried copra sourced from the Coconut Triangle of Sri Lanka. Perfect for cooking and cosmetic purposes, with no artificial chemical treatments.',
    price: 1250,
    originalPrice: 1500,
    discount: 16,
    rating: 4.8,
    reviewCount: 164,
    soldCount: 920,
    images: [
      'https://images.unsplash.com/photo-1614261054170-17936a267597?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'groceries-daily-essentials',
    subCategory: 'Cooking Oil',
    brand: 'Unilever',
    stock: 80,
    specifications: {
      'Volume': '1 Litre',
      'Processing Type': 'Expeller Pressed / Natural',
      'Packaging': 'Plastic Bottle',
      'Origin': 'Sri Lanka'
    },
    colors: ['1L Bottle'],
    sizes: ['1 Litre'],
    vendor: {
      id: 'v-grocery-pal',
      name: 'Super Grocers Lanka',
      ratingPercent: 95,
      responseTime: 'Within 2 hours',
      isFollowed: false
    },
    reviews: [
      { id: 'r7', userName: 'Nilanthi K.', rating: 5, comment: 'Very pure coconut oil. Smells rich and authentic. Excellent packing from vendor, no leakages at all.', date: '2026-06-25', verifiedPurchase: true }
    ],
    qna: []
  },
  {
    id: 'prod-007',
    title: 'Premium Ergonomic Office Chair - Adjustable Height - Breathable Mesh Back',
    description: 'Upgrade your home office with this ergonomic chair featuring high-density foam cushion, high tension breathable mesh back, nylon armrests, smooth-rolling multi-surface castors, and adjustable tilt tension.',
    price: 19500,
    originalPrice: 28000,
    discount: 30,
    rating: 4.4,
    reviewCount: 22,
    soldCount: 45,
    images: [
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'home-kitchen',
    subCategory: 'Furniture',
    brand: 'Damro',
    stock: 10,
    specifications: {
      'Backrest': 'Breathable Polyester Mesh',
      'Seat': 'High-density Foam with Fabric Cover',
      'Gas Lift': 'Class 3 Gas Lift (up to 120kg)',
      'Base': 'Heavy-duty Star Base with Castors',
      'Adjustment': 'Height, Tilt Tension, Lock'
    },
    colors: ['Black Mesh', 'Gray Mesh', 'Blue Mesh'],
    sizes: ['Standard Size'],
    vendor: {
      id: 'v-furniture-hq',
      name: 'Lanka Furniture Hub',
      ratingPercent: 88,
      responseTime: 'Within 5 hours',
      isFollowed: false
    },
    reviews: [
      { id: 'r8', userName: 'Ruwan D.', rating: 4, comment: 'Good sturdy chair. Very easy to assemble. Helps with lower back pain during long working hours.', date: '2026-06-05', verifiedPurchase: true }
    ],
    qna: [
      { id: 'q4', question: 'Does this come assembled?', answer: 'It is shipped flat-packed with detailed tools and visual manual. Assembly takes around 15 mins.', askedBy: 'Sahan F.', answeredBy: 'Lanka Furniture Hub', date: '2026-06-07' }
    ]
  },
  {
    id: 'prod-008',
    title: 'Baseus 20000mAh Power Bank - 22.5W Fast Charging - LED Digital Display',
    description: 'A high-capacity portable charger equipped with an intelligent digital display for real-time power level. Supports various fast charging protocols including PD 3.0, QC 3.0, SCP, and FCP.',
    price: 7900,
    originalPrice: 11500,
    discount: 31,
    rating: 4.7,
    reviewCount: 88,
    soldCount: 310,
    images: [
      'https://images.unsplash.com/photo-1609592424085-f6df64eb9847?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'electronics-gadgets',
    subCategory: 'Accessories',
    brand: 'Xiaomi',
    stock: 45,
    specifications: {
      'Capacity': '20000mAh / 74Wh',
      'Max Power': '22.5W',
      'Inputs': 'Micro USB, Type-C',
      'Outputs': '2x USB-A, Type-C (Bi-directional PD)',
      'Display': 'LED Numeric Percent Display'
    },
    colors: ['Matte Black', 'Stellar White'],
    sizes: ['20000mAh'],
    vendor: {
      id: 'v-gadget-pal',
      name: 'Smart Gadgets Sri Lanka',
      ratingPercent: 93,
      responseTime: 'Within 2 hours',
      isFollowed: false
    },
    reviews: [
      { id: 'r9', userName: 'Kishan P.', rating: 5, comment: 'Original Baseus powerbank. Recharges my iPhone twice very quickly. Great price on Daraz.', date: '2026-06-22', verifiedPurchase: true }
    ],
    qna: []
  }
];

export const MOCK_CAROUSEL_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=400',
    title: 'GRAND SALE FESTIVAL',
    subtitle: 'Up to 70% Off on Electronics & Lifestyle'
  },
  {
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200&h=400',
    title: "MEGA FASHION WEEK",
    subtitle: 'Free Shipping + Instant Store Collect Vouchers'
  },
  {
    url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1200&h=400',
    title: 'SUPER ELECTRONICS SHOWCASE',
    subtitle: 'Official Brands with TRCSL Approvals and Extended Warranties'
  }
];

export const CATEGORY_ICONS_GRID = [
  { name: 'Mobiles', icon: 'Smartphone', categoryId: 'mobile-phones-accessories', count: 58 },
  { name: 'Electronics', icon: 'Cpu', categoryId: 'electronics-gadgets', count: 130 },
  { name: 'Pet Supplies', icon: 'Dog', categoryId: 'pet-supplies-accessories', count: 7 },
  { name: 'Home & Kitchen', icon: 'Home', categoryId: 'home-kitchen', count: 1291 },
  { name: 'Beauty', icon: 'Sparkles', categoryId: 'beauty-personal-care', count: 252 },
  { name: 'Fashion', icon: 'Shirt', categoryId: 'clothing-fashion', count: 483 },
  { name: 'Groceries', icon: 'ShoppingBasket', categoryId: 'groceries-daily-essentials', count: 3 },
  { name: 'Sports', icon: 'Activity', categoryId: 'sports-outdoors', count: 91 },
  { name: 'Fragrances', icon: 'Droplet', categoryId: 'perfumes-fragrances', count: 12 },
  { name: 'Health', icon: 'HeartPulse', categoryId: 'health-wellness', count: 42 },
  { name: 'Books', icon: 'BookOpen', categoryId: 'books-media', count: 11 },
  { name: 'Automotive', icon: 'Car', categoryId: 'automotive-motorbike', count: 26 },
  { name: 'Eyewear', icon: 'Glasses', categoryId: 'sunglasses-eyewear', count: 114 },
];

export const PROMO_BANNERS_2COL = [
  {
    title: 'SMARTPHONE CRAZE',
    subtitle: 'LKR 10,000 Off Vouchers',
    image: 'https://images.unsplash.com/photo-1551645121-d1034da75057?auto=format&fit=crop&q=80&w=600&h=300',
    categoryId: 'mobile-phones-accessories'
  },
  {
    title: 'LIFESTYLE & LIVING',
    subtitle: 'Damro & Damro partners. Max 40% Off',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600&h=300',
    categoryId: 'home-kitchen'
  }
];

export const PROMO_BANNERS_3COL = [
  {
    title: 'Cosmetics Outlet',
    tag: 'Up to 50% Off',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400&h=250',
    categoryId: 'beauty-personal-care'
  },
  {
    title: 'Fresh Groceries',
    tag: 'Daily Deals',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400&h=250',
    categoryId: 'groceries-daily-essentials'
  },
  {
    title: 'Men Activewear',
    tag: 'Hot Sellers',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400&h=250',
    categoryId: 'sports-outdoors'
  }
];
