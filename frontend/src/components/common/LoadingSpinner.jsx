import React from "react";
import { Loader2 } from "lucide-react";

/**
 * LoadingSpinner — spinner กลางที่ใช้ทุกที่ในแอป
 * Props:
 *  - text: ข้อความใต้รูป (ไม่ใส่ = ไม่แสดง)
 *  - fullPage: true = ครอบทั้งหน้าจอ (flex center)
 */
const LoadingSpinner = ({ text = "กำลังโหลด...", fullPage = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-5">
      <Loader2 className="w-14 h-14 sm:w-16 sm:h-16 animate-spin text-[#302782] dark:text-[#B2BB1E]" />
      {text && (
        <p className="text-sm sm:text-base font-medium text-black dark:text-white">
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;

