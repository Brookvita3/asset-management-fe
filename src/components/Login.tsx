import { Package, Shield, Users, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export function Login({ onLogin }: LoginProps) {
  const loginOptions = [
    {
      role: UserRole.ADMIN,
      title: 'Admin',
      description: 'Quản trị viên hệ thống - Toàn quyền quản lý',
      icon: Shield,
      color: 'blue',
      email: 'admin@company.com',
    },
    {
      role: UserRole.MANAGER,
      title: 'Manager',
      description: 'Quản lý phòng ban - Quản lý tài sản phòng ban',
      icon: Briefcase,
      color: 'green',
      email: 'manager.it@company.com',
    },
    {
      role: UserRole.STAFF,
      title: 'Staff',
      description: 'Nhân viên - Xem tài sản được giao',
      icon: Users,
      color: 'purple',
      email: 'staff1@company.com',
    },
  ];

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
            Chọn vai trò để đăng nhập vào hệ thống
          </p>
        </div>

        {/* Login Options */}
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
                  <div className={`w-16 h-16 ${colorClasses.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${colorClasses.icon}`} />
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
                    className={`w-full ${colorClasses.button}`}
                    onClick={() => onLogin(option.role)}
                  >
                    Đăng nhập với {option.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Demo version - Click vào một vai trò để trải nghiệm hệ thống</p>
        </div>
      </div>
    </div>
  );
}
