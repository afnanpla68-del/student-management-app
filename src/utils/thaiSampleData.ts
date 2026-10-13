import { AttendanceStatus } from '../types';

export interface SampleStudentSeed {
  studentId: string;
  fullName: string;
  gradeLevel: string;
  attendanceStatus: AttendanceStatus;
  midtermScore: number;
  finalScore: number;
}

export const THAI_SAMPLE_STUDENTS: SampleStudentSeed[] = [
  {
    studentId: 'STU-1001',
    fullName: 'ด.ช. กฤษณะ ศรีวิเศษ',
    gradeLevel: 'ม.1/1',
    attendanceStatus: 'มา',
    midtermScore: 45,
    finalScore: 47,
  },
  {
    studentId: 'STU-1002',
    fullName: 'ด.ญ. ชนิกานต์ สุวรรณรัตน์',
    gradeLevel: 'ม.1/1',
    attendanceStatus: 'มา',
    midtermScore: 42,
    finalScore: 44,
  },
  {
    studentId: 'STU-1003',
    fullName: 'ด.ช. ธีรภัทร วงศ์เจริญ',
    gradeLevel: 'ม.1/1',
    attendanceStatus: 'ลา',
    midtermScore: 36,
    finalScore: 38,
  },
  {
    studentId: 'STU-1004',
    fullName: 'ด.ญ. ปรียาภรณ์ ชัยมงคล',
    gradeLevel: 'ม.1/1',
    attendanceStatus: 'มา',
    midtermScore: 48,
    finalScore: 49,
  },
  {
    studentId: 'STU-1005',
    fullName: 'ด.ช. ภัทรดนัย บุญช่วย',
    gradeLevel: 'ม.1/2',
    attendanceStatus: 'ขาด',
    midtermScore: 24,
    finalScore: 23,
  },
  {
    studentId: 'STU-1006',
    fullName: 'ด.ญ. วรัญญา เลิศปัญญา',
    gradeLevel: 'ม.1/2',
    attendanceStatus: 'มา',
    midtermScore: 38,
    finalScore: 40,
  },
  {
    studentId: 'STU-1007',
    fullName: 'ด.ช. ศุภณัฐ ธนวัฒนา',
    gradeLevel: 'ม.1/2',
    attendanceStatus: 'มา',
    midtermScore: 31,
    finalScore: 34,
  },
  {
    studentId: 'STU-1008',
    fullName: 'ด.ญ. อมรรัตน์ แก้วมณี',
    gradeLevel: 'ม.2/1',
    attendanceStatus: 'มา',
    midtermScore: 44,
    finalScore: 45,
  },
  {
    studentId: 'STU-1009',
    fullName: 'ด.ช. เอกภาพ สันติธรรม',
    gradeLevel: 'ม.2/1',
    attendanceStatus: 'ลา',
    midtermScore: 29,
    finalScore: 28,
  },
  {
    studentId: 'STU-1010',
    fullName: 'ด.ญ. ณัฐนันท์ พิทักษ์ไทย',
    gradeLevel: 'ม.2/1',
    attendanceStatus: 'มา',
    midtermScore: 35,
    finalScore: 33,
  },
  {
    studentId: 'STU-1011',
    fullName: 'ด.ช. ธนกร มงคลศิลป์',
    gradeLevel: 'ม.2/2',
    attendanceStatus: 'มา',
    midtermScore: 46,
    finalScore: 48,
  },
  {
    studentId: 'STU-1012',
    fullName: 'ด.ญ. พิชญาภา อารีรักษ์',
    gradeLevel: 'ม.2/2',
    attendanceStatus: 'ขาด',
    midtermScore: 18,
    finalScore: 22,
  },
];
