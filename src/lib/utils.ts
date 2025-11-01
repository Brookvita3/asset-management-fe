import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AssetStatus, AssetCondition, UserRole } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getStatusLabel(status: AssetStatus): string {
  const labels = {
    [AssetStatus.IN_STOCK]: 'Trong kho',
    [AssetStatus.IN_USE]: 'Đang sử dụng',
    [AssetStatus.MAINTENANCE]: 'Bảo trì',
    [AssetStatus.RETIRED]: 'Đã thanh lý',
  };
  return labels[status];
}

export function getStatusColor(status: AssetStatus): string {
  const colors = {
    [AssetStatus.IN_STOCK]: 'bg-blue-100 text-blue-800',
    [AssetStatus.IN_USE]: 'bg-green-100 text-green-800',
    [AssetStatus.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
    [AssetStatus.RETIRED]: 'bg-gray-100 text-gray-800',
  };
  return colors[status];
}

export function getConditionLabel(condition: AssetCondition): string {
  const labels = {
    [AssetCondition.GOOD]: 'Tốt',
    [AssetCondition.NEEDS_REPAIR]: 'Cần sửa',
    [AssetCondition.OBSOLETE]: 'Lỗi thời',
  };
  return labels[condition];
}

export function getConditionColor(condition: AssetCondition): string {
  const colors = {
    [AssetCondition.GOOD]: 'bg-green-100 text-green-800',
    [AssetCondition.NEEDS_REPAIR]: 'bg-yellow-100 text-yellow-800',
    [AssetCondition.OBSOLETE]: 'bg-red-100 text-red-800',
  };
  return colors[condition];
}

export function getRoleLabel(role: UserRole): string {
  const labels = {
    [UserRole.ADMIN]: 'Quản trị viên',
    [UserRole.MANAGER]: 'Quản lý',
    [UserRole.STAFF]: 'Nhân viên',
  };
  return labels[role];
}

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = value?.toString() || '';
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
