import React, { useState, useEffect } from "react";
import { ProductData } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { server } from "@/main";

const Catagories = () => {
  const { categories: contextCategories, fetchCategories: refreshContextCategories } = ProductData();
  
  const [categoriesWithImages, setCategoriesWithImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch category objects to check for existing images and get their database _id
  const fetchCategoryDetails = async () => {
    try {
      const { data } = await axios.get(`${server}/api/category/all`);
      const backendCategories = data.categories || data || [];

      // Map through all known context categories to ensure nothing is left out
      const mergedList = (contextCategories || []).map((catName) => {
        const found = backendCategories.find(
          (bc) => (typeof bc === "string" ? bc : bc.name)?.toLowerCase() === catName.toLowerCase()
        );

        return {
          id: found && typeof found === "object" ? found._id : null,
          name: catName,
          image: found && typeof found === "object" ? found.image?.url || null : null,
        };
      });

      setCategoriesWithImages(mergedList);
    } catch (error) {
      console.log("Error fetching category details:", error);
      setCategoriesWithImages((contextCategories || []).map((name) => ({ id: null, name, image: null })));
    }
  };

  useEffect(() => {
    if (contextCategories && contextCategories.length > 0) {
      fetchCategoryDetails();
    }
  }, [contextCategories]);

  const handleFileChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!categoryImage) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", selectedCategory.name);
      formData.append("files", categoryImage);

      const { data } = await axios.post(`${server}/api/category/new`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Cookies.get("token"),
        },
      });

      toast.success(data.message || "Category image saved successfully!");
      setOpenModal(false);
      setCategoryImage(null);
      setSelectedCategory(null);
      
      fetchCategoryDetails();
      if (refreshContextCategories) refreshContextCategories();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save category image");
    } finally {
      setLoading(false);
    }
  };

  // Handler to delete category without touching products
  const handleDeleteCategory = async (catId, catName) => {
    if (!catId) {
      toast.error("This category only exists via products and has no standalone record to delete.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the category "${catName}"? Your products will remain safe.`)) {
      return;
    }

    try {
      const { data } = await axios.delete(`${server}/api/category/${catId}`, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      toast.success(data.message || "Category deleted successfully");
      fetchCategoryDetails();
      if (refreshContextCategories) refreshContextCategories();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoriesWithImages && categoriesWithImages.length > 0 ? (
          categoriesWithImages.map((cat, index) => (
            <Card key={index} className="overflow-hidden flex flex-col justify-between relative group">
              {/* Delete Icon Button */}
              {cat.id && (
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  className="absolute top-2 right-2 z-10 bg-red-600/80 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition-all"
                  title="Delete Category"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="h-40 bg-muted flex items-center justify-center relative">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm text-muted-foreground">No Image</span>
                )}
              </div>
              <CardContent className="p-4 flex flex-col gap-3">
                <h3 className="font-semibold text-lg capitalize">{cat.name}</h3>
                <Dialog 
                  open={openModal && selectedCategory?.name === cat.name} 
                  onOpenChange={(isOpen) => {
                    setOpenModal(isOpen);
                    if (!isOpen) {
                      setSelectedCategory(null);
                      setCategoryImage(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedCategory({ name: cat.name, image: cat.image })}
                    >
                      {cat.image ? "Update Image" : "Add Image"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{cat.image ? `Update Image for "${cat.name}"` : `Add Image for "${cat.name}"`}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateCategory} className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Category Image</label>
                        <Input type="file" accept="image/*" onChange={handleFileChange} required />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Uploading..." : "Save Changes"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default Catagories;