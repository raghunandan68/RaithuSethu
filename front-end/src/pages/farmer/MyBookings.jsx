import { useState, useEffect } from "react";
import { bookingsApi } from "../../api/resources";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage, formatCurrency, formatDate } from "../../utils/format";
import Button from "../../components/common/Button";
import { PageLoader, EmptyState, Badge } from "../../components/common/Feedback";
import { Calendar, Check } from "lucide-react";

export default function FarmerBookings() {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  const fetch = async () => {
    try {
      const res = await bookingsApi.getAll();
      setBookings(res.data || []);
    } catch {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleComplete = async (id) => {
    setCompleting(id);
    try {
      await bookingsApi.complete(id);
      toast.success("Booking marked as completed!");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setCompleting(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">My Bookings</h1>
        <p className="mt-1 text-sm text-ink-soft">Track confirmed purchases from buyers</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar size={40} />}
          title="No bookings yet"
          description="Bookings will appear once buyers confirm purchases."
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-paddy-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{b.crop_name || `Booking #${b.id.slice(0, 8)}`}</h3>
                    <Badge tone={b.status === "completed" ? "paddy" : b.status === "confirmed" ? "gold" : "neutral"}>
                      {b.status}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-0.5 text-sm text-ink-soft">
                    <p>Quantity: <span className="font-semibold text-ink">{b.quantity} kg</span></p>
                    <p>Total: <span className="font-semibold text-ink">{formatCurrency(b.total_price)}</span></p>
                    {b.delivery_date && <p>Delivery: {formatDate(b.delivery_date)}</p>}
                    <p className="text-xs text-ink-soft/60">Payment: {b.payment_method?.toUpperCase() || "COD"}</p>
                  </div>
                </div>
                {b.status === "confirmed" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleComplete(b.id)}
                    loading={completing === b.id}
                  >
                    <Check size={14} /> Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
