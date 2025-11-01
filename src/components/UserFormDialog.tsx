import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { mockDepartments, mockRoles } from '../lib/mockData';
import { User, UserRole } from '../types';
import { toast } from 'sonner@2.0.3';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.STAFF,
    departmentId: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
      });
      setStep(1);
    } else {
      setFormData({
        name: '',
        email: '',
        role: UserRole.STAFF,
        departmentId: '',
      });
      setStep(1);
    }
  }, [user, open]);

  // Dynamically determine steps based on role
  // For all roles, we now have 2 steps: Basic Info and Role (with department in role step)
  const steps = [
    { id: 1, name: 'Thông tin cơ bản' },
    { id: 2, name: 'Vai trò & Phòng ban' },
  ];
  
  const maxStep = steps.length;
  
  console.log('UserFormDialog render - step:', step, 'maxStep:', maxStep, 'step < maxStep:', step < maxStep);

  // Reset step if current step exceeds maxStep (e.g., when changing from Manager to Admin at step 3)
  useEffect(() => {
    if (step > maxStep) {
      setStep(maxStep);
    }
  }, [step, maxStep]);

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (!formData.name.trim()) {
          toast.error('Vui lòng nhập họ tên');
          return false;
        }
        if (!formData.email.trim()) {
          toast.error('Vui lòng nhập email');
          return false;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error('Email không hợp lệ');
          return false;
        }
        return true;
      case 2:
        if (!formData.role) {
          toast.error('Vui lòng chọn vai trò');
          return false;
        }
        // Department is required for Manager and Staff
        if (formData.role !== UserRole.ADMIN && !formData.departmentId) {
          toast.error('Vui lòng chọn phòng ban');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    console.log('handleNext called, current step:', step, 'maxStep:', maxStep);
    if (validateStep(step)) {
      console.log('Validation passed, moving to step:', step + 1);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(step)) {
      return;
    }

    // Here you would normally save to backend
    if (user) {
      toast.success('Người dùng đã được cập nhật');
    } else {
      toast.success('Người dùng đã được tạo thành công. Email kích hoạt đã được gửi.');
    }
    
    onOpenChange(false);
  };

  const getRoleLabel = (role: UserRole): string => {
    const labels = {
      [UserRole.ADMIN]: 'Quản trị viên',
      [UserRole.MANAGER]: 'Quản lý',
      [UserRole.STAFF]: 'Nhân viên',
    };
    return labels[role];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</DialogTitle>
          <DialogDescription>
            {user ? 'Cập nhật thông tin người dùng trong hệ thống' : 'Tạo tài khoản người dùng mới và gửi email kích hoạt'}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                    step > s.id
                      ? 'bg-blue-600 border-blue-600'
                      : step === s.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-gray-300 text-gray-400'
                  )}
                >
                  {step > s.id ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={step === s.id ? 'text-blue-600' : 'text-gray-400'}>
                      {s.id}
                    </span>
                  )}
                </div>
                <span className="text-sm mt-2 text-gray-600">{s.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-colors',
                    step > s.id ? 'bg-blue-600' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} onKeyDown={(e) => {
          if (e.key === 'Enter' && step < maxStep) {
            e.preventDefault();
            handleNext();
          }
        }}>
          <div className="py-4 min-h-[300px] max-h-[500px] overflow-y-auto">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nguyen.van.a@company.com"
                    disabled={!!user}
                  />
                  {user && (
                    <p className="text-sm text-gray-500">
                      Email không thể thay đổi
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Role */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="role">
                    Vai trò <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => {
                      const newRole = value as UserRole;
                      // Clear department if changing to Admin (Admin doesn't need department)
                      if (newRole === UserRole.ADMIN) {
                        setFormData({ ...formData, role: newRole, departmentId: '' });
                      } else {
                        setFormData({ ...formData, role: newRole });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserRole).map(role => (
                        <SelectItem key={role} value={role}>
                          {getRoleLabel(role)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Department selection for Manager and Staff */}
                {formData.role !== UserRole.ADMIN && (
                  <div className="space-y-2 border-t pt-4">
                    <Label htmlFor="department" className="text-base">
                      Phòng ban <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.departmentId} 
                      onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phòng ban" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDepartments.filter(d => d.isActive).map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.departmentId && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-2">
                        {(() => {
                          const dept = mockDepartments.find(d => d.id === formData.departmentId);
                          return dept ? (
                            <div className="text-sm text-gray-700 space-y-1">
                              <p><span className="text-gray-600">Mô tả:</span> {dept.description}</p>
                              <p><span className="text-gray-600">Số nhân viên:</span> {dept.employeeCount}</p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm text-blue-900 mb-2">Quyền hạn của vai trò:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {formData.role === UserRole.ADMIN && (
                      <>
                        <li>• Toàn quyền quản lý hệ thống</li>
                        <li>• Quản lý người dùng, phòng ban, vai trò</li>
                        <li>• Xem và quản lý tất cả tài sản</li>
                        <li>• Truy cập báo cáo toàn hệ thống</li>
                        <li className="text-blue-600">• Admin không cần thuộc phòng ban cụ thể</li>
                      </>
                    )}
                    {formData.role === UserRole.MANAGER && (
                      <>
                        <li>• Quản lý tài sản trong phòng ban</li>
                        <li>• Gán và thu hồi tài sản</li>
                        <li>• Đánh giá tình trạng tài sản</li>
                        <li>• Xem báo cáo phòng ban</li>
                      </>
                    )}
                    {formData.role === UserRole.STAFF && (
                      <>
                        <li>• Xem tài sản được giao</li>
                        <li>• Xem thông tin phòng ban</li>
                        <li>• Xem báo cáo cá nhân</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}


          </div>

          <DialogFooter className="gap-2">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            {step < maxStep ? (
              <Button 
                type="button" 
                className="bg-blue-600" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Next button clicked');
                  handleNext();
                }}
              >
                Tiếp theo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" className="bg-blue-600">
                {user ? 'Cập nhật' : 'Tạo người dùng'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
