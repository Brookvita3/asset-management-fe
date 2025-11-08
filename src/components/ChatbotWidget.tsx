import { useState, useEffect, useRef, Fragment } from "react";
import { MessageCircle, X, Send, Loader2, GripVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChatMessage } from "../types";
import { sendChatMessageAPI, loadChatHistoryAPI } from "../services/chatbotAPI";
import { createPortal } from "react-dom";
import { useAuth } from "../contexts/AuthContext";

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
  
  // Resizable state
  const [size, setSize] = useState({ width: 384, height: 500 }); // 384px = w-96
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);

  const { currentUser } = useAuth();

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

  // Handle resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return;

      const deltaX = resizeRef.current.startX - e.clientX;
      const deltaY = e.clientY - resizeRef.current.startY;

      const newWidth = Math.max(300, Math.min(800, resizeRef.current.startWidth + deltaX));
      const newHeight = Math.max(400, Math.min(800, resizeRef.current.startHeight + deltaY));

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Load chat history when widget opens
  useEffect(() => {
    if (isOpen) {
      const initializeChat = async () => {
        try {
          const response: any = await loadChatHistoryAPI(
            currentUser?.id || "1"
          );
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
      const response: any = await sendChatMessageAPI(
        input,
        currentUser?.id || "1"
      );

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
        <div 
          className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 z-50"
          style={{ 
            width: `${size.width}px`, 
            height: `${size.height}px`,
            minWidth: '300px',
            minHeight: '400px',
            maxWidth: '800px',
            maxHeight: '800px',
            userSelect: isResizing ? 'none' : 'auto',
          }}
        >
          {/* Resize Handle - Top Left */}
          <div
            onMouseDown={handleMouseDown}
            className="absolute -top-1 -left-1 w-8 h-8 cursor-nw-resize hover:bg-blue-100 rounded-tl-lg flex items-center justify-center group z-10"
            title="Kéo để thay đổi kích thước"
          >
            <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-blue-600 rotate-45" />
          </div>

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
                    <p className="text-sm whitespace-pre-line break-words overflow-x-auto">
                      {renderWithBreaks(normalizeText(message.content))}
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

export function normalizeText(s?: string): string {
  if (!s) return "";
  let out = s.trim(); // loại bỏ khoảng trắng ở đầu/cuối nếu có

  // ------------------------------------------------------------
  // 1. Thử unstringify nếu backend trả về chuỗi dạng "\"abc\nxyz\""
  // ------------------------------------------------------------
  try {
    if (
      (out.startsWith('"') && out.endsWith('"')) ||
      out.includes("\\n") ||
      out.includes("\\u")
    ) {
      const parsed = JSON.parse(out);
      if (typeof parsed === "string") out = parsed;
    }
  } catch {
    // ignore parse fail
  }

  // ------------------------------------------------------------
  // 2. Chuyển escape newline thành newline thật
  // ------------------------------------------------------------
  out = out
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n");

  // ------------------------------------------------------------
  // 3. Loại bỏ **xuống dòng đầu nội dung**
  //    Ví dụ: "\n\nXin chào" → "Xin chào"
  // ------------------------------------------------------------
  out = out.replace(/^\n+/, "");

  // ------------------------------------------------------------
  // 4. Trim lại cuối để tránh dư một ký tự xuống dòng
  // ------------------------------------------------------------
  out = out.trimEnd();

  console.log("Normalized text:", JSON.stringify(out));
  return out;
}

function renderWithBreaks(text?: string) {
  if (!text) return null;
  return text.split(/\r?\n/).map((line, i, arr) => (
    <Fragment key={i}>
      {line === "" ? <>&nbsp;</> : line}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ));
}
