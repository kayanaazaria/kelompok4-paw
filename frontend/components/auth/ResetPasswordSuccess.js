import { Lock } from "lucide-react";

export default function ResetPasswordSuccess() {
  return (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Berhasil Direset!</h2>
      <p className="text-gray-600 mb-6">
        Password Anda telah berhasil diubah. Anda akan diarahkan ke halaman login...
      </p>
    </div>
  );
}
