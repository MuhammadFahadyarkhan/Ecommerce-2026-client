import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
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
                    <div className='w-full max-w-[300px] mx-auto shadow-md rounded-lg overflow-hidden border border-gray-100 bg-white dark:bg-slate-900 p-4 relative'>
                        
                        {/* Discount Badge */}
                        {discountPercent > 0 && (
                            <span className="absolute top-6 left-6 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                                -{discountPercent}%
                            </span>
                        )}

                        <Link to={`/product/${product._id}`}>
                            <div className='relative h-[260px] bg-gray-100 dark:bg-slate-950 flex justify-center items-center overflow-hidden rounded-lg'>
                                <img
                                    src={product.images[0].url}
                                    alt="Product"
                                    className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-125"
                                />
                            </div>
                        </Link>

                        <div className="pt-4 px-1">
                            {/* Modern Bold Title */}
                            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
                                {product.title.slice(0, 30)}
                            </h3>

                            {/* Clean Description */}
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                                {product.description.slice(0, 30)}
                            </p>

                            {/* Star Ratings */}
                            <div className="flex items-center gap-1.5 mt-2">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={14} 
                                            className={i < Math.round(averageRating) ? "fill-amber-400" : "text-gray-300 dark:text-gray-600"} 
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                    ({totalReviews})
                                </span>
                            </div>

                            {/* Price and Button Side-by-Side Layout */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex flex-col">
                                    {discountPercent > 0 ? (
                                        <div className="flex items-center gap-2">
                                            {/* Reduced Price */}
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                ₨ {discountedPrice}
                                            </span>
                                            {/* Crossed-out Old Price */}
                                            <span className="text-xs text-gray-400 line-through">
                                                ₨ {originalPrice}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                                            ₨ {originalPrice}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {/* Circular Add to Cart Button */}
                                    <Button 
                                        onClick={() => addToCart({ ...product, price: discountedPrice })}
                                        className="w-9 h-9 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors shadow-sm p-0"
                                        aria-label="Add to Cart"
                                    >
                                        <ShoppingCart size={16} />
                                    </Button>

                                    {/* View Product Button */}
                                    <Button onClick={() => navigate(`/product/${product._id}`)}>
                                        View Product
                                    </Button>
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