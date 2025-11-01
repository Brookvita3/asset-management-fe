import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Asset, AssetCondition } from '../types';
import { toast } from 'sonner@2.0.3';

interface EvaluateAssetDialogProps {
  asset: Asset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EvaluateAssetDialog({ asset, open, onOpenChange }: EvaluateAssetDialogProps) {
  const [condition, setCondition] = useState<AssetCondition>(AssetCondition.GOOD);
  const [notes, setNotes] = useState('');

  const handleEvaluate = () => {
    if (condition !== AssetCondition.GOOD && !notes.trim()) {
      toast.error('Vui lòng nhập ghi chú khi đánh giá tài sản không ở tình trạng tốt');
      return;
    }

    // Here you would normally save to backend
    toast.success(`Đã đánh giá tài sản ${asset.code}`);
    onOpenChange(false);
    setCondition(AssetCondition.GOOD);
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá tài sản</DialogTitle>
          <DialogDescription>
            Đánh giá tình trạng hiện tại của tài sản
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Tài sản</p>
            <p className="text-gray-900">{asset.code} - {asset.name}</p>
          </div>

          <div className="space-y-3">
            <Label>
              Tình trạng <span className="text-red-500">*</span>
            </Label>
            <RadioGroup value={condition} onValueChange={(value) => setCondition(value as AssetCondition)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AssetCondition.GOOD} id="good" />
                <Label htmlFor="good" className="cursor-pointer">
                  <span className="text-gray-900">Tốt</span>
                  <p className="text-sm text-gray-500">Tài sản hoạt động bình thường, không có vấn đề</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AssetCondition.NEEDS_REPAIR} id="repair" />
                <Label htmlFor="repair" className="cursor-pointer">
                  <span className="text-gray-900">Cần sửa chữa</span>
                  <p className="text-sm text-gray-500">Tài sản có vấn đề nhỏ, cần bảo trì hoặc sửa chữa</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AssetCondition.OBSOLETE} id="obsolete" />
                <Label htmlFor="obsolete" className="cursor-pointer">
                  <span className="text-gray-900">Lỗi thời</span>
                  <p className="text-sm text-gray-500">Tài sản đã cũ, không còn phù hợp để sử dụng</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Ghi chú {condition !== AssetCondition.GOOD && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú về tình trạng tài sản..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleEvaluate} className="bg-blue-600">
            Lưu đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
