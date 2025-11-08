import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
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
import {
  createAssetTypeAPI,
  deleteAssetTypeAPI,
  getAllAssetTypesAPI,
  updateAssetTypeAPI,
} from '../services/assetTypeAPI';
import { AssetTypeDTO } from '../types/backend';
import { AssetTypeFormDialog, AssetTypeFormValues } from './AssetTypeFormDialog';

const ITEMS_PER_PAGE = 10;

export function AssetTypes() {
  const [assetTypes, setAssetTypes] = useState<AssetTypeDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'description'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetTypeDTO | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetTypePendingDelete, setAssetTypePendingDelete] =
    useState<AssetTypeDTO | null>(null);

  const fetchAssetTypes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await getAllAssetTypesAPI();
      setAssetTypes(response.data ?? []);
    } catch (error: any) {
      console.error('Error fetching asset types:', error);
      const message =
        typeof error?.message === 'string'
          ? error.message
          : 'Không thể tải danh sách loại tài sản.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssetTypes();
  }, [fetchAssetTypes]);

  const filteredAssetTypes = useMemo(() => {
    let result = [...assetTypes];

    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword)
      );
    }

    if (statusFilter !== 'all') {
      const desiredStatus = statusFilter === 'active';
      result = result.filter((item) => item.isActive === desiredStatus);
    }

    result.sort((a, b) => {
      const aValue = (sortBy === 'name' ? a.name : a.description) ?? '';
      const bValue = (sortBy === 'name' ? b.name : b.description) ?? '';
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [assetTypes, searchTerm, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAssetTypes.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedAssetTypes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssetTypes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAssetTypes, currentPage]);

  const handleCreate = () => {
    setSelectedAssetType(null);
    setDialogOpen(true);
  };

  const handleEdit = (assetType: AssetTypeDTO) => {
    setSelectedAssetType(assetType);
    setDialogOpen(true);
  };

  const handleDelete = (assetType: AssetTypeDTO) => {
    setAssetTypePendingDelete(assetType);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (values: AssetTypeFormValues) => {
    try {
      if (selectedAssetType) {
        await updateAssetTypeAPI(selectedAssetType.id, values);
        toast.success('Đã cập nhật loại tài sản.');
      } else {
        await createAssetTypeAPI(values);
        toast.success('Đã tạo loại tài sản mới.');
      }
      setDialogOpen(false);
      setSelectedAssetType(null);
      fetchAssetTypes();
    } catch (error: any) {
      console.error('Lỗi lưu loại tài sản:', error);
      const message =
        typeof error?.message === 'string'
          ? error.message
          : 'Không thể lưu thông tin loại tài sản.';
      toast.error(message);
    }
  };

  const confirmDelete = async () => {
    if (!assetTypePendingDelete) return;

    try {
      await deleteAssetTypeAPI(assetTypePendingDelete.id);
      toast.success('Đã xóa loại tài sản.');
      setDeleteDialogOpen(false);
      setAssetTypePendingDelete(null);
      fetchAssetTypes();
    } catch (error: any) {
      console.error('Lỗi xóa loại tài sản:', error);
      const message =
        typeof error?.message === 'string'
          ? error.message
          : 'Không thể xóa loại tài sản.';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-50">Quản lý Loại tài sản</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Theo dõi, tạo mới, chỉnh sửa và vô hiệu hóa các loại tài sản trong hệ thống.
          </p>
        </div>
        <Button className="bg-blue-600" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại tài sản
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(field);
                setSortOrder(order);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sap xep" />
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

      <Card className="shadow-sm border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          {errorMessage && (
            <div className="px-6 py-3 text-sm text-red-600 bg-red-50 border-b border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-900">
              {errorMessage}
            </div>
          )}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-gray-500 dark:text-gray-400">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : paginatedAssetTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-gray-500 dark:text-gray-400">
                      Không tìm thấy loại tài sản phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAssetTypes.map((assetType) => (
                    <TableRow
                      key={assetType.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="text-gray-900 dark:text-gray-100">
                        {assetType.name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {assetType.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            assetType.isActive
                              ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                              : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          }
                        >
                          {assetType.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700"
                            onClick={() => handleEdit(assetType)}
                            aria-label={`Chinh sua ${assetType.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(assetType)}
                            aria-label={`Xoa ${assetType.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredAssetTypes.length > ITEMS_PER_PAGE && (
            <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-3">
              <Pagination>
                <PaginationContent className="justify-end">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-label="Previous page"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage((page) => Math.max(1, page - 1));
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    const isEllipsis =
                      totalPages > 7 &&
                      pageNumber !== 1 &&
                      pageNumber !== totalPages &&
                      Math.abs(pageNumber - currentPage) > 2;

                    if (isEllipsis) {
                      if (pageNumber === 2 || pageNumber === totalPages - 1) {
                        return (
                          <PaginationItem key={`ellipsis-${pageNumber}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === currentPage}
                          onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-label="Next page"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage((page) => Math.min(totalPages, page + 1));
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <AssetTypeFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedAssetType(null);
          }
        }}
        assetType={selectedAssetType}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa loại tài sản</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại tài sản này? Các tài sản đang sử dụng loại này sẽ vẫn giữ nguyên,
              nhưng không thể gán loại đã xóa cho dữ liệu mới.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
