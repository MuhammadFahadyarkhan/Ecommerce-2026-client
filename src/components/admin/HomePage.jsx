import { ProductData } from "@/context/ProductContext";
import React, { useState } from "react";
import Loading from "../Loading";
import ProductCard from "../ProductCard";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input"; 
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { server } from "@/main";

const HomePage = () => {
  const { products, page, setPage, fetchProducts, loading, totalPages, categories } =
    ProductData();

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const [open, setOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    images: null,
    categoryImage: null, // Category image for new categories
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "categorySelect") {
      if (value === "add_new_custom") {
        setIsNewCategory(true);
        setFormData((prev) => ({ ...prev, category: "" }));
      } else {
        setIsNewCategory(false);
        setFormData((prev) => ({ ...prev, category: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleCategoryImageChange = (e) => {
    setFormData((prev) => ({ ...prev, categoryImage: e.target.files[0] }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!formData.images || formData.images.length === 0) {
      toast.error("Please select product images");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Please specify a category");
      return;
    }

    try {
      // 1. If it's a new category, create it first with its optional image
      if (isNewCategory) {
        const catForm = new FormData();
        catForm.append("name", formData.category);
        if (formData.categoryImage) {
          catForm.append("files", formData.categoryImage);
        }

        await axios.post(`${server}/api/category/new`, catForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: Cookies.get("token"),
          },
        });
      }

      // 2. Now create the product
      const productForm = new FormData();
      productForm.append("title", formData.title);
      productForm.append("description", formData.description);
      productForm.append("category", formData.category);
      productForm.append("price", formData.price);
      productForm.append("stock", formData.stock);

      for (let i = 0; i < formData.images.length; i++) {
        productForm.append("files", formData.images[i]);
      }

      const { data } = await axios.post(`${server}/api/product/new`, productForm, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Cookies.get("token"),
        },
      });
      
      toast.success(data.message);
      setOpen(false);
      setIsNewCategory(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        images: null,
        categoryImage: null,
      });
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">All Products</h2>
        <Button onClick={() => setOpen(true)} className="mb-4">
          Add Product
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product & Category</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={submitHandler} className="space-y-4">
              <Input
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <Input
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              {/* Category Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  name="categorySelect"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={handleChange}
                  value={isNewCategory ? "add_new_custom" : formData.category}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories && categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="add_new_custom">➕ Add New Category...</option>
                </select>
              </div>

              {/* Conditional Input for New Category & Category Image */}
              {isNewCategory && (
                <div className="space-y-3 p-3 border rounded-md bg-muted/40">
                  <label className="text-xs font-semibold">New Category Details</label>
                  <Input
                    name="category"
                    placeholder="Enter New Category Name"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Category Image (Optional)</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageChange}
                    />
                  </div>
                </div>
              )}

              <Input
                name="price"
                type="number"
                placeholder="Product Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <Input
                name="stock"
                type="number"
                placeholder="Product Stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
              <Input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <Button type="submit" className="w-full">
                Create Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products && products.length > 0 ? (
            products.map((e) => {
              return <ProductCard product={e} key={e._id} latest={"no"} />;
            })
          ) : (
            <p>NO Products yet</p>
          )}
        </div>
      )}

      <div className="mt-2 mb-3">
        <Pagination>
          <PaginationContent>
            {page !== 1 && (
              <PaginationItem className="cursor-pointer" onClick={prevPage}>
                <PaginationPrevious />
              </PaginationItem>
            )}

            <PaginationItem className="flex items-center px-4 text-sm font-medium">
              Page {page} of {totalPages}
            </PaginationItem>

            {page < totalPages && (
              <PaginationItem className="cursor-pointer" onClick={nextPage}>
                <PaginationNext />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default HomePage;