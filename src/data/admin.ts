export type AdminOrder = {
  id: string;
  customer: string;
  phone: string;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
};

export type AdminCustomer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  orders: number;
  totalSpent: number;
  joined: string;
};

export const adminStats = {
  revenue: {
    week: 48_500_000,
    month: 186_200_000,
    year: 1_420_000_000,
  },
  orders: {
    week: 42,
    month: 168,
    year: 1240,
  },
  customers: {
    week: 18,
    month: 64,
    year: 520,
  },
  avgOrder: 1_850_000,
};

export const revenueByDay = [
  { label: "ش", value: 5200000 },
  { label: "ی", value: 7800000 },
  { label: "د", value: 6100000 },
  { label: "س", value: 9200000 },
  { label: "چ", value: 7100000 },
  { label: "پ", value: 10500000 },
  { label: "ج", value: 8900000 },
];

export const revenueByMonth = [
  { label: "فروردین", value: 98000000 },
  { label: "اردیبهشت", value: 112000000 },
  { label: "خرداد", value: 105000000 },
  { label: "تیر", value: 128000000 },
  { label: "مرداد", value: 141000000 },
  { label: "شهریور", value: 186000000 },
];

export const mockOrders: AdminOrder[] = [
  {
    id: "WS-100245",
    customer: "علی محمدی",
    phone: "09121234567",
    total: 3780000,
    status: "pending",
    date: "1404/06/28",
    items: 2,
  },
  {
    id: "WS-100244",
    customer: "سارا احمدی",
    phone: "09139876543",
    total: 2450000,
    status: "confirmed",
    date: "1404/06/27",
    items: 1,
  },
  {
    id: "WS-100243",
    customer: "رضا کریمی",
    phone: "09351234567",
    total: 5890000,
    status: "shipped",
    date: "1404/06/26",
    items: 3,
  },
  {
    id: "WS-100242",
    customer: "مریم حسینی",
    phone: "09125551234",
    total: 1890000,
    status: "delivered",
    date: "1404/06/25",
    items: 1,
  },
  {
    id: "WS-100241",
    customer: "حسین رضایی",
    phone: "09211234567",
    total: 6580000,
    status: "delivered",
    date: "1404/06/24",
    items: 2,
  },
  {
    id: "WS-100240",
    customer: "نرگس موسوی",
    phone: "09197778899",
    total: 890000,
    status: "cancelled",
    date: "1404/06/23",
    items: 1,
  },
];

export const mockCustomers: AdminCustomer[] = [
  {
    id: "C-01",
    name: "علی محمدی",
    phone: "09121234567",
    email: "ali@example.com",
    orders: 5,
    totalSpent: 12400000,
    joined: "1404/02/12",
  },
  {
    id: "C-02",
    name: "سارا احمدی",
    phone: "09139876543",
    email: "sara@example.com",
    orders: 3,
    totalSpent: 7200000,
    joined: "1404/03/01",
  },
  {
    id: "C-03",
    name: "رضا کریمی",
    phone: "09351234567",
    email: "reza@example.com",
    orders: 8,
    totalSpent: 28900000,
    joined: "1403/11/20",
  },
  {
    id: "C-04",
    name: "مریم حسینی",
    phone: "09125551234",
    email: "maryam@example.com",
    orders: 2,
    totalSpent: 4100000,
    joined: "1404/05/08",
  },
  {
    id: "C-05",
    name: "حسین رضایی",
    phone: "09211234567",
    email: "hossein@example.com",
    orders: 4,
    totalSpent: 9800000,
    joined: "1404/01/15",
  },
];

export const statusLabel: Record<AdminOrder["status"], string> = {
  pending: "در انتظار تأیید",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};
