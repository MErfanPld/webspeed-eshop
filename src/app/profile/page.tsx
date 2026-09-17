import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import type { Order, Address } from "@/types/order";
import { formatPrice, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "حساب کاربری",
  description: "مدیریت سفارش‌ها و آدرس‌ها",
};

const mockOrders: Order[] = [
  {
    id: "WS-1404-0012",
    date: "۱۴۰۴/۰۶/۲۰",
    status: "delivered",
    total: 5180000,
    itemsCount: 2,
  },
  {
    id: "WS-1404-0008",
    date: "۱۴۰۴/۰۵/۱۲",
    status: "shipped",
    total: 2790000,
    itemsCount: 1,
  },
  {
    id: "WS-1404-0003",
    date: "۱۴۰۴/۰۴/۰۱",
    status: "pending",
    total: 1890000,
    itemsCount: 1,
  },
];

const mockAddresses: Address[] = [
  {
    id: "1",
    fullName: "کاربر نمونه",
    phone: "۰۹۱۲۱۲۳۴۵۶۷",
    province: "تهران",
    city: "تهران",
    address: "خیابان ولیعصر، پلاک ۱۲۳، واحد ۴",
    postalCode: "۱۲۳۴۵۶۷۸۹۰",
    isDefault: true,
  },
];

const statusLabels: Record<Order["status"], string> = {
  pending: "در انتظار تأیید",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

export default function ProfilePage() {
  return (
    <Container className="py-8 sm:py-12">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          خانه
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">حساب کاربری</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-10">
        حساب کاربری
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-6">
          <div className="border border-border rounded-sm p-6">
            <h2 className="text-sm font-semibold mb-4">اطلاعات حساب</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">نام</dt>
                <dd className="font-medium">کاربر نمونه</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">ایمیل</dt>
                <dd className="font-medium">user@example.com</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">تلفن</dt>
                <dd className="font-medium" dir="ltr">
                  ۰۹۱۲۱۲۳۴۵۶۷
                </dd>
              </div>
            </dl>
          </div>

          <div className="border border-border rounded-sm p-6">
            <h2 className="text-sm font-semibold mb-4">آدرس‌های ذخیره شده</h2>
            {mockAddresses.map((addr) => (
              <div key={addr.id} className="text-sm space-y-1">
                {addr.isDefault && (
                  <span className="text-xs text-muted-foreground">
                    پیش‌فرض
                  </span>
                )}
                <p className="font-medium">{addr.fullName}</p>
                <p className="text-muted-foreground">
                  {addr.province}، {addr.city}
                </p>
                <p className="text-muted-foreground">{addr.address}</p>
                <p className="text-muted-foreground" dir="ltr">
                  {addr.phone}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">تاریخچه سفارش‌ها</h2>
          <div className="border border-border rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-right">
                  <th className="px-4 py-3 font-medium">شماره</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    تاریخ
                  </th>
                  <th className="px-4 py-3 font-medium">وضعیت</th>
                  <th className="px-4 py-3 font-medium">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">{order.id}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {order.date}
                    </td>
                    <td className="px-4 py-3">
                      {statusLabels[order.status]}
                    </td>
                    <td className="px-4 py-3">
                      {formatPrice(order.total)}
                      <span className="text-xs text-muted-foreground block sm:inline sm:mr-1">
                        ({formatNumber(order.itemsCount)} کالا)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            این صفحه فقط رابط کاربری است. احراز هویت واقعی در فاز بعدی اضافه
            می‌شود.
          </p>
        </div>
      </div>
    </Container>
  );
}
