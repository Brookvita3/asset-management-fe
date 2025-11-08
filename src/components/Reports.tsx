import { useEffect, useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
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
import { mockAssets, mockDepartments, mockUsers } from '../lib/mockData';
import { UserRole, AssetStatus, Asset, User } from '../types';
import { formatCurrency, exportToCSV } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { getAssetsAPI } from '../services/assetAPI';
import { getUsersAPI } from '../services/userAPI';
import { getDepartmentsAPI } from '../services/departmentAPI';

export function Reports() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const { currentUser } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState(mockDepartments);


  const fetchData = async () => {
    const [assetsResponse, usersResponse, departmentsResponse]: any = await Promise.all([
      getAssetsAPI(),
      getUsersAPI(),
      getDepartmentsAPI()
    ]);
    setAssets(assetsResponse.data);
    setUsers(usersResponse.data);
    setDepartments(departmentsResponse.data);
    console.log('Current User:', currentUser);
    console.log('All assets:', assets);
    console.log('All users:', users);
    console.log('All departments:', departments);
  }




  useEffect(() => {
    fetchData();
  }, []);


  // Filter assets based on role and selected department
  let reportAssets = currentUser?.role === UserRole.ADMIN
    ? assets
    : assets.filter(a => String(a.departmentId) === currentUser?.departmentId);

  if (selectedDepartment !== 'all') {
    reportAssets = reportAssets.filter(a => a.departmentId === selectedDepartment);
  }

  // Department statistics
  const departmentStats = departments
    .filter(dept =>
      currentUser?.role === UserRole.ADMIN
        ? dept.isActive
        : String(dept.id) === currentUser?.departmentId
    )
    .map(dept => {
      const deptAssets = reportAssets.filter(a => a.departmentId === dept.id);
      const inStock = deptAssets.filter(a => a.status === AssetStatus.IN_STOCK).length;
      const inUse = deptAssets.filter(a => a.status === AssetStatus.IN_USE).length;
      const totalValue = deptAssets.reduce((sum, a) => sum + a.value, 0);

      return {
        id: dept.id,
        name: dept.name,
        total: deptAssets.length,
        inStock,
        inUse,
        value: totalValue,
      };
    });

  // Status distribution
  const statusStats = [
    {
      name: 'Trong kho',
      value: reportAssets.filter(a => a.status === AssetStatus.IN_STOCK).length,
      color: '#3B82F6',
    },
    {
      name: 'Đang sử dụng',
      value: reportAssets.filter(a => a.status === AssetStatus.IN_USE).length,
      color: '#10B981',
    },
  ];

  // Employee assets
  const employeeStats = mockUsers
    .filter(u => {
      if (currentUser?.role === UserRole.ADMIN) return u.isActive;
      return String(u.departmentId) === currentUser?.departmentId && u.isActive;
    })
    .map(user => {
      const userAssets = reportAssets.filter(a => String(a.assignedTo) === user.id);
      const totalValue = userAssets.reduce((sum, a) => sum + a.value, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        department: mockDepartments.find(d => String(d.id) === user.departmentId)?.name || '-',
        assetCount: userAssets.length,
        totalValue,
        assets: userAssets,
      };
    })
    .filter(stat => stat.assetCount > 0);

  const handleExportDepartment = () => {
    const data = departmentStats.map(stat => ({
      'Phòng ban': stat.name,
      'Tổng tài sản': stat.total,
      // 'Trong kho': stat.inStock,
      'Đang sử dụng': stat.inUse,
      'Tổng giá trị': stat.value,
    }));
    exportToCSV(data, 'bao-cao-theo-phong-ban');
  };

  const handleExportEmployee = () => {
    const data = employeeStats.map(stat => ({
      'Nhân viên': stat.name,
      'Email': stat.email,
      'Phòng ban': stat.department,
      'Số tài sản': stat.assetCount,
      'Tổng giá trị': stat.totalValue,
    }));
    exportToCSV(data, 'bao-cao-theo-nhan-vien');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Báo cáo</h1>
          <p className="text-gray-600">Thống kê và báo cáo tài sản</p>
        </div>
        {currentUser?.role === UserRole.ADMIN && (
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phòng ban</SelectItem>
              {mockDepartments.filter(d => d.isActive).map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="department">Theo phòng ban</TabsTrigger>
          <TabsTrigger value="employee">Theo nhân viên</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân bổ theo trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tài sản theo phòng ban</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3B82F6" name="Tổng số" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Department Tab */}
        <TabsContent value="department" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Báo cáo theo phòng ban</CardTitle>
                <Button onClick={handleExportDepartment} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead className="text-right">Tổng tài sản</TableHead>
                    {/* <TableHead className="text-right">Trong kho</TableHead> */}
                    <TableHead className="text-right">Đang sử dụng</TableHead>
                    <TableHead className="text-right">Tổng giá trị</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentStats.map(stat => (
                    <TableRow key={stat.id}>
                      <TableCell className="text-gray-900">{stat.name}</TableCell>
                      <TableCell className="text-right">{stat.total}</TableCell>
                      {/* <TableCell className="text-right">{stat.inStock}</TableCell> */}
                      <TableCell className="text-right">{stat.inUse}</TableCell>
                      <TableCell className="text-right">{formatCurrency(stat.value)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50">
                    <TableCell className="text-gray-900">Tổng cộng</TableCell>
                    <TableCell className="text-right">
                      {departmentStats.reduce((sum, s) => sum + s.total, 0)}
                    </TableCell>
                    {/* <TableCell className="text-right">
                      {departmentStats.reduce((sum, s) => sum + s.inStock, 0)}
                    </TableCell> */}
                    <TableCell className="text-right">
                      {departmentStats.reduce((sum, s) => sum + s.inUse, 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(departmentStats.reduce((sum, s) => sum + s.value, 0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employee Tab */}
        <TabsContent value="employee" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Báo cáo theo nhân viên</CardTitle>
                <Button onClick={handleExportEmployee} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead className="text-right">Số tài sản</TableHead>
                    <TableHead className="text-right">Tổng giá trị</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeStats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Chưa có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    employeeStats.map(stat => (
                      <TableRow key={stat.id}>
                        <TableCell className="text-gray-900">{stat.name}</TableCell>
                        <TableCell>{stat.email}</TableCell>
                        <TableCell>{stat.department}</TableCell>
                        <TableCell className="text-right">{stat.assetCount}</TableCell>
                        <TableCell className="text-right">{formatCurrency(stat.totalValue)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
