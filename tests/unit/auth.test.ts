import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "@/server/auth/token";
import { hashPassword, hashPasswordSync, verifyPassword } from "@/server/auth/password";

const SECRET = "x".repeat(40);

describe("session tokens", () => {
  it("round-trips a valid token", async () => {
    const exp = Math.floor(Date.now() / 1000) + 60;
    const t = await signSession({ sid: "s", uid: "u", exp }, SECRET);
    expect(await verifySession(t, SECRET)).toEqual({ sid: "s", uid: "u", exp });
  });

  it("rejects tampered payloads and wrong secrets", async () => {
    const exp = Math.floor(Date.now() / 1000) + 60;
    const t = await signSession({ sid: "s", uid: "u", exp }, SECRET);
    const [body, sig] = t.split(".");
    const forged = Buffer.from(JSON.stringify({ sid: "s", uid: "admin", exp })).toString("base64url");
    expect(await verifySession(`${forged}.${sig}`, SECRET)).toBeNull();
    expect(await verifySession(`${body}.${sig}`, "y".repeat(40))).toBeNull();
    expect(await verifySession("garbage", SECRET)).toBeNull();
    expect(await verifySession(undefined, SECRET)).toBeNull();
  });

  it("rejects expired tokens", async () => {
    const t = await signSession({ sid: "s", uid: "u", exp: 1000 }, SECRET);
    expect(await verifySession(t, SECRET, 1001)).toBeNull();
  });
});

describe("password hashing", () => {
  it("verifies correct passwords only", async () => {
    const h = await hashPassword("secret-pass");
    expect(h.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("secret-pass", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
    expect(await verifyPassword("secret-pass", hashPasswordSync("secret-pass"))).toBe(true);
    expect(await verifyPassword("x", "not-a-hash")).toBe(false);
  });
});
