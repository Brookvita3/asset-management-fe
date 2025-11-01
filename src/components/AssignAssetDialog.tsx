import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Asset, UserRole } from '../types';
import { mockUsers, mockDepartments } from '../lib/mockData';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';

interface AssignAssetDialogProps {
  asset: Asset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignAssetDialog({ asset, open, onOpenChange }: AssignAssetDialogProps) {
  const { currentUser } = useAuth();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [assignDate, setAssignDate] = useState('');

  // Set default date to today when dialog opens
  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split('T')[0];
      setAssignDate(today);
      // Reset selections
      setSelectedDepartmentId('');
      setSelectedUserId('');
    }
  }, [open]);

  // Get available departments based on role
  const availableDepartments = !currentUser ? [] :
    currentUser.role === UserRole.ADMIN
    ? mockDepartments.filter(d => d.isActive)
    : mockDepartments.filter(d => d.id === currentUser.departmentId && d.isActive);

  // Get users in selected department
  const availableUsers = selectedDepartmentId
    ? mockUsers.filter(
        u => u.departmentId === selectedDepartmentId && 
        u.isActive &&
        u.role === UserRole.STAFF
      )
    : [];

  // Reset user selection when department changes
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartmentId(deptId);
    setSelectedUserId('');
  };

  const handleAssign = () => {
    if (!selectedDepartmentId) {
      toast.error('Vui lòng chọn phòng ban');
      return;
    }

    if (!selectedUserId) {
      toast.error('Vui lòng chọn nhân viên');
      return;
    }

    if (!assignDate) {
      toast.error('Vui lòng chọn ngày gán');
      return;
    }

    const user = mockUsers.find(u => u.id === selectedUserId);
    
    // Here you would normally save to backend
    // Update: current_user_id, status = IN_USE, add history "ASSIGNED"
    toast.success(`Đã gán tài sản ${asset.code} cho ${user?.name} vào ngày ${assignDate}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gán tài sản</DialogTitle>
          <DialogDescription>
            Chọn phòng ban và nhân viên để gán tài sản
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Tài sản</p>
            <p className="text-gray-900">{asset.code} - {asset.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">
              Chọn phòng ban <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedDepartmentId} onValueChange={handleDepartmentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                {availableDepartments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">
              Chọn nhân viên <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedUserId} 
              onValueChange={setSelectedUserId}
              disabled={!selectedDepartmentId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDepartmentId && availableUsers.length === 0 && (
              <p className="text-sm text-yellow-600">
                Không có nhân viên khả dụng trong phòng ban này
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignDate">
              Ngày gán <span className="text-red-500">*</span>
            </Label>
            <Input
              id="assignDate"
              type="date"
              value={assignDate}
              onChange={(e) => setAssignDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleAssign} className="bg-blue-600" disabled={!selectedUserId}>
            Gán tài sản
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
