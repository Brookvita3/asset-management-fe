// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

export enum AssetStatus {
  IN_STOCK = 'IN_STOCK',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED',
}

export enum AssetCondition {
  GOOD = 'GOOD',
  NEEDS_REPAIR = 'NEEDS_REPAIR',
  OBSOLETE = 'OBSOLETE',
}

export enum ActionType {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  RECLAIMED = 'RECLAIMED',
  EVALUATED = 'EVALUATED',
  UPDATED = 'UPDATED',
}

export enum PermissionCategory {
  USERS = 'USERS',
  ASSETS = 'ASSETS',
  DEPARTMENTS = 'DEPARTMENTS',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
}

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  isActive: boolean;
  employeeCount: number;
}

export interface AssetType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  typeId: string;
  departmentId?: string;
  assignedTo?: string;
  purchaseDate: Date;
  value: number;
  status: AssetStatus;
  condition?: AssetCondition;
  image?: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
}

export interface AssetHistory {
  id: string;
  assetId: string;
  actionType: ActionType;
  performedBy: string;
  performedAt: Date;
  details: string;
  notes?: string;
  previousStatus?: AssetStatus;
  newStatus?: AssetStatus;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  assetId?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ReportData {
  departmentStats: {
    departmentId: string;
    departmentName: string;
    totalAssets: number;
    inStock: number;
    inUse: number;
    totalValue: number;
  }[];
  statusStats: {
    status: AssetStatus;
    count: number;
    percentage: number;
  }[];
  conditionStats: {
    condition: AssetCondition;
    count: number;
  }[];
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  category: PermissionCategory;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs
  isActive: boolean;
  isDefault: boolean; // Cannot be deleted or disabled
  createdAt: Date;
}
