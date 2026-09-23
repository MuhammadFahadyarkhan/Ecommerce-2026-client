import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ProductData } from "@/context/ProductContext";
import { Filter, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const [show, setShow] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const {
    search,
    setSearch,
    categories,
    category,
    setCategory,
    totalPages,
    price,
    setPrice,
    page,
    setPage,
    products,
    loading,
  } = ProductData();

  // 🔄 Sync URL Query Parameter to Context Category on mount or URL change
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      if (category !== urlCategory) {
        setCategory(urlCategory);
      }
    } else {
      if (category !== "") {
        setCategory("");
      }
    }
  }, [searchParams]);

  // Handle manual category change from sidebar dropdown
  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    if (val) {
      setSearchParams({ category: val });
    } else {
      setSearchParams({});
    }
  };

  const clearFilter = () => {
    setPrice("");
    setCategory("");
    setSearch("");
    setPage(1);
    setSearchParams({});
  };

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Backdrop Overlay */}
      {show && (
        <div
          onClick={() => setShow(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar Filter Component */}
      <div
        className={`z-50 bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out shrink-0 w-64
          fixed inset-y-0 left-0 md:relative md:translate-x-0 ${
            show ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 relative">
          <button
            onClick={() => setShow(false)}
            className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full p-2 md:hidden"
          >
            <X size={18} />
          </button>
          <h2 className="text-lg font-bold mb-4">Filters</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Search Title</label>
            <input
              type="text"
              placeholder="Search Title"
              className="w-full p-2 border rounded-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white text-sm"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">All</option>
              {categories.map((e) => (
                <option value={e} key={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Price</label>
            <select
              className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              <option value="">Select</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>

          <Button className="w-full mt-2" onClick={clearFilter}>
            Clear Filter
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between overflow-x-hidden">
        <div>
          <button
            onClick={() => setShow(true)}
            className="md:hidden flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md mb-4 shadow"
          >
            <Filter size={18} /> Filters
          </button>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products && products.length > 0 ? (
                products.map((e) => (
                  <ProductCard key={e._id} product={e} latest={"no"} />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-10">
                  No Products Yet
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-8 mb-4 flex justify-center">
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
        )}
      </div>
    </div>
  );
};

export default Products;