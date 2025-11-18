import React from "react";
import { Paperclip } from "lucide-react";

const LampiranSection = ({ attachmentUrl }) => {
  if (!attachmentUrl) return null;

  const fileUrl = `http://localhost:5001${attachmentUrl}`;

  return (
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Lampiran</h2>
      <a
        href={fileUrl}
        download
        className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm sm:text-base"
      >
        <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-medium">Download Lampiran</span>
      </a>
    </div>
  );
};

export default LampiranSection;
