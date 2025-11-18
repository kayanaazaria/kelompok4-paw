'use client';

export default function ErrorAlert({ message }) {
  if (!message) return null;
  
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {message}
    </div>
  );
}
