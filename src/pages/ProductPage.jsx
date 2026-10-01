import { server } from "@/main";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CartData } from "@/context/CartContext";
import { ProductData } from "@/context/ProductContext";
import { UserData } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { X, Edit, Loader, Trash2, Star, Share2, ShieldCheck, Truck, RefreshCw, Plus, Minus, MessageCircle } from "lucide-react";

const ProductPage = () => {
  const { fetchProduct, fetchProducts, products, product, relatedProduct, reviews, reviewStats, loading } = ProductData();
  const { addToCart, fetchCart } = CartData();
  const { id } = useParams();
  const { isAuth, user } = UserData();
  const navigate = useNavigate();

  // Dynamic categories extracted from database products with a safe fallback
  const dynamicCategories = [...new Set(products?.map((p) => p.category).filter(Boolean))];
  const categories = dynamicCategories.length > 0 ? dynamicCategories : ["Electronics", "Clothing", "Books", "Home", "Other"];

  // Quantity states
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct(id);
    if (fetchProducts) {
      fetchProducts();
    }
  }, [id]);

  // Dynamically update Open Graph (OG) Meta tags for proper Facebook & Messenger previews
  useEffect(() => {
    if (!product) return;

    const originalTitle = document.title;
    document.title = product.title || originalTitle;

    const setMetaTag = (property, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (property.startsWith('og:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const productUrl = window.location.href;
    const productImage = product.images?.[0]?.url || "";

    setMetaTag('og:title', product.title);
    setMetaTag('og:description', product.description);
    setMetaTag('og:image', productImage);
    setMetaTag('og:url', productUrl);
    setMetaTag('og:type', 'website');

    return () => {
      document.title = originalTitle;
    };
  }, [product]);

  // Sync user details to review form once user data loads
  useEffect(() => {
    if (user) {
      setReviewName(user.name || "");
      setReviewEmail(user.email || "");
    }
  }, [user]);

  const addToCartHandler = () => {
    addToCart(product, quantity);
  };

  // General Share Handler (uses native mobile share sheet if available, or copies link)
  const handleShare = async () => {
    const shareData = {
      title: product?.title,
      text: product?.description,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      }
    } catch (err) {
      console.log("Error sharing:", err);
    }
  };

  // Facebook Share Dialog handler (Works once hosted on a public domain with OG tags)
  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(fbShareUrl, '_blank', 'width=600,height=500');
  };

  // Facebook Messenger Share handler via official sharer endpoint
  const handleMessengerShare = () => {
    const url = encodeURIComponent(window.location.href);
    const messengerUrl = `https://www.facebook.com/dialog/send?link=${url}&app_id=291494419107518&redirect_uri=${url}`;
    const fallbackUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    
    const popup = window.open(messengerUrl, '_blank', 'width=600,height=500');
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.open(fallbackUrl, '_blank', 'width=600,height=500');
    }
  };

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [updatedImages, setUpdatedImages] = useState(null);

  // Review Modal & Form States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState(user?.name || "");
  const [reviewEmail, setReviewEmail] = useState(user?.email || "");
  const [reviewNickname, setReviewNickname] = useState("");
  const [reviewLocation, setReviewLocation] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [recommend, setRecommend] = useState("Yes");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const updateHandler = () => {
    setShow(!show);
    if (product) {
      setCategory(product.category || "");
      setTitle(product.title || "");
      setDescription(product.description || "");
      setStock(product.stock || "");
      setPrice(product.price || "");
      setDiscount(product.discountPercent || product.discount || "");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        { 
          title, 
          description, 
          price, 
          discountPercent: discount,
          stock, 
          category 
        },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );
      toast.success(data.message);
      fetchProduct(id);
      setShow(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    if (!updatedImages || updatedImages.length === 0) {
      toast.error("Please select new images.");
      setBtnLoading(false);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < updatedImages.length; i++) {
      formData.append("files", updatedImages[i]);
    }

    try {
      const { data } = await axios.post(
        `${server}/api/product/${id}`,
        formData,
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );
      toast.success(data.message);
      fetchProduct(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product images");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setBtnLoading(true);
      try {
        const { data } = await axios.delete(`${server}/api/product/${id}`, {
          headers: {
            token: Cookies.get("token"),
          },
        });
        toast.success(data.message);
        
        await fetchProducts();
        
        try {
          await fetchCart();
        } catch (cartErr) {
          console.log("Cart refresh warning:", cartErr);
        }

        navigate("/"); 
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete product");
      } finally {
        setBtnLoading(false);
      }
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const { data } = await axios.delete(`${server}/api/product/${id}/review/${reviewId}`, {
          headers: {
            token: Cookies.get("token"),
          },
        });
        toast.success(data.message || "Review deleted successfully");
        fetchProduct(id);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete review");
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuth) {
      toast.error("Please login to write a review");
      return;
    }
    if (overallRating === 0) {
      toast.error("Please provide an overall rating");
      return;
    }

    setReviewSubmitting(true);
    try {
      const { data } = await axios.post(
        `${server}/api/product/${id}/review`,
        {
          name: reviewName,
          email: reviewEmail,
          nickname: reviewNickname,
          location: reviewLocation,
          ratings: {
            overall: overallRating,
            quality: qualityRating,
            delivery: deliveryRating,
            service: serviceRating,
          },
          recommend: recommend === "Yes",
          title: reviewTitle,
          comment: reviewComment,
        },
        {
          headers: {
            token: Cookies.get("token"),
          },
        }
      );
      toast.success(data.message || "Review submitted successfully!");
      setShowReviewModal(false);
      fetchProduct(id);
      setReviewTitle("");
      setReviewComment("");
      setOverallRating(0);
      setQualityRating(0);
      setDeliveryRating(0);
      setServiceRating(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const discountPercent = product?.discountPercent || product?.discount || 0;
  const hasDiscount = discountPercent > 0;
  const discountedPrice = hasDiscount 
    ? product.price * (1 - discountPercent / 100) 
    : product?.price;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {user && user.role === "admin" && (
            <div className="w-full max-w-[450px] m-auto mb-5">
              <div className="flex gap-4">
                <Button onClick={updateHandler} className="flex-1 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                  {show ? <X className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                  {show ? "Cancel" : "Edit Product"}
                </Button>
                <Button 
                  onClick={deleteHandler} 
                  variant="destructive" 
                  disabled={btnLoading}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>

              {show && (
                <form onSubmit={submitHandler} className="space-y-4 mt-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="Product Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Product Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md dark:bg-zinc-950 dark:border-zinc-800 dark:text-white"
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((cat) => (
                        <option value={cat} key={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      placeholder="Product Price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Discount Percentage (%)</Label>
                    <Input
                      placeholder="e.g. 20 for 20% off"
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <Input
                      placeholder="Product Stock"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    disabled={btnLoading}
                  >
                    {btnLoading ? <Loader className="animate-spin" /> : "Update Product"}
                  </Button>
                </form>
              )}
            </div>
          )}

          {product && (
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-14 mt-7">
              <div className="w-full lg:max-w-[650px]">
                <Carousel>
                  <CarouselContent>
                    {product?.images?.map((image, index) => (
                      <CarouselItem key={index}>
                        <img src={image.url} alt="image" className="w-full rounded-md object-cover shadow-sm" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                {user && user.role === "admin" && (
                  <form onSubmit={handleSubmitImage} className="flex flex-col gap-4 mt-4">
                    <div>
                      <Label>Upload New Images:</Label>
                      <input
                        type="file"
                        name="files"
                        id="files"
                        multiple
                        accept="image/*"
                        onChange={(e) => setUpdatedImages(e.target.files)}
                        className="block w-full mt-1 text-sm"
                      />
                    </div>
                    <Button type="submit" disabled={btnLoading} className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                      {btnLoading ? <Loader className="animate-spin" /> : "Update Image"}
                    </Button>
                  </form>
                )}
              </div>

              <div className="w-full lg:w-1/2 space-y-5">
                <div className="flex items-center justify-between">
                  {product.category && (
                    <span className="inline-block text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300">
                      {product.category}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {/* Native / General Share Button */}
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                      title="Share Product"
                    >
                      <Share2 size={18} className="text-slate-600 dark:text-slate-400" />
                    </button>

                    {/* Facebook Feed Share Button */}
                    <button
                      onClick={handleFacebookShare}
                      className="p-2 rounded-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                      title="Share to Facebook"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-blue-600 dark:text-blue-400"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </button>

                    {/* Facebook Messenger Share Button */}
                    <button
                      onClick={handleMessengerShare}
                      className="p-2 rounded-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                      title="Share to Facebook Messenger"
                    >
                      <MessageCircle size={18} className="text-sky-500 dark:text-sky-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{product.title}</h1>
                  {hasDiscount && (
                    <span className="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                
                {/* Review Stars Under the Title */}
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.round(reviewStats?.averageRating || 0) ? "fill-amber-400" : "text-gray-300 dark:text-gray-700"} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {reviewStats?.averageRating || 0} ({reviewStats?.totalReviews || 0} {reviewStats?.totalReviews === 1 ? 'Rating' : 'Ratings'})
                  </span>
                </div>

                {/* Price Display with Strikethrough for Old Price */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    ₨ {discountedPrice.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-slate-500 line-through">
                      ₨ {product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Product Description</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {product.description}
                  </p>
                </div>

                {/* Quantity Counter & Controls */}
                {isAuth && product.stock > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity:</span>
                    <div className="flex items-center border border-slate-200 dark:border-zinc-800 rounded-md">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm font-semibold">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {isAuth ? (
                  <>
                    {product.stock <= 0 ? (
                      <p className="text-red-600 text-xl font-semibold">Out of Stock</p>
                    ) : (
                      <Button onClick={addToCartHandler} className="w-full sm:w-auto bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-8 py-3">
                        Add To Cart
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-blue-500 text-sm">Please Login to add something in cart</p>
                )}

                {/* Trust Badges / Perks */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-zinc-950">
                    <Truck size={18} className="text-slate-800 dark:text-slate-200" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-zinc-950">
                    <ShieldCheck size={18} className="text-slate-800 dark:text-slate-200" />
                    <span>Secure Warranty</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-zinc-950">
                    <RefreshCw size={18} className="text-slate-800 dark:text-slate-200" />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Section UI */}
          <div className="mt-16 border-t dark:border-zinc-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">Customer Reviews</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.round(reviewStats?.averageRating || 0) ? "fill-amber-400" : "text-gray-300 dark:text-gray-700"} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">
                    {reviewStats?.averageRating || 0} (Based on {reviewStats?.totalReviews || 0} Ratings)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {reviewStats?.recommendPercentage || 0}% of reviewers would recommend this product
                </p>
              </div>

              <button
                onClick={() => {
                  if (!isAuth) {
                    toast.error("Please login to write a review");
                    return;
                  }
                  setShowReviewModal(true);
                }}
                className="px-6 py-2.5 rounded-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium text-sm transition-colors shadow-sm"
              >
                Write a review
              </button>
            </div>

            <hr className="border-gray-300 dark:border-zinc-800 mb-6" />

            <div className="space-y-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev._id} className="pb-6 border-b border-gray-100 dark:border-zinc-900 last:border-none">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-wrap items-center gap-1 text-sm">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {rev.nickname || rev.name || "Anonymous"}
                          </span>
                          {rev.location && (
                            <span className="text-slate-500">from {rev.location}</span>
                          )}
                        </div>

                        {user && user.role === "admin" && (
                          <button
                            onClick={() => handleReviewDelete(rev._id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>
                          {new Date(rev.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <div className="flex items-center text-amber-500 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < (rev.ratings?.overall || 5)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300 dark:text-gray-700"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          ({Number(rev.ratings?.overall || 5).toFixed(1)})
                        </span>
                      </div>

                      {rev.title && (
                        <h4 className="font-medium text-slate-900 dark:text-white mt-2 text-sm">
                          {rev.title}
                        </h4>
                      )}

                      {rev.comment && (
                        <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 leading-relaxed">
                          {rev.comment}
                        </p>
                      )}

                      {rev.recommend && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                          I would recommend this to a friend!
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No reviews yet. Be the first to write one!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Pop-up */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 border dark:border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Product Reviews</h3>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Your Name</Label>
                    <Input
                      placeholder="Enter your name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Your Email</Label>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Nickname</Label>
                    <Input
                      placeholder="Enter your nickname"
                      value={reviewNickname}
                      onChange={(e) => setReviewNickname(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">This name will be published with this review.</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Location</Label>
                    <Input
                      placeholder="Enter your location"
                      value={reviewLocation}
                      onChange={(e) => setReviewLocation(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Example: Karachi, Lahore, Islamabad.</p>
                  </div>
                </div>

                <div className="border-t dark:border-zinc-800 pt-4 mt-4 space-y-4">
                  <h4 className="text-xs font-bold tracking-wider uppercase text-slate-500">My Rating</h4>

                  {/* Overall Rating */}
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Overall Rating *</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setOverallRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={24}
                            className={
                              star <= overallRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 dark:text-gray-700"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Rating */}
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Quality Rating</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setQualityRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={
                              star <= qualityRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 dark:text-gray-700"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Rating */}
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Delivery Rating</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setDeliveryRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={
                              star <= deliveryRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 dark:text-gray-700"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Rating */}
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Service Rating</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setServiceRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={
                              star <= serviceRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 dark:text-gray-700"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recommend Option */}
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Would you recommend this product?</Label>
                    <select
                      value={recommend}
                      onChange={(e) => setRecommend(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm dark:bg-zinc-950 dark:border-zinc-800 dark:text-white"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Review Title */}
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Review Title</Label>
                    <Input
                      placeholder="Summarize your review or highlight a key feature"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                  </div>

                  {/* Review Comment */}
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Review Comment</Label>
                    <textarea
                      placeholder="Write your detailed review here..."
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-3 border rounded-md text-sm dark:bg-zinc-950 dark:border-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
                <Button type="button" variant="outline" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={reviewSubmitting} className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                  {reviewSubmitting ? <Loader className="animate-spin h-4 w-4" /> : "Submit Review"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;