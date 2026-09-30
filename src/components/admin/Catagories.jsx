import React, { useState, useEffect } from "react";
import { ProductData } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, FolderPlus, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
  
  // Modal state controls
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  
  // Form states for creating a new category
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);

  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Pagination calculations
  const totalPages = Math.ceil(categoriesWithImages.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categoriesWithImages.slice(indexOfFirstItem, indexOfLastItem);

  // Handle creating a new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", newCategoryName.trim());
      if (newCategoryImage) {
        formData.append("files", newCategoryImage);
      }

      const { data } = await axios.post(`${server}/api/category/new`, formData, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      toast.success(data.message || "Category created successfully!");
      setOpenAddModal(false);
      setNewCategoryName("");
      setNewCategoryImage(null);
      
      fetchCategoryDetails();
      if (refreshContextCategories) refreshContextCategories();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
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
      setOpenEditModal(false);
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Manage Categories</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Organize and manage your store categories and display photos.</p>
        </div>
        
        {/* Add Category Dialog Trigger */}
        <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl px-5 shadow-md transition-all flex items-center gap-2">
              <Plus size={16} /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl bg-white dark:bg-zinc-950 shadow-2xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category Name</label>
                <Input 
                  type="text" 
                  placeholder="e.g. Electronics, Footwear"
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)} 
                  required 
                  className="rounded-xl border-0 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category Image (Optional)</label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setNewCategoryImage(e.target.files[0])} 
                  className="rounded-xl border-0 bg-zinc-100 dark:bg-zinc-900 file:text-zinc-700 dark:file:text-zinc-300 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
              </div>
              <Button type="submit" className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl py-2.5 font-medium transition-all" disabled={loading}>
                {loading ? "Creating..." : "Create Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentCategories && currentCategories.length > 0 ? (
          currentCategories.map((cat, index) => (
            <Card key={cat.id || index} className="overflow-hidden flex flex-col justify-between relative group bg-white dark:bg-zinc-950 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300">
              <button
                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                className="absolute top-3 right-3 z-10 bg-rose-600/90 hover:bg-rose-600 text-white p-2 rounded-xl shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete Category"
              >
                <Trash2 size={15} />
              </button>

              <div className="w-full h-52 bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden flex items-center justify-center p-4">
                {cat.image ? (
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 space-y-1">
                    <ImageIcon size={28} strokeWidth={1.5} />
                    <span className="text-xs font-medium">No Image</span>
                  </div>
                )}
              </div>

              <CardContent className="p-5 flex flex-col gap-4">
                <h3 className="font-semibold text-base text-zinc-900 dark:text-white capitalize tracking-tight line-clamp-1">{cat.name}</h3>
                
                <Dialog 
                  open={openEditModal && selectedCategory?.id === cat.id} 
                  onOpenChange={(isOpen) => {
                    setOpenEditModal(isOpen);
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
                      className="w-full rounded-xl border-0 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setNewName(cat.name || "");
                      }}
                    >
                      <Edit size={14} /> Edit Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl bg-white dark:bg-zinc-950 shadow-2xl sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">Edit Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateCategory} className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category Name</label>
                        <Input 
                          type="text" 
                          value={newName} 
                          onChange={(e) => setNewName(e.target.value)} 
                          required 
                          className="rounded-xl border-0 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Update Image (Optional)</label>
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => setCategoryImage(e.target.files[0])} 
                          className="rounded-xl border-0 bg-zinc-100 dark:bg-zinc-900 file:text-zinc-700 dark:file:text-zinc-300 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl py-2.5 font-medium transition-all" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-950 rounded-2xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-3">
              <FolderPlus size={24} strokeWidth={1.5} />
            </div>
            <p className="text-zinc-900 dark:text-white font-semibold text-base">No categories found</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Get started by adding your first category using the button above.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-zinc-950 px-6 py-4 rounded-2xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] mt-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing <span className="font-medium text-zinc-900 dark:text-white">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-medium text-zinc-900 dark:text-white">
              {Math.min(indexOfLastItem, categoriesWithImages.length)}
            </span>{" "}
            of <span className="font-medium text-zinc-900 dark:text-white">{categoriesWithImages.length}</span> categories
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-xl border-0 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>

            <div className="flex items-center gap-1 px-2">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">{currentPage}</span>
              <span className="text-sm text-zinc-400">/</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{totalPages}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-xl border-0 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catagories;