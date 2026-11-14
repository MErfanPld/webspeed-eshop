"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Category, Product } from "@/types/product";

export type Catalog = {
  products: Product[];
  categories: Category[];
};

/** Empty until a provider passes the store's catalog from the API */
const DEFAULT_CATALOG: Catalog = { products: [], categories: [] };

const CatalogContext = createContext<Catalog>(DEFAULT_CATALOG);

/**
 * Provides the product catalog to client blocks (product sliders, grids…).
 * The server layouts pass the store's catalog loaded from the Django API.
 */
export function CatalogProvider({
  value,
  children,
}: {
  value: Catalog;
  children: ReactNode;
}) {
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): Catalog {
  return useContext(CatalogContext);
}
