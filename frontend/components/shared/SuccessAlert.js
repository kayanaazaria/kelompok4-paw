'use client';

export default function SuccessAlert({ message }) {
  if (!message) return null;
  return (
    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
      {message}
    </div>
  );
}
