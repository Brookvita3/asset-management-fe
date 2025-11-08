import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
// Legacy mock data reference preserved during API migration.
// import { mockAssetTypes, mockDepartments } from "../lib/mockData";
import { Asset, Department, AssetType } from "../types";
import { toast } from "sonner";

export interface AssetFormValues {
  code: string;
  name: string;
  typeId: string;
  departmentId?: string;
  assignedTo?: number;
  purchaseDate: string;
  value: number;
  description?: string;
}

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  assetTypes: AssetType[];
  departments: Department[];
  onSubmit: (payload: AssetFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

const NONE_DEPARTMENT_VALUE = "__none__";

const emptyForm: AssetFormValues = {
  code: "",
  name: "",
  typeId: "",
  departmentId: undefined,
  purchaseDate: "",
  value: 0,
  description: "",
};

export function AssetFormDialog({
  open,
  onOpenChange,
  asset,
  assetTypes,
  departments,
  onSubmit,
  isSubmitting = false,
}: AssetFormDialogProps) {
  const [formValues, setFormValues] = useState<AssetFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<keyof AssetFormValues, string>>({
    code: "",
    name: "",
    typeId: "",
    departmentId: "",
    purchaseDate: "",
    assignedTo: "",
    value: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (asset) {
      setFormValues({
        code: asset.code,
        name: asset.name,
        typeId: asset.typeId ?? "",
        departmentId: asset.departmentId ?? undefined,
        purchaseDate: asset.purchaseDate
          ? new Date(asset.purchaseDate).toISOString().split("T")[0]
          : "",
        value: asset.value ?? 0,
        description: asset.description ?? "",
      });
      setPreview(asset.image ?? null);
    } else {
      setFormValues(emptyForm);
      setPreview(null);
    }
    setSelectedFile(null);
    setErrors({
      code: "",
      name: "",
      typeId: "",
      departmentId: "",
      purchaseDate: "",
      assignedTo: "",
      value: "",
      description: "",
    });
  }, [asset, open]);

  const validate = () => {
    const nextErrors: Record<keyof AssetFormValues, string> = {
      code: "",
      name: "",
      typeId: "",
      departmentId: "",
      purchaseDate: "",
      assignedTo: "",
      value: "",
      description: "",
    };
    let hasError = false;

    if (!formValues.code.trim()) {
      nextErrors.code = "Vui lòng nhập mã tài sản.";
      hasError = true;
    } else if (!/^[A-Z0-9-]+$/.test(formValues.code.trim())) {
      nextErrors.code =
        "Mã tài sản chỉ sử dụng chữ in hoa, số và dấu gạch ngang.";
      hasError = true;
    }

    if (!formValues.name.trim()) {
      nextErrors.name = "Vui lòng nhập tên tài sản.";
      hasError = true;
    }

    if (!formValues.typeId) {
      nextErrors.typeId = "Vui lòng chọn loại tài sản.";
      hasError = true;
    }

    if (!formValues.purchaseDate) {
      nextErrors.purchaseDate = "Vui lòng chọn ngày mua.";
      hasError = true;
    }

    if (Number.isNaN(formValues.value) || formValues.value <= 0) {
      nextErrors.value = "Giá trị phải lớn hơn 0.";
      hasError = true;
    }

    setErrors(nextErrors);
    return !hasError;
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Kiểm tra lại thông tin bắt buộc.");
      return;
    }

    await onSubmit({
      ...formValues,
      code: formValues.code.trim(),
      name: formValues.name.trim(),
      description: formValues.description?.trim(),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !isSubmitting && onOpenChange(value)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {asset ? "Chỉnh sửa tài sản" : "Thêm tài sản mới"}
          </DialogTitle>
          <DialogDescription>
            {asset
              ? "Cập nhật thông tin tài sản hiện có."
              : "Điền thông tin để tạo một tài sản mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset-code">
                Mã tài sản <span className="text-red-500">*</span>
              </Label>
              <Input
                id="asset-code"
                value={formValues.code}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    code: event.target.value.toUpperCase(),
                  }))
                }
                disabled={Boolean(asset)}
                className={errors.code ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-name">
                Tên tài sản <span className="text-red-500">*</span>
              </Label>
              <Input
                id="asset-name"
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, name: event.target.value }))
                }
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-type">
                Loại tài sản <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.typeId}
                onValueChange={(value) =>
                  setFormValues((prev) => ({ ...prev, typeId: value }))
                }
              >
                <SelectTrigger
                  id="asset-type"
                  className={errors.typeId ? "border-red-500 focus:ring-red-500" : ""}
                >
                  <SelectValue placeholder="Chọn loại tài sản" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.typeId && <p className="text-sm text-red-500">{errors.typeId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-department">Phòng ban</Label>
              <Select

                value={formValues.departmentId ?? NONE_DEPARTMENT_VALUE}
                onValueChange={(value) =>
                  setFormValues((prev) => ({
                    ...prev,
                    departmentId:
                      value === NONE_DEPARTMENT_VALUE ? undefined : value,
                  }))
                }
                disabled={true}
              >
                <SelectTrigger id="asset-department">
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_DEPARTMENT_VALUE}>
                    Không phân bổ
                  </SelectItem>
                  {departments
                    .filter((dept) => dept.isActive)
                    .map((dept) => (
                      <SelectItem key={dept.id} value={String(dept.id)}>
                        {dept.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-date">
                Ngày mua <span className="text-red-500">*</span>
              </Label>
              <Input
                id="asset-date"
                type="date"
                value={formValues.purchaseDate}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    purchaseDate: event.target.value,
                  }))
                }
                className={
                  errors.purchaseDate
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.purchaseDate && (
                <p className="text-sm text-red-500">{errors.purchaseDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-value">
                Giá trị (VNĐ) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="asset-value"
                type="number"
                min="0"
                value={formValues.value}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    value: Number(event.target.value),
                  }))
                }
                className={
                  errors.value ? "border-red-500 focus-visible:ring-red-500" : ""
                }
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-description">Mô tả</Label>
            <Textarea
              id="asset-description"
              value={formValues.description ?? ""}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={3}
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="asset-image">Ảnh tài sản (tùy chọn)</Label>
            <Input id="asset-image" type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <img
                src={preview}
                alt="Asset preview"
                className="mt-2 max-h-40 rounded border border-gray-200 object-contain"
              />
            )}
            {selectedFile && (
              <p className="text-xs text-gray-500">
                Chưa gửi ảnh lên server (cần API upload riêng).
              </p>
            )}
          </div> */}

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600" disabled={isSubmitting}>
              {asset ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
