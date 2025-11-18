'use client';

import { ResetPasswordForm, ResetPasswordHeader, LoginHero } from '@/components/auth';

export default function ResetPasswordLayout({
  form,
  error,
  success,
  loading,
  showPassword,
  showConfirmPassword,
  onFormChange,
  onSubmit,
  onTogglePassword,
  onToggleConfirmPassword,
  onBackToLogin
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen p-5">
        <LoginHero />
        
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-200 p-5 max-h-[90vh] overflow-y-auto">
            <ResetPasswordHeader />
            
            <div className="mt-4">
              <ResetPasswordForm
                form={form}
                error={error}
                success={success}
                loading={loading}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                onFormChange={onFormChange}
                onSubmit={onSubmit}
                onTogglePassword={onTogglePassword}
                onToggleConfirmPassword={onToggleConfirmPassword}
                onBackToLogin={onBackToLogin}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
            <ResetPasswordHeader isMobile />
            
            <div className="mt-6">
              <ResetPasswordForm
                form={form}
                error={error}
                success={success}
                loading={loading}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                onFormChange={onFormChange}
                onSubmit={onSubmit}
                onTogglePassword={onTogglePassword}
                onToggleConfirmPassword={onToggleConfirmPassword}
                onBackToLogin={onBackToLogin}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
