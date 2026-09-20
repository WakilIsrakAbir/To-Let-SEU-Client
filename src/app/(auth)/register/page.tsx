'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SEU_DEPARTMENTS } from '@/lib/constants';
import { SEUDepartment } from '@/types/user';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  GraduationCap,
  BadgeCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { currentTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'CSE' as SEUDepartment,
    studentId: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = formData.email.toLowerCase().trim();
    if (!normalizedEmail.endsWith('@gmail.com')) {
      setError('Only valid @gmail.com accounts are permitted to register.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await register({
      name: formData.name,
      email: normalizedEmail,
      phone: formData.phone,
      department: formData.department,
      studentId: formData.studentId,
      password: formData.password,
    });
    setLoading(false);

    if (res.success) {
      router.push('/posts');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 py-12 transition-colors">
      <div className="card w-full max-w-lg bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            style={{ backgroundColor: currentTheme.hex }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white mb-3 shadow-lg"
          >
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Create SEU Student Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Join the Southeast University bachelor roommate network
          </p>
        </div>

        {error && (
          <div className="alert alert-error bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl mb-6 p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Google Sign Up */}
        <div className="mb-4">
          <GoogleAuthButton label="Sign Up with Google" />
        </div>

        <div className="divider text-[11px] font-bold text-slate-400 uppercase tracking-wider my-4">
          or register with Gmail & password
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Tanvir Ahmed"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full pl-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Gmail Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-sm"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Must be @gmail.com
              </span>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone className="w-5 h-5" />
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* SEU Department & Student ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                SEU Department
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="select select-bordered w-full pl-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                >
                  {SEU_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                SEU Student ID (Optional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <BadgeCheck className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  name="studentId"
                  placeholder="20220000000XX"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: currentTheme.hex }}
            className="btn w-full border-none text-white rounded-xl py-3 mt-4 text-base font-semibold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          Already registered?{' '}
          <Link
            href="/login"
            style={{ color: currentTheme.hex }}
            className="font-bold hover:underline inline-flex items-center gap-1"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
