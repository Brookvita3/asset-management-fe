import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Bell, MessageSquare, Moon } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  const {
    darkMode,
    sidebarVisible,
    emailNotifications,
    evaluationReminders,
    reminderDaysBefore,
    chatbotEnabled,
    autoSuggestions,
    toggleDarkMode,
    toggleSidebar,
    setEmailNotifications,
    setEvaluationReminders,
    setReminderDaysBefore,
    setChatbotEnabled,
    setAutoSuggestions,
    saveSettings,
  } = useSettings();

  const handleSave = () => {
    saveSettings();
    toast.success('Đã lưu cài đặt thành công');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-gray-50">Cài đặt</h1>
        <p className="text-gray-600 dark:text-gray-400">Quản lý cài đặt hệ thống</p>
      </div>

      <div className="grid gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <CardTitle>Thông báo</CardTitle>
            </div>
            <CardDescription>
              Cấu hình thông báo tự động
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo email</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nhận thông báo qua email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Nhắc nhở đánh giá tài sản</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gửi nhắc nhở khi đến hạn đánh giá</p>
              </div>
              <Switch
                checked={evaluationReminders}
                onCheckedChange={setEvaluationReminders}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Số ngày nhắc trước</Label>
              <Input
                type="number"
                value={reminderDaysBefore}
                onChange={(e) => setReminderDaysBefore(parseInt(e.target.value) || 7)}
                className="max-w-xs"
                min={1}
                max={30}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gửi thông báo nhắc nhở trước X ngày
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Chatbot Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <CardTitle>Chatbot AI</CardTitle>
            </div>
            <CardDescription>
              Cấu hình trợ lý AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Kích hoạt chatbot</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hiển thị chatbot cho người dùng</p>
              </div>
              <Switch
                checked={chatbotEnabled}
                onCheckedChange={setChatbotEnabled}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Tự động gợi ý</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chatbot tự động gợi ý câu hỏi phổ biến</p>
              </div>
              <Switch
                checked={autoSuggestions}
                onCheckedChange={setAutoSuggestions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600" />
              <CardTitle>Giao diện</CardTitle>
            </div>
            <CardDescription>
              Tùy chỉnh giao diện hiển thị
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Chế độ tối</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sử dụng giao diện tối</p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Hiển thị sidebar</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Luôn hiển thị thanh điều hướng</p>
              </div>
              <Switch
                checked={sidebarVisible}
                onCheckedChange={toggleSidebar}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-blue-600" onClick={handleSave}>
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </div>
  );
}
