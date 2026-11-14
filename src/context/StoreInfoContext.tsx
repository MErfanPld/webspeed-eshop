"use client";

import { createContext, useContext, type ReactNode } from "react";

export type StoreInfo = {
  id: string;
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  instagram: string;
  payment: { cardNumber?: string; cardHolder?: string; bank?: string };
  shipping: { flatRate?: number; freeOver?: number };
};

/** Empty until the server layout provides the store from the API */
const FALLBACK: StoreInfo = {
  id: "",
  name: "",
  tagline: "",
  phone: "",
  email: "",
  address: "",
  workingHours: "",
  instagram: "",
  payment: {},
  shipping: {},
};

const Ctx = createContext<StoreInfo>(FALLBACK);

/** Current store's public info (name, contact, payment) for client components */
export function StoreInfoProvider({ value, children }: { value: StoreInfo; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStoreInfo(): StoreInfo {
  return useContext(Ctx);
}
