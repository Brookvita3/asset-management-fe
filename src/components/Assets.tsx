import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Edit,
  UserPlus,
  UserMinus,
  ClipboardCheck,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
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
} from "./ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { AssetFormDialog, AssetFormValues } from "./AssetFormDialog";
import { AssetDetailDialog } from "./AssetDetailDialog";
import { AssignAssetDialog } from "./AssignAssetDialog";
import { EvaluateAssetDialog } from "./EvaluateAssetDialog";
// Legacy mock data retained for reference during API migration.
// import {
//   mockAssets,
//   mockAssetTypes,
//   mockDepartments,
//   mockUsers,
// } from "../lib/mockData";
import {
  Asset,
  AssetCondition,
  AssetHistory,
  AssetStatus,
  AssetType,
  Department,
  User,
  UserRole,
} from "../types";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import {
  assignAssetAPI,
  createAssetAPI,
  deleteAssetAPI,
  evaluateAssetAPI,
  getAssetHistoryAPI,
  getAssetsAPI,
  updateAssetAPI,
} from "../services/assetAPI";
import { getAllAssetTypesAPI } from "../services/assetTypeAPI";
import { getDepartmentsAPI } from "../services/departmentAPI";
import { getUsersAPI } from "../services/userAPI";
import { toAsset, toAssetHistory, toAssetType, toDepartment, toUser } from "../lib/mappers";
import { AssetHistoryDTO } from "../types/backend";

const ITEMS_PER_PAGE = 10;

export function Assets() {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetHistories, setAssetHistories] = useState<AssetHistory[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [evaluateDialogOpen, setEvaluateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [
        assetResponse,
        assetTypeResponse,
        departmentResponse,
        userResponse,
        assetHistoryResponse,
      ]: any = await Promise.all([
        getAssetsAPI(),
        getAllAssetTypesAPI(),
        getDepartmentsAPI(),
        getUsersAPI(),
        getAssetHistoryAPI(),
      ]);

      console.log("Assets, Asset Types, Departments, Users before mapping.", {
        assetResponse,
        assetTypeResponse,
        departmentResponse,
        userResponse,
        assetHistoryResponse,
      });

      setAssets((assetResponse.data ?? []).map(toAsset));
      setAssetTypes((assetTypeResponse.data ?? []).map(toAssetType));
      setDepartments((departmentResponse.data ?? []).map(toDepartment));
      setUsers((userResponse.data ?? []).map(toUser));
      setAssetHistories((assetHistoryResponse.data ?? []).map(toAssetHistory));


      console.log("Assets, Asset Types, Departments, Users loaded.", {
        assets,
        assetTypes,
        departments,
        users,
      });
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể tải dữ liệu tài sản.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAssets = useCallback(async () => {
    try {
      const assetResponse: any = await getAssetsAPI();
      setAssets((assetResponse.data ?? []).map(toAsset));
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể tải lại danh sách tài sản.";
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Auto-open asset detail dialog when assetId is in query params (from notification click)
  useEffect(() => {
    const assetIdParam = searchParams.get('assetId');
    if (assetIdParam && assets.length > 0) {
      const asset = assets.find(a => String(a.id) === assetIdParam);
      if (asset) {
        setSelectedAsset(asset);
        setDetailDialogOpen(true);
        // Remove the query param after opening
        searchParams.delete('assetId');
        setSearchParams(searchParams);
      }
    }
  }, [searchParams, assets, setSearchParams]);

  const filteredAssets = useMemo(() => {
    if (!currentUser) return [];

    let scopedAssets: Asset[] =
      currentUser.role === UserRole.ADMIN
        ? assets
        : currentUser.role === UserRole.MANAGER
          ? assets.filter(
            (asset) => asset.departmentId === currentUser.departmentId
          )
          : assets.filter((asset) => asset.assignedTo === currentUser.id);

    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();
      scopedAssets = scopedAssets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(keyword) ||
          asset.code.toLowerCase().includes(keyword)
      );
    }

    if (selectedDepartment !== "all") {
      scopedAssets = scopedAssets.filter(
        (asset) => asset.departmentId === selectedDepartment
      );
    }

    if (selectedStatus !== "all") {
      scopedAssets = scopedAssets.filter(
        (asset) => asset.status === selectedStatus
      );
    }

    if (selectedType !== "all") {
      scopedAssets = scopedAssets.filter(
        (asset) => asset.typeId === selectedType
      );
    }

    return scopedAssets;
  }, [
    assets,
    currentUser,
    searchTerm,
    selectedDepartment,
    selectedStatus,
    selectedType,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAssets.length / ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedStatus, selectedType]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleCreateNew = () => {
    setEditingAsset(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormDialogOpen(true);
  };

  const handleSaveAsset = async (values: AssetFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingAsset) {
        await updateAssetAPI(Number(editingAsset.id), {
          id: Number(editingAsset.id),
          code: values.code,
          name: values.name,
          typeId: Number(values.typeId),
          assignedTo: values.assignedTo
            ? Number(values.assignedTo)
            : 0,
          purchaseDate: values.purchaseDate,
          value: values.value,
          description: values.description,
          status: editingAsset.status,
          condition: editingAsset.condition,
        });
        toast.success("Đã cập nhật tài sản thành công.");
      } else {
        await createAssetAPI({
          code: values.code,
          name: values.name,
          typeId: Number(values.typeId),
          assignedTo: 0,
          departmentId: values.departmentId
            ? Number(values.departmentId)
            : undefined,
          purchaseDate: values.purchaseDate,
          value: values.value,
          status: AssetStatus.IN_STOCK,
          condition: AssetCondition.GOOD,
          description: values.description,
        });
        toast.success("Đã tạo tài sản mới thành công.");
      }
      await refreshAssets();
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể lưu tài sản.";
      toast.error(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleDelete = (asset: Asset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const handleAssignSubmit = async ({
    userId,
    assignDate,
  }: {
    userId: string;
    assignDate: string;
  }) => {
    if (!selectedAsset) return;
    setIsSubmitting(true);
    try {
      await assignAssetAPI(Number(selectedAsset.id), {
        userId: Number(userId),
        assignDate,
      });
      toast.success("Đã gán tài sản thành công.");
      await refreshAssets();
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể gán tài sản.";
      toast.error(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEvaluateSubmit = async ({
    condition,
    notes,
  }: {
    condition: string;
    notes?: string;
  }) => {
    if (!selectedAsset) return;
    setIsSubmitting(true);
    try {
      await evaluateAssetAPI(Number(selectedAsset.id), {
        performedBy: Number(currentUser?.id),
        details: "Đánh giá tài sản",
        notes: notes,
        previousStatus: selectedAsset?.status,
        newStatus: selectedAsset?.status,
        condition: condition,
      });
      toast.success("Đã lưu đánh giá tài sản.");
      await refreshAssets();
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể đánh giá tài sản.";
      toast.error(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedAsset) return;

    if (selectedAsset.status === AssetStatus.IN_USE) {
      toast.error(
        "Không thể xóa tài sản đang được sử dụng. Vui lòng thu hồi trước."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteAssetAPI(Number(selectedAsset.id));
      toast.success("Đã xóa tài sản thành công.");
      setDeleteDialogOpen(false);
      setSelectedAsset(null);
      await refreshAssets();
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể xóa tài sản.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAssetType = assetTypes.find(
    (type) => String(type.id) === selectedAsset?.typeId
  );
  const selectedDepartmentEntity = departments.find(
    (dept) => dept.id === selectedAsset?.departmentId
  );
  const assignedUserEntity = users.find(
    (user) => user.id === selectedAsset?.assignedTo
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-50">Quản lý Tài sản</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Danh sách và thao tác tài sản trong tổ chức.
          </p>
        </div>
        {(currentUser?.role === UserRole.ADMIN ||
          currentUser?.role === UserRole.MANAGER) && (
            <Button onClick={handleCreateNew} className="bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Thêm tài sản
            </Button>
          )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tên, mã tài sản..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>

            {currentUser?.role === UserRole.ADMIN && (
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng ban</SelectItem>
                  {departments.map((dept) => (
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
                {Object.values(AssetStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Loại tài sản" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {assetTypes.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.name}
                  </SelectItem>
                ))}
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
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableHead className="font-semibold">Mã tài sản</TableHead>
                  <TableHead className="font-semibold">Tên tài sản</TableHead>
                  <TableHead className="font-semibold">Loại</TableHead>
                  <TableHead className="font-semibold">Phòng ban</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-right">
                    Giá trị
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : paginatedAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center">
                      Không tìm thấy tài sản phù hợp với bộ lọc.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAssets.map((asset) => {
                    const typeName =
                      assetTypes.find(
                        (type) => String(type.id) === asset.typeId
                      )?.name ?? "—";
                    const departmentName =
                      departments.find(
                        (dept) => dept.id === asset.departmentId
                      )?.name ?? "—";

                    return (
                      <TableRow
                        key={asset.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900 dark:text-gray-50">
                          {asset.code}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-200">
                          {asset.name}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {typeName}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {departmentName}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(asset.status)}>
                            {getStatusLabel(asset.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-gray-700 dark:text-gray-200">
                          {formatCurrency(asset.value)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(asset)}
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {(currentUser?.role === UserRole.ADMIN ||
                              currentUser?.role === UserRole.MANAGER) && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(asset)}
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleAssign(asset)}
                                    title="Gán tài sản"
                                  >
                                    <UserPlus className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEvaluate(asset)}
                                    title="Đánh giá"
                                  >
                                    <ClipboardCheck className="w-4 h-4" />
                                  </Button>
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
                            {currentUser?.role === UserRole.MANAGER &&
                              asset.assignedTo === currentUser.id && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Thu hồi (chưa hỗ trợ)"
                                  disabled
                                >
                                  <UserMinus className="w-4 h-4" />
                                </Button>
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

      {filteredAssets.length > ITEMS_PER_PAGE && (
        <Card className="shadow-sm border-gray-200 dark:border-gray-700">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {startIndex + 1}-{Math.min(endIndex, filteredAssets.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {filteredAssets.length}
                </span>{" "}
                tài sản
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
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
                            className={
                              currentPage === page
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            }
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    if (
                      totalPages > 7 &&
                      (page === currentPage - 2 || page === currentPage + 2)
                    ) {
                      return <PaginationEllipsis key={`ellipsis-${page}`} />;
                    }

                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      )}

      <AssetFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        asset={editingAsset}
        assetTypes={assetTypes}
        departments={departments}
        onSubmit={handleSaveAsset}
        isSubmitting={isSubmitting}
      />

      {selectedAsset && (
        <>
          <AssetDetailDialog
            asset={selectedAsset}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            assetType={selectedAssetType ?? null}
            department={selectedDepartmentEntity ?? null}
            assignedUser={assignedUserEntity ?? null}
            createdBy={users.find(
              (user) => user.id === selectedAsset.createdBy
            ) ?? null}
            users={users}
            history={assetHistories.filter(
              (assetHistorie) => assetHistorie.assetId === selectedAsset.id
            )}
          />
          <AssignAssetDialog
            asset={selectedAsset}
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            departments={departments}
            users={users}
            onAssign={handleAssignSubmit}
            isSubmitting={isSubmitting}
          />
          <EvaluateAssetDialog
            asset={selectedAsset}
            open={evaluateDialogOpen}
            onOpenChange={setEvaluateDialogOpen}
            onEvaluate={handleEvaluateSubmit}
            isSubmitting={isSubmitting}
          />
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài sản</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài sản{" "}
              <span className="font-semibold text-gray-900">
                {selectedAsset?.code} - {selectedAsset?.name}
              </span>
              ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
