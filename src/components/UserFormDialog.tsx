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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Department, User, UserRole } from "../types";
import { toast } from "sonner";
import { getRoleLabel } from "../lib/utils";

export interface UserFormValues {
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  password?: string;
  isActive: boolean;
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  departments: Department[];
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  departments,
  onSubmit,
  isSubmitting = false,
}: UserFormDialogProps) {
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState<UserFormValues>({
    name: "",
    email: "",
    role: UserRole.STAFF,
    departmentId: undefined,
    password: "",
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId || undefined,
        password: "",
        isActive: user.isActive,
      });
      setStep(1);
    } else {
      setFormValues({
        name: "",
        email: "",
        role: UserRole.STAFF,
        departmentId: undefined,
        password: "",
        isActive: true,
      });
      setStep(1);
    }
  }, [user, open]);

  const activeDepartments = useMemo(
    () => departments.filter((department) => department.isActive),
    [departments]
  );

  const steps = [
    { id: 1, name: "Thông tin cơ bản" },
    { id: 2, name: "Vai trò & phòng ban" },
  ];

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1: {
        if (!formValues.name.trim()) {
          toast.error("Vui lòng nhập họ tên.");
          return false;
        }
        if (!formValues.email.trim()) {
          toast.error("Vui lòng nhập email.");
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues.email)) {
          toast.error("Email không hợp lệ.");
          return false;
        }
        if (!user && !formValues.password?.trim()) {
          toast.error("Vui lòng đặt mật khẩu tạm cho tài khoản mới.");
          return false;
        }
        return true;
      }
      case 2: {
        if (!formValues.role) {
          toast.error("Vui lòng chọn vai trò.");
          return false;
        }
        if (formValues.role !== UserRole.ADMIN && !formValues.departmentId) {
          toast.error("Vui lòng chọn phòng ban.");
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep(step)) return;

    await onSubmit({
      ...formValues,
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      departmentId:
        formValues.role === UserRole.ADMIN ? undefined : formValues.departmentId,
      password: formValues.password?.trim() || undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !isSubmitting && onOpenChange(value)}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin để{" "}
            {user ? "cập nhật tài khoản" : "tạo tài khoản mới"} cho hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <nav aria-label="Tiến trình tạo người dùng" className="flex justify-between">
            {steps.map((item) => {
              const isActive = item.id === step;
              const isCompleted = item.id < step;
              return (
                <div key={item.id} className="flex-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.id}
                  </div>
                  <p className="mt-2 text-xs text-center text-gray-600">
                    {item.name}
                  </p>
                </div>
              );
            })}
          </nav>

          {step === 1 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user-name">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="user-name"
                  value={formValues.name}
                  onChange={(event) =>
                    setFormValues((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="user-email"
                  type="email"
                  value={formValues.email}
                  onChange={(event) =>
                    setFormValues((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </div>

              {!user && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="user-password">
                    Mật khẩu tạm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="user-password"
                    type="password"
                    value={formValues.password ?? ""}
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder="Nhập mật khẩu khởi tạo"
                  />
                  <p className="text-xs text-gray-500">
                    Người dùng sẽ được yêu cầu đổi mật khẩu sau khi đăng nhập lần đầu.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between rounded-md border border-dashed border-gray-200 p-4 dark:border-gray-700 md:col-span-2">
                <div>
                  <Label className="font-medium">Trạng thái tài khoản</Label>
                  <p className="text-sm text-gray-500">
                    Tắt để vô hiệu hóa quyền đăng nhập của người dùng.
                  </p>
                </div>
                <Switch
                  checked={formValues.isActive}
                  onCheckedChange={(checked) =>
                    setFormValues((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Vai trò <span className="text-red-500">*</span></Label>
                <Select
                  value={formValues.role}
                  onValueChange={(value) => {
                    const role = value as UserRole;
                    setFormValues((prev) => ({
                      ...prev,
                      role,
                      departmentId: role === UserRole.ADMIN ? undefined : prev.departmentId,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UserRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleLabel(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formValues.role !== UserRole.ADMIN && (
                <div className="space-y-2">
                  <Label>Phòng ban <span className="text-red-500">*</span></Label>
                  <Select
                    value={formValues.departmentId ?? ""}
                    onValueChange={(value) =>
                      setFormValues((prev) => ({
                        ...prev,
                        departmentId: value || undefined,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeDepartments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Quay lại
              </Button>
            )}
            {step < steps.length && (
              <Button
                type="button"
                className="bg-blue-600"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Tiếp tục
              </Button>
            )}
            {step === steps.length && (
              <Button type="submit" className="bg-blue-600" disabled={isSubmitting}>
                {user ? "Lưu thay đổi" : "Tạo người dùng"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
