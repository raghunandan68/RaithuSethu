import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { chatApi } from "../../api/resources";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../utils/format";
import { PageLoader } from "../../components/common/Feedback";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";
import { MessageCircle } from "lucide-react";

export default function Chat() {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const toast = useToast();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showList, setShowList] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await chatApi.getConversations();
      setConversations(res.data || []);
    } catch {
      toast.error("Failed to load conversations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    const conv = location.state?.conversation;
    if (conv) {
      setActiveConv(conv);
      setShowList(false);
      if (conv.id) {
        (async () => {
          setMessagesLoading(true);
          try {
            const res = await chatApi.getMessages(conv.id);
            setMessages(res.data || []);
          } catch { /* ignore */ }
          setMessagesLoading(false);
        })();
      }
    } else if (location.state?.conversationId) {
      const convId = location.state.conversationId;
      const found = conversations.find((c) => c.id === convId);
      if (found) {
        setActiveConv(found);
        setShowList(false);
      }
    }
  }, [location.state, conversations]);

  useEffect(() => {
    if (!socket || !activeConv) return;

    const handleMessage = (msg) => {
      if (msg.conversation_id === activeConv.id) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchConversations();
    };

    socket.on("receive_message", handleMessage);
    return () => socket.off("receive_message", handleMessage);
  }, [socket, activeConv, fetchConversations]);

  const selectConversation = async (conv) => {
    setActiveConv(conv);
    setShowList(false);
    setMessagesLoading(true);
    try {
      const res = await chatApi.getMessages(conv.id);
      setMessages(res.data || []);
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = (content) => {
    if (!socket || !activeConv) return;
    socket.emit("send_message", {
      conversation_id: activeConv.id,
      content,
    });
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-paddy-100 bg-white shadow-sm">
      <div className={`w-full border-r border-paddy-100 lg:w-80 lg:block ${showList ? "block" : "hidden"}`}>
        <div className="border-b border-paddy-100 px-4 py-3">
          <h2 className="font-display text-lg font-semibold text-ink">Chats</h2>
          <p className="text-xs text-ink-soft/60">
            {connected ? "Connected" : "Reconnecting..."}
          </p>
        </div>
        <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
          <ConversationList
            conversations={conversations}
            activeId={activeConv?.id}
            onSelect={selectConversation}
            currentUserId={user?.id}
          />
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${showList ? "hidden" : "flex"} lg:flex`}>
        <ChatWindow
          conversation={activeConv}
          messages={messages}
          onSend={sendMessage}
          onBack={() => setShowList(true)}
          loading={messagesLoading}
        />
      </div>
    </div>
  );
}
