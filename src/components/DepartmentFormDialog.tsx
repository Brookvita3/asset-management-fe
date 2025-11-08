import { useEffect, useMemo, useState } from "react";
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
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { Department, User } from "../types";
import { toast } from "sonner";

export interface DepartmentFormValues {
  name: string;
  description: string;
  employeeCount: number;
  managerId?: string;
  isActive: boolean;
}

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  users: User[];
  onSubmit: (values: DepartmentFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  users,
  onSubmit,
  isSubmitting = false,
}: DepartmentFormDialogProps) {
  const [formValues, setFormValues] = useState<DepartmentFormValues>({
    name: "",
    description: "",
    employeeCount: 0,
    managerId: undefined,
    isActive: true,
  });

  useEffect(() => {
    if (department) {
      setFormValues({
        name: department.name,
        description: department.description,
        employeeCount: department.employeeCount,
        managerId: department.managerId,
        isActive: department.isActive,
      });
    } else {
      setFormValues({
        name: "",
        description: "",
        employeeCount: 0,
        managerId: undefined,
        isActive: true,
      });
    }
  }, [department, open]);

  const managers = useMemo(
    () => users.filter((user) => user.isActive),
    [users]
  );

  const hasActiveEmployees = useMemo(() => {
    if (!department) return false;
    return users.some(
      (user) => user.departmentId === department.id && user.isActive
    );
  }, [department, users]);

  const validate = () => {
    if (!formValues.name.trim()) {
      toast.error("Vui lòng nhập tên phòng ban.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({
      ...formValues,
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      managerId: formValues.managerId || undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !isSubmitting && onOpenChange(value)}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {department ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
          </DialogTitle>
          <DialogDescription>
            {department
              ? "Cập nhật thông tin phòng ban."
              : "Điền thông tin để tạo phòng ban mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="department-name">
                Tên phòng ban <span className="text-red-500">*</span>
              </Label>
              <Input
                id="department-name"
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department-description">Mô tả</Label>
              <Textarea
                id="department-description"
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department-manager">Trưởng phòng</Label>
              <Select
                disabled={true}
                value={formValues.managerId ?? "none"}
                onValueChange={(value) =>
                  setFormValues((prev) => ({
                    ...prev,
                    managerId: value === "none" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger id="department-manager">
                  <SelectValue placeholder="Chọn trưởng phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Chưa phân công</SelectItem>
                  {managers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-md border border-dashed border-gray-200 dark:border-gray-700 p-4">
              <div>
                <Label className="font-medium">Trạng thái hoạt động</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tắt để ngưng sử dụng phòng ban trong hệ thống.
                </p>
              </div>
              <Switch
                checked={formValues.isActive}
                onCheckedChange={(checked) =>
                  setFormValues((prev) => ({
                    ...prev,
                    isActive: checked,
                  }))
                }
              />
            </div>

            {department && hasActiveEmployees && !formValues.isActive && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Phòng ban này hiện đang có nhân sự hoạt động. Vui lòng chuyển
                  nhân sự sang phòng khác trước khi vô hiệu hóa.
                </AlertDescription>
              </Alert>
            )}
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
              disabled={department && hasActiveEmployees && !formValues.isActive || isSubmitting}
              type="submit" className="bg-blue-600">
              {department ? "Cập nhật" : "Tạo phòng ban"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
