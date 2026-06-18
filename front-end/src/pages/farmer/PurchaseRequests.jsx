import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { farmerApi } from "../../api/farmer";
import { chatApi } from "../../api/resources";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage, formatCurrency, formatDateTime } from "../../utils/format";
import Button from "../../components/common/Button";
import { PageLoader, EmptyState, Badge } from "../../components/common/Feedback";
import { ShoppingBag, Check, X, MessageCircle } from "lucide-react";

export default function PurchaseRequests() {
  const toast = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [chatLoading, setChatLoading] = useState(null);

  const fetch = async () => {
    try {
      const res = await farmerApi.getPurchaseRequests();
      setRequests(res.data || []);
    } catch {
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleAccept = async (id) => {
    setActionLoading(id);
    try {
      await farmerApi.acceptRequest(id);
      toast.success("Request accepted!");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await farmerApi.rejectRequest(id);
      toast.success("Request rejected.");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleChat = async (req) => {
    setChatLoading(req.id);
    try {
      const res = await chatApi.createConversation(req.buyer_id);
      navigate("/chat", { state: { conversation: res.data } });
    } catch (err) {
      toast.error(extractErrorMessage(err) || "Failed to start chat");
    } finally {
      setChatLoading(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Purchase Requests</h1>
        <p className="mt-1 text-sm text-ink-soft">Review and respond to buyer requests for your crops</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={40} />}
          title="No requests yet"
          description="Buyers will send requests when they're interested in your crops."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="rounded-xl border border-paddy-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{req.crop_name}</h3>
                    <Badge tone={req.status === "pending" ? "gold" : req.status === "accepted" ? "paddy" : "terracotta"}>
                      {req.status}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-ink-soft">
                      Quantity: <span className="font-semibold text-ink">{req.quantity} kg</span>
                    </p>
                    {req.proposed_price && (
                      <p className="text-sm text-ink-soft">
                        Proposed Price: <span className="font-semibold text-ink">{formatCurrency(req.proposed_price)}</span>
                      </p>
                    )}
                    {req.message && (
                      <p className="mt-2 rounded-lg bg-paddy-50 px-3 py-2 text-sm text-ink-soft italic">
                        &ldquo;{req.message}&rdquo;
                      </p>
                    )}
                    <p className="text-xs text-ink-soft/60">{formatDateTime(req.created_at)}</p>
                  </div>
                </div>
                {req.status === "pending" && (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAccept(req.id)}
                      loading={actionLoading === req.id}
                    >
                      <Check size={14} /> Accept
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(req.id)}
                      disabled={actionLoading === req.id}
                    >
                      <X size={14} /> Reject
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleChat(req)}
                      loading={chatLoading === req.id}
                    >
                      <MessageCircle size={14} /> Chat
                    </Button>
                  </div>
                )}
                {(req.status === "accepted" || req.status === "completed") && (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleChat(req)}
                      loading={chatLoading === req.id}
                    >
                      <MessageCircle size={14} /> Chat
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
