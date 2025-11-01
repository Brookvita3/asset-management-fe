import { useState } from 'react';
import { Package, Shield, Users, Briefcase, LogIn, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { UserRole } from '../types';
import { loginAPI } from '../services/authAPI';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: () => void; // Callback after successful login
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoOptions, setShowDemoOptions] = useState(true);

  const loginOptions = [
    {
      role: UserRole.ADMIN,
      title: 'Admin',
      description: 'Quản trị viên hệ thống - Toàn quyền quản lý',
      icon: Shield,
      color: 'blue',
      email: 'admin@company.com',
      password: 'admin123',
    },
    {
      role: UserRole.MANAGER,
      title: 'Manager',
      description: 'Quản lý phòng ban - Quản lý tài sản phòng ban',
      icon: Briefcase,
      color: 'green',
      email: 'manager.it@company.com',
      password: 'manager123',
    },
    {
      role: UserRole.STAFF,
      title: 'Staff',
      description: 'Nhân viên - Xem tài sản được giao',
      icon: Users,
      color: 'purple',
      email: 'staff1@company.com',
      password: 'staff123',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAPI({ email, password });
      
      if (response.message && response.message.includes('success')) {
        toast.success('Đăng nhập thành công!');
        onLogin(); // Notify parent component
      } else {
        setError(response.message || 'Đăng nhập thất bại');
        toast.error('Đăng nhập thất bại');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Lỗi kết nối đến server';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const response = await loginAPI({ email: demoEmail, password: demoPassword });
      
      if (response.message && response.message.includes('success')) {
        toast.success('Đăng nhập thành công!');
        onLogin();
      } else {
        setError(response.message || 'Đăng nhập thất bại');
        toast.error('Đăng nhập thất bại');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Lỗi kết nối đến server';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-gray-900 mb-2">Hệ thống Quản lý Tài sản</h1>
          <p className="text-gray-600">
            {showDemoOptions ? 'Chọn vai trò để đăng nhập vào hệ thống' : 'Đăng nhập vào hệ thống'}
          </p>
        </div>

        {showDemoOptions ? (
          <>
            {/* Demo Login Options */}
            <div className="grid md:grid-cols-3 gap-6">
              {loginOptions.map((option) => {
                const Icon = option.icon;
                const colorClasses = {
                  blue: {
                    bg: 'bg-blue-50',
                    icon: 'text-blue-600',
                    button: 'bg-blue-600 hover:bg-blue-700',
                  },
                  green: {
                    bg: 'bg-green-50',
                    icon: 'text-green-600',
                    button: 'bg-green-600 hover:bg-green-700',
                  },
                  purple: {
                    bg: 'bg-purple-50',
                    icon: 'text-purple-600',
                    button: 'bg-purple-600 hover:bg-purple-700',
                  },
                }[option.color];

                return (
                  <Card
                    key={option.role}
                    className="border-2 hover:border-blue-200 transition-all hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className={`w-16 h-16 ${colorClasses?.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className={`w-8 h-8 ${colorClasses?.icon}`} />
                      </div>
                      <CardTitle>{option.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {option.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <p className="mb-1">Tài khoản demo:</p>
                        <p className="text-xs bg-gray-50 p-2 rounded border border-gray-200">
                          {option.email}
                        </p>
                      </div>
                      <Button
                        className={`w-full ${colorClasses?.button}`}
                        onClick={() => handleDemoLogin(option.email, option.password)}
                        disabled={loading}
                      >
                        {loading ? 'Đang đăng nhập...' : `Đăng nhập với ${option.title}`}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Manual Login Toggle */}
            <div className="text-center mt-8">
              <Button
                variant="ghost"
                onClick={() => setShowDemoOptions(false)}
                className="text-blue-600 hover:text-blue-700"
              >
                Hoặc đăng nhập bằng tài khoản riêng
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Manual Login Form */}
            <Card className="max-w-md mx-auto border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Đăng nhập
                </CardTitle>
                <CardDescription>
                  Nhập email và mật khẩu để đăng nhập vào hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </form>

                <div className="text-center mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowDemoOptions(true)}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Quay lại đăng nhập demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            {showDemoOptions
              ? 'Demo version - Click vào một vai trò để trải nghiệm hệ thống'
              : 'Nhập thông tin đăng nhập của bạn'}
          </p>
        </div>
      </div>
    </div>
  );
}
