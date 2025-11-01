import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { ChatMessage } from '../types';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API configuration
  const API_BASE_URL = 'http://localhost:8080';
  const USER_ID = 1; // Hardcoded for demo purposes

  // API call functions
  const sendChatMessage = async (message: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/chat?userId=${USER_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: USER_ID,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data; // Return ChatbotResponse
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/history?userId=${USER_ID}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data; // Return List<ChatHistoryResponse>
    } catch (error) {
      console.error('Error loading chat history:', error);
      throw error;
    }
  };

  // Load chat history when widget opens
  useEffect(() => {
    if (isOpen) {
      const initializeChat = async () => {
        try {
          const history = await loadChatHistory();

          if (history && history.length > 0) {
            // Convert ChatHistoryResponse to ChatMessage format
            const chatMessages: ChatMessage[] = history.map((msg: any) => ({
              id: msg.id.toString(),
              role: msg.direction === 'QUESTION' ? 'user' : 'assistant',
              content: msg.content,
              timestamp: new Date(msg.timestamp),
            }));
            setMessages(chatMessages);
          } else {
            // Default welcome message if no history
            setMessages([{
              id: '1',
              role: 'assistant',
              content: 'Xin chào! Tôi là trợ lý AI của hệ thống Quản lý Tài sản. Tôi có thể giúp bạn:\n\n• Hướng dẫn cách tạo tài sản mới\n• Hướng dẫn gán tài sản cho nhân viên\n• Hướng dẫn đánh giá tài sản\n• Giải thích các quy trình và chính sách\n\nBạn cần hỗ trợ gì?',
              timestamp: new Date(),
            }]);
          }
        } catch (error) {
          console.error('Failed to load chat history:', error);
          setError('Không thể tải lịch sử chat. Vui lòng thử lại sau.');
          // Set default message on error
          setMessages([{
            id: '1',
            role: 'assistant',
            content: 'Xin chào! Tôi là trợ lý AI của hệ thống Quản lý Tài sản. Tôi có thể giúp bạn:\n\n• Hướng dẫn cách tạo tài sản mới\n• Hướng dẫn gán tài sản cho nhân viên\n• Hướng dẫn đánh giá tài sản\n• Giải thích các quy trình và chính sách\n\nBạn cần hỗ trợ gì?',
            timestamp: new Date(),
          }]);
        }
      };

      initializeChat();
    }
  }, [isOpen]);

  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(input);

      if (response.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.answer,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Xin lỗi, có lỗi xảy ra: ${response.message}`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
      setError('Không thể gửi tin nhắn. Vui lòng thử lại sau.');

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, có lỗi kết nối với server. Vui lòng thử lại sau.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <div>
                <h3>Trợ lý AI</h3>
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
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>  
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            {/* Error Display */}
            {error && (
              <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="bg-blue-600"
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
    </>
  );
}
