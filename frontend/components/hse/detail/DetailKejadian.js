import React from "react";

const DetailKejadian = ({ detailKejadian }) => {
  return (
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Detail Kejadian</h2>
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
        {detailKejadian}
      </p>
    </div>
  );
};

export default DetailKejadian;
