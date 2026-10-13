import React, { useState, useMemo } from 'react';
import { Student, AttendanceStatus } from '../types';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Download,
  BookOpen,
  ArrowUpDown,
  GraduationCap,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import {
  getGradeBadgeColor,
  getAttendanceBadgeColor,
} from '../utils/gradeCalculator';

interface StudentTableProps {
  students: Student[];
  onAddClick: () => void;
  onEditClick: (student: Student) => void;
  onDeleteClick: (student: Student) => void;
  onSeedSampleData: () => void;
  isSeeding: boolean;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onSeedSampleData,
  isSeeding,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeLevelFilter, setGradeLevelFilter] = useState('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState<string>('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'studentId' | 'fullName' | 'totalScore' | 'grade'>('studentId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Extract unique gradeLevels (classrooms)
  const uniqueGradeLevels = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.gradeLevel) set.add(s.gradeLevel);
    });
    return Array.from(set).sort();
  }, [students]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        // Search filter
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !query ||
          student.studentId.toLowerCase().includes(query) ||
          student.fullName.toLowerCase().includes(query) ||
          student.gradeLevel.toLowerCase().includes(query);

        // Grade level filter
        const matchesGradeLevel =
          gradeLevelFilter === 'ALL' || student.gradeLevel === gradeLevelFilter;

        // Attendance status filter
        const matchesAttendance =
          attendanceFilter === 'ALL' || student.attendanceStatus === attendanceFilter;

        // Grade filter
        const matchesGrade =
          gradeFilter === 'ALL' || student.grade === gradeFilter;

        return matchesSearch && matchesGradeLevel && matchesAttendance && matchesGrade;
      })
      .sort((a, b) => {
        let valA: string | number = a[sortField];
        let valB: string | number = b[sortField];

        if (sortField === 'totalScore') {
          return sortDirection === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
        }

        if (sortField === 'grade') {
          return sortDirection === 'asc'
            ? Number(valA) - Number(valB)
            : Number(valB) - Number(valA);
        }

        const cmp = String(valA).localeCompare(String(valB), 'th');
        return sortDirection === 'asc' ? cmp : -cmp;
      });
  }, [students, searchTerm, gradeLevelFilter, attendanceFilter, gradeFilter, sortField, sortDirection]);

  // Handle export to CSV
  const handleExportCSV = () => {
    if (students.length === 0) return;

    const headers = [
      'รหัสนักเรียน',
      'ชื่อ-นามสกุล',
      'ระดับชั้น/ห้อง',
      'สถานะการมาเรียน',
      'คะแนนกลางภาค (50)',
      'คะแนนปลายภาค (50)',
      'คะแนนรวม (100)',
      'เกรด',
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.studentId}"`,
      `"${s.fullName}"`,
      `"${s.gradeLevel}"`,
      `"${s.attendanceStatus}"`,
      s.midtermScore,
      s.finalScore,
      s.totalScore,
      `"${s.grade}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `student_records_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSort = (field: 'studentId' | 'fullName' | 'totalScore' | 'grade') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              ทะเบียนรายชื่อนักเรียนและผลการประเมิน
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              จัดการข้อมูล บันทึกคะแนน และตรวจสอบผลการเรียนของนักเรียน
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {students.length === 0 && (
              <button
                onClick={onSeedSampleData}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors disabled:opacity-60 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isSeeding ? 'กำลังโหลด...' : 'โหลดข้อมูลตัวอย่าง (12 คน)'}</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              disabled={filteredStudents.length === 0}
              title="ส่งออกเป็นไฟล์ CSV"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>ส่งออก CSV</span>
            </button>

            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มนักเรียนใหม่</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหารหัส หรือ ชื่อนักเรียน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Classroom Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-slate-500 whitespace-nowrap">ห้องเรียน:</label>
            <select
              value={gradeLevelFilter}
              onChange={(e) => setGradeLevelFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="ALL">ทั้งหมด ({students.length})</option>
              {uniqueGradeLevels.map((level) => {
                const count = students.filter((s) => s.gradeLevel === level).length;
                return (
                  <option key={level} value={level}>
                    {level} ({count} คน)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Attendance Status Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-slate-500 whitespace-nowrap">การเข้าเรียน:</label>
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="ALL">สถานะทั้งหมด</option>
              <option value="มา">มาเรียน (ปกติ)</option>
              <option value="ลา">ลากิจ / ลาป่วย</option>
              <option value="ขาด">ขาดเรียน</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-slate-500 whitespace-nowrap">เกรด:</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="ALL">เกรดทั้งหมด</option>
              <option value="4">เกรด 4 (80-100)</option>
              <option value="3.5">เกรด 3.5 (75-79)</option>
              <option value="3">เกรด 3 (70-74)</option>
              <option value="2.5">เกรด 2.5 (65-69)</option>
              <option value="2">เกรด 2 (60-64)</option>
              <option value="1.5">เกรด 1.5 (55-59)</option>
              <option value="1">เกรด 1 (50-54)</option>
              <option value="0">เกรด 0 (0-49)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th
                onClick={() => toggleSort('studentId')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>รหัสนักเรียน</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('fullName')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>ชื่อ-นามสกุล</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">ระดับชั้น/ห้อง</th>
              <th className="py-3 px-4 text-center">การเข้าเรียน</th>
              <th className="py-3 px-4 text-center">กลางภาค (50)</th>
              <th className="py-3 px-4 text-center">ปลายภาค (50)</th>
              <th
                onClick={() => toggleSort('totalScore')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>คะแนนรวม (100)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('grade')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>เกรด</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const gradeBadge = getGradeBadgeColor(student.grade);
                const attendanceBadge = getAttendanceBadgeColor(student.attendanceStatus);

                return (
                  <tr
                    key={student.id || student.studentId}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    {/* Student ID */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {student.studentId}
                    </td>

                    {/* Full Name */}
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {student.fullName.charAt(0) === 'ด'
                            ? student.fullName.slice(0, 4)
                            : student.fullName.slice(0, 1)}
                        </div>
                        <span>{student.fullName}</span>
                      </div>
                    </td>

                    {/* Grade Level */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {student.gradeLevel}
                      </span>
                    </td>

                    {/* Attendance Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${attendanceBadge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${attendanceBadge.dot}`} />
                        <span>{student.attendanceStatus}</span>
                      </span>
                    </td>

                    {/* Midterm Score */}
                    <td className="py-3 px-4 text-center text-slate-700 font-medium">
                      {student.midtermScore}
                    </td>

                    {/* Final Score */}
                    <td className="py-3 px-4 text-center text-slate-700 font-medium">
                      {student.finalScore}
                    </td>

                    {/* Total Score with visual progress bar */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1 w-24">
                        <div className="font-bold text-slate-900">
                          {student.totalScore}{' '}
                          <span className="text-[10px] font-normal text-slate-400">/100</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            style={{ width: `${student.totalScore}%` }}
                            className={`h-full rounded-full ${
                              student.totalScore >= 80
                                ? 'bg-emerald-500'
                                : student.totalScore >= 65
                                ? 'bg-blue-500'
                                : student.totalScore >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Calculated Grade */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-xs border ${gradeBadge.bg} ${gradeBadge.text} ${gradeBadge.border}`}
                      >
                        เกรด {student.grade}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditClick(student)}
                          title="แก้ไขข้อมูล"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteClick(student)}
                          title="ลบข้อมูล"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-slate-700">
                      {students.length === 0 ? 'ยังไม่มีข้อมูลนักเรียนในระบบ' : 'ไม่พบข้อมูลที่ตรงกับเงื่อนไขค้นหา'}
                    </div>
                    <p className="text-xs text-slate-500">
                      {students.length === 0
                        ? 'คุณสามารถเพิ่มนักเรียนคนแรก หรือโหลดข้อมูลตัวอย่างนักเรียนเพื่อทดลองใช้งาน'
                        : 'ลองปรับคำค้นหาหรือตัวกรองห้องเรียน/สถานะ/เกรด'}
                    </p>
                    {students.length === 0 ? (
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                          onClick={onAddClick}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>เพิ่มนักเรียน</span>
                        </button>
                        <button
                          onClick={onSeedSampleData}
                          disabled={isSeeding}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>โหลดข้อมูลตัวอย่าง</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setGradeLevelFilter('ALL');
                          setAttendanceFilter('ALL');
                          setGradeFilter('ALL');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium underline cursor-pointer"
                      >
                        ล้างตัวกรองทั้งหมด
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          แสดง <strong>{filteredStudents.length}</strong> จากทั้งหมด{' '}
          <strong>{students.length}</strong> คน
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> มาเรียน
          </span>
          <span className="inline-flex items-center gap-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> ลา
          </span>
          <span className="inline-flex items-center gap-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-red-500" /> ขาด
          </span>
        </div>
      </div>
    </div>
  );
};
