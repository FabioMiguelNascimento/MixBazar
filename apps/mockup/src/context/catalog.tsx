"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  productSlug,
  seedProducts,
  type AdminProduct,
} from "@/components/admin/product-model";

type ProductPatch = {
  id: string;
  patch: { priceValue: number; active: boolean };
};

type CatalogContextValue = {
  products: AdminProduct[];
  /** Aceita lista pronta ou atualizador imutável. */
  setProducts: (
    update: AdminProduct[] | ((prev: AdminProduct[]) => AdminProduct[]),
  ) => void;
  /** Conciliação da integração: cria novos e patch de existentes. */
  applyProdutos: (
    incoming: Omit<AdminProduct, "id">[],
    updates?: ProductPatch[],
  ) => { created: number; updated: number };
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProductsState] = useState<AdminProduct[]>(seedProducts);

  const setProducts = useCallback(
    (
      update: AdminProduct[] | ((prev: AdminProduct[]) => AdminProduct[]),
    ) => {
      setProductsState((prev) =>
        typeof update === "function" ? update(prev) : update,
      );
    },
    [],
  );

  const applyProdutos = useCallback(
    (incoming: Omit<AdminProduct, "id">[], updates: ProductPatch[] = []) => {
      let created = 0;
      let updated = 0;

      setProductsState((prev) => {
        const next = [...prev];

        for (const candidate of incoming) {
          const index = next.findIndex(
            (product) => product.name === candidate.name,
          );

          if (index === -1) {
            next.push({
              ...candidate,
              id: productSlug(
                candidate.name,
                new Set(next.map((product) => product.id)),
              ),
            });
            created += 1;
          } else {
            next[index] = {
              ...next[index],
              priceValue: candidate.priceValue,
              oldPriceValue: candidate.oldPriceValue,
              badge: candidate.badge,
              active: candidate.active,
            };
            updated += 1;
          }
        }

        /* Preço da planilha vira o preço final — promo antiga cai fora. */
        for (const { id, patch } of updates) {
          const index = next.findIndex((product) => product.id === id);

          if (index === -1) continue;

          next[index] = {
            ...next[index],
            priceValue: patch.priceValue,
            oldPriceValue: null,
            badge: null,
            active: patch.active,
          };
          updated += 1;
        }

        return next;
      });

      return { created, updated };
    },
    [],
  );

  const value = useMemo<CatalogContextValue>(
    () => ({ products, setProducts, applyProdutos }),
    [products, setProducts, applyProdutos],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (context === null) {
    throw new Error("useCatalog deve ser usado dentro de CatalogProvider");
  }

  return context;
}
