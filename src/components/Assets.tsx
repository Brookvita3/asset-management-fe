import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, UserPlus, UserMinus, ClipboardCheck, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { AssetFormDialog } from './AssetFormDialog';
import { AssetDetailDialog } from './AssetDetailDialog';
import { AssignAssetDialog } from './AssignAssetDialog';
import { EvaluateAssetDialog } from './EvaluateAssetDialog';
import {
  mockAssets,
  mockAssetTypes,
  mockDepartments,
  mockUsers
} from '../lib/mockData';
import { Asset, UserRole, AssetStatus } from '../types';
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { getAllAssetTypesAPI } from '../services/assetTypeAPI';

export function Assets() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [evaluateDialogOpen, setEvaluateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;



  // Filter assets based on user role
  let filteredAssets = !currentUser ? [] :
    currentUser.role === UserRole.ADMIN
      ? mockAssets
      : currentUser.role === UserRole.MANAGER
        ? mockAssets.filter(a => a.departmentId === currentUser.departmentId)
        : mockAssets.filter(a => a.assignedTo === currentUser.id);

  // Apply filters
  if (searchTerm) {
    filteredAssets = filteredAssets.filter(
      asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedDepartment !== 'all') {
    filteredAssets = filteredAssets.filter(a => a.departmentId === selectedDepartment);
  }

  if (selectedStatus !== 'all') {
    filteredAssets = filteredAssets.filter(a => a.status === selectedStatus);
  }

  if (selectedType !== 'all') {
    filteredAssets = filteredAssets.filter(a => a.typeId === selectedType);
  }

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedStatus, selectedType]);

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailDialogOpen(true);
  };

  const handleAssign = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssignDialogOpen(true);
  };

  const handleEvaluate = (asset: Asset) => {
    setSelectedAsset(asset);
    setEvaluateDialogOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormDialogOpen(true);
  };

  const handleDelete = (asset: Asset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAsset) {
      // Check if asset is in use
      if (selectedAsset.status === AssetStatus.IN_USE) {
        toast.error('Không thể xóa tài sản đang được sử dụng. Vui lòng thu hồi trước.');
        setDeleteDialogOpen(false);
        return;
      }

      // Here you would normally delete from backend
      toast.success(`Đã xóa tài sản ${selectedAsset.code} thành công`);
      setDeleteDialogOpen(false);
      setSelectedAsset(null);
    }
  };

  const handleCreateNew = () => {
    setEditingAsset(null);
    setFormDialogOpen(true);
  };

  const canManageAssets = currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MANAGER);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-50">Quản lý Tài sản</h1>
          <p className="text-gray-600 dark:text-gray-400">Danh sách và quản lý tài sản</p>
        </div>
        {canManageAssets && (
          <Button onClick={handleCreateNew} className="bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Thêm tài sản mới
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tên, mã tài sản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {currentUser && currentUser.role === UserRole.ADMIN && (
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng ban</SelectItem>
                  {mockDepartments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value={AssetStatus.IN_STOCK}>Trong kho</SelectItem>
                <SelectItem value={AssetStatus.IN_USE}>Đang sử dụng</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Loại tài sản" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {mockAssetTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card className="shadow-sm border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="font-semibold">Mã tài sản</TableHead>
                  <TableHead className="font-semibold">Tên tài sản</TableHead>
                  <TableHead className="font-semibold">Loại</TableHead>
                  {currentUser.role === UserRole.ADMIN && <TableHead className="font-semibold">Phòng ban</TableHead>}
                  <TableHead className="font-semibold">Người sử dụng</TableHead>
                  <TableHead className="font-semibold">Ngày mua</TableHead>
                  <TableHead className="font-semibold">Giá trị</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="text-right font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p>Không tìm thấy tài sản nào</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAssets.map((asset) => {
                    const assetType = mockAssetTypes.find(t => t.id === asset.typeId);
                    const department = mockDepartments.find(d => d.id === asset.departmentId);
                    const assignedUser = mockUsers.find(u => u.id === asset.assignedTo);

                    return (
                      <TableRow key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <TableCell>
                          <span className="font-mono text-gray-700 dark:text-gray-300">{asset.code}</span>
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-50">{asset.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{assetType?.name}</TableCell>
                        {currentUser.role === UserRole.ADMIN && (
                          <TableCell className="text-gray-600 dark:text-gray-400">{department?.name || '-'}</TableCell>
                        )}
                        <TableCell className="text-gray-600 dark:text-gray-400">{assignedUser?.name || '-'}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{formatDate(asset.purchaseDate)}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-50">{formatCurrency(asset.value)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(asset.status)}>
                            {getStatusLabel(asset.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(asset)}
                              title="Xem chi tiết"
                              className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {canManageAssets && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(asset)}
                                  title="Chỉnh sửa"
                                  className="hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {asset.status === AssetStatus.IN_STOCK && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleAssign(asset)}
                                    title="Gán tài sản"
                                    className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 transition-colors"
                                  >
                                    <UserPlus className="w-4 h-4" />
                                  </Button>
                                )}
                                {asset.status === AssetStatus.IN_USE && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEvaluate(asset)}
                                      title="Đánh giá"
                                      className="hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30 dark:hover:text-amber-400 transition-colors"
                                    >
                                      <ClipboardCheck className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {/* Handle reclaim */ }}
                                      title="Thu hồi"
                                      className="hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/30 dark:hover:text-orange-400 transition-colors"
                                    >
                                      <UserMinus className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(asset)}
                                  title="Xóa"
                                  className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="shadow-sm border-gray-200 dark:border-gray-700">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị <span className="font-semibold text-gray-900 dark:text-gray-100">{startIndex + 1}-{Math.min(endIndex, filteredAssets.length)}</span> trong tổng số <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredAssets.length}</span> tài sản
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30'}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className={`cursor-pointer ${currentPage === page ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <PaginationEllipsis key={page} />;
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <AssetFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        asset={editingAsset}
      />
      {selectedAsset && (
        <>
          <AssetDetailDialog
            asset={selectedAsset}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
          />
          <AssignAssetDialog
            asset={selectedAsset}
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
          />
          <EvaluateAssetDialog
            asset={selectedAsset}
            open={evaluateDialogOpen}
            onOpenChange={setEvaluateDialogOpen}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài sản</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài sản <span className="font-semibold text-gray-900">{selectedAsset?.code} - {selectedAsset?.name}</span>?
              <br />
              <span className="text-red-600">Hành động này không thể hoàn tác.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
