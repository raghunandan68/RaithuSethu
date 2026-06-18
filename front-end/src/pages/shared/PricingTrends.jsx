import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Search, Leaf } from "lucide-react";
import { buyerApi } from "../../api/buyer";
import { useToast } from "../../context/ToastContext";
import { SkeletonTable } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

export default function PricingTrends() {
  const [trends, setTrends] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast();

  useEffect(() => {
    buyerApi.getAvailableCrops()
      .then(res => {
        const crops = res.data || [];
        const byCategory = {};
        
        crops.forEach(c => {
          if (!byCategory[c.category]) {
            byCategory[c.category] = { prices: [], count: 0 };
          }
          byCategory[c.category].prices.push(c.price_per_unit);
          byCategory[c.category].count += 1;
        });

        const calculatedTrends = Object.entries(byCategory).map(([category, data]) => {
          const prices = data.prices;
          const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          return { category, crop_count: data.count, avg_price: avg, min_price: min, max_price: max };
        });

        setTrends(calculatedTrends);
        setFiltered(calculatedTrends);
      })
      .catch(() => toast.error("Failed to load pricing trends"))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    if (!search) setFiltered(trends);
    else setFiltered(trends.filter(t => t.category.toLowerCase().includes(search.toLowerCase())));
  }, [search, trends]);

  return (
    <div className="page-enter max-w-5xl mx-auto space-y-6">
      <div className="page-header">
        <h1 className="page-title">Market Price Trends</h1>
        <p className="page-subtitle">Real-time aggregate pricing data across the platform</p>
      </div>

      <div className="card p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={6} />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState type="search" title="No data found" description="Try a different search term or check back later when more listings are added." />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t, i) => (
            <div key={t.category} className="card p-5 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <Leaf size={18} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 capitalize">{t.category}</h3>
                  <p className="text-xs text-slate-500">{t.crop_count} listings</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Average Price</span>
                  <span className="font-bold text-slate-900 text-lg">₹{Math.round(t.avg_price)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Lowest Price</span>
                  <span className="font-semibold text-green-600">₹{t.min_price}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500">Highest Price</span>
                  <span className="font-semibold text-amber-600">₹{t.max_price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
