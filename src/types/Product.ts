// export interface Product {
//   id: string;
//   name: string;
//   description?: string | null;

//   quantities: Array<{
//     quantity: string;
//     cakePrice: number;
//     birthdayPackPrice?: number | null;
//   }> | null;

//   imageUrls?: string[] | null;
//   imageUrl?: string | null; // legacy

//   isVeg: boolean;

//   createdAt?: any;
//   updatedAt?: any;

//   // legacy fields to be removed over time
//   price?: number;
//   halfPrice?: number | null;
//   quantity?: string;
// }

// API FETHCED DATA


export interface Product {
  id: string;
  name: string;
  description?: string;

  // ✅ Required for filtering
  categoryId: string;

  // ✅ Pricing (primary UI field)
  price: number;

  // ✅ Stock status (fixes your error)
  inStock: boolean;

  // ✅ New pricing system (preferred)
  quantities: Array<{
    quantity: string;
    cakePrice: number;
    birthdayPackPrice?: number | null;
  }>;

  // ✅ Images
  imageUrls?: string[];
  imageUrl?: string | null; // fallback

  // ✅ Type
  isVeg: boolean;

  // ✅ Metadata
  createdAt?: any;
  updatedAt?: any;

  // 🟡 Legacy (keep temporarily, remove later)
  halfPrice?: number | null;
  quantity?: string;
}