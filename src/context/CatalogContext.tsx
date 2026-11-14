"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Category, Product } from "@/types/product";
import { products as seedProducts } from "@/data/products";
import { categories as seedCategories } from "@/data/categories";

export type Catalog = {
  products: Product[];
  categories: Category[];
};

const DEFAULT_CATALOG: Catalog = {
  products: seedProducts,
  categories: seedCategories,
};

const CatalogContext = createContext<Catalog>(DEFAULT_CATALOG);

/**
 * Provides the product catalog to client blocks (product sliders, grids…).
 * The server layout passes the store's catalog; without a provider the
 * bundled seed data is used (tests, isolated previews).
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
