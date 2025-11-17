import { Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordSuccess({ email }) {
  return (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
        <Mail className="w-8 h-8 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Terkirim!</h2>
      <p className="text-gray-600 mb-6">
        Kami telah mengirimkan link reset password ke email <strong>{email}</strong>. 
        Silakan cek inbox atau folder spam Anda.
      </p>
      <Link
        href="/login"
        className="inline-block w-full bg-emerald-600 text-white font-semibold rounded-lg py-3 hover:bg-emerald-700 transition"
      >
        Kembali ke Login
      </Link>
    </div>
  );
}
