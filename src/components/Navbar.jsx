import { LogIn, ShoppingCart, User, Search, X, ArrowRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu';
import { DropdownMenuSeparator } from './ui/dropdown-menu';
import { ModeToggle } from './mode-toggle';
import { UserData } from "@/context/UserContext";
import { CartData } from '@/context/CartContext';
import axios from 'axios';
import { server } from '@/main';

const Navbar = () => {
  const navigate = useNavigate();

  const { isAuth, logoutUser, user } = UserData();
  const { totalItem, setTotalItem } = CartData();

  // Search Drawer States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const logoutHandler = () => {
    logoutUser(navigate, setTotalItem);
  };

  // Live product search effect with debounce
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const { data } = await axios.get(`${server}/api/product/all?search=${encodeURIComponent(searchQuery)}`);
        // Adjust based on your backend response structure (e.g. data.products or data)
        setSearchResults(data.products || data || []);
      } catch (error) {
        console.log("Error searching products:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <div className="z-50 sticky top-0 bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center">
            {/* Logo with increased height and negative margins */}
            <img 
              src="/logo.png" 
              alt="Khalis Masala Shop" 
              className="h-28 w-auto object-contain -my-6 cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => navigate("/")}
            />
          </div>

          <ul className="flex items-center space-x-2 sm:space-x-4 mt-3 sm:mt-0">
            {/* Search Icon Button */}
            <li>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-200 flex items-center justify-center"
                aria-label="Open Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </li>

            {/* Home Link */}
            <li>
              <button 
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-200"
              >
                Home
              </button>
            </li>

            {/* Products Link */}
            <li>
              <button 
                onClick={() => navigate("/products")}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-200"
              >
                Products
              </button>
            </li>

            {/* Shopping Cart Icon Link */}
            <li>
              <button 
                onClick={() => navigate("/cart")}
                className="relative p-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-200 flex items-center justify-center"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full shadow-md animate-pulse">
                  {totalItem ? totalItem : 0}
                </span>
              </button>
            </li>

            {/* User Account Dropdown */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-200 flex items-center justify-center outline-none">
                    {isAuth ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl p-2 w-48">
                  <DropdownMenuLabel className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase px-2 py-1.5">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-900 my-1" />
                  {!isAuth ? (
                    <DropdownMenuItem 
                      onClick={() => navigate("/login")}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 focus:bg-zinc-100 dark:focus:bg-zinc-900 focus:text-black dark:focus:text-white cursor-pointer"
                    >
                      Login
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem 
                        onClick={() => navigate("/orders")}
                        className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 focus:bg-zinc-100 dark:focus:bg-zinc-900 focus:text-black dark:focus:text-white cursor-pointer"
                      >
                        Your Orders
                      </DropdownMenuItem>
                      {user && user.role === "admin" && (
                        <DropdownMenuItem 
                          onClick={() => navigate("/admin/dashboard")}
                          className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 focus:bg-zinc-100 dark:focus:bg-zinc-900 focus:text-black dark:focus:text-white cursor-pointer"
                        >
                          Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-900 my-1" />
                      <DropdownMenuItem 
                        onClick={logoutHandler}
                        className="rounded-xl px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/50 focus:text-rose-600 cursor-pointer"
                      >
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            {/* Theme Mode Toggle */}
            <li className="flex items-center pl-1">
              <ModeToggle />
            </li>
          </ul>
        </div>
      </div>

      {/* Side Search Overlay & Drawer */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Slide-over Panel */}
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 h-full shadow-2xl z-10 flex flex-col border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Search Products
              </h2>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Box */}
            <div className="p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-900">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Type product name (e.g. Garam Masala)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Results Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {isSearching ? (
                <div className="text-center py-12 text-sm text-zinc-500">Searching products...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => {
                  const prodImg = product.images?.[0]?.url || product.image?.url || product.image || "";
                  const prodPrice = product.price || 0;

                  return (
                    <div
                      key={product._id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/product/${product._id}`);
                      }}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all cursor-pointer group"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-xl bg-white dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                        {prodImg ? (
                          <img 
                            src={prodImg} 
                            alt={product.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        ) : (
                          <span className="text-[10px] text-zinc-400">No Image</span>
                        )}
                      </div>

                      {/* Product Title & Price */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {product.title}
                        </h4>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                          Rs {Number(prodPrice).toFixed(2)}
                        </p>
                      </div>

                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  );
                })
              ) : searchQuery.trim() !== "" ? (
                <div className="text-center py-12 text-sm text-zinc-500 dark:text-zinc-400">
                  No products found matching "{searchQuery}"
                </div>
              ) : (
                <div className="text-center py-12 text-sm text-zinc-400 dark:text-zinc-500">
                  Type a name above to search for products instantly.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;