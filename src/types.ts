export type AttendanceStatus = 'มา' | 'ลา' | 'ขาด';

export interface Student {
  id?: string;
  studentId: string;
  fullName: string;
  gradeLevel: string;
  attendanceStatus: AttendanceStatus;
  midtermScore: number;
  finalScore: number;
  totalScore: number;
  grade: string;
  creatorUid: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentFormData {
  studentId: string;
  fullName: string;
  gradeLevel: string;
  attendanceStatus: AttendanceStatus;
  midtermScore: number;
  finalScore: number;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface DashboardStats {
  totalStudents: number;
  presentCount: number;
  leaveCount: number;
  absentCount: number;
  attendanceRate: number;
  averageTotalScore: number;
  topScore: number;
  passRate: number;
  gradeDistribution: Record<string, number>;
}
