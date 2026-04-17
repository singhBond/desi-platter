// // components/menu/ProductGrid.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { db } from "@/lib/firebase";
// import { collection, query, onSnapshot } from "firebase/firestore";
// import { ProductItem } from "@/components/ProductItem";

// interface QuantityOption {
//   quantity: string;
//   cakePrice: number;
//   birthdayPackPrice?: number | null;
// }

// interface Product {
//   id: string;
//   name: string;
//   description?: string;
//   imageUrl?: string;
//   imageUrls?: string[];
//   quantities: QuantityOption[];
//   isVeg: boolean;
//   // Legacy fields (optional)
//   price?: number;
//   halfPrice?: number;
// }

// export const ProductGrid = ({
//   categoryId,
//   filter,
//   onProductClick,
// }: {
//   categoryId: string;
//   filter: "all" | "veg" | "nonveg";
//   onProductClick: (p: Product) => void;
// }) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!categoryId) return;
//     setLoading(true);

//     const q = query(collection(db, "categories", categoryId, "products"));
//     const unsub = onSnapshot(q, (snap) => {
//       const data = snap.docs.map((d) => {
//         const item = d.data();
//         const imageUrls = item.imageUrls || (item.imageUrl ? [item.imageUrl] : []);

//         // === HANDLE QUANTITIES (Supporting both new and old formats) ===
//         let quantities: QuantityOption[] = [];
//         if (item.quantities && Array.isArray(item.quantities) && item.quantities.length > 0) {
//           quantities = item.quantities;
//         } else {
//           // Fallback to old format
//           quantities = [
//             {
//               quantity: item.quantity || "Standard",
//               cakePrice: item.price || 0,
//               birthdayPackPrice: item.halfPrice,
//             },
//           ];
//         }

//         return {
//           id: d.id,
//           name: item.name || "Unnamed",
//           description: item.description,
//           imageUrl: item.imageUrl,
//           imageUrls: imageUrls.filter(Boolean),
//           isVeg: item.isVeg ?? true,
//           quantities: quantities,
//         } as Product;
//       });

//       setProducts(data);
//       setLoading(false);
//     });

//     return () => unsub();
//   }, [categoryId]);

//   const filtered = products.filter((p) => {
//     if (filter === "veg") return p.isVeg;
//     if (filter === "nonveg") return !p.isVeg;
//     return true;
//   });

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {Array(12)
//           .fill(0)
//           .map((_, i) => (
//             <div
//               key={i}
//               className="bg-gray-200 border-2 border-dashed rounded-2xl h-80 animate-pulse"
//             />
//           ))}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
//       {filtered.map((p) => (
//         <ProductItem
//           key={p.id}
//           product={p}
//           onClick={() => onProductClick(p)}
//         />
//       ))}
//     </div>
//   );
// };


// API FETCHED DATA

"use client";

import React, { useEffect, useMemo } from "react";
import { ProductItem } from "@/components/ProductItem";

interface QuantityOption {
  quantity: string;
  cakePrice: number;
  birthdayPackPrice?: number | null;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  inStock: boolean;
  quantities: QuantityOption[];
  imageUrl?: string;
  imageUrls: string[];
  isVeg: boolean;
}

interface ProductGridProps {
  products: Product[];           // ← Accept products as prop (for fetcher compatibility)
  categoryId: string;
  filter: "all" | "veg" | "nonveg";
  onProductClick: (product: Product) => void;
}

export const ProductGrid = ({
  products,
  categoryId,
  filter,
  onProductClick,
}: ProductGridProps) => {
  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (categoryId && String(p.categoryId) !== String(categoryId)) {
        return false;
      }

      // Veg / Non-veg filter
      if (filter === "veg") return p.isVeg;
      if (filter === "nonveg") return !p.isVeg;

      return true;
    });
  }, [products, categoryId, filter]);

  // Scroll to top on category change
  useEffect(() => {
    if (categoryId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [categoryId]);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm mt-1">Try changing category or filter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product, index) => (
        <ProductItem
          key={`${product.id}-${index}`}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
};