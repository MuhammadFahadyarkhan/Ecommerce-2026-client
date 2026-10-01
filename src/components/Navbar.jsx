import { LogIn, ShoppingCart, User } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu';
import { DropdownMenuSeparator } from './ui/dropdown-menu';
import { ModeToggle } from './mode-toggle';
import { UserData } from "@/context/UserContext";
import { CartData } from '@/context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();

  const { isAuth, logoutUser, user } = UserData();
  const { totalItem, setTotalItem } = CartData(); // 👈 Fixed: Added setTotalItem here

  const logoutHandler = () => {
    logoutUser(navigate, setTotalItem);
  };

  return (
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
  );
};

export default Navbar;