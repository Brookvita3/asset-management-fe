import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { ChatMessage } from '../types';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI của hệ thống Quản lý Tài sản. Tôi có thể giúp bạn:\n\n• Hướng dẫn cách tạo tài sản mới\n• Hướng dẫn gán tài sản cho nhân viên\n• Hướng dẫn đánh giá tài sản\n• Giải thích các quy trình và chính sách\n\nBạn cần hỗ trợ gì?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const knowledgeBase = {
    'tạo tài sản': 'Để tạo tài sản mới:\n1. Vào menu "Tài sản"\n2. Nhấn nút "Thêm tài sản mới"\n3. Điền đầy đủ thông tin: Tên, Mã, Loại tài sản, Ngày mua, Giá trị\n4. Mã tài sản phải là duy nhất\n5. Giá trị phải lớn hơn 0\n6. Nhấn "Lưu" để hoàn tất',
    'gán tài sản': 'Để gán tài sản cho nhân viên:\n1. Vào danh sách tài sản\n2. Chọn tài sản có trạng thái "Trong kho"\n3. Nhấn nút "Gán"\n4. Chọn nhân viên trong phòng ban của bạn\n5. Xác nhận gán\n\nLưu ý: Chỉ Manager và Admin mới có quyền gán tài sản.',
    'thu hồi tài sản': 'Để thu hồi tài sản:\n1. Tìm tài sản đang sử dụng\n2. Nhấn nút "Thu hồi"\n3. Nhập lý do thu hồi (nếu cần)\n4. Xác nhận\n\nTài sản sẽ chuyển về trạng thái "Trong kho".',
    'đánh giá tài sản': 'Để đánh giá tài sản:\n1. Chọn tài sản cần đánh giá\n2. Nhấn "Đánh giá"\n3. Chọn tình trạng: Tốt / Cần sửa / Lỗi thời\n4. Nhập ghi chú (bắt buộc nếu không phải "Tốt")\n5. Lưu đánh giá\n\nĐánh giá được khuyến nghị thực hiện hàng năm.',
    'báo cáo': 'Hệ thống cung cấp các loại báo cáo:\n\n1. Báo cáo theo phòng ban: Thống kê số lượng và giá trị tài sản\n2. Báo cáo theo trạng thái: Phân bổ tài sản theo trạng thái\n3. Báo cáo theo nhân viên: Chi tiết tài sản từng người\n\nBạn có thể xuất báo cáo ra file CSV.',
    'phân quyền': 'Hệ thống có 3 vai trò:\n\n• Admin: Toàn quyền quản trị hệ thống\n• Manager: Quản lý tài sản trong phòng ban\n• Staff: Xem tài sản được giao\n\nMỗi vai trò có quyền hạn riêng biệt.',
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simple keyword matching
    const lowerInput = input.toLowerCase();
    let response = 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về:\n• Cách tạo tài sản\n• Cách gán tài sản\n• Cách thu hồi tài sản\n• Cách đánh giá tài sản\n• Báo cáo\n• Phân quyền';

    for (const [keyword, answer] of Object.entries(knowledgeBase)) {
      if (lowerInput.includes(keyword)) {
        response = answer;
        break;
      }
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);

    setInput('');
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
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" className="bg-blue-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
