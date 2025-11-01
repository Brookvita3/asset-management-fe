import { useState } from 'react';
import { Plus, Search, Edit, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { mockRoles } from '../lib/mockData';
import { RoleFormDialog } from './RoleFormDialog';
import { Role } from '../types';

export function RoleManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  let filteredRoles = mockRoles;

  if (searchTerm) {
    filteredRoles = filteredRoles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedRole(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Quản lý Vai trò</h1>
          <p className="text-gray-600">Quản lý vai trò và phân quyền hệ thống</p>
        </div>
        <Button className="bg-blue-600" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm vai trò
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên vai trò</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Số quyền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-gray-900">{role.name}</span>
                        {role.isDefault && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Mặc định
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-gray-600 truncate">{role.description}</p>
                  </TableCell>
                  <TableCell>{role.permissions.length} quyền</TableCell>
                  <TableCell>
                    <Badge className={role.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {role.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(role)}
                      disabled={role.isDefault && !role.isActive}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RoleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={selectedRole}
      />
    </div>
  );
}
