import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, Smile } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onEndSession: () => void;
  sessionId: string;
}

export default function ChatOverlay({ isOpen, onClose, onEndSession, sessionId }: ChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const startChatMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest("POST", "/api/chat/start", { sessionId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.chatSession) {
        const initialMessages = JSON.parse(data.chatSession.messages);
        setMessages(initialMessages);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal memulai sesi chat. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ sessionId, message }: { sessionId: string; message: string }) => {
      const response = await apiRequest("POST", "/api/chat/message", { sessionId, message });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.messages) {
        setMessages(data.messages);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  });

  const endSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest("POST", "/api/chat/end", { sessionId });
      return response.json();
    },
    onSuccess: () => {
      onEndSession();
    }
  });

  useEffect(() => {
    if (isOpen && sessionId && messages.length === 0) {
      startChatMutation.mutate(sessionId);
    }
  }, [isOpen, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    const message = inputMessage.trim();
    if (!message || sendMessageMutation.isPending) return;

    setInputMessage("");
    sendMessageMutation.mutate({ sessionId, message });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-auto chat-animation">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Smile className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">AI Pendamping</h3>
              <p className="text-sm text-muted-foreground">Siap mendengarkan Anda</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-close-chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              {message.isUser ? (
                <div className="flex-1 flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-xs">
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="text-primary text-sm" size={16} />
                  </div>
                  <div className="bg-muted rounded-lg p-3 max-w-xs">
                    <p className="text-muted-foreground text-sm">{message.text}</p>
                  </div>
                </>
              )}
            </div>
          ))}
          {sendMessageMutation.isPending && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-primary text-sm" size={16} />
              </div>
              <div className="bg-muted rounded-lg p-3 max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-border">
          <div className="flex space-x-3">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan Anda di sini..."
              className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-testid="input-chat-message"
              disabled={sendMessageMutation.isPending}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sendMessageMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-send-message"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-xs text-muted-foreground">AI ini tidak menggantikan konsultasi profesional</p>
            <button 
              onClick={() => endSessionMutation.mutate(sessionId)}
              className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
              data-testid="button-end-session"
              disabled={endSessionMutation.isPending}
            >
              Akhiri Sesi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
