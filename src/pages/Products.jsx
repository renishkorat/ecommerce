
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState("default");

  // Fetch Products and Categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        const productData = productRes.data;
        if (!Array.isArray(productData) || !Array.isArray(categoryRes.data)) {
          throw new Error("The API returned invalid product or category data");
        }

        setProducts(productData);
        setCategories(categoryRes.data);

        // Automatically calculate highest product price
        const highestPrice = Math.max(
          0,
          ...productData.map(
            (product) => Number(product.price) || 0
          )
        );

        setMaxPrice(highestPrice);
      } catch (error) {
        console.error("Products loading error:", error);
        alert("Products could not be loaded");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update search and category from URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  // Calculate highest price dynamically
  const highestPrice = useMemo(() => {
    return Math.max(
      0,
      ...products.map(
        (product) => Number(product.price) || 0
      )
    );
  }, [products]);

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        !category || product.category === category;

      const matchPrice =
        Number(product.price) <= maxPrice;

      return matchSearch && matchCategory && matchPrice;
    });

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, search, category, maxPrice, sort]);

  // Clear All Filters
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMaxPrice(highestPrice);
    setSort("default");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container-custom py-10">

      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          All Products
        </h1>

        <p className="text-slate-500">
          Discover our latest collection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar Filters */}
        <aside className="bg-white rounded-xl p-5 shadow-sm h-fit">

          <h2 className="text-xl font-bold mb-5">
            Filters
          </h2>

          {/* Search */}
          <label className="font-semibold block mb-2">
            Search
          </label>

          <input
            type="text"
            className="input-field mb-5"
            placeholder="Product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Category */}
          <label className="font-semibold block mb-2">
            Category
          </label>

          <select
            className="input-field mb-5"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          {/* Maximum Price */}
          <div className="mb-5">

            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold">
                Maximum Price
              </label>

              <span className="text-blue-600 font-bold">
                ₹{maxPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max={Math.max(1, highestPrice)}
              step="1"
              value={Math.min(maxPrice, highestPrice)}
              onChange={(e) =>
                setMaxPrice(Number(e.target.value))
              }
              className="w-full accent-blue-600"
            />

            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>₹0</span>
              <span>
                ₹{highestPrice.toLocaleString("en-IN")}
              </span>
            </div>

          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full border border-blue-600 text-blue-600 rounded-lg py-2 hover:bg-blue-600 hover:text-white transition"
          >
            Clear Filters
          </button>

        </aside>

        {/* Products Section */}
        <section className="lg:col-span-3">

          {/* Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">

            <p className="text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field sm:w-56"
            >
              <option value="default">
                Default Sorting
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>

              <option value="rating">
                Top Rated
              </option>
            </select>

          </div>

          {/* Product List */}
          {filteredProducts.length === 0 ? (

            <div className="bg-white p-10 rounded-xl text-center">

              <h3 className="text-xl font-bold">
                No Products Found
              </h3>

              <p className="text-slate-500 mt-2">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="btn-primary mt-5"
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>

          )}

        </section>

      </div>

    </div>
  );
}
