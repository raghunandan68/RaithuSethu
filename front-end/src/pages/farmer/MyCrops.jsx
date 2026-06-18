import { useState, useEffect } from "react";
import { farmerApi } from "../../api/farmer";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage, formatCurrency } from "../../utils/format";
import Button from "../../components/common/Button";
import { PageLoader, EmptyState, Badge, Spinner } from "../../components/common/Feedback";
import CropForm from "../../components/crop/CropForm";
import { Sprout, Plus, Edit2, Trash2, X } from "lucide-react";

export default function MyCrops() {
  const toast = useToast();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchCrops = async () => {
    try {
      const res = await farmerApi.getMyCrops();
      setCrops(res.data || []);
    } catch {
      toast.error("Failed to load crops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCrops(); }, []);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await farmerApi.createCrop(data);
      toast.success("Crop listed successfully!");
      setShowForm(false);
      fetchCrops();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    if (!editing) return;
    setSubmitting(true);
    try {
      await farmerApi.updateCrop(editing.id, data);
      toast.success("Crop updated!");
      setEditing(null);
      fetchCrops();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cropId) => {
    setDeleting(cropId);
    try {
      await farmerApi.deleteCrop(cropId);
      toast.success("Crop removed.");
      fetchCrops();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">My Crops</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage your crop listings</p>
        </div>
        {!showForm && !editing && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> List New Crop
          </Button>
        )}
      </div>

      {(showForm || editing) && (
        <div className="mb-8 rounded-2xl border border-paddy-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">
              {editing ? "Edit Crop" : "List a New Crop"}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="text-ink-soft hover:text-ink"
            >
              <X size={20} />
            </button>
          </div>
          <CropForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            loading={submitting}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {crops.length === 0 ? (
        <EmptyState
          icon={<Sprout size={40} />}
          title="No crops listed"
          description="List your crops to connect with buyers."
          action={
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <Plus size={16} /> List Your First Crop
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-paddy-100">
          <table className="w-full text-sm">
            <thead className="bg-paddy-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-ink-soft">Crop</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-soft">Category</th>
                <th className="px-4 py-3 text-right font-semibold text-ink-soft">Qty</th>
                <th className="px-4 py-3 text-right font-semibold text-ink-soft">Price</th>
                <th className="px-4 py-3 text-center font-semibold text-ink-soft">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-ink-soft">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paddy-100">
              {crops.map((crop) => (
                <tr key={crop.id} className="hover:bg-paddy-50/50">
                  <td className="px-4 py-3 font-medium text-ink">{crop.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{crop.category || "—"}</td>
                  <td className="px-4 py-3 text-right text-ink">{crop.quantity} {crop.unit}</td>
                  <td className="px-4 py-3 text-right text-ink font-semibold">
                    {formatCurrency(crop.price_per_unit)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge tone={crop.status === "active" ? "paddy" : crop.status === "sold" ? "gold" : "neutral"}>
                      {crop.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditing(crop)}
                        className="rounded-lg p-2 text-ink-soft hover:bg-paddy-100 hover:text-river-500"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(crop.id)}
                        disabled={deleting === crop.id}
                        className="rounded-lg p-2 text-ink-soft hover:bg-paddy-100 hover:text-terracotta-500 disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === crop.id ? <Spinner className="h-4 w-4" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
