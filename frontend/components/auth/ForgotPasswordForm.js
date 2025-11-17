import { Mail } from "lucide-react";

export default function ForgotPasswordForm({ 
  email, 
  setEmail, 
  loading, 
  error, 
  onSubmit 
}) {
  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h1>
        <p className="text-gray-600 text-sm">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-3 transition disabled:opacity-60"
        >
          {loading ? "Mengirim..." : "Kirim Link Reset Password"}
        </button>
      </form>
    </>
  );
}
