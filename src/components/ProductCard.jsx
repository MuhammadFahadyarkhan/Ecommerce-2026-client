import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

const ProductCard = ({ product }) => {
    const navigate = useNavigate()
    return (
        <div>
            {
                product && (
                    <div className='w-full max-w-[300px] mx-auto shadow-md rounded-lg overflow-hidden border border-gray-100 bg-white dark:bg-slate-900 p-4'>
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

                            {/* Price and Button Side-by-Side Layout with Reduced Price Font */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                    ₨ {product.price}
                                </div>
                                <Button onClick={() => navigate(`/product/${product._id}`)}>
                                    View Product
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ProductCard