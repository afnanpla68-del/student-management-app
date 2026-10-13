import React, { useState, useEffect } from 'react';
import { Student, StudentFormData, AttendanceStatus } from '../types';
import { calculateGrade, getGradeBadgeColor } from '../utils/gradeCalculator';
import { X, Calculator, AlertCircle, Save, Sparkles } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
  initialData?: Student | null;
  existingGradeLevels: string[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingGradeLevels,
}) => {
  const isEditing = Boolean(initialData);

  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('ม.1/1');
  const [customGradeLevel, setCustomGradeLevel] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>('มา');
  const [midtermScore, setMidtermScore] = useState<string>('40');
  const [finalScore, setFinalScore] = useState<string>('40');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when initialData changes
  useEffect(() => {
    if (initialData) {
      setStudentId(initialData.studentId);
      setFullName(initialData.fullName);
      setAttendanceStatus(initialData.attendanceStatus);
      setMidtermScore(String(initialData.midtermScore));
      setFinalScore(String(initialData.finalScore));

      if (existingGradeLevels.includes(initialData.gradeLevel)) {
        setGradeLevel(initialData.gradeLevel);
        setCustomGradeLevel('');
      } else {
        setGradeLevel('custom');
        setCustomGradeLevel(initialData.gradeLevel);
      }
    } else {
      // Default new student state
      setStudentId('');
      setFullName('');
      setGradeLevel(existingGradeLevels[0] || 'ม.1/1');
      setCustomGradeLevel('');
      setAttendanceStatus('มา');
      setMidtermScore('35');
      setFinalScore('40');
    }
    setErrors({});
  }, [initialData, isOpen, existingGradeLevels]);

  if (!isOpen) return null;

  // Real-time automatic calculations
  const parsedMidterm = Number(midtermScore) || 0;
  const parsedFinal = Number(finalScore) || 0;
  const computedTotalScore = Math.min(100, Math.max(0, parsedMidterm + parsedFinal));
  const computedGrade = calculateGrade(computedTotalScore);
  const gradeColor = getGradeBadgeColor(computedGrade);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!studentId.trim()) {
      errs.studentId = 'กรุณาระบุรหัสนักเรียน เช่น STU-1001';
    } else if (studentId.trim().length > 32) {
      errs.studentId = 'รหัสนักเรียนต้องไม่เกิน 32 ตัวอักษร';
    }

    if (!fullName.trim()) {
      errs.fullName = 'กรุณาระบุชื่อ-นามสกุลนักเรียน';
    } else if (fullName.trim().length > 100) {
      errs.fullName = 'ชื่อ-นามสกุลต้องไม่เกิน 100 ตัวอักษร';
    }

    const finalRoom = gradeLevel === 'custom' ? customGradeLevel.trim() : gradeLevel;
    if (!finalRoom) {
      errs.gradeLevel = 'กรุณาระบุระดับชั้น/ห้องเรียน เช่น ม.1/1';
    }

    if (isNaN(parsedMidterm) || parsedMidterm < 0 || parsedMidterm > 50) {
      errs.midtermScore = 'คะแนนกลางภาคต้องอยู่ระหว่าง 0 - 50 คะแนน';
    }

    if (isNaN(parsedFinal) || parsedFinal < 0 || parsedFinal > 50) {
      errs.finalScore = 'คะแนนปลายภาคต้องอยู่ระหว่าง 0 - 50 คะแนน';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const resolvedGradeLevel = gradeLevel === 'custom' ? customGradeLevel.trim() : gradeLevel;

    setIsSubmitting(true);
    try {
      await onSubmit({
        studentId: studentId.trim(),
        fullName: fullName.trim(),
        gradeLevel: resolvedGradeLevel,
        attendanceStatus,
        midtermScore: parsedMidterm,
        finalScore: parsedFinal,
      });
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มข้อมูลนักเรียนใหม่'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              กรอกข้อมูลการเรียนและการเข้าเรียนเพื่อคำนวณเกรดอัตโนมัติ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errors.submit && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Student ID & Grade Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                รหัสนักเรียน <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น STU-1001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  errors.studentId ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600`}
              />
              {errors.studentId && (
                <p className="text-[11px] text-red-600 mt-1">{errors.studentId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ระดับชั้น / ห้องเรียน <span className="text-red-500">*</span>
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
              >
                {existingGradeLevels.length > 0 ? (
                  existingGradeLevels.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="ม.1/1">ม.1/1</option>
                    <option value="ม.1/2">ม.1/2</option>
                    <option value="ม.2/1">ม.2/1</option>
                    <option value="ม.2/2">ม.2/2</option>
                    <option value="ม.3/1">ม.3/1</option>
                  </>
                )}
                <option value="custom">+ กำหนดห้องเรียนเอง...</option>
              </select>

              {gradeLevel === 'custom' && (
                <input
                  type="text"
                  placeholder="ระบุ เช่น ม.4/1, ป.6/2"
                  value={customGradeLevel}
                  onChange={(e) => setCustomGradeLevel(e.target.value)}
                  className="mt-2 w-full px-3 py-1.5 text-xs rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              )}
              {errors.gradeLevel && (
                <p className="text-[11px] text-red-600 mt-1">{errors.gradeLevel}</p>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ชื่อ-นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="เช่น ด.ช. กฤษณะ ศรีวิเศษ"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl border ${
                errors.fullName ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Attendance Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              สถานะการมาเรียน <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['มา', 'ลา', 'ขาด'] as AttendanceStatus[]).map((status) => {
                const isSelected = attendanceStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setAttendanceStatus(status)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? status === 'มา'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-400 ring-2 ring-emerald-200'
                          : status === 'ลา'
                          ? 'bg-amber-50 text-amber-700 border-amber-400 ring-2 ring-amber-200'
                          : 'bg-red-50 text-red-700 border-red-400 ring-2 ring-red-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        status === 'มา'
                          ? 'bg-emerald-500'
                          : status === 'ลา'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <span>{status === 'มา' ? 'มาเรียน' : status === 'ลา' ? 'ลากิจ/ป่วย' : 'ขาดเรียน'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exam Scores (Midterm & Final) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                คะแนนกลางภาค (0 - 50) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="1"
                value={midtermScore}
                onChange={(e) => setMidtermScore(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  errors.midtermScore ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600`}
              />
              {errors.midtermScore && (
                <p className="text-[11px] text-red-600 mt-1">{errors.midtermScore}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                คะแนนปลายภาค (0 - 50) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="1"
                value={finalScore}
                onChange={(e) => setFinalScore(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  errors.finalScore ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600`}
              />
              {errors.finalScore && (
                <p className="text-[11px] text-red-600 mt-1">{errors.finalScore}</p>
              )}
            </div>
          </div>

          {/* Live Automatic Calculation Preview */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>คำนวณผลการเรียนอัตโนมัติ (Live Calculation)</span>
              </span>
              <span className="text-[11px] font-normal text-blue-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>คำนวณทันที</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Total Score */}
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                <span className="text-[11px] text-slate-500 block">คะแนนรวม (เต็ม 100)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-slate-900">
                    {computedTotalScore}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  กลางภาค {parsedMidterm} + ปลายภาค {parsedFinal}
                </div>
              </div>

              {/* Calculated Grade */}
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                <span className="text-[11px] text-slate-500 block">เกรดที่ได้</span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-3 py-0.5 rounded-lg text-xl font-bold border ${gradeColor.bg} ${gradeColor.text} ${gradeColor.border}`}
                  >
                    เกรด {computedGrade}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {computedTotalScore >= 80
                    ? 'ผลการเรียนดีเยี่ยม'
                    : computedTotalScore >= 70
                    ? 'ผลการเรียนดี'
                    : computedTotalScore >= 50
                    ? 'ผ่านเกณฑ์'
                    : 'ต้องปรับปรุง (ไม่ผ่านเกณฑ์)'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-sm shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มนักเรียน'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
