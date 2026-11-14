import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ws-orders-"));
process.env.DATA_DIR = dir;

const { getDb } = await import("@/server/db");
const { storeService } = await import("@/server/services/stores");
const { catalogService } = await import("@/server/services/catalog");
const { orderService, toEnglishDigits } = await import("@/server/services/orders");
const { sniffImage } = await import("@/server/services/media");

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64"
);
const receipt = () => new File([PNG], "r.png", { type: "image/png" });
const customer = {
  fullName: "خریدار",
  phone: "۰۹۱۲۱۲۳۴۵۶۷",
  province: "تهران",
  city: "تهران",
  address: "آدرس",
  postalCode: "1234567890",
};

let storeId = "";
let productId = "";

beforeAll(() => {
  getDb();
  storeId = storeService.list()[0].id;
  storeService.update(storeId, { settings: { shipping: { flatRate: 50_000, freeOver: 1_000_000 } } });
  const p = catalogService.saveProduct(storeId, {
    name: "محصول تست",
    slug: "test-product",
    price: 200_000,
    stock: 3,
    status: "active",
    sizes: ["M"],
    colors: [{ name: "مشکی", hex: "#000000" }],
  });
  productId = p.id;
});

afterAll(() => {
  getDb().close();
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("order service", () => {
  it("computes prices and shipping on the server and reserves stock", async () => {
    const o = await orderService.create(storeId, {
      customer,
      items: [{ productId, size: "M", color: "مشکی", quantity: 2, price: 1 }],
      receipt: receipt(),
    });
    expect(o.subtotal).toBe(400_000);
    expect(o.shipping).toBe(50_000);
    expect(o.total).toBe(450_000);
    expect(o.customer.phone).toBe("09121234567");
    expect(catalogService.getProduct(storeId, productId)!.stock).toBe(1);
  });

  it("rejects orders beyond stock without changing anything", async () => {
    await expect(
      orderService.create(storeId, { customer, items: [{ productId, size: "M", color: "مشکی", quantity: 5 }], receipt: receipt() })
    ).rejects.toThrow(/موجودی/);
    expect(catalogService.getProduct(storeId, productId)!.stock).toBe(1);
  });

  it("validates variants, customer data and receipt type", async () => {
    await expect(
      orderService.create(storeId, { customer, items: [{ productId, size: "XXL", color: "مشکی", quantity: 1 }], receipt: receipt() })
    ).rejects.toThrow(/سایز/);
    await expect(
      orderService.create(storeId, { customer: { ...customer, phone: "123" }, items: [{ productId, size: "M", color: "مشکی", quantity: 1 }], receipt: receipt() })
    ).rejects.toThrow();
    await expect(
      orderService.create(storeId, {
        customer,
        items: [{ productId, size: "M", color: "مشکی", quantity: 1 }],
        receipt: new File(["<svg/>"], "x.png", { type: "image/png" }),
      })
    ).rejects.toThrow(/رسید/);
  });

  it("cancelling restores stock; re-opening reserves it again", () => {
    const [o] = orderService.list(storeId);
    orderService.updateStatus(storeId, o.id, "cancelled");
    expect(catalogService.getProduct(storeId, productId)!.stock).toBe(3);
    orderService.updateStatus(storeId, o.id, "confirmed");
    expect(catalogService.getProduct(storeId, productId)!.stock).toBe(1);
  });

  it("tracking requires the matching phone", () => {
    const [o] = orderService.list(storeId);
    expect(orderService.track(storeId, o.number, "09120000000")).toBeNull();
    expect(orderService.track(storeId, o.number, "09121234567")?.id).toBe(o.id);
  });

  it("reports stats excluding cancelled orders", () => {
    const s = orderService.stats(storeId);
    expect(s.orders).toBe(1);
    expect(s.revenue).toBe(450_000);
  });
});

describe("helpers", () => {
  it("converts Persian digits", () => {
    expect(toEnglishDigits("۰۹۱۲")).toBe("0912");
  });

  it("detects image types by magic bytes only", () => {
    expect(sniffImage(new Uint8Array(PNG))?.mime).toBe("image/png");
    expect(sniffImage(new TextEncoder().encode("<svg onload=alert(1)>"))).toBeNull();
    expect(sniffImage(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))?.mime).toBe("image/jpeg");
  });
});
