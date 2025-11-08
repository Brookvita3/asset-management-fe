import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Asset, AssetCondition } from "../types";
import { toast } from "sonner";

interface EvaluateAssetDialogProps {
  asset: Asset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEvaluate: (payload: { condition: AssetCondition; notes?: string }) => Promise<void>;
  isSubmitting?: boolean;
}

export function EvaluateAssetDialog({
  asset,
  open,
  onOpenChange,
  onEvaluate,
  isSubmitting = false,
}: EvaluateAssetDialogProps) {
  const [condition, setCondition] = useState<AssetCondition>(AssetCondition.GOOD);
  const [notes, setNotes] = useState("");

  const handleEvaluate = async () => {
    if (condition !== AssetCondition.GOOD && !notes.trim()) {
      toast.error("Vui lòng nhập ghi chú khi đánh giá khác 'Tốt'.");
      return;
    }

    await onEvaluate({ condition, notes: notes.trim() || undefined });
    setCondition(AssetCondition.GOOD);
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !isSubmitting && onOpenChange(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá tài sản</DialogTitle>
          <DialogDescription>
            Đánh giá tình trạng hiện tại của tài sản.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Tài sản</p>
            <p className="text-gray-900">
              {asset.code} - {asset.name}
            </p>
          </div>

          <div className="space-y-3">
            <Label>
              Tình trạng <span className="text-red-500">*</span>
            </Label>
            <RadioGroup value={condition} onValueChange={(value) => setCondition(value as AssetCondition)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AssetCondition.GOOD} id="condition-good" />
                <Label htmlFor="condition-good" className="cursor-pointer">
                  <span className="text-gray-900">Tốt</span>
                  <p className="text-sm text-gray-500">
                    Tài sản hoạt động bình thường.
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AssetCondition.NEEDS_REPAIR} id="condition-repair" />
                <Label htmlFor="condition-repair" className="cursor-pointer">
                  <span className="text-gray-900">Cần sửa chữa</span>
                  <p className="text-sm text-gray-500">
                    Cần bảo trì hoặc sửa chữa trong thời gian sớm.
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={AssetCondition.OBSOLETE} id="condition-obsolete" />
                <Label htmlFor="condition-obsolete" className="cursor-pointer">
                  <span className="text-gray-900">Lỗi thời</span>
                  <p className="text-sm text-gray-500">
                    Tài sản không còn phù hợp để sử dụng.
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluation-notes">
              Ghi chú {condition !== AssetCondition.GOOD && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="evaluation-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Nhập ghi chú về tình trạng tài sản..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleEvaluate}
            className="bg-blue-600"
            disabled={isSubmitting}
          >
            Lưu đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
