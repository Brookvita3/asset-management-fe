import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { AssetType } from '../types';
import { toast } from 'sonner@2.0.3';

interface AssetTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetType: AssetType | null;
  onSave: (assetType: Partial<AssetType>) => void;
}

export function AssetTypeFormDialog({
  open,
  onOpenChange,
  assetType,
  onSave,
}: AssetTypeFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (assetType) {
      setFormData({
        name: assetType.name,
        description: assetType.description,
        isActive: assetType.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        isActive: true,
      });
    }
    setErrors({ name: '', description: '' });
  }, [assetType, open]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên loại tài sản';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.description;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    onSave({
      id: assetType?.id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      isActive: formData.isActive,
    });

    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {assetType ? 'Chỉnh sửa loại tài sản' : 'Thêm loại tài sản mới'}
          </DialogTitle>
          <DialogDescription>
            {assetType 
              ? 'Cập nhật thông tin loại tài sản' 
              : 'Điền thông tin để tạo loại tài sản mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên loại tài sản <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Laptop, Màn hình, Bàn làm việc..."
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả chi tiết về loại tài sản..."
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label>Trạng thái hoạt động</Label>
                <p className="text-sm text-gray-500">
                  Cho phép sử dụng loại tài sản này
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600">
              {assetType ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
