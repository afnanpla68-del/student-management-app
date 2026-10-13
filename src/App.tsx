/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Student, StudentFormData, UserProfile } from './types';
import {
  subscribeStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  seedSampleStudents,
} from './services/studentService';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { StudentTable } from './components/StudentTable';
import { StudentModal } from './components/StudentModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'students'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Auto clear toast notification
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        setCurrentUser(null);
        setStudents([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to students collection when authenticated
  useEffect(() => {
    if (!currentUser) return;

    setDataLoading(true);
    const unsubscribe = subscribeStudents(
      currentUser.uid,
      (data) => {
        setStudents(data);
        setDataLoading(false);
        setErrorNotice(null);
      },
      (err) => {
        console.error('Subscription error:', err);
        setErrorNotice('ไม่สามารถโหลดข้อมูลนักเรียนได้: ' + err.message);
        setDataLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Sign-in Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setLoginError('หน้าต่างเข้าสู่ระบบถูกปิดก่อนดำเนินการเสร็จสิ้น');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setLoginError('การดำเนินการถูกยกเลิก');
      } else {
        setLoginError('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google: ' + (err.message || ''));
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setToastMessage({ type: 'success', text: 'ออกจากระบบเรียบร้อยแล้ว' });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Add / Edit Student Form Submit
  const handleStudentFormSubmit = async (formData: StudentFormData) => {
    if (!currentUser) return;

    if (editingStudent && editingStudent.id) {
      // Update
      await updateStudent(editingStudent.id, formData, currentUser.uid);
      setToastMessage({
        type: 'success',
        text: `อัปเดตข้อมูล ${formData.fullName} เรียบร้อยแล้ว`,
      });
    } else {
      // Create
      await createStudent(formData, currentUser.uid);
      setToastMessage({
        type: 'success',
        text: `เพิ่มนักเรียน ${formData.fullName} เรียบร้อยแล้ว`,
      });
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deletingStudent || !deletingStudent.id) return;
    setIsDeleting(true);
    try {
      await deleteStudent(deletingStudent.id);
      setToastMessage({
        type: 'success',
        text: `ลบข้อมูล ${deletingStudent.fullName} เรียบร้อยแล้ว`,
      });
      setDeletingStudent(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      setToastMessage({
        type: 'error',
        text: 'เกิดข้อผิดพลาดในการลบข้อมูล: ' + err.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Seed Thai Sample Students
  const handleSeedSampleData = async () => {
    if (!currentUser) return;
    setIsSeeding(true);
    try {
      const count = await seedSampleStudents(currentUser.uid);
      setToastMessage({
        type: 'success',
        text: `นำเข้าข้อมูลตัวอย่างนักเรียน ${count} คน สำเร็จแล้ว`,
      });
    } catch (err: any) {
      console.error('Seed error:', err);
      setToastMessage({
        type: 'error',
        text: 'เกิดข้อผิดพลาดในการนำเข้าข้อมูลตัวอย่าง: ' + err.message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Unique grade levels for dropdown
  const existingGradeLevels = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.gradeLevel) set.add(s.gradeLevel);
    });
    if (set.size === 0) {
      return ['ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.2/2', 'ม.3/1'];
    }
    return Array.from(set).sort();
  }, [students]);

  // Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>
      </div>
    );
  }

  // Not authenticated: Show Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={handleGoogleLogin}
        isLoading={loginLoading}
        errorMessage={loginError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentCount={students.length}
      />

      {/* Error notice banner */}
      {errorNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button
              onClick={() => setErrorNotice(null)}
              className="text-red-500 hover:text-red-800 text-xs font-bold"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {dataLoading && students.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm">กำลังโหลดข้อมูลนักเรียนจาก Cloud Firestore...</p>
          </div>
        ) : activeTab === 'dashboard' ? (
          <Dashboard
            students={students}
            onNavigateToStudents={() => setActiveTab('students')}
            onSeedSampleData={handleSeedSampleData}
            isSeeding={isSeeding}
          />
        ) : (
          <StudentTable
            students={students}
            onAddClick={() => {
              setEditingStudent(null);
              setIsModalOpen(true);
            }}
            onEditClick={(student) => {
              setEditingStudent(student);
              setIsModalOpen(true);
            }}
            onDeleteClick={(student) => {
              setDeletingStudent(student);
            }}
            onSeedSampleData={handleSeedSampleData}
            isSeeding={isSeeding}
          />
        )}
      </main>

      {/* Student Add/Edit Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleStudentFormSubmit}
        initialData={editingStudent}
        existingGradeLevels={existingGradeLevels}
      />

      {/* Student Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingStudent)}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
        student={deletingStudent}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Student Education Hub</strong> — ระบบสารสนเทศและการจัดการข้อมูลนักเรียน
          </div>
          <div className="text-slate-400">
            Cloud Firestore • student-education-hub • Real-time Data Sync
          </div>
        </div>
      </footer>
    </div>
  );
}
