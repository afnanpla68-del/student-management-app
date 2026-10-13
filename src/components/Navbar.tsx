import React from 'react';
import { UserProfile } from '../types';
import { GraduationCap, LogOut, ShieldCheck, Database } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  onLogout: () => void;
  activeTab: 'dashboard' | 'students';
  setActiveTab: (tab: 'dashboard' | 'students') => void;
  studentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  activeTab,
  setActiveTab,
  studentCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">
                  Student Education Hub
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Database className="w-3 h-3 text-blue-600" />
                  student-education-hub
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ระบบสารสนเทศและการจัดการข้อมูลนักเรียน
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              แดชบอร์ดภาพรวม
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'students'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>รายชื่อนักเรียน</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs bg-slate-200 text-slate-700 font-medium">
                {studentCount}
              </span>
            </button>
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 pl-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-9 h-9 rounded-full ring-2 ring-blue-500/20 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm shadow-xs">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="hidden md:block text-left">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                  <span>{user.displayName || 'ผู้ดูแลระบบ'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                  {user.email || 'Google User'}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="ออกจากระบบ"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
