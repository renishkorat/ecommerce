
import { useEffect, useRef, useState } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../../services/api";
import Loader from "../../components/Loader";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  discount: "0",
  category: "Electronics",
  image: "",
  rating: "4.0",
  stock: "",
};

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const toastTimer = useRef(null);

  // Show Toast Notification
  const showToast = (message, type = "success") => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast({
      show: true,
      message,
      type,
    });

    toastTimer.current = setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3000);
  };

  // Clear Toast Timer
  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const [p, c] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);

      setProducts(p.data);
      setCategories(c.data);
    } catch (error) {
      showToast("Could not load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open Add Form
  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  // Open Edit Form
  const openEdit = (product) => {
    setEditingId(product.id);

    setForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      discount: String(product.discount),
      category: product.category,
      image: product.image,
      rating: String(product.rating),
      stock: String(product.stock),
    });

    setShowForm(true);
  };

  // Add / Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(form.price) <= 0 || Number(form.stock) < 0) {
      showToast("Enter valid price and stock", "error");
      return;
    }

    if (Number(form.discount) < 0 || Number(form.discount) > 100) {
      showToast("Discount must be between 0 and 100", "error");
      return;
    }

    const productData = {
      ...form,
      price: Number(form.price),
      discount: Number(form.discount),
      rating: Number(form.rating),
      stock: Number(form.stock),
    };

    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, productData);

        showToast("Product updated successfully!");
      } else {
        await api.post("/products", productData);

        showToast("Product added successfully!");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      await fetchProducts();
    } catch (error) {
      showToast("Product operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.filter((item) => item.id !== id)
      );

      showToast("Product deleted successfully!");
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>

      {/* Toast Notification */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3">

        {toast.show && (
          <div
            className={`flex items-center gap-3 p-4 min-w-[300px] max-w-[380px] bg-white rounded-xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
              toast.type === "success"
                ? "border-green-200"
                : "border-red-200"
            }`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                toast.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <FiCheckCircle size={23} />
              ) : (
                <FiAlertCircle size={23} />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-slate-800">
                {toast.type === "success" ? "Success!" : "Error!"}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() =>
                setToast((prev) => ({
                  ...prev,
                  show: false,
                }))
              }
              className="text-slate-400 hover:text-slate-700"
            >
              <FiX size={19} />
            </button>
          </div>
        )}

      </div>

      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-7">

        <div>
          <h1 className="text-3xl font-bold">
            Manage Products
          </h1>

          <p className="text-slate-500 mt-1">
            {products.length} products
          </p>
        </div>

        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus />
          Add Product
        </button>

      </div>

      {/* Add / Edit Product Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>

            <button onClick={() => setShowForm(false)}>
              <FiX size={24} />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            {/* Product Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Title
              </label>

              <input
                required
                className="input-field w-full"
                placeholder="Enter product title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>

              <select
                className="input-field w-full"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Price (₹)
              </label>

              <input
                required
                type="number"
                min="1"
                className="input-field w-full"
                placeholder="Enter price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Discount (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                className="input-field w-full"
                placeholder="Enter discount"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value })
                }
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Stock Quantity
              </label>

              <input
                required
                type="number"
                min="0"
                className="input-field w-full"
                placeholder="Enter stock quantity"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rating (0-5)
              </label>

              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="input-field w-full"
                placeholder="Enter rating"
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: e.target.value })
                }
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Image URL
              </label>

              <input
                required
                type="url"
                className="input-field w-full"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Description
              </label>

              <textarea
                required
                rows="3"
                className="input-field w-full"
                placeholder="Enter product description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={saving}
              className="btn-primary md:col-span-2 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Add Product"}
            </button>

          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">

        <table className="w-full text-left min-w-[700px]">

          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-10 text-center text-slate-500"
                >
                  No products available.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-slate-50 transition"
                >

                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />

                      <span className="font-semibold">
                        {product.title}
                      </span>

                    </div>
                  </td>

                  <td className="p-4">
                    {product.category}
                  </td>

                  <td className="p-4 font-semibold">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3">

                      <button
                        onClick={() => openEdit(product)}
                        title="Edit Product"
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                      >
                        <FiEdit size={19} />
                      </button>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        title="Delete Product"
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                      >
                        <FiTrash2 size={19} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
