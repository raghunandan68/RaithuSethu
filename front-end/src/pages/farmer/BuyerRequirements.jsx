import { useState, useEffect } from "react";
import { farmerApi } from "../../api/farmer";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage, formatCurrency } from "../../utils/format";
import Button from "../../components/common/Button";
import { PageLoader, EmptyState, Badge } from "../../components/common/Feedback";
import { Field, Input, TextArea } from "../../components/common/Field";
import { User, Send, X } from "lucide-react";

export default function BuyerRequirements() {
  const toast = useToast();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const [responseForm, setResponseForm] = useState({ crop_id: "", offered_price: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    try {
      const res = await farmerApi.getBuyerRequirements();
      setRequirements(res.data || []);
    } catch {
      toast.error("Failed to load buyer requirements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleRespond = async (reqId) => {
    setSubmitting(true);
    try {
      await farmerApi.respondToRequirement({
        requirement_id: reqId,
        ...responseForm,
        offered_price: Number(responseForm.offered_price),
      });
      toast.success("Response sent to buyer!");
      setResponding(null);
      setResponseForm({ crop_id: "", offered_price: "", message: "" });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Buyer Requirements</h1>
        <p className="mt-1 text-sm text-ink-soft">Browse what buyers are looking for and respond with your crops</p>
      </div>

      {requirements.length === 0 ? (
        <EmptyState
          icon={<User size={40} />}
          title="No requirements posted yet"
          description="Buyers haven't posted any requirements yet."
        />
      ) : (
        <div className="space-y-3">
          {requirements.filter(r => r.is_active !== false).map((req) => (
            <div key={req.id} className="rounded-xl border border-paddy-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">{req.crop_name}</h3>
                  <div className="mt-1 space-y-0.5 text-sm text-ink-soft">
                    <p>Category: {req.category || "—"}</p>
                    <p>Quantity: <span className="font-semibold">{req.quantity} {req.unit || "kg"}</span></p>
                    <p>Max Price: <span className="font-semibold">{formatCurrency(req.max_price)}</span></p>
                    {req.location && <p>Location: {req.location}</p>}
                    {req.description && (
                      <p className="mt-1 italic text-ink-soft/70">&ldquo;{req.description}&rdquo;</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setResponding(responding === req.id ? null : req.id)}
                >
                  {responding === req.id ? <X size={14} /> : <Send size={14} />}
                  {responding === req.id ? "Cancel" : "Respond"}
                </Button>
              </div>

              {responding === req.id && (
                <div className="mt-4 rounded-lg border border-paddy-100 bg-paddy-50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-ink">Respond to Requirement</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Your Crop ID">
                        <Input
                          placeholder="Enter your crop ID"
                          value={responseForm.crop_id}
                          onChange={(e) => setResponseForm({ ...responseForm, crop_id: e.target.value })}
                        />
                      </Field>
                      <Field label="Offered Price (₹)">
                        <Input
                          type="number"
                          placeholder="Your price"
                          value={responseForm.offered_price}
                          onChange={(e) => setResponseForm({ ...responseForm, offered_price: e.target.value })}
                        />
                      </Field>
                    </div>
                    <Field label="Message">
                      <TextArea
                        rows={2}
                        placeholder="Optional message..."
                        value={responseForm.message}
                        onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })}
                      />
                    </Field>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleRespond(req.id)}
                      loading={submitting}
                    >
                      Send Response
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
