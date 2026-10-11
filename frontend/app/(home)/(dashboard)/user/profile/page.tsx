"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LuCamera,
  LuCalendar,
  LuCheck,
  LuChevronRight,
  LuInfo,
  LuLock,
  LuMail,
  LuPhone,
  LuShieldAlert,
  LuShieldCheck,
  LuUser,
  LuMapPin,
} from "react-icons/lu";

interface UserData {
  fullName: string;
  email: string;
  role?: string;
  avatar?: string;
  dob?: string;
  phone?: string;
  address?: string;
  lastAvatarChangedDate?: string;
  lastNameChangedDate?: string;
}

export default function UserProfilePage() {
  const [currentUser, setCurrentUser] = useState<UserData>({
    fullName: "Nguyễn Võ Anh Kiệt",
    email: "kiet.nguyen@taskflow.vn",
    role: "user",
    dob: "27/04/2005",
    address: "TP. Hồ Chí Minh",
    phone: "",
  });

  // State chỉnh sửa form
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newAvatarSelected, setNewAvatarSelected] = useState<string | null>(null);

  // Modal thông báo thành công
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Lỗi & thông báo
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy ngày hôm nay định dạng YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();

  // Kiểm tra điều kiện giới hạn 1 ngày 1 lần
  const isAvatarLockedToday = currentUser.lastAvatarChangedDate === todayStr;
  const isNameLockedToday = currentUser.lastNameChangedDate === todayStr;
  // Số điện thoại chỉ được nhập 1 lần: nếu đã có phone lưu thì khóa vĩnh viễn
  const isPhoneLockedForever = Boolean(currentUser.phone && currentUser.phone.trim() !== "");

  // Đọc thông tin từ localStorage khi tải trang
  useEffect(() => {
    if (typeof window !== "undefined") {
      const curStr = localStorage.getItem("taskflow_current_user");
      let baseUser: UserData = {
        fullName: "Nguyễn Võ Anh Kiệt",
        email: "kiet.nguyen@taskflow.vn",
        role: "user",
        dob: "27/04/2005",
        address: "TP. Hồ Chí Minh",
        phone: "",
      };

      if (curStr) {
        try {
          const parsed = JSON.parse(curStr);
          baseUser = { ...baseUser, ...parsed };
        } catch {}
      }

      // Tìm thông tin chi tiết từ taskflow_users (nếu có dob, phone, address)
      try {
        const usersStr = localStorage.getItem("taskflow_users");
        if (usersStr) {
          const users = JSON.parse(usersStr);
          const matched = users.find(
            (u: { email: string }) => u.email.toLowerCase() === baseUser.email.toLowerCase()
          );
          if (matched) {
            baseUser = {
              ...baseUser,
              dob: matched.dob || baseUser.dob || "27/04/2005",
              phone: matched.phone || baseUser.phone || "",
              address: matched.address || baseUser.address || "TP. Hồ Chí Minh",
              lastAvatarChangedDate: matched.lastAvatarChangedDate || baseUser.lastAvatarChangedDate,
              lastNameChangedDate: matched.lastNameChangedDate || baseUser.lastNameChangedDate,
              avatar: matched.avatar || baseUser.avatar,
            };
          }
        }
      } catch {}

      // Đọc số điện thoại từ taskflow_user_phones
      try {
        const pStr = localStorage.getItem("taskflow_user_phones");
        if (pStr) {
          const phoneMap = JSON.parse(pStr);
          if (phoneMap[baseUser.email.toLowerCase()]) {
            baseUser.phone = phoneMap[baseUser.email.toLowerCase()];
          }
        }
      } catch {}

      setCurrentUser(baseUser);
      setNameInput(baseUser.fullName);
      setPhoneInput(baseUser.phone || "");
      if (baseUser.avatar) {
        setAvatarPreview(baseUser.avatar);
      }
    }
  }, []);

  // Tính chữ cái đại diện avatar (chữ cái đầu của TÊN GỌI)
  const getInitials = (name: string) => {
    if (!name) return "K";
    const parts = name.trim().split(/\s+/);
    const lastName = parts[parts.length - 1];
    return lastName ? lastName.charAt(0).toUpperCase() : "K";
  };

  // Xử lý chọn ảnh đại diện (.PNG, .JPG, .JPEG)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isAvatarLockedToday) {
      setErrorMsg(
        `🔒 Bạn đã thay đổi ảnh đại diện hôm nay (${todayStr}). Theo quy định, mỗi ngày chỉ được đổi ảnh 1 lần. Vui lòng quay lại vào ngày mai!`
      );
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng (.PNG, .JPG, .JPEG)
    const validExtensions = [".png", ".jpg", ".jpeg"];
    const fileName = file.name.toLowerCase();
    const isValidFormat = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidFormat) {
      setErrorMsg("⚠️ Định dạng ảnh không hợp lệ! Hệ thống chỉ chấp nhận định dạng .PNG, .JPG hoặc .JPEG.");
      return;
    }

    // Giới hạn kích thước tối đa 3MB
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg("⚠️ Dung lượng ảnh vượt quá 3MB! Vui lòng chọn ảnh nhẹ hơn.");
      return;
    }

    // Đọc ảnh và tạo preview base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setNewAvatarSelected(result);
    };
    reader.readAsDataURL(file);
  };

  // Lưu thông tin cá nhân khi bấm Xác nhận
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setErrorMsg("Họ và tên không được để trống!");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Kiểm tra số điện thoại nếu nhập lần đầu
    let finalPhone = currentUser.phone || "";
    if (!isPhoneLockedForever && phoneInput.trim()) {
      const cleanPhone = phoneInput.trim().replace(/\s+/g, "");
      // Kiểm tra định dạng số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
      if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(cleanPhone)) {
        setErrorMsg("Số điện thoại không đúng định dạng (Ví dụ: 0912345678)!");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      finalPhone = cleanPhone;
    }

    // Kiểm tra xem có thay đổi Tên không
    const isNameChanged = trimmedName !== currentUser.fullName;
    if (isNameChanged && isNameLockedToday) {
      setErrorMsg("🔒 Tên người dùng đã được cập nhật hôm nay. Bạn không thể đổi thêm trong ngày!");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Kiểm tra xem có thay đổi Avatar không
    const isAvatarChanged = Boolean(newAvatarSelected && newAvatarSelected !== currentUser.avatar);
    if (isAvatarChanged && isAvatarLockedToday) {
      setErrorMsg("🔒 Bạn đã thay đổi ảnh đại diện hôm nay. Không thể đổi thêm trong ngày!");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSaving(true);

    try {
      // Chuẩn bị dữ liệu cập nhật
      const updatedUser: UserData = {
        ...currentUser,
        fullName: trimmedName,
        phone: finalPhone,
        avatar: newAvatarSelected ? newAvatarSelected : currentUser.avatar,
        lastAvatarChangedDate: isAvatarChanged ? todayStr : currentUser.lastAvatarChangedDate,
        lastNameChangedDate: isNameChanged ? todayStr : currentUser.lastNameChangedDate,
      };

      // 1. Cập nhật taskflow_current_user
      localStorage.setItem("taskflow_current_user", JSON.stringify(updatedUser));

      // 2. Cập nhật từ điển số điện thoại taskflow_user_phones
      if (finalPhone) {
        try {
          const pStr = localStorage.getItem("taskflow_user_phones");
          const phoneMap = pStr ? JSON.parse(pStr) : {};
          phoneMap[updatedUser.email.toLowerCase()] = finalPhone;
          localStorage.setItem("taskflow_user_phones", JSON.stringify(phoneMap));
        } catch {}
      }

      // 3. Cập nhật taskflow_users (tự động thêm mới nếu chưa có trong danh sách)
      try {
        const usersStr = localStorage.getItem("taskflow_users");
        let users = [];
        if (usersStr) {
          try { users = JSON.parse(usersStr); } catch {}
        }
        const idx = users.findIndex(
          (u: { email: string }) => u.email.toLowerCase() === updatedUser.email.toLowerCase()
        );
        if (idx !== -1) {
          users[idx].fullName = updatedUser.fullName;
          users[idx].phone = updatedUser.phone;
          users[idx].avatar = updatedUser.avatar;
          users[idx].lastAvatarChangedDate = updatedUser.lastAvatarChangedDate;
          users[idx].lastNameChangedDate = updatedUser.lastNameChangedDate;
        } else {
          users.push({
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            avatar: updatedUser.avatar,
            role: updatedUser.role || "user",
            lastAvatarChangedDate: updatedUser.lastAvatarChangedDate,
            lastNameChangedDate: updatedUser.lastNameChangedDate,
            createdAt: new Date().toISOString(),
          });
        }
        localStorage.setItem("taskflow_users", JSON.stringify(users));
      } catch {}

      // 4. Cập nhật taskflow_members_list đồng bộ số điện thoại sang Admin
      try {
        const membersStr = localStorage.getItem("taskflow_members_list");
        let members = membersStr ? JSON.parse(membersStr) : [];
        const mIdx = members.findIndex(
          (m: { email: string }) => m.email.toLowerCase() === updatedUser.email.toLowerCase()
        );
        if (mIdx !== -1) {
          members[mIdx].name = updatedUser.fullName;
          members[mIdx].initials = getInitials(updatedUser.fullName);
          members[mIdx].phone = updatedUser.phone; // Đồng bộ số điện thoại sang admin
        } else {
          members.push({
            name: updatedUser.fullName,
            initials: getInitials(updatedUser.fullName),
            email: updatedUser.email,
            phone: updatedUser.phone,
            admin: updatedUser.role === "admin",
            tasks: 0,
            joined: "Tham gia gần đây",
            color: "bg-teal-100 text-teal-700",
          });
        }
        localStorage.setItem("taskflow_members_list", JSON.stringify(members));
      } catch {}

      setCurrentUser(updatedUser);
      setNewAvatarSelected(null);
      setSuccessMsg("✓ Cập nhật thông tin cá nhân thành công!");
      setShowSuccessModal(true);

      // Bắn sự kiện kèm payload detail để Header cập nhật avatar và tên ngay lập tức
      window.dispatchEvent(
        new CustomEvent("taskflow_profile_updated", { detail: updatedUser })
      );
    } catch {
      setErrorMsg("Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại!");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[13px] text-slate-800 pb-16">
      <div className="mx-auto max-w-[860px]">
        {/* Breadcrumb & Tiêu đề */}
        <div className="mb-6 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/user/task/list" className="hover:text-main transition">
              Không gian làm việc
            </Link>
            <LuChevronRight size={13} />
            <span className="text-slate-600 font-medium">Hồ sơ cá nhân</span>
          </div>
          <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">
            Thông tin cá nhân
          </h1>
          <p className="text-slate-500 text-xs">
            Quản lý thông tin tài khoản, ảnh đại diện và hồ sơ thành viên trong hệ thống TaskFlow.
          </p>
        </div>

        {/* Thông báo Thành công & Thất bại */}
        {successMsg && (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-xs font-medium shadow-xs animate-in fade-in">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs font-medium shadow-xs animate-in fade-in">
            <LuShieldAlert size={16} className="text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Khung chính của Form thông tin */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 1. KHU VỰC ẢNH ĐẠI DIỆN */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-1">Ảnh đại diện</h2>
            <p className="text-xs text-slate-400 mb-5">
              Hỗ trợ định dạng .PNG, .JPG hoặc .JPEG (Quy định: Thay đổi tối đa 1 lần / ngày).
            </p>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Khung tròn ảnh đại diện */}
              <div className="relative group">
                <div className="h-[96px] w-[96px] rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-bold text-[32px] grid place-items-center shadow-md ring-4 ring-pink-100 overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={currentUser.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(nameInput || currentUser.fullName)}</span>
                  )}
                </div>

                {/* Nút bấm tải ảnh đè lên */}
                {!isAvatarLockedToday && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-main text-white shadow-md hover:bg-main/90 transition cursor-pointer"
                    title="Chọn ảnh mới"
                  >
                    <LuCamera size={15} />
                  </button>
                )}
              </div>

              {/* Hướng dẫn và Nút chọn ảnh */}
              <div className="flex-1 flex flex-col gap-2.5 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <button
                    type="button"
                    disabled={isAvatarLockedToday}
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      isAvatarLockedToday
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : "bg-indigo-50 text-main border border-indigo-200 hover:bg-indigo-100 cursor-pointer"
                    }`}
                  >
                    {isAvatarLockedToday ? "🔒 Đã đổi hôm nay" : "Tải ảnh mới (.PNG, .JPG, .JPEG)"}
                  </button>

                  {newAvatarSelected && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarPreview(currentUser.avatar || null);
                        setNewAvatarSelected(null);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Khôi phục
                    </button>
                  )}
                </div>

                {/* Trạng thái quy định 1 ngày 1 lần */}
                {isAvatarLockedToday ? (
                  <p className="text-[11.5px] text-amber-600 font-medium flex items-center gap-1 justify-center sm:justify-start">
                    <LuLock size={13} />
                    Bạn đã thay đổi ảnh đại diện hôm nay ({todayStr}). Có thể đổi lại vào ngày mai.
                  </p>
                ) : (
                  <p className="text-[11.5px] text-slate-400">
                    💡 Bạn có quyền thay đổi ảnh đại diện hôm nay. Sau khi xác nhận, ảnh sẽ khóa đến 00:00 ngày mai.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 2. KHU VỰC THÔNG TIN CÁ NHÂN */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-5">
            <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
              Chi tiết tài khoản & Thông tin định danh
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Họ và tên (Có thể đổi 1 lần/ngày) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Họ và tên *
                  </label>
                  {isNameLockedToday && (
                    <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                      <LuLock size={12} />
                      Đã đổi hôm nay
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={isNameLockedToday}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none transition ${
                      isNameLockedToday
                        ? "border-slate-200 bg-slate-50/80 text-slate-500 cursor-not-allowed"
                        : "border-slate-200 bg-white text-slate-800 focus:border-main focus:ring-1 focus:ring-main"
                    }`}
                  />
                  <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>

                <p className="text-[11px] text-slate-400">
                  {isNameLockedToday
                    ? `🔒 Đã cập nhật hôm nay (${todayStr}). Bạn chỉ có thể đổi lại sau 00:00 ngày mai.`
                    : "💡 Có thể thay đổi họ tên (Quy định tối đa 1 lần / ngày)."}
                </p>
              </div>

              {/* Địa chỉ Gmail (CỐ ĐỊNH, KHÔNG THỂ SỬA) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Địa chỉ Gmail (Định danh tài khoản)
                  </label>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <LuLock size={12} />
                    Cố định
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    disabled
                    readOnly
                    value={currentUser.email}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100/80 py-2.5 pl-9 pr-8 text-sm text-slate-500 cursor-not-allowed select-none font-mono"
                  />
                  <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <LuLock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                </div>

                <p className="text-[11px] text-slate-400">
                  🔒 Địa chỉ Gmail định danh tài khoản, không thể thay đổi theo chính sách bảo mật.
                </p>
              </div>

              {/* Ngày / tháng / năm sinh (CỐ ĐỊNH, KHÔNG THỂ SỬA) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Ngày / tháng / năm sinh
                  </label>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <LuLock size={12} />
                    Cố định
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={currentUser.dob || "27/04/2005"}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100/80 py-2.5 pl-9 pr-8 text-sm text-slate-500 cursor-not-allowed select-none"
                  />
                  <LuCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <LuLock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                </div>

                <p className="text-[11px] text-slate-400">
                  🔒 Ngày tháng năm sinh cố định theo hồ sơ đăng ký căn cước công dân.
                </p>
              </div>

              {/* Số điện thoại (Chỉ nhập 1 lần, chỉ Admin mới sửa được) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Số điện thoại liên hệ
                  </label>
                  {isPhoneLockedForever ? (
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                      <LuShieldCheck size={12} />
                      Đã xác thực
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-600 font-semibold">
                      Chỉ nhập 1 lần duy nhất!
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    disabled={isPhoneLockedForever}
                    readOnly={isPhoneLockedForever}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Nhập số điện thoại (Ví dụ: 0912345678)"
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-8 text-sm outline-none transition ${
                      isPhoneLockedForever
                        ? "border-slate-200 bg-slate-100/80 text-slate-600 cursor-not-allowed select-none font-mono"
                        : "border-slate-200 bg-white text-slate-800 focus:border-main focus:ring-1 focus:ring-main"
                    }`}
                  />
                  <LuPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  {isPhoneLockedForever && (
                    <LuLock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  {isPhoneLockedForever ? (
                    <span className="text-slate-500 font-medium">
                      🔒 Số điện thoại đã được lưu và khóa bảo mật. Chỉ <strong>Quản trị viên (Admin)</strong> mới có quyền chỉnh sửa.
                    </span>
                  ) : (
                    "⚠️ Lưu ý quan trọng: Bạn chỉ có thể nhập số điện thoại một lần duy nhất. Sau khi lưu, ô này sẽ bị khóa vĩnh viễn."
                  )}
                </p>
              </div>

              {/* Tỉnh / Thành phố */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Địa chỉ thường trú / Khu vực
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={currentUser.address || "TP. Hồ Chí Minh"}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100/80 py-2.5 pl-9 pr-3 text-sm text-slate-500 cursor-not-allowed"
                  />
                  <LuMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>
            </div>
          </section>

          {/* 3. NÚT XÁC NHẬN & THÔNG BÁO VỊ TRÍ NÚT */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            {/* Thông báo kết quả ngay vị trí nút bấm */}
            {successMsg && (
              <div className="w-full p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <LuCheck className="text-emerald-600 shrink-0 text-base" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="w-full p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <LuShieldAlert className="text-red-600 shrink-0 text-base" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <LuInfo size={16} className="text-main shrink-0" />
                <span>
                  Các thông tin cho phép chỉnh sửa sẽ được lưu ngay sau khi bạn bấm <strong>Xác nhận</strong>.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/user/task/list"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Quay lại Task
                </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-main px-6 py-2.5 text-xs font-bold text-white hover:bg-main/90 transition shadow-sm cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  <LuCheck size={16} />
                  {isSaving ? "Đang lưu..." : "Xác nhận thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Thông Báo Cập Nhật Thành Công */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] rounded-3xl bg-white p-6 shadow-2xl text-center flex flex-col items-center border border-slate-100 animate-in zoom-in-95 duration-200">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-4 shadow-inner">
                <LuCheck />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Cập nhật thành công!
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Thông tin cá nhân và ảnh đại diện đã được lưu và đồng bộ toàn bộ hệ thống ngay lập tức mà không cần tải lại trang.
              </p>

              {/* Tóm tắt thông tin vừa đổi */}
              <div className="mt-4 w-full rounded-2xl bg-slate-50 p-3.5 border border-slate-200/70 text-left flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-bold text-base grid place-items-center shrink-0 overflow-hidden ring-2 ring-pink-100">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <span>{getInitials(currentUser.fullName)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800 text-sm truncate">{currentUser.fullName}</div>
                  <div className="text-slate-400 text-xs truncate">{currentUser.email}</div>
                  {currentUser.phone && (
                    <div className="text-emerald-700 text-xs font-medium flex items-center gap-1 mt-0.5">
                      <LuShieldCheck size={13} />
                      <span>SĐT: {currentUser.phone} (Đã khóa)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Ở lại trang
                </button>
                <Link
                  href="/user/task/list"
                  className="flex-1 py-2.5 rounded-xl bg-main text-white text-xs font-bold hover:bg-main/90 transition text-center shadow-sm"
                >
                  Về trang Task
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
