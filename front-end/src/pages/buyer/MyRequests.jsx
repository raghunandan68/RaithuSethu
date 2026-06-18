import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buyerApi } from "../../api/buyer";
import { chatApi } from "../../api/resources";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/format";
import { PageLoader, EmptyState, Badge } from "../../components/common/Feedback";
import { formatCurrency, formatDateTime } from "../../utils/format";
import { ShoppingBag, MessageCircle } from "lucide-react";
import Button from "../../components/common/Button";

export default function MyRequests() {
  const navigate = useNavigate();
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await buyerApi.getMyRequests();
        setRequests(res.data || []);
      } catch {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChat = async (req) => {
    setChatLoading(req.id);
    try {
      const res = await chatApi.createConversation(req.farmer_id);
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
        <h1 className="font-display text-2xl font-semibold text-ink">My Requests</h1>
        <p className="mt-1 text-sm text-ink-soft">Track your purchase requests to farmers</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={40} />}
          title="No requests sent"
          description="Browse the marketplace and send requests for crops you need."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="rounded-xl border border-paddy-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{req.crop_name}</h3>
                    <Badge tone={req.status === "pending" ? "gold" : req.status === "accepted" ? "paddy" : "terracotta"}>
                      {req.status}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-0.5 text-sm text-ink-soft">
                    <p>Quantity: <span className="font-semibold text-ink">{req.quantity} kg</span></p>
                    {req.proposed_price && (
                      <p>Proposed Price: <span className="font-semibold text-ink">{formatCurrency(req.proposed_price)}</span></p>
                    )}
                    <p className="text-xs text-ink-soft/60">{formatDateTime(req.created_at)}</p>
                  </div>
                </div>
                {(req.status === "accepted" || req.status === "completed") && (
                  <div className="flex shrink-0">
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
