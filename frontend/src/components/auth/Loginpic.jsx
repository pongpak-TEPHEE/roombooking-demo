import React from "react";
import { CalendarCheck, QrCode, ShieldCheck, FileSpreadsheet } from "lucide-react";

// Left-hand panel of the login page (desktop only): what the system does.
const FEATURES = [
  { icon: CalendarCheck, title: "จองห้องพร้อมตรวจเวลาชน", desc: "ระบบเช็กการจองซ้อนและตารางเรียนก่อนส่งคำขอ" },
  { icon: ShieldCheck, title: "ขั้นตอนอนุมัติ", desc: "เจ้าหน้าที่อนุมัติหรือปฏิเสธคำขอ และแจ้งผลผู้จอง" },
  { icon: QrCode, title: "QR Code หน้าห้อง", desc: "สแกนดูสถานะห้องและตารางการใช้งานวันนี้ได้ทันที" },
  { icon: FileSpreadsheet, title: "นำเข้าตารางเรียน", desc: "อัปโหลดตารางเรียนทั้งเทอมจากไฟล์ Excel/CSV" },
];

const Loginpic = () => (
  <div className="hidden lg:flex w-[55%] shrink-0 relative overflow-hidden bg-gradient-to-br from-[#302782] to-[#1d175a] text-white items-center justify-center p-12 xl:p-16">
    <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#B2BB1E]/20 blur-3xl" />
    <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
    <div className="relative max-w-lg">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B2BB1E]">Room Booking · Demo</p>
      <h2 className="mt-3 text-4xl xl:text-5xl font-black leading-tight">ระบบจองห้องเรียนและห้องปฏิบัติการ</h2>
      <ul className="mt-10 space-y-6">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Icon size={22} className="text-[#B2BB1E]" />
            </div>
            <div>
              <p className="font-black">{title}</p>
              <p className="text-sm text-white/75">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default Loginpic;
