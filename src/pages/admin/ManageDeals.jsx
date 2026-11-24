
import { useEffect, useRef, useState } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiTag,
} from "react-icons/fi";

import api from "../../services/api";
import Loader from "../../components/Loader";

const emptyForm = {
  productId: "",
  discount: "20",
  startDate: "",
  endDate: "",
  active: true,
};

export default function ManageDeals() {
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const toastTimer = useRef(null);

  const showToast = (message, type = "success") => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast({ show: true, message, type });

    toastTimer.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [productRes, dealRes] = await Promise.all([
        api.get("/products"),
        api.get("/deals"),
      ]);

      setProducts(productRes.data);
      setDeals(dealRes.data);
    } catch (error) {
      showToast("Could not load deals", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setForm({
      ...emptyForm,
      productId: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (deal) => {
    setEditingId(deal.id);
    setForm({
      productId: String(deal.productId),
      discount: String(deal.discount),
      startDate: deal.startDate || "",
      endDate: deal.endDate || "",
      active: deal.active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const discount = Number(form.discount);

    if (!form.productId) {
      showToast("Please select a product", "error");
      return;
    }

    if (discount < 1 || discount > 100) {
      showToast("Discount must be between 1 and 100", "error");
      return;
    }

    if (!form.startDate || !form.endDate) {
      showToast("Please select start and end dates", "error");
      return;
    }

    if (form.endDate < form.startDate) {
      showToast("End date must be after start date", "error");
      return;
    }

    const alreadyExists = deals.some(
      (deal) =>
        String(deal.productId) === String(form.productId) &&
        String(deal.id) !== String(editingId)
    );

    if (alreadyExists) {
      showToast("This product already has a deal", "error");
      return;
    }

    const dealData = {
      productId: String(form.productId),
      discount,
      startDate: form.startDate,
      endDate: form.endDate,
      active: form.active,
    };

    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/deals/${editingId}`, dealData);
        showToast("Deal updated successfully!");
      } else {
        await api.post("/deals", dealData);
        showToast("Deal added successfully!");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchData();
    } catch (error) {
      showToast("Deal operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleDeal = async (deal) => {
    try {
      await api.patch(`/deals/${deal.id}`, {
        active: !deal.active,
      });

      setDeals((prev) =>
        prev.map((item) =>
          String(item.id) === String(deal.id)
            ? { ...item, active: !item.active }
            : item
        )
      );

      showToast(
        deal.active ? "Deal deactivated" : "Deal activated"
      );
    } catch (error) {
      showToast("Could not update deal status", "error");
    }
  };

  const deleteDeal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) {
      return;
    }

    try {
      await api.delete(`/deals/${id}`);
      setDeals((prev) =>
        prev.filter((deal) => String(deal.id) !== String(id))
      );
      showToast("Deal deleted successfully!");
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  const getProduct = (productId) =>
    products.find(
      (product) => String(product.id) === String(productId)
    );

  const today = new Date().toISOString().slice(0, 10);

  const getDealStatus = (deal) => {
    if (!deal.active) return "Inactive";
    if (today < deal.startDate) return "Upcoming";
    if (today > deal.endDate) return "Expired";
    return "Active";
  };

  if (loading) return <Loader />;

  return (
    <div>
      {/* Toast */}
      <div className="fixed top-5 right-5 z-[100]">
        {toast.show && (
          <div
            className={`flex items-center gap-3 p-4 min-w-[300px] max-w-[380px] bg-white rounded-xl shadow-2xl border ${toast.type === "success"
                ? "border-green-200"
                : "border-red-200"
              }`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${toast.type === "success"
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
                setToast((prev) => ({ ...prev, show: false }))
              }
              className="text-slate-400 hover:text-slate-700"
            >
              <FiX size={19} />
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-bold">Manage Deals</h1>
          <p className="text-slate-500 mt-1">
            {deals.length} deals
          </p>
        </div>

        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus />
          Add Deal
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Deal" : "Add New Deal"}
            </h2>

            <button onClick={() => setShowForm(false)}>
              <FiX size={24} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Product */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Product
              </label>

              <select
                required
                className="input-field w-full"
                value={form.productId}
                onChange={(e) =>
                  setForm({ ...form, productId: e.target.value })
                }
              >
                <option value="">Choose a product</option>

                {products.map((product) => {
                  const assigned = deals.some(
                    (deal) =>
                      String(deal.productId) === String(product.id) &&
                      String(deal.id) !== String(editingId)
                  );

                  return (
                    <option
                      key={product.id}
                      value={product.id}
                      disabled={assigned}
                    >
                      {product.title}
                      {assigned ? " (Deal already added)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Deal Discount (%)
              </label>

              <input
                required
                type="number"
                min="1"
                max="100"
                className="input-field w-full"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value })
                }
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Start Date
              </label>

              <input
                required
                type="date"
                className="input-field w-full"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                End Date
              </label>

              <input
                required
                type="date"
                min={form.startDate || undefined}
                className="input-field w-full"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
              />
            </div>

            {/* Active */}
            <div className="flex items-center gap-3 mt-7">
              <input
                id="dealActive"
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
                className="w-4 h-4"
              />

              <label
                htmlFor="dealActive"
                className="text-sm font-semibold text-slate-700"
              >
                Activate this deal
              </label>
            </div>

            <button
              disabled={saving}
              className="btn-primary md:col-span-2 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Deal"
                  : "Add Deal"}
            </button>
          </form>
        </div>
      )}

      {/* Deals Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[850px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Start Date</th>
              <th className="p-4">End Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {deals.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-10 text-center text-slate-500"
                >
                  No deals added yet.
                </td>
              </tr>
            ) : (
              deals.map((deal) => {
                const product = getProduct(deal.productId);
                const status = getDealStatus(deal);

                return (
                  <tr
                    key={deal.id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-4">
                      {product ? (
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
                      ) : (
                        <span className="text-red-500">
                          Product not found
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-bold text-red-500">
                      {deal.discount}% OFF
                    </td>

                    <td className="p-4">{deal.startDate}</td>
                    <td className="p-4">{deal.endDate}</td>


                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => toggleDeal(deal)}
                        role="switch"
                        aria-checked={deal.active}
                        title={deal.active ? "Deactivate Deal" : "Activate Deal"}
                        className={`relative w-[60px] h-7 rounded-full flex items-center transition-all duration-300 ${deal.active ? "bg-green-500" : "bg-slate-300"
                          }`}
                      >
                        <span
                          className={`absolute text-[10px] font-bold ${deal.active
                              ? "left-3 text-green-800"
                              : "right-3 text-slate-600"
                            }`}
                        >
                          {deal.active ? "ON" : "OFF"}
                        </span>

                        <span
                          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${deal.active ? "left-[36px]" : "left-1"
                            }`}
                        />
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEdit(deal)}
                          title="Edit Deal"
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                        >
                          <FiEdit size={19} />
                        </button>

                        <button
                          onClick={() => deleteDeal(deal.id)}
                          title="Delete Deal"
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                        >
                          <FiTrash2 size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
