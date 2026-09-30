import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import { UserData } from "@/context/UserContext";
import axios from 'axios';
import { server } from '@/main';

const Footer = () => {
  const navigate = useNavigate();
  const { isAuth } = UserData();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${server}/api/category/all`);
        setCategories(data.categories || data || []);
      } catch (error) {
        console.log("Error fetching categories for footer:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="w-full mt-16 bg-slate-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-gray-800 text-slate-600 dark:text-gray-400">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 items-start">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left md:col-span-1">
            <h1 className="text-xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
              Khalis Masala Shop
            </h1>
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 leading-relaxed">
              Your one-stop shop for everything you need, delivered pure and fresh.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-slate-900 dark:text-white">
              Quick Links
            </p>
            <div className="flex flex-col items-center md:items-start gap-2.5 text-sm">
              <button 
                onClick={() => navigate("/")} 
                className="hover:opacity-75 transition-opacity cursor-pointer text-center md:text-left"
              >
                Home
              </button>
              <button 
                onClick={() => navigate("/products")} 
                className="hover:opacity-75 transition-opacity cursor-pointer text-center md:text-left"
              >
                Products
              </button>
              {isAuth && (
                <>
                  <button 
                    onClick={() => navigate("/cart")} 
                    className="hover:opacity-75 transition-opacity cursor-pointer text-center md:text-left"
                  >
                    Cart
                  </button>
                  <button 
                    onClick={() => navigate("/orders")} 
                    className="hover:opacity-75 transition-opacity cursor-pointer text-center md:text-left"
                  >
                    Orders
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Categories Links */}
          {categories.length > 0 && (
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-slate-900 dark:text-white">
                Categories
              </p>
              <div className="flex flex-col items-center md:items-start gap-2.5 text-sm max-h-56 overflow-y-auto px-2 w-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-800">
                {categories.map((cat, index) => {
                  const catName = typeof cat === "string" ? cat : cat.name;
                  return (
                    <button
                      key={index}
                      onClick={() => navigate(`/products?category=${encodeURIComponent(catName)}`)}
                      className="hover:opacity-75 transition-opacity cursor-pointer capitalize text-center md:text-left truncate max-w-full"
                    >
                      {catName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Connect / Social & Email / WhatsApp */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-slate-900 dark:text-white">
              Connect With Us
            </p>
            
            {/* Plain Text Email */}
            <div className="inline-flex items-center gap-2 text-xs mb-4 text-slate-700 dark:text-gray-300">
              <FaEnvelope size={14} />
              <span>Khalismasalashop@gmail.com</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-end gap-3 mb-6">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-800 hover:opacity-75 transition-opacity flex items-center justify-center text-slate-700 dark:text-gray-300" aria-label="Facebook">
                <FaFacebookF size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-800 hover:opacity-75 transition-opacity flex items-center justify-center text-slate-700 dark:text-gray-300" aria-label="Twitter">
                <FaTwitter size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-800 hover:opacity-75 transition-opacity flex items-center justify-center text-slate-700 dark:text-gray-300" aria-label="Instagram">
                <FaInstagram size={15} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-800 hover:opacity-75 transition-opacity flex items-center justify-center text-slate-700 dark:text-gray-300" aria-label="YouTube">
                <FaYoutube size={15} />
              </a>
            </div>

            {/* WhatsApp Button */}
            <a 
              href="https://wa.me/923062300042?text=Hello,%20I%20want%20to%20order%20from%20Khalis%20Masala%20Shop." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors shadow-sm"
              aria-label="WhatsApp Order"
            >
              <FaWhatsapp size={16} />
              <span>Order via WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-900 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>© {new Date().getFullYear()} Khalis Masala Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer