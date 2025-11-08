import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit, UserX } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
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
import { Avatar, AvatarFallback } from "./ui/avatar";
import { UserFormDialog, UserFormValues } from "./UserFormDialog";
// Legacy mock references preserved while migrating to live APIs.
// import { mockUsers, mockDepartments } from "../lib/mockData";
import { User, UserRole, Department } from "../types";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
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
import { getDepartmentsAPI } from "../services/departmentAPI";
import {
  createUserAPI,
  getUsersAPI,
  updateUserAPI,
} from "../services/userAPI";
import { toDepartment, toUser } from "../lib/mappers";
import { getRoleLabel } from "../lib/utils";

const ITEMS_PER_PAGE = 10;

export function Users() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [userResponse, departmentResponse] = await Promise.all([
        getUsersAPI(),
        getDepartmentsAPI(),
      ]);
      setUsers((userResponse.data ?? []).map(toUser));
      setDepartments((departmentResponse.data ?? []).map(toDepartment));
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể tải danh sách người dùng.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(keyword) ||
          user.email.toLowerCase().includes(keyword)
      );
    }
    return result;
  }, [users, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleAdd = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeactivate = (user: User) => {
    if (currentUser && user.id === currentUser.id) {
      toast.error("Bạn không thể vô hiệu hóa tài khoản của chính mình.");
      return;
    }
    setUserToDeactivate(user);
    setDeactivateDialogOpen(true);
  };

  const handleSaveUser = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        await updateUserAPI(Number(selectedUser.id), {
          name: values.name,
          email: values.email,
          role: values.role,
          departmentId: values.departmentId
            ? Number(values.departmentId)
            : undefined,
          active: values.isActive,
        });
        toast.success("Đã cập nhật người dùng.");
      } else {
        await createUserAPI({
          name: values.name,
          email: values.email,
          role: values.role,
          departmentId: values.departmentId
            ? Number(values.departmentId)
            : undefined,
          password: values.password,
          active: values.isActive,
        });
        toast.success("Đã tạo người dùng mới.");
      }
      await fetchUsers();
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể lưu người dùng.";
      toast.error(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeactivate = async () => {
    if (!userToDeactivate) return;
    setIsSubmitting(true);
    try {
      await updateUserAPI(Number(userToDeactivate.id), {
        active: false,
      });
      toast.success(`Đã vô hiệu hóa ${userToDeactivate.name}.`);
      setDeactivateDialogOpen(false);
      setUserToDeactivate(null);
      await fetchUsers();
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Không thể vô hiệu hóa người dùng.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resolveDepartment = (departmentId?: string) =>
    departmentId
      ? departments.find((department) => department.id === departmentId)
      : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-50">Quản lý Người dùng</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Danh sách tài khoản và vai trò trong hệ thống.
          </p>
        </div>
        <Button className="bg-blue-600" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10"
            />
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
                  <TableHead className="font-semibold">Người dùng</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Phòng ban</TableHead>
                  <TableHead className="font-semibold">Vai trò</TableHead>
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
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                      Không tìm thấy người dùng nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => {
                    const department = resolveDepartment(user.departmentId);
                    return (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        <TableCell className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-gray-900 dark:text-gray-50 font-medium">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {user.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {department?.name ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.isActive
                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                            }
                          >
                            {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Chỉnh sửa"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Vô hiệu hóa"
                              onClick={() => handleDeactivate(user)}
                              className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                              disabled={!user.isActive}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
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

      {filteredUsers.length > ITEMS_PER_PAGE && (
        <Card className="shadow-sm border-gray-200 dark:border-gray-700">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}
                </span>{" "}
                trên tổng số{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {filteredUsers.length}
                </span>{" "}
                người dùng
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

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        departments={departments}
        onSubmit={handleSaveUser}
        isSubmitting={isSubmitting}
      />

      <AlertDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vô hiệu hóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn vô hiệu hóa{" "}
              <span className="font-semibold text-gray-900">
                {userToDeactivate?.name}
              </span>
              ? Người dùng sẽ không thể đăng nhập cho tới khi được kích hoạt lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDeactivate}
              disabled={isSubmitting}
            >
              Vô hiệu hóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
