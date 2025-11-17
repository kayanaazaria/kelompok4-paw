import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackToLogin() {
  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Kembali ke Login</span>
    </Link>
  );
}
