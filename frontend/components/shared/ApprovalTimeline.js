import React from "react";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

// Helper function untuk mendapatkan icon dan warna berdasarkan status
const getStatusIcon = (status) => {
  switch (status) {
    case 'done':
      return {
        icon: CheckCircle,
        bgColor: 'bg-green-500',
        bgLight: 'bg-green-50',
        textColor: 'text-green-800'
      };
    case 'current':
      return {
        icon: Clock,
        bgColor: 'bg-yellow-500',
        bgLight: 'bg-yellow-50',
        textColor: 'text-yellow-800'
      };
    case 'rejected':
      return {
        icon: XCircle,
        bgColor: 'bg-red-500',
        bgLight: 'bg-red-50',
        textColor: 'text-red-800'
      };
    case 'draft':
      return {
        icon: FileText,
        bgColor: 'bg-gray-400',
        bgLight: 'bg-gray-50',
        textColor: 'text-gray-800'
      };
    default:
      return {
        icon: Clock,
        bgColor: 'bg-gray-400',
        bgLight: 'bg-gray-50',
        textColor: 'text-gray-800'
      };
  }
};

// Komponen untuk single step dalam timeline
export const ApprovalTimelineStep = ({ label, detail, status = 'pending', showConnector = true }) => {
  const { icon: Icon, bgColor, bgLight, textColor } = getStatusIcon(status);

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* Icon Circle dengan Connector Vertikal */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`${bgColor} w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-10`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        {showConnector && (
          <div className={`${bgColor} w-1 flex-1`}></div>
        )}
      </div>

      {/* Content - Flex 1 untuk mengisi ruang */}
      <div className={`flex-1 ${bgLight} p-3 sm:p-4 rounded-lg ${showConnector ? 'mb-3' : ''}`}>
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 mt-1">{detail}</p>
      </div>
    </div>
  );
};

// Komponen timeline vertikal lengkap
export const ApprovalTimeline = ({ steps }) => {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <ApprovalTimelineStep
          key={step.id || index}
          label={step.label}
          detail={step.detail}
          status={step.status}
          showConnector={index < steps.length - 1}
        />
      ))}
    </div>
  );
};

// Komponen timeline compact (untuk modal/sidebar)
export const ApprovalTimelineCompact = ({ steps }) => {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const { icon: Icon, bgColor, bgLight } = getStatusIcon(step.status);
        const showStep = step.status !== 'skipped';
        
        if (!showStep) return null;

        return (
          <div key={step.id || index} className={`flex items-center gap-3 ${bgLight} p-3 rounded-lg`}>
            <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{step.label}</p>
              <p className="text-sm text-gray-600">{step.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApprovalTimeline;
