export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  images?: string[];
}

export interface QnA {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  answeredBy?: string;
  date: string;
}

export interface Vendor {
  id: string;
  name: string;
  ratingPercent: number;
  responseTime: string;
  isFollowed?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // In LKR
  originalPrice: number;
  discount: number; // e.g., 25 representing 25%
  rating: number;
  reviewCount: number;
  soldCount: number;
  images: string[];
  category: string;
  subCategory: string;
  brand: string;
  brandLogo?: string;
  stock: number;
  specifications: Record<string, string>;
  colors: string[];
  sizes: string[];
  vendor: Vendor;
  reviews: Review[];
  qna: QnA[];
}

export interface Voucher {
  id: string;
  code: string;
  discountAmount: number; // LKR off
  minSpend: number;
  isCollected: boolean;
  expiryDate: string;
}

export interface CartItem {
  id: string; // Combine prodId + color + size for unique cart key
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Lucide icon name or a visual label
  color?: string;
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'system' | 'vendor' | 'ai';
  senderName?: string;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  vendorId: string;
  vendorName: string;
  messages: Message[];
}
