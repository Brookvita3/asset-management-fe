import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  BarChart3,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  Layers,
} from 'lucide-react';
import { NotificationBell } from './NotificationBell';
import { ChatbotWidget } from './ChatbotWidget';
import { Avatar, AvatarFallback } from './ui/avatar';
import { UserRole, User as UserType } from '../types';
import { getRoleLabel } from '../lib/utils';
import { useSettings } from '../contexts/SettingsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
  currentUser: UserType;
  onLogout: () => void;
}

export function Layout({ children, currentUser, onLogout }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarVisible, chatbotEnabled } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync local state with settings context
  useEffect(() => {
    setSidebarOpen(sidebarVisible);
  }, [sidebarVisible]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { name: 'Tài sản', href: '/assets', icon: Package, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { name: 'Loại tài sản', href: '/asset-types', icon: Layers, roles: [UserRole.ADMIN] },
    { name: 'Người dùng', href: '/users', icon: Users, roles: [UserRole.ADMIN] },
    { name: 'Phòng ban', href: '/departments', icon: Building2, roles: [UserRole.ADMIN] },
    { name: 'Báo cáo', href: '/reports', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { name: 'Cài đặt', href: '/settings', icon: Settings, roles: [UserRole.ADMIN] },
  ];

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(currentUser.role)
  );

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5 dark:text-gray-300" /> : <Menu className="w-5 h-5 dark:text-gray-300" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 dark:text-gray-50">Quản lý Tài sản</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getRoleLabel(currentUser.role)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors">
                  <div className="text-right">
                    <p className="text-sm text-gray-900 dark:text-gray-50">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                  </div>
                  <Avatar>
                    <AvatarFallback className="bg-blue-600 text-white">
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="text-gray-900 dark:text-gray-50">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{getRoleLabel(currentUser.role)}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="w-4 h-4 mr-2" />
                  Thông tin cá nhân
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutClick} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <nav className="p-4 space-y-1">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-0'
          }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Chatbot Widget */}
      {chatbotEnabled && <ChatbotWidget />}
    </div>
  );
}
