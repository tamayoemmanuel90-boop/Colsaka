"use client";

import { useEffect, useState } from "react";
import {
  FALLBACK_PRODUCTS,
  fetchProducts,
  type ProductDTO,
} from "@/lib/products-client";

export function useProducts() {
  const [products, setProducts] = useState<ProductDTO[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchProducts().then((p) => {
      if (alive) {
        setProducts(p);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return { products, loading };
}
