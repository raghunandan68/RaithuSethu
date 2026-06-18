import { useState, useEffect } from "react";
import { adminApi } from "../../api/resources";
import { PageLoader } from "../../components/common/Feedback";
import { Users, Sprout, IndianRupee, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../utils/format";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getDashboard();
        setData(res.data);
      } catch {
        setData({});
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <PageLoader />;

  const cards = [
    { label: "Total Farmers", value: data?.total_farmers ?? 0, icon: Users, color: "paddy" },
    { label: "Total Buyers", value: data?.total_buyers ?? 0, icon: Users, color: "river" },
    { label: "Active Crops", value: data?.active_crops ?? 0, icon: Sprout, color: "paddy" },
    { label: "Total Revenue", value: data?.total_revenue ? formatCurrency(data.total_revenue) : "₹0", icon: IndianRupee, color: "gold" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-ink-soft">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-paddy-100 bg-white p-4 shadow-sm">
            <div className={`mb-3 inline-flex rounded-lg p-2 bg-${card.color}-100`}>
              <card.icon size={18} className={`text-${card.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-ink">{card.value}</p>
            <p className="text-xs text-ink-soft">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
