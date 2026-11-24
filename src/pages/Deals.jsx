
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import dealsBanner from "../assets/Deals.png";

export default function Deals() {
    const [deals, setDeals] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const [dealRes, productRes] = await Promise.all([
                    api.get("/deals"),
                    api.get("/products"),
                ]);

                if (!Array.isArray(dealRes.data) || !Array.isArray(productRes.data)) {
                    throw new Error("The API returned invalid deal or product data");
                }

                setDeals(dealRes.data);
                setProducts(productRes.data);
                setError("");
            } catch (err) {
                console.error("Unable to load deals:", err);
                setError("Unable to load deals. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();

        // Automatically update deals every 5 seconds
        const interval = setInterval(() => {
            fetchDeals();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) return <Loader />;

    const today = new Date().toISOString().slice(0, 10);

    const activeDeals = deals
        .filter(
            (deal) =>
                deal.active === true &&
                deal.endDate >= today
        )
        .map((deal) => {
            const product = products.find(
                (item) =>
                    String(item.id) === String(deal.productId)
            );

            if (!product) return null;

            return {
                ...product,
                discount: Number(deal.discount),
                isUpcoming: deal.startDate > today,
            };
        })
        .filter(Boolean);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            {/* Deals Banner */}
            <section className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10">

                <img
                    src={dealsBanner}
                    alt="Shopping Deals"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/60 to-transparent"></div>

                <div className="relative z-10 h-full flex flex-col mt-7 px-6 md:px-12 text-white">

                    <span className="bg-orange-500 w-fit px-4 py-2 rounded-full text-sm font-bold mb-4">
                        LIMITED TIME OFFER
                    </span>
                </div>
            </section>

            {/* Special Offers Heading */}
            <div className="mb-8">

                <p className="text-sm font-semibold text-red-500 mb-2">
                    SPECIAL OFFERS
                </p>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                    Today's Deals
                </h1>

                <p className="text-slate-500 mt-2">
                    Explore products selected by our admin with special discounts.
                </p>

            </div>

            {/* Deals Products */}
            {error ? (
                <div className="text-center py-16 text-red-500">
                    {error}
                </div>
            ) : activeDeals.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-xl">

                    <h2 className="text-xl font-semibold text-slate-800">
                        No Active Deals
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Please check back later for exciting offers.
                    </p>

                </div>
            ) : (
                <>
                    <p className="text-slate-500 mb-5">
                        {activeDeals.length} deals available
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {activeDeals.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}

                    </div>
                </>
            )}

        </div>
    );
}
