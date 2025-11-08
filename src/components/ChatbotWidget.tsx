import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChatMessage } from "../types";
import { sendChatMessageAPI, loadChatHistoryAPI } from "../services/chatbotAPI";
import { createPortal } from "react-dom";

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
      <div className="flex space-x-2">
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  </div>
);

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const USER_ID = 1; // Hardcoded for demo purposes

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Load chat history when widget opens
  useEffect(() => {
    if (isOpen) {
      const initializeChat = async () => {
        try {
          const response: any = await loadChatHistoryAPI(USER_ID);
          const history = response.data;

          if (history && history.length > 0) {
            // Convert ChatHistoryResponse to ChatMessage format
            const chatMessages: ChatMessage[] = history.map((msg: any) => ({
              id: msg.id.toString(),
              role: msg.direction === "QUESTION" ? "user" : "assistant",
              content: msg.content,
              timestamp: new Date(msg.timestamp),
            }));
            // Sort by timestamp to ensure correct order (oldest first)
            chatMessages.sort(
              (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
            );
            setMessages(chatMessages);
          } else {
            // Default welcome message if no history
            setMessages([
              {
                id: "1",
                role: "assistant",
                content: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp bạn gì?",
                timestamp: new Date(),
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to load chat history:", error);
          setError("Không thể tải lịch sử chat. Vui lòng thử lại sau.");
          // Set default message on error
          setMessages([
            {
              id: "1",
              role: "assistant",
              content: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp bạn gì?",
              timestamp: new Date(),
            },
          ]);
        }
      };

      initializeChat();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response: any = await sendChatMessageAPI(input, USER_ID);

      if (response.data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.answer,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Xin lỗi, có lỗi xảy ra: ${response.message}`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      setError("Không thể gửi tin nhắn. Vui lòng thử lại sau.");

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Xin lỗi, có lỗi kết nối với server. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed top-1/2 bottom-6 right-6 w-96 h-[500px] max-h-[50vh] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Trợ lý AI</h3>
                <p className="text-xs opacity-90">Hỗ trợ 24/7</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 break-words ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t flex-shrink-0">
            {/* Error Display */}
            {error && (
              <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
