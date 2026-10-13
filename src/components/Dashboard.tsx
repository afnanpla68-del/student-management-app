import React from 'react';
import { Student } from '../types';
import {
  Users,
  UserCheck,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  UserX,
  Clock,
  BookOpen,
} from 'lucide-react';
import { getGradeBadgeColor } from '../utils/gradeCalculator';

interface DashboardProps {
  students: Student[];
  onNavigateToStudents: () => void;
  onSeedSampleData: () => void;
  isSeeding: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  onNavigateToStudents,
  onSeedSampleData,
  isSeeding,
}) => {
  const totalStudents = students.length;

  const presentCount = students.filter((s) => s.attendanceStatus === 'มา').length;
  const leaveCount = students.filter((s) => s.attendanceStatus === 'ลา').length;
  const absentCount = students.filter((s) => s.attendanceStatus === 'ขาด').length;

  const attendanceRate =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const averageScore =
    totalStudents > 0
      ? (
          students.reduce((acc, s) => acc + (s.totalScore || 0), 0) / totalStudents
        ).toFixed(1)
      : '0.0';

  const maxScore =
    totalStudents > 0 ? Math.max(...students.map((s) => s.totalScore || 0)) : 0;

  const passedStudents = students.filter((s) => (s.totalScore || 0) >= 50).length;
  const passRate =
    totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 100) : 0;

  // Grade distributions: 4, 3.5, 3, 2.5, 2, 1.5, 1, 0
  const gradeKeys = ['4', '3.5', '3', '2.5', '2', '1.5', '1', '0'];
  const gradeDistribution: Record<string, number> = {};
  gradeKeys.forEach((g) => {
    gradeDistribution[g] = 0;
  });

  students.forEach((s) => {
    const g = s.grade || '0';
    if (gradeDistribution[g] !== undefined) {
      gradeDistribution[g]++;
    } else {
      gradeDistribution['0']++;
    }
  });

  const maxGradeCount = Math.max(...Object.values(gradeDistribution), 1);

  // Group by grade levels (classrooms)
  const classroomMap: Record<
    string,
    { total: number; present: number; totalScore: number }
  > = {};
  students.forEach((s) => {
    const c = s.gradeLevel || 'ไม่ระบุ';
    if (!classroomMap[c]) {
      classroomMap[c] = { total: 0, present: 0, totalScore: 0 };
    }
    classroomMap[c].total++;
    if (s.attendanceStatus === 'มา') classroomMap[c].present++;
    classroomMap[c].totalScore += s.totalScore || 0;
  });

  const classrooms = Object.keys(classroomMap).sort();

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-linear-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-600/15 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-medium text-blue-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ระบบสารสนเทศและการจัดการข้อมูลนักเรียน</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            แดชบอร์ดสรุปผลการเรียนและการเข้าเรียน
          </h2>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            ติดตามสถานะการมาเรียน คะแนนสอบกลางภาค-ปลายภาค และวิเคราะห์การกระจายตัวของเกรดนักเรียนแบบเรียลไทม์
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToStudents}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
            >
              <span>จัดการรายชื่อนักเรียน</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {totalStudents === 0 && (
              <button
                onClick={onSeedSampleData}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 text-white text-sm font-medium transition-colors border border-white/20 cursor-pointer disabled:opacity-60"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isSeeding ? 'กำลังโหลด...' : 'โหลดข้อมูลตัวอย่างนักเรียน (12 คน)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              จำนวนนักเรียนทั้งหมด
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500">คน</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {classrooms.length > 0
              ? `กระจายอยู่ใน ${classrooms.length} ห้องเรียน`
              : 'ยังไม่มีข้อมูลนักเรียน'}
          </p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              อัตราการมาเรียน
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600">{attendanceRate}%</span>
            <span className="text-xs text-slate-500">({presentCount}/{totalStudents} คน)</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>มา {presentCount}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 ml-1" />
            <span>ลา {leaveCount}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-1" />
            <span>ขาด {absentCount}</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              คะแนนเฉลี่ยรวม
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-700">{averageScore}</span>
            <span className="text-xs text-slate-500">/ 100 คะแนน</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            คะแนนสูงสุดในระบบ: <span className="font-semibold text-slate-700">{maxScore}</span> คะแนน
          </p>
        </div>

        {/* Pass Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              อัตราการผ่านเกณฑ์
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-teal-700">{passRate}%</span>
            <span className="text-xs text-slate-500">({passedStudents}/{totalStudents} คน)</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            เกณฑ์ผ่าน: ได้คะแนนรวม 50 คะแนนขึ้นไป (เกรด 1 ขึ้นไป)
          </p>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                กราฟการกระจายตัวของเกรด (Grade Distribution)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                สถิตินักเรียนแยกตามเกรดผลการเรียน 8 ระดับ (เกรด 4 ถึงเกรด 0)
              </p>
            </div>
            <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              รวม {totalStudents} คน
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2">
            {gradeKeys.map((grade) => {
              const count = gradeDistribution[grade] || 0;
              const percentage =
                totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
              const heightPercent = totalStudents > 0 ? (count / maxGradeCount) * 100 : 0;
              const colors = getGradeBadgeColor(grade);

              return (
                <div
                  key={grade}
                  className="flex-1 flex flex-col items-center justify-end h-full group"
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md shadow-xs pointer-events-none whitespace-nowrap">
                    {count} คน ({percentage}%)
                  </div>

                  {/* Count indicator above bar */}
                  <div className="text-xs font-bold text-slate-700 mb-1">
                    {count > 0 ? count : ''}
                  </div>

                  {/* Vertical bar */}
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-44 relative">
                    <div
                      style={{ height: `${Math.max(heightPercent, count > 0 ? 8 : 2)}%` }}
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        grade === '4'
                          ? 'bg-linear-to-t from-emerald-500 to-emerald-400'
                          : grade === '3.5'
                          ? 'bg-linear-to-t from-teal-500 to-teal-400'
                          : grade === '3'
                          ? 'bg-linear-to-t from-blue-500 to-blue-400'
                          : grade === '2.5'
                          ? 'bg-linear-to-t from-cyan-500 to-cyan-400'
                          : grade === '2'
                          ? 'bg-linear-to-t from-amber-500 to-amber-400'
                          : grade === '1.5'
                          ? 'bg-linear-to-t from-orange-500 to-orange-400'
                          : grade === '1'
                          ? 'bg-linear-to-t from-rose-500 to-rose-400'
                          : 'bg-linear-to-t from-red-500 to-red-400'
                      }`}
                    />
                  </div>

                  {/* Grade label */}
                  <div className="mt-3 text-center">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded-md text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border}`}
                    >
                      เกรด {grade}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>เกณฑ์เกรด 4 (80-100) • 3.5 (75-79) • 3 (70-74) • 2.5 (65-69) • 2 (60-64) • 1.5 (55-59) • 1 (50-54) • 0 (0-49)</span>
            <button
              onClick={onNavigateToStudents}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>ดูรายชื่อนักเรียน</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Attendance Breakdown & Classroom Summary (1 col) */}
        <div className="space-y-6">
          {/* Attendance Stats Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              สถิติการเข้าเรียน (Attendance)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              สรุปอัตราการมา ลา ขาด ของนักเรียน
            </p>

            {/* Visual Progress Bar */}
            <div className="h-4 rounded-full bg-slate-100 overflow-hidden flex mb-4">
              {totalStudents > 0 ? (
                <>
                  <div
                    style={{ width: `${(presentCount / totalStudents) * 100}%` }}
                    className="bg-emerald-500 transition-all duration-300"
                    title={`มา: ${presentCount} คน`}
                  />
                  <div
                    style={{ width: `${(leaveCount / totalStudents) * 100}%` }}
                    className="bg-amber-500 transition-all duration-300"
                    title={`ลา: ${leaveCount} คน`}
                  />
                  <div
                    style={{ width: `${(absentCount / totalStudents) * 100}%` }}
                    className="bg-red-500 transition-all duration-300"
                    title={`ขาด: ${absentCount} คน`}
                  />
                </>
              ) : (
                <div className="w-full bg-slate-200" />
              )}
            </div>

            {/* Detailed Breakdown List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-900">มาเรียนปกติ</div>
                    <div className="text-[11px] text-emerald-700">เข้าชั้นเรียนตรงเวลา</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-900">{presentCount}</span>
                  <span className="text-xs text-emerald-700 ml-1">
                    ({totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900">ลากิจ / ลาป่วย</div>
                    <div className="text-[11px] text-amber-700">มีใบลาหรือแจ้งล่วงหน้า</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-900">{leaveCount}</span>
                  <span className="text-xs text-amber-700 ml-1">
                    ({totalStudents > 0 ? Math.round((leaveCount / totalStudents) * 100) : 0}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 border border-red-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center">
                    <UserX className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-900">ขาดเรียน</div>
                    <div className="text-[11px] text-red-700">ไม่มาโดยไม่แจ้งเหตุผล</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-red-900">{absentCount}</span>
                  <span className="text-xs text-red-700 ml-1">
                    ({totalStudents > 0 ? Math.round((absentCount / totalStudents) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Classroom Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              สรุปตามห้องเรียน (Classrooms)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              สถิติคะแนนและการมาเรียนแยกตามห้อง
            </p>

            {classrooms.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {classrooms.map((room) => {
                  const data = classroomMap[room];
                  const avg = (data.totalScore / data.total).toFixed(1);
                  const attPct = Math.round((data.present / data.total) * 100);

                  return (
                    <div
                      key={room}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                          {room}
                        </span>
                        <span className="text-slate-600">{data.total} คน</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">
                          มา: <strong className="text-emerald-600">{attPct}%</strong>
                        </span>
                        <span className="text-slate-500">
                          เฉลี่ย: <strong className="text-indigo-600">{avg}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                ยังไม่มีข้อมูลห้องเรียน
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
