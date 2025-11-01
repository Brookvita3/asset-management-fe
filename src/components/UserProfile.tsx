import { useState } from 'react';
import { User, Mail, Building2, Shield, Calendar, Save, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockDepartments } from '../lib/mockData';
import { getRoleLabel } from '../lib/utils';
import { User as UserType } from '../types';
import { toast } from 'sonner@2.0.3';

interface UserProfileProps {
  currentUser: UserType;
  onUpdateProfile: (updatedUser: UserType) => void;
}

export function UserProfile({ currentUser, onUpdateProfile }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const department = mockDepartments.find(d => d.id === currentUser.departmentId);

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const updatedUser: UserType = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
    };

    onUpdateProfile(updatedUser);
    setIsEditing(false);
    toast.success('Cập nhật thông tin thành công');
  };

  const handleCancelEdit = () => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // In a real app, you would call an API here
    toast.success('Đổi mật khẩu thành công');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Thông tin cá nhân</h1>
        <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-blue-600 text-white text-2xl">
                {currentUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-gray-900">{currentUser.name}</h2>
                <Badge className="bg-blue-100 text-blue-700">
                  {getRoleLabel(currentUser.role)}
                </Badge>
                {currentUser.isActive ? (
                  <Badge className="bg-green-100 text-green-700">
                    Hoạt động
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-700">
                    Vô hiệu hóa
                  </Badge>
                )}
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{department?.name || 'Chưa có phòng ban'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Tham gia từ {currentUser.createdAt.toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <Input
                  id="role"
                  value={getRoleLabel(currentUser.role)}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Phòng ban</Label>
                <Input
                  id="department"
                  value={department?.name || 'Chưa có phòng ban'}
                  disabled
                />
              </div>

              <Separator />

              <div className="flex gap-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600">
                    <User className="w-4 h-4 mr-2" />
                    Chỉnh sửa thông tin
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSaveProfile} className="bg-blue-600">
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thay đổi
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Hủy
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>
                Cập nhật mật khẩu của bạn để bảo mật tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <Separator />

              <Button onClick={handleChangePassword} className="bg-blue-600">
                <Lock className="w-4 h-4 mr-2" />
                Đổi mật khẩu
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
