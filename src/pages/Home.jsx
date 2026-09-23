import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { ProductData } from '@/context/ProductContext';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '@/main';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="w-full overflow-x-hidden">
      <Hero navigate={navigate} />

      {/* Full-Width Floating Categories Bar */}
      <div className="relative z-20 w-full px-2 sm:px-6 -mt-16 sm:-mt-20 mb-8">
        <div className="relative flex items-center w-full">
          {/* Left Arrow Button (Desktop only) */}
          <button 
            onClick={scrollLeft}
            className="absolute left-2 sm:left-4 z-30 bg-white/90 hover:bg-white text-gray-800 shadow-md border border-gray-200 rounded-full p-2.5 hidden sm:flex items-center justify-center transition-all opacity-90 hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Categories Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex items-center justify-start md:justify-center gap-5 sm:gap-8 overflow-x-auto py-4 px-4 sm:px-16 w-full scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                    {/* Responsive Circular Image size */}
                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl transition-transform duration-300 group-hover/item:scale-105 flex items-center justify-center flex-shrink-0">
                      {catImg ? (
                        <img
                          src={catImg}
                          alt={catName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 text-center px-1">
                          No Image
                        </span>
                      )}
                    </div>
                    {/* Category Name Label */}
                    <span className="mt-2 text-xs sm:text-sm md:text-base font-semibold text-gray-800 capitalize text-center max-w-[90px] sm:max-w-[110px] truncate">
                      {catName}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-500 text-center w-full">No categories found.</p>
            )}
          </div>

          {/* Right Arrow Button (Desktop only) */}
          <button 
            onClick={scrollRight}
            className="absolute right-2 sm:right-4 z-30 bg-white/90 hover:bg-white text-gray-800 shadow-md border border-gray-200 rounded-full p-2.5 hidden sm:flex items-center justify-center transition-all opacity-90 hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="top products mt-4 p-4">
        <div className="inline-flex items-center gap-1.5">
          <h1 className="text-xl font-serif font-bold tracking-tight text-slate-900 dark:text-white pl-3 mt-3">
            Latest Products
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-7">
          {newProd && newProd.length > 0 ? (
            newProd.map((e) => {
              return <ProductCard key={e._id} product={e} latest={"yes"} />;
            })
          ) : (
            <p>No Products Yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;