import { useState, useEffect } from "react";
import { bookingsApi } from "../../api/resources";
import { PageLoader, EmptyState, Badge } from "../../components/common/Feedback";
import { formatCurrency, formatDate } from "../../utils/format";
import { Calendar } from "lucide-react";

export default function BuyerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await bookingsApi.getAll();
        setBookings(res.data || []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">My Bookings</h1>
        <p className="mt-1 text-sm text-ink-soft">Track your confirmed purchases</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar size={40} />}
          title="No bookings yet"
          description="Bookings will appear when farmers accept your requests."
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-paddy-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{b.crop_name || `Booking #${b.id.slice(0, 8)}`}</h3>
                    <Badge tone={b.status === "completed" ? "paddy" : b.status === "confirmed" ? "gold" : "neutral"}>
                      {b.status}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-0.5 text-sm text-ink-soft">
                    <p>Quantity: {b.quantity} kg</p>
                    <p>Total: <span className="font-semibold text-ink">{formatCurrency(b.total_price)}</span></p>
                    {b.delivery_date && <p>Delivery: {formatDate(b.delivery_date)}</p>}
                    <p className="text-xs text-ink-soft/60">Payment: {b.payment_method?.toUpperCase() || "COD"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
