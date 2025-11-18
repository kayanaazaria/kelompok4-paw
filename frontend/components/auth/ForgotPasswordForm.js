'use client';

export default function ForgotPasswordForm({ 
  email,
  error,
  success,
  loading,
  onEmailChange,
  onSubmit,
  onBackToLogin
}) {
  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-2">
          {success}
        </div>
      )}

      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={onEmailChange}
            placeholder="Contoh@email.com"
            className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2 transition disabled:opacity-60"
        >
          {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
        </button>
      </form>

      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full text-sm text-emerald-600 hover:underline text-center"
      >
        Kembali ke halaman login
      </button>
    </div>
  );
}
