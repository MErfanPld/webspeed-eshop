/** Response shapes of the Django API (camelCase, see API README). */
import type { Category, Product } from "./product";

export type ProductStatus = "active" | "draft" | "archived";
export type ProductRecord = Product & { status: ProductStatus; createdAt: string; updatedAt: string };

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderCustomer = {
  fullName: string;
  phone: string;
  email?: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  number: string;
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  hasReceipt: boolean;
  discount?: number;
  couponCode?: string | null;
  paymentMethod?: "card" | "online";
  paid?: boolean;
  paidAt?: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StoreSettings = {
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  instagram?: string;
  currency?: string;
  payment?: { cardNumber?: string; cardHolder?: string; bank?: string };
  shipping?: { flatRate?: number; freeOver?: number };
  theme?: Record<string, unknown>;
};

export type Store = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  settings: StoreSettings;
  createdAt: string;
};

export type Role = "owner" | "admin" | "editor";

export type PublicStore = {
  id: string;
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  workingHours?: string;
  instagram?: string;
  payment: { cardNumber?: string; cardHolder?: string; bank?: string };
  shipping: { flatRate?: number; freeOver?: number };
  theme?: Record<string, unknown>;
};

export type MediaItem = { id: string; name: string; mime: string; size: number; url: string; createdAt: string };

export type CustomerRow = {
  phone: string;
  name: string;
  email: string | null;
  orders: number;
  totalSpent: number;
  firstOrder: string;
  lastOrder: string | null;
};

export type DashboardStats = {
  days: number;
  orders: number;
  revenue: number;
  avgOrder: number;
  customers: number;
  pending: number;
  byDay: { day: string; revenue: number; orders: number }[];
  lowStock: { id: string; name: string; stock: number }[];
  recent: Order[];
  products: number;
  pages: number;
  publishedPages: number;
};


export type { Category, Product };

export type Brand = { id: number; slug: string; name: string; logo: string; products?: number };

export type CouponKind = "percent" | "fixed";
export type Coupon = {
  id: number;
  code: string;
  kind: CouponKind;
  value: number;
  maxDiscount: number | null;
  minOrder: number;
  usageLimit: number | null;
  perCustomerLimit: number | null;
  usedCount: number;
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
  createdAt: string;
};

export type ReviewStatus = "pending" | "approved" | "rejected";
export type AdminReview = {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
  productId: string;
  productName: string;
};

export type Address = {
  id: number;
  title: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
};

export type AuditEntry = {
  id: number;
  action: string;
  target: string;
  meta: Record<string, unknown>;
  user: string | null;
  createdAt: string;
};

export type Pagination = { page: number; pageSize: number; total: number; pages: number };

export type SavedBlockItem = {
  id: number;
  kind: "block" | "template";
  name: string;
  description: string;
  blocks: unknown[];
  createdAt: string;
};

export type PlanInfo = {
  slug: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  maxProducts: number | null;
  maxMembers: number | null;
  customDomain: boolean;
  highlighted: boolean;
};

export type SubscriptionInfo = {
  plan: PlanInfo;
  status: "trial" | "active" | "suspended";
  active: boolean;
  trialEndsAt: string | null;
  paidUntil: string | null;
  endsAt: string | null;
  daysLeft: number | null;
};

export type PlatformStoreRow = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  createdAt: string;
  orders: number;
  products: number;
  subscription: SubscriptionInfo | null;
  url: string | null;
  adminUrl: string | null;
};
