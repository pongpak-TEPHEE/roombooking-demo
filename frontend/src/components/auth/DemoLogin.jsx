import React, { useEffect, useState } from "react";
import { ShieldCheck, GraduationCap, AlertCircle, Loader2 } from "lucide-react";
import api from "../../api/axios.js";

const ROLES = [
  {
    role: "teacher",
    title: "อาจารย์ (Teacher)",
    desc: "ค้นหาห้องว่าง ส่งคำขอจอง และดูประวัติการจอง",
    icon: GraduationCap,
  },
  {
    role: "staff",
    title: "เจ้าหน้าที่ (Staff)",
    desc: "อนุมัติคำขอ จัดการห้อง ผู้ใช้ ตารางเรียน และเทอม",
    icon: ShieldCheck,
  },
];

// Demo-only login: skips the e-mail OTP and signs in as a shared demo account.
const DemoLogin = ({ onSuccess }) => {
  const [loadingRole, setLoadingRole] = useState(null);
  const [error, setError] = useState("");
  const [serverReady, setServerReady] = useState(false);

  // The free-tier API sleeps when idle; ping it early so it is awake by the time the visitor clicks.
  useEffect(() => {
    let cancelled = false;
    api.get("/health", { timeout: 90000 })
      .then(() => !cancelled && setServerReady(true))
      .catch(() => !cancelled && setServerReady(true));
    return () => { cancelled = true; };
  }, []);

  const login = async (role) => {
    setError("");
    setLoadingRole(role);
    try {
      const res = await api.post("/auth/demo-login", { role }, { timeout: 90000 });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง");
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-2xl border border-[#B2BB1E]/40 bg-[#B2BB1E]/10 p-4 text-sm text-[#302782] dark:text-white">
        <p className="font-black">โหมดสาธิต (Demo)</p>
        <p className="mt-1 font-medium">
          ระบบจริงเข้าสู่ระบบด้วย OTP ทางอีเมล @ku.th แต่ในเดโมนี้เลือกบทบาทเพื่อเข้าใช้งานได้ทันที
          ข้อมูลทั้งหมดเป็นข้อมูลสมมติและจะถูกรีเซ็ตทุกวัน
        </p>
        {!serverReady && (
          <p className="mt-2 flex items-center gap-2 text-xs font-bold opacity-80">
            <Loader2 size={14} className="animate-spin" /> กำลังปลุกเซิร์ฟเวอร์ (ครั้งแรกอาจใช้เวลาราว 1 นาที)
          </p>
        )}
      </div>

      {ROLES.map(({ role, title, desc, icon: Icon }) => (
        <button
          key={role}
          type="button"
          onClick={() => login(role)}
          disabled={loadingRole !== null}
          className="w-full flex items-center gap-4 rounded-2xl border-2 border-[#302782]/15 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-left transition-all hover:border-[#302782] dark:hover:border-[#B2BB1E] active:scale-[0.98] disabled:opacity-60"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#302782] text-white">
            {loadingRole === role ? <Loader2 size={24} className="animate-spin" /> : <Icon size={24} />}
          </div>
          <div>
            <p className="font-black text-[#302782] dark:text-white">เข้าใช้งานในฐานะ{title}</p>
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">{desc}</p>
          </div>
        </button>
      ))}

      {error && (
        <div className="flex items-center justify-center gap-1.5 text-red-500 text-sm font-bold">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default DemoLogin;
