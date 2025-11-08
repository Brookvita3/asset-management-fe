import { useState } from 'react';
import { Package, Shield, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { UserRole } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

interface LoginProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
}

export function Login({ onLogin }: LoginProps) {
  const [isSubmitting, setIsSubmitting] = useState<UserRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const loginOptions: LoginCredentials[] = [
    { role: UserRole.ADMIN, email: 'admin@company.com', password: '123456' },
    { role: UserRole.MANAGER, email: 'manager.it@company.com', password: '123456' },
    { role: UserRole.STAFF, email: 'staff1@company.com', password: '123456' },
  ];

  const metadata = {
    [UserRole.ADMIN]: {
      title: 'Quản trị viên',
      description: 'Quản trị viên có quyền truy cập đầy đủ vào nền tảng để quản lý toàn tổ chức.',
      icon: Shield,
      color: 'blue' as const,
    },
    [UserRole.MANAGER]: {
      title: 'Quản lý',
      description: 'Quản lý tài sản và đội ngũ trong phòng ban của bạn.',
      icon: Briefcase,
      color: 'green' as const,
    },
    [UserRole.STAFF]: {
      title: 'Nhân viên',
      description: 'Theo dõi các nhiệm vụ cá nhân và lịch sử tài sản.',
      icon: Users,
      color: 'purple' as const,
    },
  };

  const colorStyles = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', button: 'bg-green-600 hover:bg-green-700' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700' },
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsSubmitting(credentials.role);
      await onLogin(credentials);
    } catch (error: any) {
      const message =
        typeof error?.message === 'string'
          ? error.message
          : 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập của bạn.';
      toast.error(message);
    } finally {
      setIsSubmitting(null);
    }
  };

  // ===============================
  // MAIN RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-gray-900 mb-2 text-xl font-semibold">
            Nền tảng Quản lý Tài sản
          </h1>
          <p className="text-gray-600 text-sm">
            Chọn vai trò để tiếp tục
          </p>
        </div>

        {/* STEP 1: Choose role */}
        {!selectedRole && (
          <div className="space-y-4">
            {loginOptions.map((option) => {
              const { title, icon: Icon, color } = metadata[option.role];
              const palette = colorStyles[color];
              return (
                <Button
                  key={option.role}
                  onClick={() => setSelectedRole(option.role)}
                  className={`w-full flex items-center justify-center gap-2 ${palette.button}`}
                >
                  <Icon className="w-5 h-5" />
                  Tiếp tục với {title}
                </Button>
              );
            })}
          </div>
        )}

        {/* STEP 2: Show login form for selected role */}
        {selectedRole && (() => {
          const option = loginOptions.find((o) => o.role === selectedRole)!;
          const { title, description, icon: Icon, color } = metadata[selectedRole];
          const palette = colorStyles[color];
          const loading = isSubmitting === selectedRole;

          return (
            <Card className="border-2 mt-6 hover:border-blue-200 transition duration-200 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${palette.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${palette.icon}`} />
                  </div>
                  <Button
                    variant="ghost"
                    className="text-gray-500 text-sm"
                    onClick={() => setSelectedRole(null)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Trở lại
                  </Button>
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget as HTMLFormElement);
                    const email = String(fd.get('email') ?? '');
                    const password = String(fd.get('password') ?? '');
                    handleLogin({ role: option.role, email, password });
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={option.email}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                      Mật khẩu
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      defaultValue={option.password}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className={`w-full ${palette.button}`}
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập…' : `Đăng nhập với ${title}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })()}
      </div>
    </div>
  );
}
