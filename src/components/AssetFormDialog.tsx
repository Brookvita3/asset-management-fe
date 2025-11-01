import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { mockAssetTypes, mockDepartments } from '../lib/mockData';
import { Asset } from '../types';
import { toast } from 'sonner@2.0.3';

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: Asset | null;
}

export function AssetFormDialog({ open, onOpenChange, asset }: AssetFormDialogProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    typeId: '',
    departmentId: '',
    purchaseDate: '',
    value: '',
    description: '',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (asset && open) {
      setFormData({
        code: asset.code,
        name: asset.name,
        typeId: asset.typeId,
        departmentId: asset.departmentId || '',
        purchaseDate: asset.purchaseDate,
        value: asset.value.toString(),
        description: asset.description,
        image: null,
      });
      setImagePreview(asset.imageUrl || null);
    } else if (!asset && open) {
      // Reset form when creating new
      setFormData({
        code: '',
        name: '',
        typeId: '',
        departmentId: '',
        purchaseDate: '',
        value: '',
        description: '',
        image: null,
      });
      setImagePreview(null);
    }
  }, [asset, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      setFormData({ ...formData, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.code || !formData.name || !formData.typeId || !formData.purchaseDate || !formData.value) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Validate asset code format: ^[A-Z0-9-]+$
    const codeRegex = /^[A-Z0-9-]+$/;
    if (!codeRegex.test(formData.code)) {
      toast.error('Mã tài sản chỉ được chứa chữ in hoa, số và dấu gạch ngang');
      return;
    }

    if (parseFloat(formData.value) <= 0) {
      toast.error('Giá trị tài sản phải lớn hơn 0');
      return;
    }

    // Here you would normally save to backend
    if (asset) {
      // Update existing asset
      toast.success(`Tài sản ${formData.code} đã được cập nhật thành công`);
    } else {
      // Create new asset - status = IN_STOCK, add history entry "CREATED"
      toast.success('Tài sản đã được tạo thành công với trạng thái "Trong kho"');
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{asset ? 'Chỉnh sửa tài sản' : 'Thêm tài sản mới'}</DialogTitle>
          <DialogDescription>
            {asset
              ? 'Cập nhật thông tin tài sản trong hệ thống'
              : 'Điền thông tin để tạo tài sản mới trong hệ thống'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã tài sản <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="VD: LT-001"
                disabled={!!asset}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Tên tài sản <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Dell Latitude 5420"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeId">
                Loại tài sản <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.typeId} onValueChange={(value) => setFormData({ ...formData, typeId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại tài sản" />
                </SelectTrigger>
                <SelectContent>
                  {mockAssetTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentId">Phòng ban</Label>
              <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">
                Ngày mua <span className="text-red-500">*</span>
              </Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                Giá trị (VNĐ) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="VD: 25000000"
              />
            </div>

            {/* <div className="col-span-2 space-y-2">
              <Label htmlFor="image">Hình ảnh</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div> */}

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả chi tiết về tài sản..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600">
              {asset ? 'Cập nhật' : 'Tạo tài sản'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
