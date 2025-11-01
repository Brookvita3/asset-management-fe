import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Asset } from '../types';
import { 
  mockAssetTypes, 
  mockDepartments, 
  mockUsers,
  mockAssetHistory 
} from '../lib/mockData';
import { formatCurrency, formatDate, formatDateTime, getStatusLabel, getStatusColor, getConditionLabel, getConditionColor } from '../lib/utils';
import { Calendar, DollarSign, Package, User, Building2, ClipboardList } from 'lucide-react';

interface AssetDetailDialogProps {
  asset: Asset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssetDetailDialog({ asset, open, onOpenChange }: AssetDetailDialogProps) {
  const assetType = mockAssetTypes.find(t => t.id === asset.typeId);
  const department = mockDepartments.find(d => d.id === asset.departmentId);
  const assignedUser = mockUsers.find(u => u.id === asset.assignedTo);
  const createdBy = mockUsers.find(u => u.id === asset.createdBy);
  
  const history = mockAssetHistory
    .filter(h => h.assetId === asset.id)
    .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết tài sản</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết và lịch sử tài sản
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
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
                <p className="text-gray-900">{assetType?.name}</p>
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

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-6">
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
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Người sử dụng</p>
                  <p className="text-gray-900">{assignedUser.name}</p>
                  <p className="text-sm text-gray-500">{assignedUser.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Ngày mua</p>
                <p className="text-gray-900">{formatDate(asset.purchaseDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Người tạo</p>
                <p className="text-gray-900">{createdBy?.name}</p>
              </div>
            </div>
          </div>

          {asset.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-gray-600 mb-2">Mô tả</p>
                <p className="text-gray-900">{asset.description}</p>
              </div>
            </>
          )}

          <Separator />

          {/* History Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-gray-400" />
              <h3 className="text-gray-900">Lịch sử hoạt động</h3>
            </div>
            
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Chưa có lịch sử hoạt động</p>
              ) : (
                history.map((item, index) => {
                  const performer = mockUsers.find(u => u.id === item.performedBy);
                  
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                        {index < history.length - 1 && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-gray-900">{item.details}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {performer?.name} • {formatDateTime(item.performedAt)}
                            </p>
                            {item.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic">"{item.notes}"</p>
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
                  );
                })
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
