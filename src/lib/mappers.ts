import {
  Asset,
  AssetCondition,
  AssetStatus,
  AssetType as FrontendAssetType,
  Department,
  User,
  UserRole,
  ActionType,
  AssetHistory,
} from "../types";
import {
  AssetDTO,
  AssetHistoryDTO,
  AssetTypeDTO,
  DepartmentDTO,
  UserDTO,
} from "../types/backend";

const parseAssetStatus = (status?: string): AssetStatus => {
  switch (status) {
    case AssetStatus.IN_STOCK:
    case AssetStatus.IN_USE:
    case AssetStatus.RETIRED:
    case AssetStatus.MAINTENANCE:
      return status;
    case "REPAIR":
      return AssetStatus.MAINTENANCE;
    default:
      return AssetStatus.IN_STOCK;
  }
};

const parseAssetCondition = (condition?: string): AssetCondition => {
  switch (condition) {
    case AssetCondition.GOOD:
    case AssetCondition.NEEDS_REPAIR:
    case AssetCondition.OBSOLETE:
      return condition;
    case "DAMAGED":
      return AssetCondition.NEEDS_REPAIR;
    default:
      return AssetCondition.GOOD;
  }
};

const parseUserRole = (role?: string): UserRole => {
  switch (role) {
    case UserRole.ADMIN:
    case UserRole.MANAGER:
    case UserRole.STAFF:
      return role;
    default:
      return UserRole.STAFF;
  }
};

export const toAssetType = (dto: AssetTypeDTO): FrontendAssetType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  isActive: dto.isActive,
});

export const toDepartment = (dto: DepartmentDTO): Department => ({
  id: String(dto.id),
  name: dto.name,
  description: dto.description,
  managerId: dto.managerId ? String(dto.managerId) : undefined,
  isActive: dto.isActive,
  employeeCount: dto.employeeCount ?? 0,
});

export const toUser = (dto: UserDTO): User => ({
  id: String(dto.id),
  name: dto.name,
  email: dto.email,
  role: parseUserRole(dto.role),
  departmentId: dto.departmentId ? String(dto.departmentId) : "",
  isActive: dto.active,
  avatar: dto.avatarUrl,
  createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
});

export const toAsset = (dto: AssetDTO): Asset => ({
  id: String(dto.id),
  code: dto.code,
  name: dto.name,
  typeId: dto.typeId ? String(dto.typeId) : "",
  departmentId: dto.departmentId ? String(dto.departmentId) : undefined,
  assignedTo: dto.assignedTo ? String(dto.assignedTo) : undefined,
  purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : new Date(),
  value: dto.value ?? 0,
  status: parseAssetStatus(dto.status),
  condition: parseAssetCondition(dto.condition),
  image: dto.imageUrl,
  description: dto.description,
  createdBy: dto.createdBy ?? "",
  createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
});
export const toAssetHistory = (dto: AssetHistoryDTO): AssetHistory => ({
  id: String(dto.id),
  assetId: String(dto.assetId),
  actionType: dto.actionType as ActionType,
  performedBy: dto.performedBy,
  performedAt: dto.performedAt ? new Date(dto.performedAt) : new Date(),
  details: dto.details ?? "",
  notes: dto.notes ?? "",
  previousStatus: dto.previousStatus
    ? parseAssetStatus(dto.previousStatus)
    : undefined,
  newStatus: dto.newStatus ? parseAssetStatus(dto.newStatus) : undefined,
});