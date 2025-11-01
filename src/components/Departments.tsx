import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
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
import { mockDepartments, mockUsers } from '../lib/mockData';
import { DepartmentFormDialog } from './DepartmentFormDialog';
import { Department } from '../types';

export function Departments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  let filteredDepartments = mockDepartments;

  if (searchTerm) {
    filteredDepartments = filteredDepartments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEdit = (dept: Department) => {
    setSelectedDepartment(dept);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedDepartment(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-50">Quản lý Phòng ban</h1>
          <p className="text-gray-600 dark:text-gray-400">Danh sách và quản lý phòng ban</p>
        </div>
        <Button className="bg-blue-600" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phòng ban
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm phòng ban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card className="shadow-sm border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="font-semibold">Tên phòng ban</TableHead>
                  <TableHead className="font-semibold">Mô tả</TableHead>
                  <TableHead className="font-semibold">Trưởng phòng</TableHead>
                  <TableHead className="font-semibold">Số nhân viên</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="text-right font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p>Không tìm thấy phòng ban nào</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDepartments.map((dept) => {
                    const manager = mockUsers.find(u => u.id === dept.managerId);

                    return (
                      <TableRow key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                              <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-gray-900 dark:text-gray-50">{dept.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-gray-600 dark:text-gray-400 truncate">{dept.description}</p>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{manager?.name || 'Chưa có'}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {dept.employeeCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={dept.isActive ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}>
                            {dept.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(dept)}
                            className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="shadow-sm border-gray-200 dark:border-gray-700">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị <span className="font-semibold text-gray-900 dark:text-gray-100">{startIndex + 1}-{Math.min(endIndex, filteredDepartments.length)}</span> trong tổng số <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredDepartments.length}</span> phòng ban
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

      <DepartmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        department={selectedDepartment}
      />
    </div>
  );
}
