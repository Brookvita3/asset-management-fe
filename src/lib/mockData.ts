import {
  User,
  Department,
  AssetType,
  Asset,
  AssetHistory,
  Notification,
  UserRole,
  AssetStatus,
  AssetCondition,
  ActionType,
  Permission,
  PermissionCategory,
  Role
} from '../types';

// Mock Users - Extended data for pagination demo
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Nguyễn Văn Admin',
    email: 'admin@company.com',
    role: UserRole.ADMIN,
    departmentId: '1',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Trần Thị Manager IT',
    email: 'manager.it@company.com',
    role: UserRole.MANAGER,
    departmentId: '1',
    isActive: true,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '3',
    name: 'Lê Văn Hùng',
    email: 'hung.le@company.com',
    role: UserRole.STAFF,
    departmentId: '1',
    isActive: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    name: 'Phạm Thị Manager HR',
    email: 'manager.hr@company.com',
    role: UserRole.MANAGER,
    departmentId: '2',
    isActive: true,
    createdAt: new Date('2024-01-06'),
  },
  {
    id: '5',
    name: 'Hoàng Văn Nam',
    email: 'nam.hoang@company.com',
    role: UserRole.STAFF,
    departmentId: '2',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '6',
    name: 'Trần Minh Tuấn',
    email: 'tuan.tran@company.com',
    role: UserRole.STAFF,
    departmentId: '1',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '7',
    name: 'Nguyễn Thị Lan',
    email: 'lan.nguyen@company.com',
    role: UserRole.STAFF,
    departmentId: '3',
    isActive: true,
    createdAt: new Date('2024-02-05'),
  },
  {
    id: '8',
    name: 'Phạm Văn Đức',
    email: 'duc.pham@company.com',
    role: UserRole.STAFF,
    departmentId: '4',
    isActive: true,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '9',
    name: 'Lê Thị Hương',
    email: 'huong.le@company.com',
    role: UserRole.MANAGER,
    departmentId: '3',
    isActive: true,
    createdAt: new Date('2024-02-12'),
  },
  {
    id: '10',
    name: 'Võ Minh Khoa',
    email: 'khoa.vo@company.com',
    role: UserRole.STAFF,
    departmentId: '5',
    isActive: true,
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '11',
    name: 'Đặng Thị Mai',
    email: 'mai.dang@company.com',
    role: UserRole.STAFF,
    departmentId: '1',
    isActive: true,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '12',
    name: 'Bùi Văn Sơn',
    email: 'son.bui@company.com',
    role: UserRole.STAFF,
    departmentId: '2',
    isActive: true,
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '13',
    name: 'Ngô Thị Linh',
    email: 'linh.ngo@company.com',
    role: UserRole.MANAGER,
    departmentId: '4',
    isActive: true,
    createdAt: new Date('2024-03-05'),
  },
  {
    id: '14',
    name: 'Trương Văn Hải',
    email: 'hai.truong@company.com',
    role: UserRole.STAFF,
    departmentId: '3',
    isActive: true,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '15',
    name: 'Đinh Thị Thu',
    email: 'thu.dinh@company.com',
    role: UserRole.STAFF,
    departmentId: '5',
    isActive: true,
    createdAt: new Date('2024-03-12'),
  },
  {
    id: '16',
    name: 'Phan Văn Long',
    email: 'long.phan@company.com',
    role: UserRole.STAFF,
    departmentId: '1',
    isActive: true,
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '17',
    name: 'Dương Thị Hà',
    email: 'ha.duong@company.com',
    role: UserRole.STAFF,
    departmentId: '2',
    isActive: true,
    createdAt: new Date('2024-03-20'),
  },
  {
    id: '18',
    name: 'Lý Văn Tài',
    email: 'tai.ly@company.com',
    role: UserRole.MANAGER,
    departmentId: '5',
    isActive: true,
    createdAt: new Date('2024-03-25'),
  },
  {
    id: '19',
    name: 'Vũ Thị Nga',
    email: 'nga.vu@company.com',
    role: UserRole.STAFF,
    departmentId: '4',
    isActive: true,
    createdAt: new Date('2024-04-01'),
  },
  {
    id: '20',
    name: 'Cao Văn Thắng',
    email: 'thang.cao@company.com',
    role: UserRole.STAFF,
    departmentId: '3',
    isActive: true,
    createdAt: new Date('2024-04-05'),
  },
  {
    id: '21',
    name: 'Nguyễn Thị Vân',
    email: 'van.nguyen@company.com',
    role: UserRole.STAFF,
    departmentId: '1',
    isActive: false,
    createdAt: new Date('2024-04-10'),
  },
  {
    id: '22',
    name: 'Trần Văn Phong',
    email: 'phong.tran@company.com',
    role: UserRole.STAFF,
    departmentId: '2',
    isActive: true,
    createdAt: new Date('2024-04-12'),
  },
  {
    id: '23',
    name: 'Lê Thị Thanh',
    email: 'thanh.le@company.com',
    role: UserRole.STAFF,
    departmentId: '5',
    isActive: true,
    createdAt: new Date('2024-04-15'),
  },
  {
    id: '24',
    name: 'Hoàng Văn Quân',
    email: 'quan.hoang@company.com',
    role: UserRole.STAFF,
    departmentId: '4',
    isActive: true,
    createdAt: new Date('2024-04-20'),
  },
  {
    id: '25',
    name: 'Phạm Thị Hồng',
    email: 'hong.pham@company.com',
    role: UserRole.STAFF,
    departmentId: '3',
    isActive: true,
    createdAt: new Date('2024-05-01'),
  },
  {
    id: '26',
    name: 'Võ Văn Bình',
    email: 'binh.vo@company.com',
    role: UserRole.STAFF,
    departmentId: '1',
    isActive: true,
    createdAt: new Date('2024-05-05'),
  },
  {
    id: '27',
    name: 'Đặng Thị Kim',
    email: 'kim.dang@company.com',
    role: UserRole.STAFF,
    departmentId: '2',
    isActive: true,
    createdAt: new Date('2024-05-10'),
  },
  {
    id: '28',
    name: 'Bùi Văn Tùng',
    email: 'tung.bui@company.com',
    role: UserRole.STAFF,
    departmentId: '5',
    isActive: true,
    createdAt: new Date('2024-05-15'),
  },
  {
    id: '29',
    name: 'Ngô Thị Dung',
    email: 'dung.ngo@company.com',
    role: UserRole.STAFF,
    departmentId: '4',
    isActive: false,
    createdAt: new Date('2024-05-20'),
  },
  {
    id: '30',
    name: 'Trương Văn An',
    email: 'an.truong@company.com',
    role: UserRole.STAFF,
    departmentId: '3',
    isActive: true,
    createdAt: new Date('2024-06-01'),
  },
  {
    id: '31',
    name: 'Đinh Thị Loan',
    email: 'loan.dinh@company.com',
    role: UserRole.STAFF,
    departmentId: '1',
    isActive: true,
    createdAt: new Date('2024-06-05'),
  },
  {
    id: '32',
    name: 'Phan Văn Cường',
    email: 'cuong.phan@company.com',
    role: UserRole.STAFF,
    departmentId: '2',
    isActive: true,
    createdAt: new Date('2024-06-10'),
  },
  {
    id: '33',
    name: 'Dương Thị Hằng',
    email: 'hang.duong@company.com',
    role: UserRole.STAFF,
    departmentId: '5',
    isActive: true,
    createdAt: new Date('2024-06-15'),
  },
  {
    id: '34',
    name: 'Lý Văn Đạt',
    email: 'dat.ly@company.com',
    role: UserRole.STAFF,
    departmentId: '4',
    isActive: true,
    createdAt: new Date('2024-06-20'),
  },
  {
    id: '35',
    name: 'Vũ Thị Trang',
    email: 'trang.vu@company.com',
    role: UserRole.STAFF,
    departmentId: '3',
    isActive: true,
    createdAt: new Date('2024-07-01'),
  },
];

// Mock Departments - Extended data for pagination demo
export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'IT',
    description: 'Phòng Công nghệ Thông tin',
    managerId: '2',
    isActive: true,
    employeeCount: 15,
  },
  {
    id: '2',
    name: 'Nhân sự',
    description: 'Phòng Quản lý Nhân sự',
    managerId: '4',
    isActive: true,
    employeeCount: 12,
  },
  {
    id: '3',
    name: 'Kế toán',
    description: 'Phòng Kế toán - Tài chính',
    managerId: '9',
    isActive: true,
    employeeCount: 8,
  },
  {
    id: '4',
    name: 'Kinh doanh',
    description: 'Phòng Kinh doanh và Marketing',
    managerId: '13',
    isActive: true,
    employeeCount: 20,
  },
  {
    id: '5',
    name: 'Hành chính',
    description: 'Phòng Hành chính - Tổng hợp',
    managerId: '18',
    isActive: true,
    employeeCount: 10,
  }
];

// Mock Asset Types - Extended data
export const mockAssetTypes: AssetType[] = [
  {
    id: 1,
    name: 'Laptop',
    description: 'Máy tính xách tay',
    isActive: true,
  },
  {
    id: 2,
    name: 'Màn hình',
    description: 'Màn hình máy tính',
    isActive: true,
  },
  {
    id: 3,
    name: 'Bàn làm việc',
    description: 'Bàn văn phòng',
    isActive: true,
  },
  {
    id: 4,
    name: 'Ghế văn phòng',
    description: 'Ghế làm việc',
    isActive: true,
  },
  {
    id: 5,
    name: 'Điện thoại',
    description: 'Điện thoại di động',
    isActive: true,
  },
  {
    id: 6,
    name: 'Máy in',
    description: 'Máy in văn phòng',
    isActive: true,
  },
  {
    id: 7,
    name: 'Máy chiếu',
    description: 'Máy chiếu projector',
    isActive: true,
  },
  {
    id: 8,
    name: 'Bàn phím',
    description: 'Bàn phím máy tính',
    isActive: true,
  },
  {
    id: 9,
    name: 'Chuột',
    description: 'Chuột máy tính',
    isActive: true,
  },
  {
    id: 10,
    name: 'Tủ hồ sơ',
    description: 'Tủ đựng hồ sơ văn phòng',
    isActive: true,
  },
  {
    id: 11,
    name: 'Máy scan',
    description: 'Máy quét tài liệu',
    isActive: true,
  },
  {
    id: 12,
    name: 'Router',
    description: 'Thiết bị mạng Router',
    isActive: true,
  },
  {
    id: 13,
    name: 'Switch',
    description: 'Thiết bị mạng Switch',
    isActive: false,
  },
  {
    id: 14,
    name: 'UPS',
    description: 'Bộ lưu điện',
    isActive: true,
  },
  {
    id: 15,
    name: 'Điều hòa',
    description: 'Máy điều hòa không khí',
    isActive: true,
  },
];

// Mock Assets
export const mockAssets: Asset[] = [
  {
    id: '1',
    code: 'LT-001',
    name: 'Dell Latitude 5420',
    typeId: '1',
    departmentId: '1',
    assignedTo: '3',
    purchaseDate: new Date('2023-06-15'),
    value: 25000000,
    status: AssetStatus.IN_USE,
    condition: AssetCondition.GOOD,
    description: 'Laptop Dell cho nhân viên IT',
    createdBy: '1',
    createdAt: new Date('2023-06-15'),
  },
  {
    id: '2',
    code: 'LT-002',
    name: 'MacBook Pro 14"',
    typeId: '1',
    departmentId: '1',
    purchaseDate: new Date('2023-08-20'),
    value: 45000000,
    status: AssetStatus.IN_STOCK,
    condition: AssetCondition.GOOD,
    description: 'MacBook Pro M2',
    createdBy: '1',
    createdAt: new Date('2023-08-20'),
  },
  {
    id: '3',
    code: 'MH-001',
    name: 'Dell UltraSharp 27"',
    typeId: '2',
    departmentId: '1',
    assignedTo: '3',
    purchaseDate: new Date('2023-07-10'),
    value: 8000000,
    status: AssetStatus.IN_USE,
    condition: AssetCondition.GOOD,
    description: 'Màn hình 27 inch 4K',
    createdBy: '1',
    createdAt: new Date('2023-07-10'),
  },
  {
    id: '4',
    code: 'LT-003',
    name: 'HP EliteBook 840',
    typeId: '1',
    departmentId: '2',
    assignedTo: '5',
    purchaseDate: new Date('2023-05-01'),
    value: 22000000,
    status: AssetStatus.IN_USE,
    condition: AssetCondition.NEEDS_REPAIR,
    description: 'Laptop cho phòng Nhân sự',
    createdBy: '1',
    createdAt: new Date('2023-05-01'),
  },
  {
    id: '5',
    code: 'BAN-001',
    name: 'Bàn làm việc Ergonomic',
    typeId: '3',
    departmentId: '1',
    assignedTo: '3',
    purchaseDate: new Date('2023-03-15'),
    value: 5000000,
    status: AssetStatus.IN_USE,
    condition: AssetCondition.GOOD,
    description: 'Bàn làm việc điều chỉnh độ cao',
    createdBy: '1',
    createdAt: new Date('2023-03-15'),
  },
  {
    id: '6',
    code: 'GHE-001',
    name: 'Ghế Herman Miller',
    typeId: '4',
    departmentId: '1',
    purchaseDate: new Date('2023-03-15'),
    value: 12000000,
    status: AssetStatus.IN_STOCK,
    condition: AssetCondition.GOOD,
    description: 'Ghế văn phòng cao cấp',
    createdBy: '1',
    createdAt: new Date('2023-03-15'),
  },
  {
    id: '7',
    code: 'DT-001',
    name: 'iPhone 14 Pro',
    typeId: '5',
    departmentId: '2',
    assignedTo: '4',
    purchaseDate: new Date('2023-09-20'),
    value: 28000000,
    status: AssetStatus.IN_USE,
    condition: AssetCondition.GOOD,
    description: 'Điện thoại công ty',
    createdBy: '1',
    createdAt: new Date('2023-09-20'),
  },
  {
    id: '8',
    code: 'LT-004',
    name: 'Lenovo ThinkPad X1',
    typeId: '1',
    departmentId: '3',
    purchaseDate: new Date('2022-12-10'),
    value: 30000000,
    status: AssetStatus.IN_STOCK,
    condition: AssetCondition.GOOD,
    description: 'Laptop cho phòng Kế toán',
    createdBy: '1',
    createdAt: new Date('2022-12-10'),
  },
];

// Generate more assets for pagination demo
const generateMoreAssets = (): Asset[] => {
  const baseAssets = mockAssets;
  const moreAssets: Asset[] = [];
  let assetId = 9;

  const laptops = ['ASUS ZenBook 14', 'Acer Swift 3', 'MSI Prestige 14', 'Surface Laptop 5', 'LG Gram 17'];
  const monitors = ['LG 32\" 4K', 'Samsung Odyssey G7', 'BenQ Designer PD2700', 'ASUS ProArt PA278', 'ViewSonic VP2768'];

  // Add 20 more laptops
  for (let i = 0; i < 20; i++) {
    const deptId = String((i % 5) + 1);
    const userId = String((i % 20) + 6);
    const isInUse = i % 3 !== 0;

    moreAssets.push({
      id: String(assetId++),
      code: `LT-${String(i + 5).padStart(3, '0')}`,
      name: laptops[i % laptops.length],
      typeId: '1',
      departmentId: deptId,
      assignedTo: isInUse ? userId : undefined,
      purchaseDate: new Date(2024, (i % 12), 15),
      value: 20000000 + (i * 200000),
      status: isInUse ? AssetStatus.IN_USE : AssetStatus.IN_STOCK,
      condition: i % 8 === 0 ? AssetCondition.NEEDS_REPAIR : AssetCondition.GOOD,
      description: `Laptop ${laptops[i % laptops.length]}`,
      createdBy: '1',
      createdAt: new Date(2024, (i % 12), 15),
    });
  }

  // Add 15 more monitors
  for (let i = 0; i < 15; i++) {
    const deptId = String((i % 5) + 1);
    const userId = String((i % 20) + 6);
    const isInUse = i % 2 === 0;

    moreAssets.push({
      id: String(assetId++),
      code: `MH-${String(i + 2).padStart(3, '0')}`,
      name: monitors[i % monitors.length],
      typeId: '2',
      departmentId: deptId,
      assignedTo: isInUse ? userId : undefined,
      purchaseDate: new Date(2024, (i % 12), 10),
      value: 6000000 + (i * 300000),
      status: isInUse ? AssetStatus.IN_USE : AssetStatus.IN_STOCK,
      condition: AssetCondition.GOOD,
      description: `Màn hình ${monitors[i % monitors.length]}`,
      createdBy: '1',
      createdAt: new Date(2024, (i % 12), 10),
    });
  }

  // Add 10 more desks
  for (let i = 0; i < 10; i++) {
    const deptId = String((i % 5) + 1);
    const userId = String((i % 20) + 6);

    moreAssets.push({
      id: String(assetId++),
      code: `BAN-${String(i + 2).padStart(3, '0')}`,
      name: 'Bàn làm việc hiện đại',
      typeId: '3',
      departmentId: deptId,
      assignedTo: userId,
      purchaseDate: new Date(2024, (i % 12), 5),
      value: 4500000 + (i * 100000),
      status: AssetStatus.IN_USE,
      condition: AssetCondition.GOOD,
      description: 'Bàn làm việc hiện đại',
      createdBy: '1',
      createdAt: new Date(2024, (i % 12), 5),
    });
  }

  // Add 10 more chairs  
  for (let i = 0; i < 10; i++) {
    const deptId = String((i % 5) + 1);
    const isInUse = i % 2 === 0;
    const userId = String((i % 20) + 6);

    moreAssets.push({
      id: String(assetId++),
      code: `GHE-${String(i + 2).padStart(3, '0')}`,
      name: 'Ghế Ergohuman V2',
      typeId: '4',
      departmentId: deptId,
      assignedTo: isInUse ? userId : undefined,
      purchaseDate: new Date(2024, (i % 12), 1),
      value: 9000000 + (i * 200000),
      status: isInUse ? AssetStatus.IN_USE : AssetStatus.IN_STOCK,
      condition: AssetCondition.GOOD,
      description: 'Ghế văn phòng Ergohuman',
      createdBy: '1',
      createdAt: new Date(2024, (i % 12), 1),
    });
  }

  // Add 12 phones
  for (let i = 0; i < 12; i++) {
    const deptId = String((i % 5) + 1);
    const userId = String((i % 20) + 6);
    const isInUse = i % 3 !== 1;

    moreAssets.push({
      id: String(assetId++),
      code: `DT-${String(i + 2).padStart(3, '0')}`,
      name: i % 2 === 0 ? 'Samsung Galaxy S23' : 'iPhone 15 Pro',
      typeId: '5',
      departmentId: deptId,
      assignedTo: isInUse ? userId : undefined,
      purchaseDate: new Date(2024, (i % 12), 20),
      value: 18000000 + (i * 500000),
      status: isInUse ? AssetStatus.IN_USE : AssetStatus.IN_STOCK,
      condition: AssetCondition.GOOD,
      description: 'Điện thoại công ty',
      createdBy: '1',
      createdAt: new Date(2024, (i % 12), 20),
    });
  }

  return [...baseAssets, ...moreAssets];
};

// Replace original mockAssets with extended version
mockAssets.splice(0, mockAssets.length, ...generateMoreAssets());

// Mock Asset History
export const mockAssetHistory: AssetHistory[] = [
  {
    id: '1',
    assetId: '1',
    actionType: ActionType.CREATED,
    performedBy: '1',
    performedAt: new Date('2023-06-15'),
    details: 'Tài sản được tạo mới',
    previousStatus: undefined,
    newStatus: AssetStatus.IN_STOCK,
  },
  {
    id: '2',
    assetId: '1',
    actionType: ActionType.ASSIGNED,
    performedBy: '2',
    performedAt: new Date('2023-06-16'),
    details: 'Gán tài sản cho Lê Văn Staff',
    previousStatus: AssetStatus.IN_STOCK,
    newStatus: AssetStatus.IN_USE,
  },
  {
    id: '3',
    assetId: '1',
    actionType: ActionType.EVALUATED,
    performedBy: '2',
    performedAt: new Date('2024-06-15'),
    details: 'Đánh giá tài sản',
    notes: 'Tình trạng tốt, hoạt động bình thường',
  },
  {
    id: '4',
    assetId: '4',
    actionType: ActionType.EVALUATED,
    performedBy: '4',
    performedAt: new Date('2024-10-20'),
    details: 'Đánh giá tài sản',
    notes: 'Bàn phím có một số phím không hoạt động, cần thay thế',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    title: 'Đánh giá tài sản sắp đến hạn',
    message: 'Tài sản LT-001 cần được đánh giá trong vòng 7 ngày',
    type: 'warning',
    isRead: false,
    assetId: '1',
    createdAt: new Date('2024-10-20'),
  },
  {
    id: '2',
    userId: '2',
    title: 'Tài sản mới được thêm',
    message: 'Tài sản LT-002 đã được thêm vào phòng IT',
    type: 'info',
    isRead: true,
    assetId: '2',
    createdAt: new Date('2024-10-15'),
  },
  {
    id: '3',
    userId: '4',
    title: 'Tài sản cần sửa chữa',
    message: 'Tài sản LT-003 được đánh giá là cần sửa chữa',
    type: 'error',
    isRead: false,
    assetId: '4',
    createdAt: new Date('2024-10-21'),
  },
];

// Mock Permissions
export const mockPermissions: Permission[] = [
  // User permissions
  { id: 'p1', code: 'users.view', name: 'Xem người dùng', category: PermissionCategory.USERS, description: 'Xem danh sách người dùng' },
  { id: 'p2', code: 'users.create', name: 'Tạo người dùng', category: PermissionCategory.USERS, description: 'Tạo người dùng mới' },
  { id: 'p3', code: 'users.edit', name: 'Sửa người dùng', category: PermissionCategory.USERS, description: 'Chỉnh sửa thông tin người dùng' },
  { id: 'p4', code: 'users.deactivate', name: 'Vô hiệu hóa người dùng', category: PermissionCategory.USERS, description: 'Vô hiệu hóa tài khoản người dùng' },

  // Asset permissions
  { id: 'p5', code: 'assets.view', name: 'Xem tài sản', category: PermissionCategory.ASSETS, description: 'Xem danh sách tài sản' },
  { id: 'p6', code: 'assets.create', name: 'Tạo tài sản', category: PermissionCategory.ASSETS, description: 'Thêm tài sản mới' },
  { id: 'p7', code: 'assets.edit', name: 'Sửa tài sản', category: PermissionCategory.ASSETS, description: 'Chỉnh sửa thông tin tài sản' },
  { id: 'p8', code: 'assets.assign', name: 'Gán tài sản', category: PermissionCategory.ASSETS, description: 'Gán tài sản cho nhân viên' },
  { id: 'p9', code: 'assets.reclaim', name: 'Thu hồi tài sản', category: PermissionCategory.ASSETS, description: 'Thu hồi tài sản từ nhân viên' },
  { id: 'p10', code: 'assets.evaluate', name: 'Đánh giá tài sản', category: PermissionCategory.ASSETS, description: 'Đánh giá tình trạng tài sản' },

  // Department permissions
  { id: 'p11', code: 'departments.view', name: 'Xem phòng ban', category: PermissionCategory.DEPARTMENTS, description: 'Xem danh sách phòng ban' },
  { id: 'p12', code: 'departments.create', name: 'Tạo phòng ban', category: PermissionCategory.DEPARTMENTS, description: 'Tạo phòng ban mới' },
  { id: 'p13', code: 'departments.edit', name: 'Sửa phòng ban', category: PermissionCategory.DEPARTMENTS, description: 'Chỉnh sửa thông tin phòng ban' },

  // Report permissions
  { id: 'p14', code: 'reports.view', name: 'Xem báo cáo', category: PermissionCategory.REPORTS, description: 'Xem báo cáo thống kê' },
  { id: 'p15', code: 'reports.export', name: 'Xuất báo cáo', category: PermissionCategory.REPORTS, description: 'Xuất báo cáo CSV' },

  // Settings permissions
  { id: 'p16', code: 'settings.manage', name: 'Quản lý cài đặt', category: PermissionCategory.SETTINGS, description: 'Quản lý cài đặt hệ thống' },
  { id: 'p17', code: 'roles.manage', name: 'Quản lý vai trò', category: PermissionCategory.SETTINGS, description: 'Quản lý vai trò và quyền' },
];

// Mock Roles
export const mockRoles: Role[] = [
  {
    id: 'r1',
    name: 'Admin',
    description: 'Quản trị viên hệ thống - có toàn quyền',
    permissions: mockPermissions.map(p => p.id), // All permissions
    isActive: true,
    isDefault: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'r2',
    name: 'Manager',
    description: 'Quản lý phòng ban - quản lý tài sản trong phòng',
    permissions: ['p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p14', 'p15'],
    isActive: true,
    isDefault: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'r3',
    name: 'Staff',
    description: 'Nhân viên - xem tài sản được giao',
    permissions: ['p5', 'p11', 'p14'],
    isActive: true,
    isDefault: false,
    createdAt: new Date('2024-01-01'),
  },
];

// Current user (for demo purposes)
export const currentUser: User = mockUsers[1]; // Manager IT
