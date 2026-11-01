import React from "react";

// Thin notice shown on every page when the app runs as a public demo.
const DemoBanner = () => (
  <div className="fixed bottom-2 left-1/2 z-[9999] -translate-x-1/2 rounded-full bg-[#302782]/90 px-3 py-1 text-[11px] font-bold text-white shadow-lg pointer-events-none select-none">
    DEMO · ข้อมูลสมมติ รีเซ็ตทุกวัน
  </div>
);

export default DemoBanner;
