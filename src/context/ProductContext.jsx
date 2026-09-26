import axios from "axios";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { server } from "../main";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);

  // Use a ref to track the latest request to prevent race conditions
  const activeRequestRef = useRef(null);

  // Auto-reset page to 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, price]);

  async function fetchProducts(targetPage = page) {
    setLoading(true);
    const requestId = {};
    activeRequestRef.current = requestId;

    try {
      const { data } = await axios.get(
        `${server}/api/product/all?search=${search}&category=${encodeURIComponent(category)}&sortByPrice=${price}&page=${targetPage}`
      );
      
      // Prevent older overlapping requests from overriding newer state
      if (activeRequestRef.current !== requestId) return;

      setProducts(data.products || []);
      setNewProd(data.newProduct || data.newProducts || []);
      // DO NOT overwrite global category list from product search response 
      // to avoid dropdown state corruption. Let fetchCategories handle it.
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      if (activeRequestRef.current === requestId) {
        console.log(error);
      }
    } finally {
      if (activeRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }

  async function fetchCategories() {
    try {
      const { data } = await axios.get(`${server}/api/category/all`);
      const backendCategories = data.categories || data || [];
      const formatted = backendCategories.map((bc) => (typeof bc === "string" ? bc : bc.name));
      setCategories(formatted);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  }

  async function fetchProduct(id) {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/product/${id}`);
      setProduct(data.product);
      setRelatedProduct(data.relatedProduct || []);
      setReviews(data.reviews || []);
      setReviewStats(data.reviewStats || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Unified effect with request guard
  useEffect(() => {
    fetchProducts(page);
  }, [search, category, page, price]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        loading,
        products,
        newProd,
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
        fetchProducts,
        fetchCategories,
        fetchProduct,
        product,
        relatedProduct,
        reviews,
        reviewStats,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const ProductData = () => useContext(ProductContext);