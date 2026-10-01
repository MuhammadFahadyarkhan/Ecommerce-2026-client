import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { ProductData } from '@/context/ProductContext';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '@/main';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { loading, products, newProd } = ProductData();
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  const fetchCategoriesWithImages = async () => {
    try {
      const { data } = await axios.get(`${server}/api/category/all`);
      setCategories(data.categories || data || []);
    } catch (error) {
      console.log("Error fetching categories for carousel:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesWithImages();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full overflow-x-hidden bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 min-h-screen">
      <Hero navigate={navigate} />

      {/* Full-Width Floating Categories Bar */}
      <div className="relative z-20 w-full px-4 sm:px-6 -mt-16 sm:-mt-20 mb-12">
        <div className="relative flex items-center w-full max-w-7xl mx-auto">
          {/* Left Arrow Button (Desktop only) */}
          <button 
            onClick={scrollLeft}
            className="absolute -left-3 sm:-left-4 z-30 bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-lg border border-zinc-200 dark:border-zinc-700 rounded-full p-2.5 hidden sm:flex items-center justify-center transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Categories Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex items-center justify-start md:justify-center gap-6 sm:gap-8 overflow-x-auto py-4 px-2 sm:px-12 w-full scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories && categories.length > 0 ? (
              categories.map((cat, index) => {
                const catName = typeof cat === "string" ? cat : cat.name;
                const catImg = typeof cat === "object" ? cat.image?.url : null;

                return (
                  <div
                    key={index}
                    onClick={() => navigate(`/products?category=${encodeURIComponent(catName)}`)}
                    className="flex flex-col items-center flex-shrink-0 cursor-pointer group/item"
                  >
                    {/* Circular Image Container */}
                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-2 border-white/80 dark:border-zinc-700/60 overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-md transition-all duration-300 group-hover/item:scale-105 group-hover/item:shadow-xl flex items-center justify-center flex-shrink-0">
                      {catImg ? (
                        <img
                          src={catImg}
                          alt={catName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                        />
                      ) : (
                        <span className="text-xs text-zinc-400 text-center px-1 font-medium">
                          No Image
                        </span>
                      )}
                    </div>
                    {/* Category Name Label */}
                    <span className="mt-2.5 text-xs sm:text-sm md:text-base font-semibold text-zinc-800 dark:text-zinc-200 capitalize text-center max-w-[90px] sm:max-w-[110px] truncate transition-colors group-hover/item:text-black dark:group-hover/item:text-white">
                      {catName}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center w-full">No categories found.</p>
            )}
          </div>

          {/* Right Arrow Button (Desktop only) */}
          <button 
            onClick={scrollRight}
            className="absolute -right-3 sm:-right-4 z-30 bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-lg border border-zinc-200 dark:border-zinc-700 rounded-full p-2.5 hidden sm:flex items-center justify-center transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Latest Products Section */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Fresh Stock</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Latest Products
            </h2>
          </div>
          <button 
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors group"
          >
            View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {newProd && newProd.length > 0 ? (
            newProd.slice(0, 8).map((e) => {
              return <ProductCard key={e._id} product={e} latest={"yes"} />;
            })
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400 col-span-full text-center py-10">No Products Yet</p>
          )}
        </div>
      </div>

      {/* Value Proposition / Trust Features Banner */}
      <div className="container mx-auto px-4 sm:px-6 my-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-700 shadow-sm text-amber-600 dark:text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white text-base">100% Pure & Authentic</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-300 mt-1 leading-relaxed">
                Sourced directly and ground fresh to retain maximum natural aroma and flavor.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-700 shadow-sm text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white text-base">Secure Checkout</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-300 mt-1 leading-relaxed">
                Safe payment options and easy ordering for complete peace of mind.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-700 shadow-sm text-amber-600 dark:text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white text-base">Fast Doorstep Delivery</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-300 mt-1 leading-relaxed">
                Quick dispatch and careful packaging so your items arrive safely at your door.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* All Products / Store Catalog Section */}
      <div className="container mx-auto px-4 sm:px-6 py-6 mb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Explore Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Featured Spices & Goods
            </h2>
          </div>
          <button 
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors group"
          >
            Browse All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products && products.length > 0 ? (
            products.slice(0, 8).map((e) => {
              return <ProductCard key={e._id} product={e} />;
            })
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400 col-span-full text-center py-10">No Products Available</p>
          )}
        </div>
      </div>

      {/* Promotional CTA Banner */}
      <div className="container mx-auto px-4 sm:px-6 mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-800 text-white p-8 sm:p-12 shadow-xl border border-zinc-800 dark:border-zinc-700">
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
              Pure Quality Guaranteed
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold mt-4 tracking-tight">
              Bring Traditional Taste to Your Kitchen Today
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base mt-3 leading-relaxed">
              Explore our wide range of pure, hand-picked spices and household essentials delivered straight to your doorstep.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button 
                onClick={() => navigate("/products")}
                className="px-6 py-3 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 font-medium text-sm transition-all shadow-md cursor-pointer"
              >
                Shop Collection
              </button>
              <a 
                href="https://wa.me/923062300042?text=Hello,%20I%20want%20to%20order%20from%20Khalis%20Masala%20Shop." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                Order via WhatsApp
              </a>
            </div>
          </div>
          {/* Background decorative element */}
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;