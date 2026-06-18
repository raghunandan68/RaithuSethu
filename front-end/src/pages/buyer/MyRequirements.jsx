import { useState, useEffect } from "react";
import { buyerApi } from "../../api/buyer";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage, CROP_CATEGORIES, CROP_UNITS } from "../../utils/format";
import Button from "../../components/common/Button";
import { PageLoader, EmptyState, Badge } from "../../components/common/Feedback";
import { Field, Input, TextArea, Select } from "../../components/common/Field";
import { User, Plus, X, Edit2 } from "lucide-react";

export default function MyRequirements() {
  const toast = useToast();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    crop_name: "",
    category: "",
    quantity: "",
    unit: "kg",
    max_price: "",
    location: "",
    required_by: "",
    description: "",
  });

  const fetch = async () => {
    try {
      const res = await buyerApi.getMyRequirements();
      setRequirements(res.data || []);
    } catch {
      toast.error("Failed to load requirements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const resetForm = () => {
    setForm({ crop_name: "", category: "", quantity: "", unit: "kg", max_price: "", location: "", required_by: "", description: "" });
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (req) => {
    setEditing(req);
    setForm({
      crop_name: req.crop_name || "",
      category: req.category || "",
      quantity: req.quantity?.toString() || "",
      unit: req.unit || "kg",
      max_price: req.max_price?.toString() || "",
      location: req.location || "",
      required_by: req.required_by?.slice(0, 10) || "",
      description: req.description || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        crop_name: form.crop_name,
        category: form.category,
        quantity: Number(form.quantity),
        unit: form.unit,
        max_price: Number(form.max_price),
        location: form.location || undefined,
        required_by: form.required_by ? new Date(form.required_by).toISOString() : undefined,
        description: form.description || undefined,
      };
      if (editing) {
        await buyerApi.updateRequirement(editing.id, payload);
        toast.success("Requirement updated!");
      } else {
        await buyerApi.createRequirement(payload);
        toast.success("Requirement posted! Farmers can now respond.");
      }
      resetForm();
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
          <h1 className="font-display text-2xl font-semibold text-ink">My Requirements</h1>
          <p className="mt-1 text-sm text-ink-soft">Let farmers know what crops you need</p>
        </div>
        {!showForm && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> New Requirement
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-paddy-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">
              {editing ? "Edit Requirement" : "Post a Requirement"}
            </h2>
            <button onClick={resetForm} className="text-ink-soft hover:text-ink"><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Crop Name" required>
                <Input value={form.crop_name} onChange={(e) => setForm({ ...form, crop_name: e.target.value })} required />
              </Field>
              <Field label="Category" required>
                <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select</option>
                  {CROP_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Quantity" required>
                <Input type="number" min="0" step="any" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </Field>
              <Field label="Unit">
                <Select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                  {CROP_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                </Select>
              </Field>
              <Field label="Max Price (₹)" required>
                <Input type="number" min="0" step="any" value={form.max_price} onChange={(e) => setForm({ ...form, max_price: e.target.value })} required />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Location" hint="Optional">
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </Field>
              <Field label="Required By" hint="Optional">
                <Input type="date" value={form.required_by} onChange={(e) => setForm({ ...form, required_by: e.target.value })} />
              </Field>
            </div>
            <Field label="Description" hint="Optional">
              <TextArea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
              <Button type="submit" variant="primary" loading={submitting}>
                {editing ? "Update" : "Post Requirement"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {requirements.length === 0 ? (
        <EmptyState
          icon={<User size={40} />}
          title="No requirements posted"
          description="Post what you need and farmers will respond with offers."
          action={
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Post Your First Requirement
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {requirements.map((req) => (
            <div key={req.id} className="rounded-xl border border-paddy-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{req.crop_name}</h3>
                    <Badge tone={req.is_active ? "paddy" : "neutral"}>
                      {req.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-0.5 text-sm text-ink-soft">
                    <p>{req.quantity} {req.unit} | Max ₹{req.max_price}</p>
                    {req.location && <p>Location: {req.location}</p>}
                    {req.description && <p className="italic">{req.description}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(req)}
                  className="rounded-lg p-2 text-ink-soft hover:bg-paddy-100"
                  title="Edit"
                >
                  <Edit2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
