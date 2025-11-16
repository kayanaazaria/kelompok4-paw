'use client';

export default function UserStats({ totalUsers }) {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
      <p>Total pengguna: <span className="font-semibold">{totalUsers}</span></p>
    </div>
  );
}
