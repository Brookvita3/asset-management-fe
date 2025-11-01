export interface AssetTypeDTO {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface AssetDTO {
  id: number;
  code: string;
  name: string;
  typeId: number;
  typeName?: string;
  departmentId?: number;
  departmentName?: string;
  assignedTo?: number;
  assignedToName?: string;
  purchaseDate: string;
  value: number;
  status: string;
  condition: string;
  description?: string;
  createdBy?: string;
  createdAt?: string;
  imageUrl?: string;
}

export interface DepartmentDTO {
  id: number;
  name: string;
  description: string;
  managerId?: number;
  managerName?: string;
  isActive: boolean;
  employeeCount: number;
  createdAt?: string;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  departmentId?: number;
  departmentName?: string;
  active: boolean;
  createdAt?: string;
  avatarUrl?: string;
}
