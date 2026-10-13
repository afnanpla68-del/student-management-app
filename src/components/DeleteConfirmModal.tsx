import React from 'react';
import { Student } from '../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  student: Student | null;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  student,
  isDeleting,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            ยืนยันการลบข้อมูลนักเรียน
          </h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            คุณต้องการลบข้อมูลของ{' '}
            <strong className="text-slate-800">{student.fullName}</strong> (รหัส:{' '}
            <span className="font-mono text-blue-600">{student.studentId}</span>) ห้อง{' '}
            {student.gradeLevel} ออกจากระบบ Cloud Firestore หรือไม่?
          </p>
          <p className="text-xs text-red-500 mt-2 font-medium">
            * การดำเนินการนี้ไม่สามารถยกเลิกได้
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all shadow-sm shadow-red-500/20 disabled:opacity-60 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังลบ...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>ลบข้อมูล</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
