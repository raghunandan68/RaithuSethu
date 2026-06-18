import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { farmerApi } from "../../api/farmer";
import { bookingsApi, flashSalesApi } from "../../api/resources";
import { useAuth } from "../../context/AuthContext";
import { Sprout, ShoppingBag, Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { PageLoader, EmptyState } from "../../components/common/Feedback";
import { formatCurrency } from "../../utils/format";

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropsRes, requestsRes, bookingsRes, flashSalesRes] = await Promise.all([
          farmerApi.getMyCrops(),
          farmerApi.getPurchaseRequests(),
          bookingsApi.getAll(),
          flashSalesApi.getAll(),
        ]);
        const crops = cropsRes.data || [];
        const requests = requestsRes.data || [];
        const bookings = bookingsRes.data || [];
        const flashSales = flashSalesRes.data || [];

        setStats({
          totalCrops: crops.length,
          activeCrops: crops.filter((c) => c.status === "active").length,
          pendingRequests: requests.filter((r) => r.status === "pending").length,
          activeBookings: bookings.filter((b) => b.status === "confirmed").length,
          activeFlashSales: flashSales.filter((f) => f.is_active).length,
          recentCrops: crops.slice(0, 3),
        });
      } catch {
        setStats({
          totalCrops: 0, activeCrops: 0, pendingRequests: 0,
          activeBookings: 0, activeFlashSales: 0, recentCrops: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const cards = [
    { label: "Active Crops", value: stats.activeCrops, icon: Sprout, color: "paddy", link: "/farmer/crops" },
    { label: "Pending Requests", value: stats.pendingRequests, icon: ShoppingBag, color: "gold", link: "/farmer/requests" },
    { label: "Active Bookings", value: stats.activeBookings, icon: Calendar, color: "river", link: "/farmer/bookings" },
    { label: "Flash Sales", value: stats.activeFlashSales, icon: TrendingUp, color: "terracotta", link: "/farmer/flash-sales" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Welcome, {user?.name || "Farmer"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Here&apos;s your farm overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="rounded-xl border border-paddy-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`mb-3 inline-flex rounded-lg p-2 bg-${card.color}-100`}>
              <card.icon size={18} className={`text-${card.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-ink">{card.value}</p>
            <p className="text-xs text-ink-soft">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">Recent Crop Listings</h2>
          <Link to="/farmer/crops" className="flex items-center gap-1 text-sm font-semibold text-paddy-700 hover:text-paddy-800">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {stats.recentCrops.length === 0 ? (
          <EmptyState
            icon={<Sprout size={32} />}
            title="No crops listed yet"
            description="Start by listing your first crop on the marketplace."
            action={
              <Link to="/farmer/crops" className="rounded-lg bg-paddy-800 px-4 py-2 text-sm font-semibold text-cream hover:bg-paddy-700">
                List a Crop
              </Link>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.recentCrops.map((crop) => (
              <div key={crop.id} className="rounded-xl border border-paddy-100 bg-white p-4">
                <h3 className="font-semibold text-ink">{crop.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{formatCurrency(crop.price_per_unit)} / {crop.unit}</p>
                <p className="text-xs text-ink-soft/60 capitalize">{crop.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
