// 'use client';

// import Image from 'next/image';
// import { useState, useEffect } from 'react';

// interface MenuItem {
//   id: string;
//   item_name: string;
//   item_desc: string;
//   sell_price: string;
//   mrp: string;
//   item_image: string;
//   cat_name: string;
//   best_seller: string;
//   unit_name: string | null;
//   in_stock: string;
// }

// interface CartItem extends MenuItem {
//   quantity: number;
// }

// export default function DigitalMenuPage() {
//   const [items, setItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch menu items
//   useEffect(() => {
//     fetch('/api/menu')
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.status === false) {
//           setError(data.message || 'Failed to load menu');
//         } else {
//           setItems(data.data || []);
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError('Failed to connect. Please try again.');
//         setLoading(false);
//       });
//   }, []);

//   // Group items by category
//   const groupedItems = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
//     const cat = item.cat_name || 'Other';
//     if (!acc[cat]) acc[cat] = [];
//     acc[cat].push(item);
//     return acc;
//   }, {});

//   const categories = Object.keys(groupedItems);

//   // Add item to cart
//   const addToCart = (item: MenuItem) => {
//     setCart((prev) => {
//       const existing = prev.findIndex((i) => i.id === item.id);
//       if (existing !== -1) {
//         return prev.map((i, idx) =>
//           idx === existing ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       }
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   // Update quantity
//   const updateQuantity = (id: string, newQty: number) => {
//     if (newQty < 1) return;
//     setCart((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
//     );
//   };

//   // Remove from cart
//   const removeFromCart = (id: string) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   // Calculate total
//   const totalAmount = cart.reduce((sum, item) => {
//     return sum + parseFloat(item.sell_price || '0') * item.quantity;
//   }, 0);

//   // Place order via WhatsApp
//   const placeOrderOnWhatsApp = () => {
//     if (cart.length === 0) return;

//     let message = `*New Order from Digital Menu*\n\n`;

//     cart.forEach((item) => {
//       const price = parseFloat(item.sell_price || '0');
//       message += `• ${item.item_name} × ${item.quantity} = ₹${(price * item.quantity).toFixed(0)}\n`;
//     });

//     message += `\n*Total: ₹${totalAmount.toFixed(0)}*\n\n`;
//     message += `Please confirm my order!`;

//     // CHANGE THIS TO YOUR ACTUAL WHATSAPP NUMBER (with country code, no + or spaces)
//     const whatsappNumber = '918210936795'; // ←←← UPDATE THIS

//     const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, '_blank');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//         <p className="text-white text-2xl">Loading delicious menu...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-400">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white pb-32">
//       {/* Header */}
//       <header className="bg-black sticky top-0 z-50 border-b border-zinc-800">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
//           <h1 className="text-4xl font-bold tracking-tight">Our Menu</h1>
//           <div
//             onClick={() => document.getElementById('cart-sidebar')?.classList.toggle('translate-x-full')}
//             className="cursor-pointer flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 px-6 py-3 rounded-2xl border border-zinc-700 transition-colors"
//           >
//             🛒 <span>Cart ({cart.length})</span>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-10">
//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search menu items..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500 rounded-2xl px-6 py-4 text-lg placeholder-zinc-500 mb-12"
//         />

//         {/* Menu Categories */}
//         {categories.map((category) => {
//           const categoryItems = groupedItems[category].filter((item) =>
//             item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
//           );

//           if (categoryItems.length === 0) return null;

//           return (
//             <section key={category} className="mb-20">
//               <h2 className="text-3xl font-semibold mb-8 flex items-center gap-4">
//                 {category}
//                 <span className="text-zinc-500 text-lg">({categoryItems.length})</span>
//               </h2>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {categoryItems.map((item) => {
//                   const price = parseFloat(item.sell_price || '0').toFixed(0);
//                   const isInStock = item.in_stock === '1';
//                   const imageUrl = item.item_image ? item.item_image.replace(/\\/g, '') : '';

//                   return (
//                     <div
//                       key={item.id}
//                       className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-orange-600 transition-all group"
//                     >
//                       <div className="relative h-56 bg-zinc-800">
//                         <img
//                           src={imageUrl || '/placeholder-food.jpg'}
//                           alt={item.item_name}
//                         //   fill
//                           className="object-cover group-hover:scale-105 transition-transform duration-300"
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
//                           }}
//                         />

//                         {item.best_seller === '1' && (
//                           <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
//                             BEST SELLER
//                           </div>
//                         )}

//                         {!isInStock && (
//                           <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
//                             <span className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium">
//                               OUT OF STOCK
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-6">
//                         <div className="flex justify-between items-start gap-4">
//                           <h3 className="font-semibold text-xl leading-tight">{item.item_name}</h3>
//                           <div className="text-right shrink-0">
//                             <div className="text-3xl font-bold text-orange-500">₹{price}</div>
//                             {item.unit_name && (
//                               <div className="text-xs text-zinc-500 mt-1">per {item.unit_name}</div>
//                             )}
//                           </div>
//                         </div>

//                         {item.item_desc && (
//                           <p className="text-zinc-400 text-sm mt-3 line-clamp-2">{item.item_desc}</p>
//                         )}

//                         <button
//                           onClick={() => addToCart(item)}
//                           disabled={!isInStock}
//                           className="mt-6 w-full bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 disabled:cursor-not-allowed py-4 rounded-2xl font-medium transition-colors"
//                         >
//                           {isInStock ? 'Add to Cart' : 'Out of Stock'}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section>
//           );
//         })}
//       </div>

//       {/* Cart Sidebar */}
//       <div
//         id="cart-sidebar"
//         className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-700 translate-x-full transition-transform duration-300 z-[60] overflow-y-auto"
//       >
//         <div className="p-6 border-b border-zinc-700 sticky top-0 bg-zinc-900 flex justify-between items-center">
//           <h2 className="text-2xl font-bold">Your Cart ({cart.length})</h2>
//           <button
//             onClick={() => document.getElementById('cart-sidebar')?.classList.add('translate-x-full')}
//             className="text-3xl text-zinc-400 hover:text-white"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {cart.length === 0 ? (
//             <p className="text-center py-16 text-zinc-400">Your cart is empty</p>
//           ) : (
//             cart.map((item) => {
//               const itemTotal = parseFloat(item.sell_price || '0') * item.quantity;
//               return (
//                 <div key={item.id} className="flex gap-4 bg-zinc-800 p-4 rounded-2xl">
//                   <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0">
//                     <img
//                       src={item.item_image.replace(/\\/g, '') || '/placeholder-food.jpg'}
//                       alt={item.item_name}
//                     //   fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h4 className="font-medium leading-tight">{item.item_name}</h4>
//                     <p className="text-orange-500 text-sm">₹{parseFloat(item.sell_price || '0')} × {item.quantity}</p>
//                     <p className="font-semibold">₹{itemTotal.toFixed(0)}</p>

//                     <div className="flex items-center gap-3 mt-4">
//                       <button
//                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                         className="w-8 h-8 bg-zinc-700 hover:bg-zinc-600 rounded-lg flex items-center justify-center"
//                       >
//                         −
//                       </button>
//                       <span className="font-medium w-6 text-center">{item.quantity}</span>
//                       <button
//                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                         className="w-8 h-8 bg-zinc-700 hover:bg-zinc-600 rounded-lg flex items-center justify-center"
//                       >
//                         +
//                       </button>
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         className="ml-auto text-red-500 text-sm hover:text-red-400"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {cart.length > 0 && (
//           <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-700 p-6">
//             <div className="flex justify-between items-center text-xl font-bold mb-6">
//               <span>Total</span>
//               <span>₹{totalAmount.toFixed(0)}</span>
//             </div>

//             <button
//               onClick={placeOrderOnWhatsApp}
//               className="w-full bg-green-600 hover:bg-green-700 py-5 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3 transition-colors"
//             >
//               📱 Place Order on WhatsApp
//             </button>
//             <p className="text-center text-xs text-zinc-500 mt-4">
//               You will be redirected to WhatsApp
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// WHITE THEME MENU

// app/menu/page.tsx
import Image from 'next/image';
import { Suspense } from 'react';

interface MenuItem {
  id: string;
  item_name: string;
  item_desc: string;
  sell_price: string;
  mrp: string;
  item_image: string;
  cat_name: string;
  best_seller: string;
  unit_name?: string;
  in_stock: string;
}

interface ApiResponse {
  status: boolean;
  count: number;
  data: MenuItem[];
}

async function getMenuData(): Promise<MenuItem[]> {
  const res = await fetch(
    'https://shibim.com/billing/shibim-billing/get-items.php?client_id=1',
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  if (!res.ok) {
    throw new Error('Failed to fetch menu items');
  }

  const json: ApiResponse = await res.json();
  return json.data;
}

export default async function DigitalMenu() {
  const items = await getMenuData();

  // Group items by category
  const groupedItems = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.cat_name || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedItems);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Digital Menu</h1>
            <p className="text-gray-500">Browse our delicious offerings</p>
          </div>
          <div className="text-sm text-gray-500">
            {items.length} items • {categories.length} categories
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Category Sidebar */}
        <aside className="w-64 hidden lg:block">
          <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Categories</h2>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
                >
                  {cat}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Menu Content */}
        <main className="flex-1">
          <div className="mb-8">
            <input
              type="text"
              id="search"
              placeholder="Search menu items..."
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
              onKeyUp={(e) => {
                const term = (e.target as HTMLInputElement).value.toLowerCase();
                document.querySelectorAll('.menu-item').forEach((el) => {
                  const name = el.getAttribute('data-name') || '';
                  (el as HTMLElement).style.display = name.includes(term) ? 'block' : 'none';
                });
              }}
            />
          </div>

          {categories.map((category) => (
            <section
              key={category}
              id={category.toLowerCase().replace(/\s+/g, '-')}
              className="mb-16 scroll-mt-24"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                {category}
                <span className="text-sm font-normal text-gray-400">
                  ({groupedItems[category].length})
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedItems[category].map((item) => {
                  const price = parseFloat(item.sell_price || '0').toFixed(2);
                  const isBestSeller = item.best_seller === '1';
                  const imageUrl = item.item_image
                    ? item.item_image.replace(/\\/g, '')
                    : '/placeholder-food.jpg';

                  return (
                    <div
                      key={item.id}
                      data-name={item.item_name.toLowerCase()}
                      className="menu-item bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative h-56 bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={item.item_name}
                          // fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
                          }}
                        />
                        {isBestSeller && (
                          <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            BEST SELLER
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-xl leading-tight">
                            {item.item_name}
                          </h3>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-orange-600">
                              ₹{price}
                            </span>
                            {item.unit_name && (
                              <p className="text-xs text-gray-400">{item.unit_name}</p>
                            )}
                          </div>
                        </div>

                        {item.item_desc && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {item.item_desc}
                          </p>
                        )}

                        <button
                          onClick={() => alert(`Added ${item.item_name} to cart!`)}
                          className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </main>
      </div>

      {/* Simple Footer */}
      <footer className="bg-white border-t py-8 text-center text-gray-500 text-sm">
        Digital Menu • Powered by Next.js • Data from Shibim Billing
      </footer>
    </div>
  );
}