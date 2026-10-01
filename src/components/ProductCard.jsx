import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Eye, Star } from 'lucide-react'
import { CartData } from '@/context/CartContext'
import { Button } from '@/components/ui/button'

const ProductCard = ({ product }) => {
    const navigate = useNavigate()
    const { addToCart } = CartData()

    // Safely read rating metrics
    const averageRating = product.ratings?.average || 0;
    const totalReviews = product.ratings?.total || 0;

    // Discount calculations
    const discountPercent = product.discountPercent || 0;
    const originalPrice = product.price;
    
    // Calculate final reduced price if discount is active
    const discountedPrice = discountPercent > 0 
        ? Math.round(originalPrice - (originalPrice * discountPercent) / 100) 
        : originalPrice;

    return (
        <div>
            {
                product && (
                    /* 💡 Added flex flex-col h-full so all cards stretch evenly */
                    <div className='w-full h-full flex flex-col shadow-md dark:shadow-[0_4px_20px_rgba(255,255,255,0.08)] rounded-lg overflow-hidden p-2.5 sm:p-4 relative'>
                        
                        {/* Discount Badge */}
                        {discountPercent > 0 && (
                            <span className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow">
                                -{discountPercent}%
                            </span>
                        )}

                        {/* Image Container with Hover Overlay */}
                        <div className='relative h-[160px] sm:h-[260px] flex justify-center items-center overflow-hidden rounded-lg group shrink-0'>
                            <Link to={`/product/${product._id}`} className="w-full h-full flex justify-center items-center">
                                <img
                                    src={product.images[0].url}
                                    alt="Product"
                                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </Link>

                            {/* Hover Overlay on Right Side */}
                            <div className="absolute inset-y-0 right-0 w-12 sm:w-16 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 sm:gap-3 z-10 p-1 sm:p-2">
                                <Button 
                                    onClick={() => addToCart({ ...product, price: discountedPrice })}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-gray-900 hover:bg-gray-100 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 shadow-md flex items-center justify-center transition-transform hover:scale-105 p-0 border dark:border-zinc-700"
                                    aria-label="Add to Cart"
                                >
                                    <ShoppingCart size={16} />
                                </Button>

                                <Button 
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-gray-900 hover:bg-gray-100 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 shadow-md flex items-center justify-center transition-transform hover:scale-105 p-0 border dark:border-zinc-700"
                                    aria-label="View Product"
                                >
                                    <Eye size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* 💡 flex-1 flex flex-col justify-between pushes footer/price to the exact same bottom baseline */}
                        <div className="pt-3 sm:pt-4 px-1 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Modern Bold Title */}
                            <h3 className="text-xs sm:text-base font-bold tracking-tight truncate">
                                {product.title.slice(0, 30)}
                            </h3>

                            {/* Clean Description */}
                            <p className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 truncate opacity-70">
                                {product.description.slice(0, 30)}
                            </p>

                            {/* Star Ratings */}
                            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={12} 
                                            className={i < Math.round(averageRating) ? "fill-amber-400 sm:w-[14px] sm:h-[14px]" : "opacity-30 sm:w-[14px] sm:h-[14px]"} 
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] sm:text-xs font-medium opacity-80">
                                    ({totalReviews})
                                </span>
                            </div>
                          </div>

                            {/* Price Section */}
                            <div className="flex items-center justify-between mt-3 sm:mt-4">
                                <div className="flex flex-col">
                                    {discountPercent > 0 ? (
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                                            {/* Reduced Price */}
                                            <span className="text-xs sm:text-sm font-bold">
                                                ₨ {discountedPrice}
                                            </span>
                                            {/* Crossed-out Old Price */}
                                            <span className="text-[10px] sm:text-xs opacity-50 line-through">
                                                ₨ {originalPrice}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-xs sm:text-sm font-bold">
                                            ₨ {originalPrice}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ProductCard