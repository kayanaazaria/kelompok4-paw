import Link from "next/link";

export default function InvalidTokenMessage() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Tidak Valid</h2>
      <p className="text-gray-600 mb-6">
        Link reset password tidak valid atau sudah kedaluwarsa.
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
