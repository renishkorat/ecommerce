
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiArrowRight,
  FiTruck,
  FiShield,
  FiHeadphones,
} from "react-icons/fi";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        setProducts(productRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("Unable to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();

    return (
      product.title?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  // Show search results when a search query exists
  if (searchQuery.trim()) {
    return (
      <section className="container-custom py-10 min-h-[60vh]">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Search Results
            </h1>
            <p className="text-slate-500 mt-2">
              Results for "{searchQuery}"
            </p>
          </div>

          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            Back to Home
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : filteredProducts.length > 0 ? (
          <>
            <p className="text-slate-500 mb-5">
              {filteredProducts.length} products found
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-xl">
            <h2 className="text-xl font-bold text-slate-700">
              No Products Found
            </h2>
            <p className="text-slate-500 mt-2">
              Try searching with a different product name or category.
            </p>
          </div>
        )}
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-r from-blue-950 via-blue-800 to-indigo-700 text-white">
        <div className="container-custom py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="bg-orange-500 px-4 py-2 rounded-full text-sm font-bold">
              BIGGEST SALE OF THE SEASON
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-7">
              Discover Amazing Products & Great Deals
            </h1>

            <p className="text-blue-100 mt-5 mb-8 max-w-lg">
              Find your favorite products at unbeatable prices. Quality,
              style and convenience all in one place.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 px-7 py-3 rounded-lg font-bold"
            >
              Shop Now <FiArrowRight />
            </Link>
          </div>

          <div className="flex-1 w-full">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=900"
              alt="Shopping offers"
              className="rounded-2xl w-full h-72 md:h-96 object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="container-custom py-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          [FiTruck, "Free Shipping", "On orders above ₹999"],
          [FiShield, "Secure Shopping", "Safe shopping experience"],
          [FiHeadphones, "24/7 Support", "We're here to help"],
        ].map(([Icon, title, description]) => (
          <div
            key={title}
            className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm"
          >
            <Icon className="text-3xl text-blue-600" />
            <div>
              <h3 className="font-bold">{title}</h3>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="container-custom py-8">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-2xl md:text-3xl font-bold">
            Shop by Category
          </h2>
          <Link to="/categories" className="text-blue-600 font-semibold">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((category) => (
            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              key={category.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-36 object-cover"
              />
              <h3 className="text-center font-bold py-4">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-custom py-10">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-2xl md:text-3xl font-bold">
            Featured Products
          </h2>
          <Link to="/products" className="text-blue-600 font-semibold">
            View All →
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="container-custom py-8">
        <div className="bg-orange-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-orange-600 font-bold">SPECIAL OFFER</p>
            <h2 className="text-3xl font-extrabold mt-2">
              Upgrade Your Lifestyle
            </h2>
            <p className="text-slate-600 mt-2">
              Discover exclusive shopping deals.
            </p>
          </div>
          <Link to="/products" className="btn-primary">
            Explore Products
          </Link>
        </div>
      </section>
    </>
  );
}
