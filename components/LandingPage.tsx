"use client";

import React, { useState , useEffect } from "react";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductItem } from "@/components/ProductItem";
import { Cart } from "@/components/Cart";
import { PageViewsCounter } from "@/components/PageViewsCounter";
import { VegFilter } from "@/components/VegFilter";
import  ProductItemFetcher from "@/components/ProductItemFetcher";
import { Header } from "./Header";
import { Footer } from "./Footer";
import BakeryLoader from "./BakeryLoader";
import { Flame, FlameKindling, Hamburger, PartyPopper, Pizza, Sparkles, UtensilsCrossed } from "lucide-react";

// Skeleton loader
const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-gray-200">
    <div className="h-56 bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
      <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
    </div>
  </div>
);

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "veg" | "nonveg">("all");

  // Show bakery loader only on initial page load (no category selected yet)
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Simulate initial load - remove delay if you have real data loading logic
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // If still in initial loading state → show bakery loader
  if (isInitialLoading && !activeCategory) {
    return <BakeryLoader />;
  }
  return (
    <section className="min-h-screen bg-gradlinearient-to-b from-orange-100 to-yellow-100">

      {/* Header */}
      {/* <div className="text-center py-6 bg-linear-to-r from-orange-800 via-yellow-600 to-yellow-800 text-white"> */}
       
        <Header/>
      {/* </div> */}

      {/* Veg Filter */}
      <VegFilter filter={filter} setFilter={setFilter} />

      {/* Layout */}
      <div className="bg-orange-50 max-w-7xl mx-auto px-3 py-2 flex gap-2">

        {/* ICONS FOR BG */}
        <div className="absolute right-32 bottom-1 animate-float opacity-30">
      <Flame className="w-14 h-14 text-orange-500 drop-shadow-[0_0_15px_#ef4444]" />
    </div>
    <div className="absolute -bottom-20 left-28 animate-float-slow opacity-30">
      <Hamburger className="w-12 h-12 text-red-800" />
    
    </div>
    <div className="absolute -bottom-44 right-24 animate-float opacity-30">
      <Pizza className="w-14 h-14 text-red-500 rotate-12 drop-shadow-[0_0_12px_#ef4444]" />
    </div>
    <div className="absolute -bottom-14 right-22 animate-float-slow opacity-30">
      <UtensilsCrossed className="w-11 h-11 text-red-600 -rotate-12" />
    </div>

    {/* Extra fiery elements */}
    <div className="absolute -bottom-54 left-38 opacity-30 animate-pulse">
      <FlameKindling className="w-10 h-10 text-orange-500" />
    </div>
    <div className="absolute -bottom-32 right-8 opacity-30">
      <Sparkles className="w-8 h-8 text-red-400" />
    </div>
    <div className="absolute bottom-56 right-1 opacity-25 animate-float">
      <PartyPopper className="w-9 h-9 text-red-500" />
    </div>
        {/* Sidebar */}
        <CategorySidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Products Grid */}
        <div className="flex-1">
          {/* <h2 className="text-3xl font-bold text-gray-800">
            {activeCategory ? "" : "Loading..."}
          </h2> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 ">
            {activeCategory ? (
              <ProductItemFetcher categoryId={activeCategory} filter={filter} />
            ) : (
              Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
            )}
          </div>
        </div>
      </div>

      {/* Cart */}
      <Cart />

      {/* Page Views */}
      <PageViewsCounter />
      <Footer/>
    </section>
  );
}


// API FETHCED DATA

