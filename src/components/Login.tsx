import { useState } from 'react';
import { Package, Shield, Users, Briefcase } from 'lucide-react';
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

  const loginOptions: LoginCredentials[] = [
    {
      role: UserRole.ADMIN,
      email: 'admin@company.com',
      password: '123456',
    },
    {
      role: UserRole.MANAGER,
      email: 'manager.it@company.com',
      password: '123456',
    },
    {
      role: UserRole.STAFF,
      email: 'staff1@company.com',
      password: '123456',
    },
  ];

  const metadata = {
    [UserRole.ADMIN]: {
      title: 'Administrator',
      description: 'Full platform access for organisation-wide management.',
      icon: Shield,
      color: 'blue' as const,
    },
    [UserRole.MANAGER]: {
      title: 'Manager',
      description: 'Manage assets and teams within your department.',
      icon: Briefcase,
      color: 'green' as const,
    },
    [UserRole.STAFF]: {
      title: 'Staff',
      description: 'Track personal assignments and asset history.',
      icon: Users,
      color: 'purple' as const,
    },
  };

  const colorStyles = {
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
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsSubmitting(credentials.role);
      await onLogin(credentials);
    } catch (error: any) {
      const message =
        typeof error?.message === 'string'
          ? error.message
          : 'Sign-in failed. Please verify your credentials.';
      toast.error(message);
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-gray-900 mb-2">Asset Management Platform</h1>
          <p className="text-gray-600">
            Choose a demo role to sign in or adapt this screen to your authentication strategy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loginOptions.map((option) => {
            const { title, description, icon: Icon, color } = metadata[option.role];
            const palette = colorStyles[color];
            const loading = isSubmitting === option.role;

            return (
              <Card
                key={option.role}
                className="border-2 hover:border-blue-200 transition duration-200 hover:shadow-lg"
              >
                <CardHeader>
                  <div className={`w-16 h-16 ${palette.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${palette.icon}`} />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="text-sm">{description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="mb-1 font-medium text-gray-700">Demo credential</p>
                    <p className="text-xs bg-gray-50 p-2 rounded border border-gray-200">
                      {option.email} / {option.password}
                    </p>
                  </div>
                  <Button
                    className={`w-full ${palette.button}`}
                    onClick={() => handleLogin(option)}
                    disabled={loading}
                  >
                    {loading ? 'Signing in…' : `Continue as ${title}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Need real authentication? Replace this screen with your identity provider.</p>
        </div>
      </div>
    </div>
  );
}
