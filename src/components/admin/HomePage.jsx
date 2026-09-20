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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if user selected the "Add New Category" option from dropdown
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

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!formData.images || formData.images.length === 0) {
      toast.error("Please select images");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Please specify a category");
      return;
    }

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        for (let i = 0; i < value.length; i++) {
          form.append("files", value[i]);
        }
      } else {
        form.append(key, value);
      }
    });

    try {
      const { data } = await axios.post(`${server}/api/product/new`, form, {
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
              <DialogTitle>Add New Product</DialogTitle>
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

              {/* Conditional Input for New Category */}
              {isNewCategory && (
                <Input
                  name="category"
                  placeholder="Enter New Category Name"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
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