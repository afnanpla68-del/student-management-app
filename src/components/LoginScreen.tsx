import React from 'react';
import { GraduationCap, Database, CheckCircle2, Award, Users, BarChart3 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  isLoading,
  errorMessage,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 sm:p-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Student Education Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            ระบบสารสนเทศและการจัดการข้อมูลนักเรียน
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Firebase: student-education-hub</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 mb-8 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>จัดการข้อมูลนักเรียนและระดับชั้น (Classroom Levels)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>บันทึกสถานะการมาเรียน (มา / ลา / ขาด)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>คำนวณคะแนนรวมและตัดเกรดอัตโนมัติ (เกรด 0 ถึง 4)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <BarChart3 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>แดชบอร์ดสรุปสถิติและกราฟการกระจายตัวของเกรด</span>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
            {errorMessage}
          </div>
        )}

        {/* Google Login Button */}
        <div>
          <button
            onClick={onLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google Account'}</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          เข้าใช้งานอย่างปลอดภัยด้วยระบบการยืนยันตัวตน Google Firebase Authentication
        </p>
      </div>
    </div>
  );
};
