"use client";

import { useEffect, useState, useRef } from "react";
import { toast, Toaster } from "sonner";
import {
  LuCamera,
  LuCheck,
  LuLock,
  LuMail,
  LuPhone,
  LuUser,
  LuCalendar,
  LuLoader,
} from "react-icons/lu";
import { authService } from "@/app/services/authService";
import { memberService } from "@/app/services/memberService";

interface UserProfileData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  avatar: string | null;
  role: string;
}

export function ProfileForm() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [initialData, setInitialData] = useState<UserProfileData | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [role, setRole] = useState<string>("user");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Chuẩn hóa định dạng ngày cho <input type="date"> (YYYY-MM-DD)
  const formatDateForInput = (d?: string | null): string => {
    if (!d) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
      const [day, month, year] = d.split("/");
      return `${year}-${month}-${day}`;
    }
    return d;
  };

  // 1. Tải thông tin tài khoản người dùng đang đăng nhập
  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("taskflow_current_user");
      let currentEmail = "";

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          currentEmail = parsed.email || "";
          if (parsed.id || parsed.userId) {
            setId(parsed.id || parsed.userId);
          }
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.dob) setDob(formatDateForInput(parsed.dob));
          if (parsed.avatar) setAvatar(parsed.avatar);
          if (parsed.role) setRole(parsed.role);
        } catch (e) {
          console.error("Lỗi đọc localStorage:", e);
        }
      }

      // Luôn gọi API để lấy dữ liệu động mới nhất từ DB
      if (currentEmail) {
        const res = await authService.getAccount(currentEmail);
        if (res.code === "success" && res.data) {
          const user = res.data;
          const uId = user.id || user.userId;
          const uName = user.fullName || "";
          const uEmail = user.email || currentEmail;
          const uPhone = user.phone || "";
          const uDob = formatDateForInput(user.dob);
          const uAvatar = user.avatar || null;
          const uRole = user.role || "user";

          setId(uId);
          setFullName(uName);
          setEmail(uEmail);
          setPhone(uPhone);
          setDob(uDob);
          setAvatar(uAvatar);
          setRole(uRole);

          const fullProfile: UserProfileData = {
            id: uId,
            fullName: uName,
            email: uEmail,
            phone: uPhone,
            dob: uDob,
            avatar: uAvatar,
            role: uRole,
          };
          setInitialData(fullProfile);

          // Cập nhật lại localStorage để đồng bộ toàn app
          localStorage.setItem(
            "taskflow_current_user",
            JSON.stringify({ ...user, id: uId, userId: uId })
          );
        }
      }
    } catch (err) {
      console.error("Lỗi tải thông tin tài khoản:", err);
      toast.error("Không thể kết nối máy chủ để tải thông tin tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  // 2. Xử lý đổi ảnh đại diện (chuyển sang base64)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Kích thước ảnh vượt quá 3MB! Vui lòng chọn ảnh nhỏ hơn.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        toast.info("Đã chọn ảnh mới. Nhấn 'Lưu thay đổi' để hoàn tất!");
      }
    };
    reader.readAsDataURL(file);
  };

  // 3. Khôi phục lại dữ liệu ban đầu khi nhấn Hủy bỏ
  const handleCancel = () => {
    if (initialData) {
      setFullName(initialData.fullName);
      setPhone(initialData.phone);
      setDob(initialData.dob);
      setAvatar(initialData.avatar);
      toast.info("Đã khôi phục thông tin ban đầu.");
    }
  };

  // 4. Lưu thay đổi thông tin người dùng
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Họ và tên không được để trống!");
      return;
    }

    if (!id) {
      toast.error("Không xác định được ID người dùng để cập nhật!");
      return;
    }

    setSaving(true);
    try {
      const res = await memberService.update(id, {
        fullName: fullName.trim(),
        phone: phone ? phone.trim() : "",
        dob: dob || "",
        avatar: avatar || "",
        role: role,
      });

      if (res.code === "success") {
        toast.success("Cập nhật thông tin thành công!");

        // Cập nhật initialData
        const updatedProfile: UserProfileData = {
          id,
          fullName: fullName.trim(),
          email,
          phone: phone ? phone.trim() : "",
          dob: dob || "",
          avatar: avatar || null,
          role,
        };
        setInitialData(updatedProfile);

        // Cập nhật lại localStorage để Header và Sider nhận ngay thông tin mới
        const stored = localStorage.getItem("taskflow_current_user");
        const prev = stored ? JSON.parse(stored) : {};
        const newStored = {
          ...prev,
          ...updatedProfile,
          userId: id,
        };
        localStorage.setItem("taskflow_current_user", JSON.stringify(newStored));

        // Phát event tùy biến để Header cập nhật avatar và tên tức thì
        window.dispatchEvent(new Event("taskflow:user_updated"));
      } else {
        toast.error(res.message || "Cập nhật thông tin thất bại!");
      }
    } catch (err: any) {
      console.error("Lỗi khi lưu thông tin:", err);
      toast.error("Đã xảy ra lỗi trong quá trình lưu thông tin!");
    } finally {
      setSaving(false);
    }
  };

  // Chữ cái đầu hiển thị trên avatar nếu chưa có ảnh
  const initialLetter = fullName ? fullName.trim().charAt(0).toUpperCase() : "U";

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="w-full pb-12">
        {/* ── Card thông tin chính ─────────────────────────────────── */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm">
          {/* Phần Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-7 border-b border-[#F1F5F9]">
            <div className="relative shrink-0">
              {avatar ? (
                <div className="relative h-20 w-20 rounded-full overflow-hidden ring-4 ring-slate-50 border border-slate-200">
                  <img
                    src={avatar}
                    alt={fullName || "Avatar"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-2xl flex items-center justify-center ring-4 ring-slate-50">
                  {initialLetter}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-main text-white shadow-md hover:bg-main/90 transition cursor-pointer"
                title="Đổi ảnh đại diện"
              >
                <LuCamera size={14} />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-base font-bold text-text">
                {fullName || "Đang tải thông tin..."}
              </h3>
              <p className="text-xs text-slate-500">{email || "..."}</p>
              <label
                onClick={() => fileInputRef.current?.click()}
                className="inline-block mt-2 text-xs font-semibold text-main hover:underline cursor-pointer"
              >
                <span>Tải ảnh mới lên (JPG, PNG, tối đa 3MB)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          {/* Form điền thông tin */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <LuLoader className="h-7 w-7 animate-spin text-main" />
              <span className="text-xs">Đang tải thông tin tài khoản...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Họ và tên */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Họ và tên</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên..."
                      required
                      className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pl-9 pr-3 text-sm text-text outline-none focus:border-main focus:ring-1 focus:ring-main"
                    />
                    <LuUser
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                  </div>
                </div>

                {/* 2. Email định danh (Cố định) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">Email định danh</label>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <LuLock size={12} /> Cố định
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      readOnly
                      value={email}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50 py-2.5 pl-9 pr-8 text-sm text-slate-500 cursor-not-allowed select-none"
                    />
                    <LuMail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                  </div>
                </div>

                {/* 3. Số điện thoại */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Số điện thoại</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại..."
                      className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pl-9 pr-3 text-sm text-text outline-none focus:border-main focus:ring-1 focus:ring-main"
                    />
                    <LuPhone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                  </div>
                </div>

                {/* 4. Ngày sinh */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Ngày sinh</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full rounded-xl border border-[#E2E8F0] py-2.5 pl-9 pr-3 text-sm text-text outline-none focus:border-main focus:ring-1 focus:ring-main cursor-pointer"
                    />
                    <LuCalendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                  </div>
                </div>

                {/* Ghi chú: Phần Địa chỉ đã được loại bỏ theo yêu cầu */}
              </div>

              {/* Footer nút bấm */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-main text-xs font-semibold text-white hover:bg-main/90 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <LuLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <LuCheck size={14} />
                  )}
                  <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
