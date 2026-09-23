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
import { X, Edit, Loader, Trash2 } from "lucide-react";

const ProductPage = () => {
  const { fetchProduct, fetchProducts, product, relatedProduct, loading } = ProductData();
  const { addToCart, fetchCart } = CartData();
  const { id } = useParams();
  const { isAuth, user } = UserData();
  const navigate = useNavigate();

  // Categories list for the select dropdown
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

  return (
    <div className="container mx-auto px-4 py-8">
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
                
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">₨ {product.price}</p>

                {/* Prominent Description Box */}
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