import { useState, useEffect } from "react";
import { adminApi } from "../../api/resources";
import { PageLoader, EmptyState } from "../../components/common/Feedback";
import { formatCurrency } from "../../utils/format";
import { TrendingUp, BarChart3 } from "lucide-react";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getAnalytics();
        setData(res.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <PageLoader />;

  if (!data) {
    return (
      <EmptyState
        icon={<BarChart3 size={40} />}
        title="Analytics data unavailable"
        description="No data available yet."
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Analytics</h1>
        <p className="mt-1 text-sm text-ink-soft">Revenue and top crops insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {data.total_revenue !== undefined && (
          <div className="rounded-xl border border-paddy-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-ink-soft">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-paddy-800">
              {formatCurrency(data.total_revenue)}
            </p>
          </div>
        )}

        {data.completed_bookings !== undefined && (
          <div className="rounded-xl border border-paddy-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-ink-soft">Completed Bookings</h3>
            <p className="mt-2 text-3xl font-bold text-paddy-800">{data.completed_bookings}</p>
          </div>
        )}
      </div>

      {data.top_crops?.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Top Crops</h2>
          <div className="overflow-x-auto rounded-xl border border-paddy-100">
            <table className="w-full text-sm">
              <thead className="bg-paddy-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-ink-soft">Crop</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink-soft">Bookings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paddy-100">
                {data.top_crops.map((c, i) => (
                  <tr key={i} className="hover:bg-paddy-50/50">
                    <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                    <td className="px-4 py-3 text-right text-ink">{c.bookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
