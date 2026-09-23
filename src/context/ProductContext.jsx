import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
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

  // Auto-reset page to 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, price]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${server}/api/product/all?search=${search}&category=${encodeURIComponent(category)}&sortByPrice=${price}&page=${page}`
      );
      setProducts(data.products);
      setNewProd(data.newProduct);
      if (data.categories) setCategories(data.categories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

  const [product, setProduct] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);

  async function fetchProduct(id) {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/product/${id}`);
      setProduct(data.product);
      setRelatedProduct(data.relatedProduct);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// <-- THIS EXPORT WAS MISSING, CAUSING THE MODULE SYNTAX ERROR
export const ProductData = () => useContext(ProductContext);