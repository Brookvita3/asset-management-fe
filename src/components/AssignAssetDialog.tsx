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
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// Legacy mock data reference preserved during API migration.
// import { mockUsers, mockDepartments } from "../lib/mockData";
import { Asset, Department, User, UserRole } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

interface AssignAssetDialogProps {
  asset: Asset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  users: User[];
  onAssign: (payload: { userId: string; assignDate: string }) => Promise<void>;
  isSubmitting?: boolean;
}

export function AssignAssetDialog({
  asset,
  open,
  onOpenChange,
  departments,
  users,
  onAssign,
  isSubmitting = false,
}: AssignAssetDialogProps) {
  const { currentUser } = useAuth();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [assignDate, setAssignDate] = useState("");

  useEffect(() => {
    if (!open) return;
    const today = new Date().toISOString().split("T")[0];
    setAssignDate(today);
    setSelectedDepartmentId("");
    setSelectedUserId("");
  }, [open]);

  const availableDepartments = useMemo(() => {
    if (!currentUser) return [];
    const activeDepartments = departments.filter((dept) => dept.isActive);
    if (currentUser.role === UserRole.ADMIN) {
      return activeDepartments;
    }
    return activeDepartments.filter((dept) => dept.id === currentUser.departmentId);
  }, [currentUser, departments]);

  const availableUsers = useMemo(() => {
    if (!selectedDepartmentId) return [];
    return users.filter(
      (user) =>
        user.departmentId === selectedDepartmentId &&
        user.isActive &&
        user.role === UserRole.STAFF
    );
  }, [users, selectedDepartmentId]);

  const handleAssign = async () => {
    if (!selectedDepartmentId) {
      toast.error("Vui lòng chọn phòng ban.");
      return;
    }
    if (!selectedUserId) {
      toast.error("Vui lòng chọn nhân viên.");
      return;
    }
    if (!assignDate) {
      toast.error("Vui lòng chọn ngày gán.");
      return;
    }

    await onAssign({ userId: selectedUserId, assignDate });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !isSubmitting && onOpenChange(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gán tài sản</DialogTitle>
          <DialogDescription>
            Chọn phòng ban và nhân viên mà bạn muốn gán tài sản.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Tài sản</p>
            <p className="text-gray-900">
              {asset.code} - {asset.name}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assign-department">
              Phòng ban <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedDepartmentId}
              onValueChange={(value) => {
                setSelectedDepartmentId(value);
                setSelectedUserId("");
              }}
            >
              <SelectTrigger id="assign-department">
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                {availableDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assign-user">
              Nhân viên <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={!selectedDepartmentId}
            >
              <SelectTrigger id="assign-user">
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDepartmentId && availableUsers.length === 0 && (
              <p className="text-sm text-yellow-600">
                Không có nhân viên phù hợp trong phòng ban này.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assign-date">
              Ngày gán <span className="text-red-500">*</span>
            </Label>
            <Input
              id="assign-date"
              type="date"
              value={assignDate}
              onChange={(event) => setAssignDate(event.target.value)}
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
            onClick={handleAssign}
            className="bg-blue-600"
            disabled={!selectedUserId || isSubmitting}
          >
            Gán tài sản
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
