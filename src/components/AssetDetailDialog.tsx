import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
// Legacy mock data reference preserved during API migration.
// import { mockAssetTypes, mockDepartments, mockUsers, mockAssetHistory } from "../lib/mockData";
import { Asset, AssetHistory, AssetType, Department, User } from "../types";
import {
    formatCurrency,
    formatDate,
    formatDateTime,
    getConditionColor,
    getConditionLabel,
    getStatusColor,
    getStatusLabel,
} from "../lib/utils";
import { Building2, Calendar, ClipboardList, Package, User as UserIcon } from "lucide-react";

interface AssetDetailDialogProps {
  asset: Asset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetType?: AssetType | null;
  department?: Department | null;
  assignedUser?: User | null;
  createdBy?: User | null;
  history?: AssetHistory[];
}

export function AssetDetailDialog({
  asset,
  open,
  onOpenChange,
  assetType,
  department,
  assignedUser,
  createdBy,
  history = [],
}: AssetDetailDialogProps) {
  const sortedHistory = [...history].sort(
    (a, b) =>
      new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết tài sản</DialogTitle>
          <DialogDescription>
            Thông tin tổng quan và lịch sử hoạt động của tài sản.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mã tài sản</p>
                <p className="text-gray-900">{asset.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tên tài sản</p>
                <p className="text-gray-900">{asset.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Loại tài sản</p>
                <p className="text-gray-900">{assetType?.name ?? "—"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                <Badge className={getStatusColor(asset.status)}>
                  {getStatusLabel(asset.status)}
                </Badge>
              </div>
              {asset.condition && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tình trạng</p>
                  <Badge className={getConditionColor(asset.condition)}>
                    {getConditionLabel(asset.condition)}
                  </Badge>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Giá trị</p>
                <p className="text-gray-900">{formatCurrency(asset.value)}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Ngày mua</p>
                <p className="text-gray-900">
                  {formatDate(asset.purchaseDate)}
                </p>
              </div>
            </div>

            {department && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Phòng ban</p>
                  <p className="text-gray-900">{department.name}</p>
                </div>
              </div>
            )}

            {assignedUser && (
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Người sử dụng</p>
                  <p className="text-gray-900">{assignedUser.name}</p>
                  <p className="text-sm text-gray-500">{assignedUser.email}</p>
                </div>
              </div>
            )}

            {createdBy && (
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Người tạo</p>
                  <p className="text-gray-900">{createdBy.name}</p>
                </div>
              </div>
            )}
          </div>

          {asset.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-gray-600 mb-2">Mô tả</p>
                <p className="text-gray-900 whitespace-pre-line">
                  {asset.description}
                </p>
              </div>
            </>
          )}

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-900">Lịch sử hoạt động</h3>
            </div>
            <div className="space-y-4">
              {sortedHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Chưa có lịch sử hoạt động nào được ghi nhận.
                </p>
              ) : (
                sortedHistory.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      {index < sortedHistory.length - 1 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-900">{item.details}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.performedBy
                              ? `${item.performedBy} • ${formatDateTime(item.performedAt)}`
                              : formatDateTime(item.performedAt)}
                          </p>
                          {item.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              "{item.notes}"
                            </p>
                          )}
                        </div>
                        {item.newStatus && (
                          <Badge className={getStatusColor(item.newStatus)}>
                            {getStatusLabel(item.newStatus)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
