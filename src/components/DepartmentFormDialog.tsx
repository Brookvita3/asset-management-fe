import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Department } from '../types';
import { toast } from 'sonner@2.0.3';
import { AlertCircle } from 'lucide-react';
import { mockUsers } from '../lib/mockData';

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

export function DepartmentFormDialog({ open, onOpenChange, department }: DepartmentFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description,
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [department, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên phòng ban');
      return;
    }

    // Check for duplicate department name (in real app, check against API)
    // Here you would normally save to backend
    toast.success(
      department 
        ? 'Phòng ban đã được cập nhật' 
        : 'Phòng ban đã được tạo thành công'
    );
    onOpenChange(false);
  };

  // Check if department has active employees
  const hasActiveEmployees = department 
    ? mockUsers.some(u => u.departmentId === department.id && u.isActive)
    : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {department ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
          </DialogTitle>
          <DialogDescription>
            {department ? 'Cập nhật thông tin phòng ban' : 'Tạo phòng ban mới trong tổ chức'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên phòng ban <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Phòng IT"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về phòng ban..."
                rows={4}
              />
            </div>

            {department && hasActiveEmployees && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Phòng ban này hiện có {department.employeeCount} nhân viên đang hoạt động.
                  Không thể vô hiệu hóa phòng ban khi còn nhân viên hoạt động.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600">
              {department ? 'Cập nhật' : 'Tạo phòng ban'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
