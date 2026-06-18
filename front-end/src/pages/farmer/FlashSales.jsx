import { useState, useEffect } from "react";
import { flashSalesApi } from "../../api/resources";
import { farmerApi } from "../../api/farmer";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage, formatCurrency, formatDateTime } from "../../utils/format";
import Button from "../../components/common/Button";
import { PageLoader, EmptyState, Badge } from "../../components/common/Feedback";
import { Field, Input, Select } from "../../components/common/Field";
import { TrendingUp, Plus, X } from "lucide-react";

export default function FlashSales() {
  const toast = useToast();
  const [flashSales, setFlashSales] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    crop_id: "",
    discount_percentage: "",
    start_time: "",
    end_time: "",
  });

  const fetch = async () => {
    try {
      const [fsRes, cropsRes] = await Promise.all([
        flashSalesApi.getAll(false),
        farmerApi.getMyCrops(),
      ]);
      setFlashSales(fsRes.data || []);
      setCrops((cropsRes.data || []).filter((c) => c.status === "active"));
    } catch {
      toast.error("Failed to load flash sales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await flashSalesApi.create({
        crop_id: form.crop_id,
        discount_percentage: Number(form.discount_percentage),
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      });
      toast.success("Flash sale created!");
      setShowForm(false);
      setForm({ crop_id: "", discount_percentage: "", start_time: "", end_time: "" });
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Flash Sales</h1>
          <p className="mt-1 text-sm text-ink-soft">Create time-limited discounts to attract buyers</p>
        </div>
        {!showForm && (
          <Button variant="gold" onClick={() => setShowForm(true)}>
            <Plus size={16} /> New Flash Sale
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-paddy-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Create Flash Sale</h2>
            <button onClick={() => setShowForm(false)} className="text-ink-soft hover:text-ink">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <Field label="Crop" required>
              <Select
                value={form.crop_id}
                onChange={(e) => setForm({ ...form, crop_id: e.target.value })}
                required
              >
                <option value="">Select a crop</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {formatCurrency(c.price_per_unit)}/{c.unit}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Discount (%)" required>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={form.discount_percentage}
                  onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })}
                  required
                />
              </Field>
              <Field label="Start Time" required>
                <Input
                  type="datetime-local"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  required
                />
              </Field>
              <Field label="End Time" required>
                <Input
                  type="datetime-local"
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  required
                />
              </Field>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" variant="gold" loading={submitting}>Create Flash Sale</Button>
            </div>
          </form>
        </div>
      )}

      {flashSales.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={40} />}
          title="No flash sales"
          description="Run flash sales to boost visibility and sell crops fast."
          action={
            <Button variant="gold" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Create Flash Sale
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {flashSales.map((fs) => (
            <div key={fs.id} className="rounded-xl border border-paddy-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{fs.crops?.name || fs.crop_name || `Flash Sale #${fs.id.slice(0, 8)}`}</h3>
                    <Badge tone={fs.is_active ? "gold" : "neutral"}>
                      {fs.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="mt-1 space-y-0.5 text-sm text-ink-soft">
                    <p>Discount: <span className="font-bold text-gold-600">{fs.discount_percentage}% OFF</span></p>
                    <p>Start: {formatDateTime(fs.start_time)}</p>
                    <p>End: {formatDateTime(fs.end_time)}</p>
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
