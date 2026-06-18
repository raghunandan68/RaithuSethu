import { useState } from "react";
import { pricingApi } from "../../api/resources";
import { formatCurrency } from "../../utils/format";
import Button from "../../components/common/Button";
import { Field, Input } from "../../components/common/Field";
import { TrendingUp, Search } from "lucide-react";

export default function Pricing() {
  const [cropName, setCropName] = useState("");
  const [price, setPrice] = useState(null);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!cropName.trim()) return;
    setLoading(true);
    setError("");
    setPrice(null);
    setTrend(null);
    try {
      const [priceRes, trendRes] = await Promise.all([
        pricingApi.getSuggestedPrice(cropName.trim()),
        pricingApi.getDemandTrend(cropName.trim()),
      ]);
      setPrice(priceRes.data);
      setTrend(trendRes.data);
    } catch {
      setError("Could not fetch pricing data for this crop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Market Pricing</h1>
        <p className="mt-1 text-sm text-ink-soft">Check suggested prices and demand trends for crops</p>
      </div>

      <div className="rounded-2xl border border-paddy-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-end gap-3">
          <div className="flex-1">
            <Field label="Crop Name">
              <Input
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Rice, Wheat, Tomato"
              />
            </Field>
          </div>
          <Button type="submit" variant="primary" loading={loading}>
            <Search size={16} /> Search
          </Button>
        </form>

        {error && <p className="mt-4 text-sm text-terracotta-500">{error}</p>}

        {(price || trend) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {price && (
              <div className="rounded-xl border border-paddy-100 bg-paddy-50 p-5">
                <h3 className="text-sm font-semibold text-ink-soft">Suggested Price</h3>
                <p className="mt-2 text-3xl font-bold text-paddy-800">
                  {price.suggested_price ? formatCurrency(price.suggested_price) : "—"}
                </p>
                <p className="mt-1 text-xs text-ink-soft/60">
                  Based on recent market data
                </p>
              </div>
            )}
            {trend && (
              <div className="rounded-xl border border-gold-100 bg-gold-50 p-5">
                <h3 className="text-sm font-semibold text-ink-soft">Demand Trend</h3>
                <div className="mt-2 flex items-center gap-2">
                  <TrendingUp size={24} className="text-gold-600" />
                  <p className="text-lg font-bold text-ink">{trend.trend || "Stable"}</p>
                </div>
                {trend.volume && (
                  <p className="mt-1 text-xs text-ink-soft/60">
                    Request volume: {trend.volume} this month
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
