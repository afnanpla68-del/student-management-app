import { AttendanceStatus } from '../types';

/**
 * คำนวณเกรดตามมาตรฐานการศึกษาไทย
 * 80 - 100 = เกรด 4
 * 75 - 79  = เกรด 3.5
 * 70 - 74  = เกรด 3
 * 65 - 69  = เกรด 2.5
 * 60 - 64  = เกรด 2
 * 55 - 59  = เกรด 1.5
 * 50 - 54  = เกรด 1
 * 0 - 49   = เกรด 0
 */
export function calculateGrade(totalScore: number): string {
  if (totalScore >= 80) return '4';
  if (totalScore >= 75) return '3.5';
  if (totalScore >= 70) return '3';
  if (totalScore >= 65) return '2.5';
  if (totalScore >= 60) return '2';
  if (totalScore >= 55) return '1.5';
  if (totalScore >= 50) return '1';
  return '0';
}

export function getGradeBadgeColor(grade: string): { bg: string; text: string; border: string } {
  switch (grade) {
    case '4':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case '3.5':
      return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
    case '3':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case '2.5':
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
    case '2':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case '1.5':
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    case '1':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case '0':
    default:
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  }
}

export function getAttendanceBadgeColor(status: AttendanceStatus): { bg: string; text: string; dot: string } {
  switch (status) {
    case 'มา':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    case 'ลา':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'ขาด':
      return { bg: 'bg-red-50 text-red-700 border-red-200', text: 'text-red-700', dot: 'bg-red-500' };
  }
}
