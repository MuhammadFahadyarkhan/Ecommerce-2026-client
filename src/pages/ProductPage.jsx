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
import { X, Edit, Loader, Trash2, Star } from "lucide-react";

const ProductPage = () => {
  const { fetchProduct, fetchProducts, product, relatedProduct, reviews, reviewStats, loading } = ProductData();
  const { addToCart, fetchCart } = CartData();
  const { id } = useParams();
  const { isAuth, user } = UserData();
  const navigate = useNavigate();

  const categories = ["Electronics", "Clothing", "Books", "Home", "Other"];

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product);
  };

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
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
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        { title, description, price, stock, category },
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

  const StarRatingSelector = ({ rating, setRating }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={`cursor-pointer transition-colors ${
              star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {user && user.role === "admin" && (
            <div className="w-full max-w-[450px] m-auto mb-5">
              <div className="flex gap-4">
                <Button onClick={updateHandler} className="flex-1">
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
                      className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
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
                    className="w-full"
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
                    {product.images &&
                      product.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <img src={image.url} alt="image" className="w-full rounded-md object-cover" />
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
                    <Button type="submit" disabled={btnLoading}>
                      {btnLoading ? <Loader className="animate-spin" /> : "Update Image"}
                    </Button>
                  </form>
                )}
              </div>

              <div className="w-full lg:w-1/2 space-y-5">
                {product.category && (
                  <span className="inline-block text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {product.category}
                  </span>
                )}

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{product.title}</h1>
                
                {/* Added Review Stars Under the Title */}
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.round(reviewStats?.averageRating || 0) ? "fill-amber-400" : "text-gray-300 dark:text-gray-600"} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {reviewStats?.averageRating || 0} ({reviewStats?.totalReviews || 0} {reviewStats?.totalReviews === 1 ? 'Rating' : 'Ratings'})
                  </span>
                </div>

                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">₨ {product.price}</p>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Product Description</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {product.description}
                  </p>
                </div>

                {isAuth ? (
                  <>
                    {product.stock <= 0 ? (
                      <p className="text-red-600 text-xl font-semibold">Out of Stock</p>
                    ) : (
                      <Button onClick={addToCartHandler}>Add To Cart</Button>
                    )}
                  </>
                ) : (
                  <p className="text-blue-500 text-sm">Please Login to add something in cart</p>
                )}
              </div>
            </div>
          )}

          {/* Dynamic Reviews Section UI */}
          <div className="mt-16 border-t pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">Customer Reviews</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.round(reviewStats?.averageRating || 0) ? "fill-amber-400" : "text-gray-300 dark:text-gray-600"} 
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
                className="px-6 py-2.5 rounded-full bg-[#4A5D4E] hover:bg-[#3B4C3F] text-white font-medium text-sm transition-colors shadow-sm"
              >
                Write a review
              </button>
            </div>

            <hr className="border-gray-300 mb-6" />

            {/* Render List of Dynamic Reviews formatted as requested */}
            <div className="space-y-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev._id} className="pb-6 border-b border-gray-100 dark:border-slate-800 last:border-none">
                    <div className="flex flex-col">
                      {/* Header Row with Name/Location & Admin Delete Button */}
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

                      {/* Date & Rating Stars */}
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
                                  : "text-gray-300 dark:text-gray-600"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          ({Number(rev.ratings?.overall || 5).toFixed(1)})
                        </span>
                      </div>

                      {/* Review Title */}
                      {rev.title && (
                        <h4 className="font-medium text-slate-900 dark:text-white mt-2 text-sm">
                          {rev.title}
                        </h4>
                      )}

                      {/* Comment Body */}
                      {rev.comment && (
                        <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 leading-relaxed">
                          {rev.comment}
                        </p>
                      )}

                      {/* Recommendation Status */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative p-6 sm:p-8 my-8">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Product Reviews</h3>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Enter your name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Enter your nickname"
                        value={reviewNickname}
                        onChange={(e) => setReviewNickname(e.target.value)}
                      />
                      <p className="text-[10px] text-gray-400 mt-1">This name will be published with this review.</p>
                    </div>
                    <div>
                      <Input
                        placeholder="Enter your location"
                        value={reviewLocation}
                        onChange={(e) => setReviewLocation(e.target.value)}
                      />
                      <p className="text-[10px] text-gray-400 mt-1">Example: Karachi, Lahore, Islamabad.</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-2">
                    <h4 className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-3">My Rating</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 dark:text-slate-300">Overall Rating</span>
                        <StarRatingSelector rating={overallRating} setRating={setOverallRating} />
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 dark:text-slate-300">Quality</span>
                        <StarRatingSelector rating={qualityRating} setRating={setQualityRating} />
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 dark:text-slate-300">Delivery</span>
                        <StarRatingSelector rating={deliveryRating} setRating={setDeliveryRating} />
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 dark:text-slate-300">Service</span>
                        <StarRatingSelector rating={serviceRating} setRating={setServiceRating} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">I would recommend this to a friend.</p>
                    <div className="flex gap-6 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="recommend"
                          checked={recommend === "Yes"}
                          onChange={() => setRecommend("Yes")}
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="recommend"
                          checked={recommend === "No"}
                          onChange={() => setRecommend("No")}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold tracking-wider uppercase text-slate-500">My Review (Optional)</h4>
                    <Input
                      placeholder="Review Title"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                    <textarea
                      placeholder="Write your review"
                      rows={5}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-3 text-sm border rounded-md dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full py-3 rounded-full bg-[#4A5D4E] hover:bg-[#3B4C3F] text-white font-medium text-sm transition-colors shadow-sm mt-4 flex items-center justify-center"
                  >
                    {reviewSubmitting ? <Loader className="animate-spin h-5 w-5" /> : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {relatedProduct?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProduct.map((e) => (
              <ProductCard key={e._id} product={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;