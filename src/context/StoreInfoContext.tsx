"use client";

import { createContext, useContext, type ReactNode } from "react";
import { storeInfo } from "@/data/store";

export type StoreInfo = {
  id: string;
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  payment: { cardNumber?: string; cardHolder?: string; bank?: string };
  shipping: { flatRate?: number; freeOver?: number };
};

const FALLBACK: StoreInfo = {
  id: "",
  name: storeInfo.name,
  tagline: storeInfo.tagline,
  phone: storeInfo.phone,
  email: storeInfo.email,
  address: storeInfo.address,
  payment: storeInfo.payment,
  shipping: { flatRate: 0, freeOver: 2_500_000 },
};

const Ctx = createContext<StoreInfo>(FALLBACK);

/** Current store's public info (name, contact, payment) for client components */
export function StoreInfoProvider({ value, children }: { value: StoreInfo; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStoreInfo(): StoreInfo {
  return useContext(Ctx);
}
