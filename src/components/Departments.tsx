import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit } from "lucide-react";
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
import { DepartmentFormDialog, DepartmentFormValues } from "./DepartmentFormDialog";
// Legacy mock references retained while migrating to live APIs.
// import { mockDepartments, mockUsers } from "../lib/mockData";
import { Department, User } from "../types";
import { toast } from "sonner";
import {
  createDepartmentAPI,
  getDepartmentsAPI,
  updateDepartmentAPI,
} from "../services/departmentAPI";
import { getUsersAPI } from "../services/userAPI";
import { toDepartment, toUser } from "../lib/mappers";

const ITEMS_PER_PAGE = 10;

export function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [deptResponse, userResponse]: any = await Promise.all([
        getDepartmentsAPI(),
        getUsersAPI(),
      ]);
      setDepartments((deptResponse.data ?? []).map(toDepartment));
      setUsers((userResponse.data ?? []).map(toUser));
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể tải danh sách phòng ban.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const filteredDepartments = useMemo(() => {
    let result = [...departments];
    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();
      result = result.filter((dept) =>
        dept.name.toLowerCase().includes(keyword)
      );
    }

    // Sort departments
    result.sort((a, b) => {
      const aValue = a.name ?? '';
      const bValue = b.name ?? '';
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [departments, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleAdd = () => {
    setSelectedDepartment(null);
    setDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setDialogOpen(true);
  };

  const handleSaveDepartment = async (values: DepartmentFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedDepartment) {
        await updateDepartmentAPI(Number(selectedDepartment.id), {
          name: values.name,
          description: values.description,
          employeeCount: values.employeeCount ? Number(values.employeeCount) : 0,
          managerId: values.managerId ? Number(values.managerId) : undefined,
          isActive: values.isActive,
        });
        toast.success("Đã cập nhật phòng ban.");
      } else {
        await createDepartmentAPI({
          name: values.name,
          description: values.description,
          employeeCount: 0,
          managerId: values.managerId ? Number(values.managerId) : undefined,
          isActive: values.isActive,
        });
        toast.success("Đã tạo phòng ban mới.");
      }
      await fetchDepartments();
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể lưu phòng ban.";
      toast.error(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resolveManager = (managerId?: string) =>
    managerId ? users.find((user) => user.id === managerId) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-50">Quản lý Phòng ban</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Danh sách phòng ban và trưởng phụ trách trong tổ chức.
          </p>
        </div>
        <Button className="bg-blue-600" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phòng ban
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm phòng ban..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value: string) => {
                const [field, order] = value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(field);
                setSortOrder(order);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                <SelectItem value="name-desc">Tên Z-A</SelectItem>
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
                  <TableHead className="font-semibold">Tên phòng ban</TableHead>
                  <TableHead className="font-semibold">Mô tả</TableHead>
                  <TableHead className="font-semibold">Trưởng phòng</TableHead>
                  <TableHead className="font-semibold">Số nhân viên</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="text-right font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : paginatedDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                      Không tìm thấy phòng ban nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDepartments.map((department) => {
                    const manager = resolveManager(department.managerId);
                    return (
                      <TableRow
                        key={department.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        <TableCell className="text-gray-900 dark:text-gray-50 font-medium">
                          {department.name}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {department.description || "—"}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {manager ? (
                            <>
                              <span className="block">{manager.name}</span>
                              <span className="block text-xs text-gray-500">
                                {manager.email}
                              </span>
                            </>
                          ) : (
                            "Chưa phân công"
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {department.employeeCount ?? 0}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              department.isActive
                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                            }
                          >
                            {department.isActive ? "Hoạt động" : "Ngưng hoạt động"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Chỉnh sửa"
                            onClick={() => handleEdit(department)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
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

      {filteredDepartments.length > ITEMS_PER_PAGE && (
        <Card className="shadow-sm border-gray-200 dark:border-gray-700">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {startIndex + 1}-{Math.min(endIndex, filteredDepartments.length)}
                </span>{" "}
                trên tổng số{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {filteredDepartments.length}
                </span>{" "}
                phòng ban
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

      <DepartmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        department={selectedDepartment}
        users={users}
        onSubmit={handleSaveDepartment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
