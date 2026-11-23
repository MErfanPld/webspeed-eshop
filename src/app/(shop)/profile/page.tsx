import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/ui/Container";
import ProfileForm from "@/components/account/ProfileForm";
import AddressBook from "@/components/account/AddressBook";
import { ApiError } from "@/lib/api/client";
import { serverApi } from "@/lib/api/server";
import type { Address, Order, OrderStatus } from "@/types/api";
import { formatNumber, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "حساب کاربری",
  description: "مدیریت سفارش‌ها و اطلاعات حساب",
};

export const dynamic = "force-dynamic";

const statusLabels: Record<OrderStatus, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

type Me = { customer: { phone: string; name: string; email: string }; orders: Order[] };

export default async function ProfilePage() {
  let me: Me;
  try {
    me = await serverApi<Me>("/customer/me", { cookies: ["ws_customer"] });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login");
    throw e;
  }
  const { customer, orders } = me;
  const { addresses } = await serverApi<{ addresses: Address[] }>("/customer/addresses", { cookies: ["ws_customer"] }).catch(
    () => ({ addresses: [] as Address[] })
  );
  const lastAddress = orders.find((o) => o.customer?.address)?.customer;

  return (
    <Container className="py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          خانه
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">حساب کاربری</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-10">حساب کاربری</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-6">
          <div className="border border-border/70 rounded-3xl bg-surface shadow-[0_1px_2px_rgba(30,27,46,0.04)] p-6">
            <h2 className="text-sm font-semibold mb-4">اطلاعات حساب</h2>
            <ProfileForm customer={customer} />
          </div>

          <div className="border border-border/70 rounded-3xl bg-surface shadow-[0_1px_2px_rgba(30,27,46,0.04)] p-6">
            <h2 className="text-sm font-semibold mb-4">آدرس‌های من</h2>
            <AddressBook
              initial={addresses}
              suggestion={lastAddress ? { ...lastAddress, title: "آخرین آدرس" } : undefined}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">تاریخچه سفارش‌ها</h2>
          {orders.length === 0 ? (
            <div className="border border-dashed border-border rounded-3xl p-8 text-center text-sm text-muted-foreground">
              هنوز سفارشی ثبت نکرده‌اید.{" "}
              <Link href="/products" className="underline underline-offset-4">
                مشاهده محصولات
              </Link>
            </div>
          ) : (
            <div className="border border-border/70 rounded-3xl bg-surface shadow-[0_1px_2px_rgba(30,27,46,0.04)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-right">
                    <th className="px-4 py-3 font-medium">شماره</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">تاریخ</th>
                    <th className="px-4 py-3 font-medium">وضعیت</th>
                    <th className="px-4 py-3 font-medium">مبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/track?number=${encodeURIComponent(order.number)}`} className="hover:underline" dir="ltr">
                          {order.number}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(order.createdAt))}
                      </td>
                      <td className="px-4 py-3">{statusLabels[order.status]}</td>
                      <td className="px-4 py-3">
                        {formatPrice(order.total)}
                        <span className="text-xs text-muted-foreground block sm:inline sm:mr-1">
                          ({formatNumber(order.items.reduce((n, i) => n + i.quantity, 0))} کالا)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
