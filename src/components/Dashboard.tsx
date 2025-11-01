import { Package, Users, Building2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  mockAssets,
  mockUsers,
  mockDepartments
} from '../lib/mockData';
import { AssetStatus, UserRole } from '../types';
import { formatCurrency, getStatusLabel, getStatusColor } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export function Dashboard() {
  const { currentUser } = useAuth();

  // Filter assets based on user role
  const userAssets = !currentUser ? [] :
    currentUser.role === UserRole.ADMIN
      ? mockAssets
      : currentUser.role === UserRole.MANAGER
        ? mockAssets.filter(a => a.departmentId === currentUser.departmentId)
        : mockAssets.filter(a => a.assignedTo === currentUser.id);

  const totalAssets = userAssets.length;
  const totalValue = userAssets.reduce((sum, asset) => sum + asset.value, 0);
  const inStockCount = userAssets.filter(a => a.status === AssetStatus.IN_STOCK).length;
  const inUseCount = userAssets.filter(a => a.status === AssetStatus.IN_USE).length;

  // Department stats
  const departmentStats = mockDepartments
    .filter(dept => dept.isActive)
    .map(dept => {
      const deptAssets = mockAssets.filter(a => a.departmentId === dept.id);
      return {
        name: dept.name,
        assets: deptAssets.length,
        value: deptAssets.reduce((sum, a) => sum + a.value, 0),
      };
    });

  // Status distribution
  const statusData = [
    { name: 'Trong kho', value: inStockCount, color: '#3B82F6' },
    { name: 'Đang sử dụng', value: inUseCount, color: '#10B981' },
  ];

  // Recent assets
  const recentAssets = [...userAssets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-gray-50">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Tổng quan quản lý tài sản</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Tổng tài sản</CardTitle>
            <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 dark:text-gray-50">{totalAssets}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {currentUser?.role === UserRole.STAFF ? 'Được giao cho bạn' : 'Trong hệ thống'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Tổng giá trị</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 dark:text-gray-50">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Tổng giá trị tài sản</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Trong kho</CardTitle>
            <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 dark:text-gray-50">{inStockCount}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Chưa gán cho ai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Đang sử dụng</CardTitle>
            <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 dark:text-gray-50">{inUseCount}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Đã gán cho nhân viên</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Stats */}
        {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.MANAGER) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-50">Tài sản theo phòng ban</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="assets" fill="#3B82F6" name="Số lượng" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-50">Phân bổ theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-50">Tài sản mới nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAssets.map((asset) => {
              const assignedUser = mockUsers.find(u => u.id === asset.assignedTo);
              const department = mockDepartments.find(d => d.id === asset.departmentId);

              return (
                <div key={asset.id} className="flex items-center justify-between py-3 border-b last:border-b-0 dark:border-gray-800">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-gray-50">{asset.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{asset.code}</p>
                          {department && (
                            <>
                              <span className="text-gray-400 dark:text-gray-600">•</span>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{department.name}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(asset.status)}>
                      {getStatusLabel(asset.status)}
                    </Badge>
                    {assignedUser && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{assignedUser.name}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
