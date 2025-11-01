import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, ArrowUpDown } from 'lucide-react';
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
import { mockAssetTypes } from '../lib/mockData';
import { AssetType } from '../types';
import { toast } from 'sonner@2.0.3';
import { AssetTypeFormDialog } from './AssetTypeFormDialog';
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
import { createAssetTypeAPI, deleteAssetTypeAPI, getAllAssetTypesAPI, updateAssetTypeAPI } from '../services/assetTypeAPI';

export function AssetTypes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetTypeToDelete, setAssetTypeToDelete] = useState<AssetType | null>(null);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'description'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkAction, setCheckAction] = useState(false);
  const itemsPerPage = 10;

  // Fetch asset types from API
  const fetchAssetTypes = useCallback(async () => {
    try {
      const response: any = await getAllAssetTypesAPI();
      if (response.message.includes('successfully')) {
        setAssetTypes(response.data);
      }

    } catch (error) {
      console.error('Error fetching asset types:', error);
    }
  }, []);

  useEffect(() => {
    fetchAssetTypes();
  }, [checkAction, fetchAssetTypes]);
  // Save asset type via API
  const createAssetType = async (data: AssetType) => {
    try {
      const response: any = await createAssetTypeAPI(data);
      if (response.message.includes('successfully')) {
        toast.success('Đã tạo loại tài sản mới');
        setCheckAction(!checkAction);
      }
    } catch (error) {
      console.error('Error creating asset type:', error);
    }
  }
  // Update asset type via API
  const updateAssetType = async (id: number, data: AssetType) => {
    try {
      const response: any = await updateAssetTypeAPI(id, data);
      if (response.message.includes('successfully')) {
        toast.success('Đã cập nhật loại tài sản');
        setCheckAction(!checkAction);
      }
    } catch (error) {
      console.error('Error updating asset type:', error);
    }
  };

  // Delete asset type via API
  const deleteAssetType = async (id: number) => {
    try {
      const response: any = await deleteAssetTypeAPI(id);
      if (response.message.includes('successfully')) {
        toast.success('Đã xóa loại tài sản');
        setCheckAction(!checkAction);
      }
    } catch (error) {
      console.error('Error deleting asset type:', error);
    }
  };

  // Apply filters
  let filteredAssetTypes = assetTypes;

  if (searchTerm) {
    filteredAssetTypes = filteredAssetTypes.filter(
      type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (statusFilter !== 'all') {
    const isActive = statusFilter === 'active';
    filteredAssetTypes = filteredAssetTypes.filter(type => type.isActive === isActive);
  }

  // Apply sorting
  filteredAssetTypes = [...filteredAssetTypes].sort((a, b) => {
    const aValue = a[sortBy].toLowerCase();
    const bValue = b[sortBy].toLowerCase();

    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredAssetTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssetTypes = filteredAssetTypes.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const handleEdit = (assetType: AssetType) => {
    setSelectedAssetType(assetType);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedAssetType(null);
    setDialogOpen(true);
  };

  const handleDelete = (assetType: AssetType) => {
    setAssetTypeToDelete(assetType);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (assetTypeToDelete) {

      deleteAssetType(assetTypeToDelete.id);
      setDeleteDialogOpen(false);
      setAssetTypeToDelete(null);
    }
  };

  const handleSave = (assetTypeData: Partial<AssetType>) => {
    if (assetTypeData.id) {
      // Update existing
      const updatedList = assetTypes.map(type =>
        type.id === assetTypeData.id
          ? { ...type, ...assetTypeData }
          : type
      );
      // update on server
      updateAssetType(assetTypeData.id, assetTypeData as AssetType);
      // setAssetTypes(updatedList);
      toast.success('Đã cập nhật loại tài sản');
    } else {
      // Add new
      const newAssetType: AssetType = {
        id: 0,
        name: assetTypeData.name!,
        description: assetTypeData.description!,
        isActive: assetTypeData.isActive ?? true,
      };
      // // optimistically update UI and persist on server
      // setAssetTypes([...assetTypes, newAssetType]);
      createAssetType(newAssetType);
      toast.success('Đã thêm loại tài sản mới');
    }
    console.log('Saved asset type data:', assetTypeData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-50">Quản lý Loại tài sản</h1>
          <p className="text-gray-600 dark:text-gray-400">Danh sách và quản lý các loại tài sản</p>
        </div>
        <Button className="bg-blue-600" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại tài sản
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field as 'name' | 'description');
              setSortOrder(order as 'asc' | 'desc');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                <SelectItem value="name-desc">Tên Z-A</SelectItem>
                <SelectItem value="description-asc">Mô tả A-Z</SelectItem>
                <SelectItem value="description-desc">Mô tả Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Asset Types Table */}
      <Card className="shadow-sm border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="font-semibold">Tên loại tài sản</TableHead>
                  <TableHead className="font-semibold">Mô tả</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="text-right font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssetTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p>Không tìm thấy loại tài sản nào</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAssetTypes.map((assetType) => (
                    <TableRow key={assetType.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <TableCell className="text-gray-900 dark:text-gray-50">
                        {assetType.name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {assetType.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            assetType.isActive
                              ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                              : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                          }
                        >
                          {assetType.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(assetType)}
                            className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(assetType)}
                            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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
                Hiển thị <span className="font-semibold text-gray-900 dark:text-gray-100">{startIndex + 1}-{Math.min(endIndex, filteredAssetTypes.length)}</span> trong tổng số <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredAssetTypes.length}</span> loại tài sản
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

      <AssetTypeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        assetType={selectedAssetType}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại tài sản{' '}
              <strong>"{assetTypeToDelete?.name}"</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
