import React, { useState, useEffect } from "react";
import { ProductData } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { server } from "@/main";

const Catagories = () => {
  const { fetchCategories: refreshContextCategories } = ProductData();
  
  const [categoriesWithImages, setCategoriesWithImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newName, setNewName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCategoryDetails = async () => {
    try {
      const { data } = await axios.get(`${server}/api/category/all`);
      const backendCategories = data.categories || data || [];

      const formattedList = backendCategories.map((bc, index) => ({
        id: bc._id || bc.id || `legacy_${index}`,
        name: bc.name || bc.title || bc.category || "Unnamed Category",
        image: bc.image?.url || null,
      }));

      setCategoriesWithImages(formattedList);
    } catch (error) {
      console.log("Error fetching category details:", error);
      setCategoriesWithImages([]);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  const handleFileChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", newName.trim());
      if (categoryImage) {
        formData.append("files", categoryImage);
      }

      const { data } = await axios.put(`${server}/api/category/${selectedCategory.id}`, formData, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      toast.success(data.message || "Category updated successfully!");
      setOpenModal(false);
      setCategoryImage(null);
      setSelectedCategory(null);
      setNewName("");
      
      fetchCategoryDetails();
      if (refreshContextCategories) refreshContextCategories();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
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
      setCategoriesWithImages((prev) => prev.filter((cat) => cat.id !== catId));
      
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
            <Card key={cat.id || index} className="overflow-hidden flex flex-col justify-between relative group shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                className="absolute top-2 right-2 z-10 bg-red-600/80 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition-all"
                title="Delete Category"
              >
                <Trash2 size={16} />
              </button>

              <div className="w-full h-56 bg-gray-50 dark:bg-gray-900 relative overflow-hidden flex items-center justify-center p-2">
                {cat.image ? (
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">No Image</span>
                )}
              </div>

              <CardContent className="p-4 flex flex-col gap-3">
                <h3 className="font-semibold text-lg capitalize">{cat.name}</h3>
                <Dialog 
                  open={openModal && selectedCategory?.id === cat.id} 
                  onOpenChange={(isOpen) => {
                    setOpenModal(isOpen);
                    if (!isOpen) {
                      setSelectedCategory(null);
                      setCategoryImage(null);
                      setNewName("");
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center gap-2"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setNewName(cat.name || "");
                      }}
                    >
                      <Edit size={14} /> Edit Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Category: "{selectedCategory?.name || cat.name}"</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateCategory} className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <Input 
                          type="text" 
                          value={newName} 
                          onChange={(e) => setNewName(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Update Image (Optional)</label>
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
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