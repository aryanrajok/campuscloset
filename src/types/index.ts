// ============================================
// CampusCloset Type Definitions
// ============================================

export type UserRole = 'buyer' | 'seller' | 'admin';

export type ProductCategory =
  | 'suit'
  | 'pant'
  | 'formal-shoes'
  | 'tie'
  | 'white-shirt'
  | 'blazer'
  | 'combo';

export type ProductCondition = 'new' | 'like-new' | 'good' | 'used';

export type ListingStatus = 'active' | 'sold' | 'draft' | 'removed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  university?: string;
  universityEmail?: string;
  isVerifiedStudent?: boolean;
  phone?: string;
  upiId?: string;
  rating?: number;
  totalRatings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  seller?: User;
  title: string;
  category: ProductCategory;
  brand?: string;
  size: string;
  color: string;
  condition: ProductCondition;
  originalPrice: number;
  sellingPrice: number;
  negotiable: boolean;
  images: string[];
  university: string;
  pickupLocation: string;
  description: string;
  status: ListingStatus;
  views?: number;
  wishlistCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  productId: string;
  message: string;
  type: 'text' | 'offer' | 'system';
  offerAmount?: number;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  buyer?: User;
  seller?: User;
  product?: Product;
  lastMessage?: ChatMessage;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'offer' | 'sold' | 'price-drop' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  productId?: string;
  userId?: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface FilterState {
  category?: ProductCategory;
  size?: string;
  color?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: ProductCondition;
  university?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'best-condition';
  search?: string;
}

export const CATEGORIES: { value: ProductCategory; label: string; icon: string }[] = [
  { value: 'suit', label: 'Court/Suit', icon: '🤵' },
  { value: 'pant', label: 'Formal Pant', icon: '👖' },
  { value: 'formal-shoes', label: 'Formal Shoes', icon: '👞' },
  { value: 'tie', label: 'Tie', icon: '👔' },
  { value: 'white-shirt', label: 'White Shirt', icon: '👕' },
  { value: 'blazer', label: 'Blazer', icon: '🧥' },
  { value: 'combo', label: 'Formal Combo', icon: '📦' },
];

export const CONDITIONS: { value: ProductCondition; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: '#10B981' },
  { value: 'like-new', label: 'Like New', color: '#3B82F6' },
  { value: 'good', label: 'Good', color: '#F59E0B' },
  { value: 'used', label: 'Used', color: '#EF4444' },
];

export const SIZES = {
  'suit': ['36', '38', '40', '42', '44', '46', '48'],
  'pant': ['28', '30', '32', '34', '36', '38', '40'],
  'formal-shoes': ['6', '7', '8', '9', '10', '11', '12'],
  'tie': ['Standard', 'Slim', 'Extra Long'],
  'white-shirt': ['S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44'],
  'blazer': ['36', '38', '40', '42', '44', '46', '48'],
  'combo': ['S', 'M', 'L', 'XL', 'XXL'],
};

export const COLORS = [
  'Black', 'Navy Blue', 'Charcoal Grey', 'Dark Grey', 'Light Grey',
  'White', 'Cream', 'Beige', 'Brown', 'Maroon', 'Burgundy',
  'Royal Blue', 'Teal', 'Olive', 'Pinstripe',
];

export const UNIVERSITIES = [
  'IIT Delhi', 'IIT Bombay', 'IIT Kanpur', 'IIT Madras', 'IIT Kharagpur',
  'BITS Pilani', 'NIT Trichy', 'NIT Warangal', 'NIT Surathkal',
  'Delhi University', 'Mumbai University', 'Anna University',
  'VIT Vellore', 'SRM Chennai', 'Manipal University',
  'IIIT Hyderabad', 'DTU Delhi', 'NSUT Delhi', 'IGDTUW Delhi',
  'Lovely Professional University', 'Chandigarh University',
  'Amity University', 'Chitkara University', 'Thapar Institute',
  'PEC Chandigarh', 'Panjab University',
  'Other',
];
