import React from "react";
import ReportTable from "./ReportTable";
import ReportCards from "./ReportCards";

const ReportList = ({ reports, loading, onEdit, onDelete, onView, onSubmit }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Memuat laporan...</span>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada laporan</h3>
          <p className="mt-1 text-sm text-gray-500">
            Mulai dengan membuat laporan kecelakaan baru.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <ReportTable
        reports={reports}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        onSubmit={onSubmit}
      />
      <ReportCards
        reports={reports}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ReportList;
