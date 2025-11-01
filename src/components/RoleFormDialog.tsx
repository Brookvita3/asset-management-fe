import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { mockPermissions } from '../lib/mockData';
import { Role, PermissionCategory } from '../types';
import { toast } from 'sonner@2.0.3';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

export function RoleFormDialog({ open, onOpenChange, role }: RoleFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: [],
        isActive: true,
      });
    }
  }, [role, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên vai trò');
      return;
    }

    if (formData.permissions.length === 0) {
      toast.error('Vui lòng chọn ít nhất một quyền');
      return;
    }

    // Check for duplicate role name (in real app, check against API)
    // Here you would normally save to backend
    toast.success(role ? 'Vai trò đã được cập nhật' : 'Vai trò đã được tạo thành công');
    onOpenChange(false);
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const toggleCategoryPermissions = (category: PermissionCategory) => {
    const categoryPermissions = mockPermissions
      .filter(p => p.category === category)
      .map(p => p.id);
    
    const allSelected = categoryPermissions.every(id => 
      formData.permissions.includes(id)
    );

    if (allSelected) {
      // Unselect all in category
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !categoryPermissions.includes(id))
      }));
    } else {
      // Select all in category
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermissions])]
      }));
    }
  };

  const getCategoryLabel = (category: PermissionCategory): string => {
    const labels = {
      [PermissionCategory.USERS]: 'Quản lý Người dùng',
      [PermissionCategory.ASSETS]: 'Quản lý Tài sản',
      [PermissionCategory.DEPARTMENTS]: 'Quản lý Phòng ban',
      [PermissionCategory.REPORTS]: 'Báo cáo',
      [PermissionCategory.SETTINGS]: 'Cài đặt',
    };
    return labels[category];
  };

  const categories = Object.values(PermissionCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}</DialogTitle>
          <DialogDescription>
            {role ? 'Cập nhật thông tin vai trò và phân quyền' : 'Tạo vai trò mới và cấu hình quyền hạn'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên vai trò <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Manager"
                  disabled={role?.isDefault}
                />
                {role?.isDefault && (
                  <p className="text-sm text-gray-500">
                    Vai trò mặc định không thể thay đổi tên
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả vai trò và trách nhiệm..."
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Permissions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>
                  Quyền hạn <span className="text-red-500">*</span>
                </Label>
                <span className="text-sm text-gray-600">
                  Đã chọn: {formData.permissions.length} quyền
                </span>
              </div>

              {role?.isDefault ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Vai trò mặc định "Admin" có toàn quyền và không thể thay đổi.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4 border rounded-lg p-4 max-h-96 overflow-y-auto">
                  {categories.map(category => {
                    const categoryPerms = mockPermissions.filter(p => p.category === category);
                    const allSelected = categoryPerms.every(p => 
                      formData.permissions.includes(p.id)
                    );

                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={allSelected}
                            onCheckedChange={() => toggleCategoryPermissions(category)}
                          />
                          <Label 
                            htmlFor={`category-${category}`}
                            className="cursor-pointer"
                          >
                            {getCategoryLabel(category)}
                          </Label>
                        </div>

                        <div className="ml-6 space-y-2">
                          {categoryPerms.map(permission => (
                            <div key={permission.id} className="flex items-start gap-2">
                              <Checkbox
                                id={permission.id}
                                checked={formData.permissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                              />
                              <div className="flex-1">
                                <Label 
                                  htmlFor={permission.id}
                                  className="cursor-pointer"
                                >
                                  {permission.name}
                                </Label>
                                <p className="text-sm text-gray-500">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {category !== categories[categories.length - 1] && (
                          <Separator className="my-3" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600">
              {role ? 'Cập nhật' : 'Tạo vai trò'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
