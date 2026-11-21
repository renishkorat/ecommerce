import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new Error("The API returned invalid category data");
        }
        setCategories(res.data);
      })
      .catch((error) => {
        console.error("Categories loading error:", error);
        alert("Categories loading failed");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-3">Explore Categories</h1>
      <p className="text-slate-500 mb-8">
        Find the products you are looking for.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-60 object-cover"
            />
            <div className="p-5 flex justify-between items-center">
              <h2 className="font-bold text-xl">{category.name}</h2>
              <span className="text-blue-600 font-semibold">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}