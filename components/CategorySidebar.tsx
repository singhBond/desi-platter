// // src/components/menu/CategorySidebar.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { db } from "@/lib/firebase";
// import { collection, query, onSnapshot, Timestamp } from "firebase/firestore";

// interface Category {
//   id: string;
//   name: string;
//   imageUrl?: string;
//   createdAt?: Timestamp | null;
//   order?: number;           // ← added support for order field
// }

// interface Props {
//   activeCategory: string;
//   onCategoryChange: (id: string) => void;
// }

// export const CategorySidebar: React.FC<Props> = ({
//   activeCategory,
//   onCategoryChange,
// }) => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const q = query(collection(db, "categories"));

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const fetchedCategories: Category[] = snapshot.docs.map((doc) => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             name: data.name || "Unnamed Category",
//             imageUrl: data.imageUrl || "",
//             createdAt: data.createdAt ?? null,
//             order: typeof data.order === "number" ? data.order : undefined,
//           };
//         });

//         // Sort by order field (ascending) → then by creation date (newest first) as fallback
//         fetchedCategories.sort((a, b) => {
//           const orderA = a.order ?? 999999;
//           const orderB = b.order ?? 999999;

//           if (orderA !== orderB) {
//             return orderA - orderB; // lower order number comes first
//           }

//           // Fallback: newer first when order is same/missing
//           const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
//           const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
//           return timeB - timeA;
//         });

//         setCategories(fetchedCategories);
//         setLoading(false);

//         // Auto-select first category if none selected
//         if (fetchedCategories.length > 0 && !activeCategory) {
//           onCategoryChange(fetchedCategories[0].id);
//         }
//       },
//       (error) => {
//         console.error("Error fetching categories:", error);
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, [activeCategory, onCategoryChange]);

//   // Skeleton for loading state
//   const SkeletonItem = () => (
//     <div className="flex flex-col items-center py-3 mb-2 animate-pulse">
//       <div className="w-14 h-14 bg-gray-300 rounded-lg" />
//       <div className="h-3 bg-gray-300 rounded w-20 mt-2" />
//     </div>
//   );

//   return (
//     <aside className="w-20 sm:w-40 md:w-32 sticky top-22 h-[calc(100vh-8rem)] overflow-y-auto bg-linear-to-r from-pink-300 via-yellow-50 to-pink-300 border-r rounded-xl shadow-sm p-2 scrollbar-thin">
//       <div
//         className="absolute inset-0 opacity- backdrop-blur-md bg-repeat  "
//         style={{
//           backgroundImage: `url("data:image/jpeg;base64,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")`,
//           backgroundColor: "#5c4033",
//         }}
//       >
//         {loading || categories.length === 0 ? (
//           // Show 6 skeleton items while loading or empty
//           Array(6).fill(0).map((_, i) => <SkeletonItem key={i} />)
//         ) : (
//           categories.map((cat) => (
//             <div
//               key={cat.id}
//               onClick={() => onCategoryChange(cat.id)}
//               className={`flex flex-col items-center cursor-pointer rounded-xl px-8 py-2 mb-2 transition-all border ${
//                 activeCategory === cat.id
//                   ? "bg-pink-100 border-pink-500 shadow-lg scale-110"
//                   : "hover:bg-pink-50 border-transparent"
//               }`}
//             >
//               <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-200 shadow-sm">
//                 <img
//                   src={cat.imageUrl || "/placeholder.svg"}
//                   alt={cat.name}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.src = "/placeholder.svg";
//                   }}
//                 />
//               </div>
//               <span className="text-xs sm:text-sm font-semibold text-center mt-1 uppercase tracking-wider text-gray-800">
//                 {cat.name}
//               </span>
//             </div>
//           ))
//         )}
//       </div>
//     </aside>
//   );
// };

// API FETCHED DATA


// src/components/menu/CategorySidebar.tsx
"use client";

import React, { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Props {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export const CategorySidebar: React.FC<Props> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/menu", {
          next: { revalidate: 3600 },
        });

        if (!res.ok) throw new Error("Failed to fetch menu");

        const result = await res.json();

        if (!result?.status || !Array.isArray(result.data)) {
          throw new Error("Invalid API response");
        }

        const categoryMap = new Map<string, Category>();

        result.data.forEach((item: any) => {
          const catId = item.cat_id || item.category_id;
          if (!catId) return;

          const catName = item.cat_name || "Unnamed Category";

          // ✅ Get the FIRST image of the first product in this category
          const imageUrl =
            item.image ||
            item.item_image ||
            (item.imageUrls && item.imageUrls[0]) ||
            "";

          // Only set category if not already added (preserves first product's image)
          if (!categoryMap.has(catId)) {
            categoryMap.set(catId, {
              id: catId,
              name: catName,
              imageUrl: imageUrl.trim() || undefined,
            });
          }
        });

        const fetchedCategories = Array.from(categoryMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCategories(fetchedCategories);

        // Auto select first category
        if (fetchedCategories.length > 0 && !activeCategory) {
          onCategoryChange(fetchedCategories[0].id);
        }
      } catch (err: any) {
        console.error("Category fetch error:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [onCategoryChange]);

  // Skeleton
  const Skeleton = () => (
    <div className="space-y-3">
      {Array(7)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col items-center py-3 animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-2xl" />
            <div className="h-3 w-20 bg-gray-300 rounded mt-2" />
          </div>
        ))}
    </div>
  );

  return (
    <aside className="w-20 sm:w-40 md:w-32 lg:w-36 sticky top-14 h-[calc(100vh-6rem)] overflow-y-auto bg-linear-to-b from-red-100 via-red-200 to-red-100 border-r border-pink-200 rounded-2xl shadow-sm p-1 scrollbar-thin scrollbar-thumb-pink-300">
      <div className="mb-4 text-center">
        <h2 className="text-xs mt-1 font-bold uppercase  text-red-800">
          Catagory
        </h2>
      </div>

      {loading ? (
        <Skeleton />
      ) : error ? (
        <div className="p-6 text-center">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition"
          >
            Retry
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No categories available
        </div>
      ) : (
        <div className="space-y-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`group flex flex-col items-center cursor-pointer rounded-2xl p-2 transition-all duration-200 border ${
                activeCategory === cat.id
                  ? "bg-white border-pink-500 shadow-md scale-105 "
                  : "hover:bg-white/80 border-transparent hover:shadow"
              }`}
            >
              {/* Category Image - First Product Image */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shadow-inner flex items-center justify-center">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-3xl text-gray-300">📦</div>
                )}
              </div>

              {/* Category Name */}
              <span className="text-[12px] sm:text-xs font-semibold text-center mt-1 text-gray-800 leading-tight tracking-wide">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};