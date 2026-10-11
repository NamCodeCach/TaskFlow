"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BiChevronDown, BiSearch } from "react-icons/bi";
import { BsShieldCheck, BsThreeDots } from "react-icons/bs";
import { FaUserSecret } from "react-icons/fa6";
import {
  IoClose,
  IoEyeOffOutline,
  IoEyeOutline,
  IoMailOutline,
} from "react-icons/io5";
import {
  LuCheck,
  LuKey,
  LuLock,
  LuPencil,
  LuShieldAlert,
  LuTrash2,
  LuUserPlus,
} from "react-icons/lu";

interface MemberItem {
  name: string;
  initials: string;
  email: string;
  admin: boolean;
  tasks: number;
  joined: string;
  color: string;
}

const AVATAR_COLORS = [
  "bg-indigo-100 text-main",
  "bg-rose-100 text-rose-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-purple-100 text-purple-600",
  "bg-amber-100 text-amber-600",
  "bg-cyan-100 text-cyan-700",
];

const defaultMembers: MemberItem[] = [
  {
    name: "Lê Trần Hoàng Nam",
    initials: "HN",
    email: "nam.nguyen@taskflow.vn",
    admin: true,
    tasks: 0,
    joined: "Bạn · Tham gia 01/10/2026",
    color: "bg-indigo-100 text-main",
  },
  {
    name: "Nguyễn Thùy Linh",
    initials: "TL",
    email: "linh.nguyen@taskflow.vn",
    admin: false,
    tasks: 4,
    joined: "Tham gia 01/10/2026",
    color: "bg-rose-100 text-rose-600",
  },
  {
    name: "Trần Quang Minh",
    initials: "QM",
    email: "minh.tran@taskflow.vn",
    admin: false,
    tasks: 2,
    joined: "Tham gia 01/10/2026",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Lê Gia Huy",
    initials: "GH",
    email: "huy.le@taskflow.vn",
    admin: false,
    tasks: 1,
    joined: "Tham gia 01/10/2026",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "Phạm Ngọc Anh",
    initials: "NA",
    email: "anh.pham@taskflow.vn",
    admin: false,
    tasks: 1,
    joined: "Tham gia 01/10/2026",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Nguyễn Võ Anh Kiệt",
    initials: "AK",
    email: "kiet.nguyen@taskflow.vn",
    admin: false,
    tasks: 3,
    joined: "Tham gia 05/10/2026",
    color: "bg-amber-100 text-amber-700",
  },
];

// Hàm tạo chữ cái đại diện avatar
const getInitials = (name: string) => {
  if (!name) return "TV";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function ThanhVien() {
  const [membersList, setMembersList] = useState<MemberItem[]>(defaultMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");
  const [currentAdminEmail, setCurrentAdminEmail] = useState("nam.nguyen@taskflow.vn");

  // State menu 3 chấm mở dòng nào
  const [activeMenuEmail, setActiveMenuEmail] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [openCreateMember, setOpenCreateMember] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);
  const [resettingPasswordMember, setResettingPasswordMember] = useState<MemberItem | null>(null);
  const [deletingMember, setDeletingMember] = useState<MemberItem | null>(null);

  // Form Thêm thành viên
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"user" | "admin">("user");
  const [newPassword, setNewPassword] = useState("Tf@2026!");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Form Chỉnh sửa thành viên
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"user" | "admin">("user");
  const [editError, setEditError] = useState<string | null>(null);

  // Form Đặt lại mật khẩu
  const [resetNewPass, setResetNewPass] = useState("Pass@123");
  const [showResetPass, setShowResetPass] = useState(false);

  // Toast thông báo
  const [toast, setToast] = useState<string | null>(null);

  // Load danh sách thành viên từ localStorage và đồng bộ tài khoản đã đăng ký
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Xác định tài khoản admin đang đăng nhập
      const curUserStr = localStorage.getItem("taskflow_current_user");
      if (curUserStr) {
        try {
          const cur = JSON.parse(curUserStr);
          if (cur.email) setCurrentAdminEmail(cur.email.toLowerCase());
        } catch {}
      }

      const savedMembersStr = localStorage.getItem("taskflow_members_list");
      let baseList = defaultMembers;

      if (savedMembersStr) {
        try {
          baseList = JSON.parse(savedMembersStr);
        } catch {}
      }

      // Đọc thêm tài khoản đăng ký mới từ taskflow_users nếu chưa có trong list
      const usersStr = localStorage.getItem("taskflow_users");
      if (usersStr) {
        try {
          const registered = JSON.parse(usersStr);
          registered.forEach((u: { fullName: string; email: string; role?: string }) => {
            const exists = baseList.some(
              (m) => m.email.toLowerCase() === u.email.toLowerCase()
            );
            if (!exists) {
              baseList.push({
                name: u.fullName,
                initials: getInitials(u.fullName),
                email: u.email,
                admin: u.role === "admin",
                tasks: 0,
                joined: "Tham gia gần đây",
                color: AVATAR_COLORS[baseList.length % AVATAR_COLORS.length],
              });
            }
          });
        } catch {}
      }

      setMembersList([...baseList]);
      localStorage.setItem("taskflow_members_list", JSON.stringify(baseList));
    }
  }, []);

  // Tự động tắt toast sau 4 giây
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Đóng dropdown menu 3 chấm khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenuEmail(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm lưu danh sách thành viên
  const updateAndPersistMembers = (newList: MemberItem[]) => {
    setMembersList(newList);
    localStorage.setItem("taskflow_members_list", JSON.stringify(newList));
  };

  // 1. Thêm thành viên mới
  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.toLowerCase().trim();

    if (!trimmedName) {
      setCreateError("Vui lòng nhập họ và tên!");
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setCreateError("Vui lòng nhập địa chỉ email hợp lệ!");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setCreateError("Mật khẩu tạm thời tối thiểu 6 ký tự!");
      return;
    }

    // Kiểm tra trùng email
    if (membersList.some((m) => m.email.toLowerCase() === trimmedEmail)) {
      setCreateError("Email này đã tồn tại trong danh sách thành viên!");
      return;
    }

    const newMemberObj: MemberItem = {
      name: trimmedName,
      initials: getInitials(trimmedName),
      email: trimmedEmail,
      admin: newRole === "admin",
      tasks: 0,
      joined: `Tham gia ${new Date().toLocaleDateString("vi-VN")}`,
      color: AVATAR_COLORS[membersList.length % AVATAR_COLORS.length],
    };

    const updated = [newMemberObj, ...membersList];
    updateAndPersistMembers(updated);

    // Lưu vào taskflow_users để tài khoản mới này có thể đăng nhập ngay lập tức
    try {
      const usersStr = localStorage.getItem("taskflow_users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      users.push({
        fullName: trimmedName,
        email: trimmedEmail,
        password: newPassword,
        role: newRole,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("taskflow_users", JSON.stringify(users));
    } catch {}

    setOpenCreateMember(false);
    setNewName("");
    setNewEmail("");
    setNewRole("user");
    setNewPassword("Tf@2026!");
    setToast(`✓ Đã thêm thành viên "${trimmedName}" thành công!`);
  };

  // Mở modal Chỉnh sửa
  const handleStartEdit = (member: MemberItem) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditEmail(member.email);
    setEditRole(member.admin ? "admin" : "user");
    setEditError(null);
    setActiveMenuEmail(null);
  };

  // 2. Lưu thông tin sau khi chỉnh sửa
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const trimmedName = editName.trim();
    const trimmedEmail = editEmail.toLowerCase().trim();

    if (!trimmedName) {
      setEditError("Họ và tên không được để trống!");
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEditError("Email không hợp lệ!");
      return;
    }

    // Kiểm tra trùng email với người khác
    const emailConflict = membersList.some(
      (m) =>
        m.email.toLowerCase() === trimmedEmail &&
        m.email.toLowerCase() !== editingMember.email.toLowerCase()
    );
    if (emailConflict) {
      setEditError("Email này đang thuộc về một thành viên khác!");
      return;
    }

    const updated = membersList.map((m) => {
      if (m.email.toLowerCase() === editingMember.email.toLowerCase()) {
        return {
          ...m,
          name: trimmedName,
          initials: getInitials(trimmedName),
          email: trimmedEmail,
          admin: editRole === "admin",
        };
      }
      return m;
    });

    updateAndPersistMembers(updated);

    // Đồng bộ vào taskflow_users trong localStorage
    try {
      const usersStr = localStorage.getItem("taskflow_users");
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const userIdx = users.findIndex(
          (u: { email: string }) => u.email.toLowerCase() === editingMember.email.toLowerCase()
        );
        if (userIdx !== -1) {
          users[userIdx].fullName = trimmedName;
          users[userIdx].email = trimmedEmail;
          users[userIdx].role = editRole;
          localStorage.setItem("taskflow_users", JSON.stringify(users));
        }
      }

      // Nếu chỉnh sửa tài khoản đang đăng nhập, cập nhật taskflow_current_user
      const curUserStr = localStorage.getItem("taskflow_current_user");
      if (curUserStr) {
        const cur = JSON.parse(curUserStr);
        if (cur.email.toLowerCase() === editingMember.email.toLowerCase()) {
          cur.fullName = trimmedName;
          cur.email = trimmedEmail;
          cur.role = editRole;
          localStorage.setItem("taskflow_current_user", JSON.stringify(cur));
        }
      }
    } catch {}

    setEditingMember(null);
    setToast(`✓ Đã cập nhật thông tin thành viên "${trimmedName}" thành công!`);
  };

  // Mở modal Đặt lại mật khẩu
  const handleStartResetPassword = (member: MemberItem) => {
    setResettingPasswordMember(member);
    setResetNewPass("Pass@123");
    setActiveMenuEmail(null);
  };

  // 3. Xác nhận Đặt lại mật khẩu
  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingPasswordMember) return;

    if (!resetNewPass || resetNewPass.length < 6) {
      alert("Mật khẩu mới phải có tối thiểu 6 ký tự!");
      return;
    }

    // Cập nhật mật khẩu trong taskflow_users
    try {
      const usersStr = localStorage.getItem("taskflow_users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      const userIdx = users.findIndex(
        (u: { email: string }) =>
          u.email.toLowerCase() === resettingPasswordMember.email.toLowerCase()
      );

      if (userIdx !== -1) {
        users[userIdx].password = resetNewPass;
      } else {
        // Nếu là tài khoản mặc định, ghi vào taskflow_users để lưu mật khẩu mới
        users.push({
          fullName: resettingPasswordMember.name,
          email: resettingPasswordMember.email,
          password: resetNewPass,
          role: resettingPasswordMember.admin ? "admin" : "user",
        });
      }
      localStorage.setItem("taskflow_users", JSON.stringify(users));
    } catch {}

    const memberName = resettingPasswordMember.name;
    setResettingPasswordMember(null);
    setToast(`✓ Đã đặt lại mật khẩu cho "${memberName}" thành công! Mật khẩu mới: ${resetNewPass}`);
  };

  // Mở modal Xác nhận Xóa
  const handleStartDelete = (member: MemberItem) => {
    // Không cho phép tự xóa chính tài khoản admin đang đăng nhập
    if (member.email.toLowerCase() === currentAdminEmail.toLowerCase()) {
      alert("⚠️ BẠN KHÔNG THỂ XÓA TÀI KHOẢN CỦA CHÍNH MÌNH!\nBạn hiện đang đăng nhập bằng tài khoản này.");
      setActiveMenuEmail(null);
      return;
    }
    setDeletingMember(member);
    setActiveMenuEmail(null);
  };

  // 4. Xác nhận Xóa thành viên
  const handleConfirmDelete = () => {
    if (!deletingMember) return;

    const updated = membersList.filter(
      (m) => m.email.toLowerCase() !== deletingMember.email.toLowerCase()
    );
    updateAndPersistMembers(updated);

    // Xóa trong taskflow_users
    try {
      const usersStr = localStorage.getItem("taskflow_users");
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const filteredUsers = users.filter(
          (u: { email: string }) =>
            u.email.toLowerCase() !== deletingMember.email.toLowerCase()
        );
        localStorage.setItem("taskflow_users", JSON.stringify(filteredUsers));
      }
    } catch {}

    const deletedName = deletingMember.name;
    setDeletingMember(null);
    setToast(`✓ Đã xóa thành viên "${deletedName}" khỏi hệ thống.`);
  };

  // Lọc thành viên theo Từ khóa & Vai trò
  const filteredMembers = membersList.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole =
      filterRole === "all"
        ? true
        : filterRole === "admin"
        ? m.admin
        : !m.admin;
    return matchSearch && matchRole;
  });

  const adminCount = membersList.filter((m) => m.admin).length;
  const userCount = membersList.filter((m) => !m.admin).length;

  return (
    <>
      {/* Toast thông báo nổi */}
      {toast && (
        <div className="fixed top-6 right-6 z-[120] flex items-center gap-3 px-4 py-3 bg-slate-900 text-white text-xs rounded-xl shadow-2xl border border-slate-700 transition-all">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-medium">{toast}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="min-h-screen bg-slate-100 text-[13px] text-slate-900">
        <div className="w-full">
          {/* Header */}
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-[26px] font-bold tracking-tight">Quản lý Thành viên</h1>
              <p className="text-slate-500 text-xs mt-1">
                Quản trị viên có toàn quyền thêm, chỉnh sửa thông tin, đặt lại mật khẩu và phân quyền thành viên.
              </p>
            </div>
            <button
              className="rounded-[10px] bg-main px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-main/90 transition shadow-sm cursor-pointer flex items-center gap-2"
              onClick={() => {
                setNewName("");
                setNewEmail("");
                setNewRole("user");
                setNewPassword("Tf@2026!");
                setCreateError(null);
                setOpenCreateMember(true);
              }}
            >
              <LuUserPlus size={16} />
              + Thêm thành viên
            </button>
          </header>

          {/* Stats Cards */}
          <section className="my-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-medium text-xs">Tổng thành viên</span>
                <FaUserSecret size={18} className="text-main" />
              </div>
              <div className="my-3 text-[28px] font-bold text-slate-800">{membersList.length}</div>
              <p className="text-[11px] text-slate-500">
                <span className="font-semibold text-main">{adminCount}</span> quản trị viên ·{" "}
                <span className="font-semibold text-slate-700">{userCount}</span> thành viên
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-medium text-xs">Quản trị viên (Admin)</span>
                <BsShieldCheck size={18} className="text-indigo-600" />
              </div>
              <div className="my-3 text-[28px] font-bold text-indigo-600">{adminCount}</div>
              <p className="text-[11px] text-slate-500">Toàn quyền quản lý nhiệm vụ & tài khoản</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-medium text-xs">Thành viên (User)</span>
                <span className="text-emerald-600 font-bold">● Đang hoạt động</span>
              </div>
              <div className="my-3 text-[28px] font-bold text-slate-800">{userCount}</div>
              <p className="text-[11px] text-slate-500">Nhận nhiệm vụ và nộp bài nhóm</p>
            </div>
          </section>

          {/* Table Container */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Thanh tìm kiếm & lọc */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 pt-5 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Danh sách tài khoản trong nhóm</h2>
                <p className="text-[11px] text-slate-400">
                  Nhấp vào nút <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-semibold">•••</code> để chỉnh sửa, đổi mật khẩu hoặc xóa
                </p>
              </div>

              <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm tên hoặc Email..."
                    className="h-[38px] w-full rounded-[10px] border border-slate-200 pl-3 pr-9 text-[13px] placeholder:text-slate-400 sm:w-[240px] outline-none focus:border-main focus:ring-1 focus:ring-main"
                  />
                  <BiSearch
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                {/* Bộ lọc vai trò */}
                <div className="relative">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as "all" | "admin" | "user")}
                    className="h-[38px] w-[150px] appearance-none rounded-[10px] border border-slate-200 bg-white pl-3 pr-8 text-[13px] text-slate-700 outline-none focus:border-main cursor-pointer"
                  >
                    <option value="all">Tất cả vai trò</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="user">Thành viên</option>
                  </select>
                  <BiChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[11.5px] text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3 font-semibold">Tên thành viên</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Vai trò</th>
                    <th className="px-5 py-3 font-semibold">Số task</th>
                    <th className="px-5 py-3 font-semibold text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        Không tìm thấy thành viên nào phù hợp với từ khóa & bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => {
                      const isMe = m.email.toLowerCase() === currentAdminEmail.toLowerCase();
                      const isMenuOpen = activeMenuEmail === m.email;

                      return (
                        <tr
                          key={m.email}
                          className="hover:bg-slate-50/60 transition group relative"
                        >
                          {/* Tên */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`relative grid h-[36px] w-[36px] place-items-center rounded-full text-[12px] font-bold shadow-xs ${m.color}`}
                              >
                                {m.initials}
                              </div>
                              <div>
                                <div className="text-[13.5px] font-semibold text-slate-800 flex items-center gap-1.5">
                                  <span>{m.name}</span>
                                  {isMe && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-main border border-indigo-200">
                                      Bạn
                                    </span>
                                  )}
                                </div>
                                <div className="mt-0.5 text-[11.5px] text-slate-400">{m.joined}</div>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-3.5 text-[13px] text-slate-600 font-mono">
                            {m.email}
                          </td>

                          {/* Vai trò */}
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${
                                m.admin
                                  ? "bg-indigo-50 text-main border border-indigo-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {m.admin ? "👑 Quản trị viên" : "👤 Thành viên"}
                            </span>
                          </td>

                          {/* Số task */}
                          <td className="px-5 py-3.5 text-[13px] font-bold text-slate-700">
                            {m.tasks}
                          </td>

                          {/* Nút 3 chấm & Action Popover */}
                          <td className="px-5 py-3.5 text-center relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuEmail(isMenuOpen ? null : m.email);
                              }}
                              className={`rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer ${
                                isMenuOpen ? "bg-slate-100 text-main font-bold" : ""
                              }`}
                              title="Tùy chọn quản lý"
                            >
                              <BsThreeDots size={16} />
                            </button>

                            {/* Dropdown Menu Popup */}
                            {isMenuOpen && (
                              <div
                                ref={dropdownRef}
                                className="absolute right-6 top-12 z-50 w-[210px] rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl text-left animate-in fade-in zoom-in-95 duration-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                  Tùy chọn quản lý
                                </div>

                                {/* 1. Sửa thông tin */}
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(m)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-700 hover:bg-indigo-50 hover:text-main transition text-left cursor-pointer"
                                >
                                  <LuPencil className="text-main" size={15} />
                                  <span>Chỉnh sửa thông tin</span>
                                </button>

                                {/* 2. Đặt lại mật khẩu */}
                                <button
                                  type="button"
                                  onClick={() => handleStartResetPassword(m)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition text-left cursor-pointer"
                                >
                                  <LuKey className="text-amber-500" size={15} />
                                  <span>Đặt lại mật khẩu</span>
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                {/* 3. Xóa thành viên */}
                                <button
                                  type="button"
                                  onClick={() => handleStartDelete(m)}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition text-left cursor-pointer ${
                                    isMe
                                      ? "text-slate-300 cursor-not-allowed hover:bg-transparent"
                                      : "text-red-600 hover:bg-red-50"
                                  }`}
                                  disabled={isMe}
                                  title={isMe ? "Không thể tự xóa chính mình" : "Xóa tài khoản này"}
                                >
                                  <LuTrash2 size={15} />
                                  <span>Xóa thành viên {isMe ? "(Bạn)" : ""}</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Table */}
            <footer className="flex flex-wrap justify-between gap-2 border-t border-slate-100 px-5 py-4 text-[12px] text-slate-500 bg-slate-50/40">
              <span>
                Hiển thị <strong className="text-slate-700">{filteredMembers.length}</strong> trên tổng số{" "}
                <strong className="text-slate-700">{membersList.length}</strong> thành viên
              </span>
              <span>Dữ liệu đồng bộ theo thời gian thực</span>
            </footer>
          </section>

          <p className="mx-1 mt-4 flex items-center gap-2 text-[11.5px] text-slate-500">
            <BsShieldCheck size={14} className="text-main" />
            Quản trị viên có thể giao task, duyệt bài nộp và quản lý thông tin thành viên toàn hệ thống.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. MODAL: THÊM THÀNH VIÊN                                     */}
      {/* ============================================================ */}
      {openCreateMember &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-[540px] rounded-[20px] bg-white p-[28px] shadow-2xl border border-slate-100">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[22px] font-bold text-slate-800">Thêm thành viên mới</h3>
                  <p className="mt-1 text-[13px] text-slate-500">
                    Tạo tài khoản và cấp quyền cho thành viên tham gia nhóm.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                  onClick={() => setOpenCreateMember(false)}
                >
                  <IoClose size={22} />
                </button>
              </div>

              {/* Lỗi cảnh báo */}
              {createError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                  ⚠️ {createError}
                </div>
              )}

              <form onSubmit={handleCreateMember} className="mt-[20px] flex flex-col gap-[16px]">
                {/* Họ và tên */}
                <div className="flex w-full flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-slate-700">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Khánh Linh"
                    className="rounded-[10px] border border-slate-200 px-[12px] py-[10px] text-[13.5px] outline-none focus:border-main focus:ring-1 focus:ring-main"
                  />
                </div>

                {/* Email */}
                <div className="flex w-full flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-slate-700">Email *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="khanhlinh.nguyen@taskflow.vn"
                      className="w-full rounded-[10px] border border-slate-200 py-[10px] pl-[12px] pr-[40px] text-[13.5px] outline-none focus:border-main focus:ring-1 focus:ring-main"
                    />
                    <IoMailOutline className="absolute right-[12px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Vai trò */}
                <div className="flex w-full flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-slate-700">Vai trò phân quyền</label>
                  <div className="grid grid-cols-2 gap-[12px]">
                    <label
                      className={`flex cursor-pointer items-center gap-[10px] rounded-[10px] border px-[12px] py-[10px] text-[13.5px] transition ${
                        newRole === "user"
                          ? "border-main bg-indigo-50/60 font-semibold text-main"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="newRole"
                        checked={newRole === "user"}
                        onChange={() => setNewRole("user")}
                        className="h-[16px] w-[16px] accent-main"
                      />
                      <span>👤 Thành viên (User)</span>
                    </label>

                    <label
                      className={`flex cursor-pointer items-center gap-[10px] rounded-[10px] border px-[12px] py-[10px] text-[13.5px] transition ${
                        newRole === "admin"
                          ? "border-main bg-indigo-50/60 font-semibold text-main"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="newRole"
                        checked={newRole === "admin"}
                        onChange={() => setNewRole("admin")}
                        className="h-[16px] w-[16px] accent-main"
                      />
                      <span>👑 Quản trị viên (Admin)</span>
                    </label>
                  </div>
                </div>

                {/* Mật khẩu ban đầu */}
                <div className="flex w-full flex-col gap-[6px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-slate-700">Mật khẩu khởi tạo</label>
                    <button
                      type="button"
                      onClick={() =>
                        setNewPassword(`Pass@${Math.floor(1000 + Math.random() * 9000)}!`)
                      }
                      className="cursor-pointer text-[12px] font-semibold text-main hover:underline"
                    >
                      Tạo ngẫu nhiên
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full rounded-[10px] border border-slate-200 py-[10px] pl-[12px] pr-[40px] text-[13.5px] outline-none focus:border-main focus:ring-1 focus:ring-main font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-[10px] border-t border-slate-100 pt-[18px] mt-2">
                  <button
                    type="button"
                    onClick={() => setOpenCreateMember(false)}
                    className="cursor-pointer rounded-[10px] border border-slate-200 px-[16px] py-[9px] text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-[10px] bg-main px-[18px] py-[9px] text-[13px] font-semibold text-white hover:bg-main/90 transition shadow-sm"
                  >
                    Tạo tài khoản mới
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ============================================================ */}
      {/* 2. MODAL: CHỈNH SỬA THÔNG TIN THÀNH VIÊN                     */}
      {/* ============================================================ */}
      {editingMember &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-[520px] rounded-[20px] bg-white p-[28px] shadow-2xl border border-slate-100">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-main">
                    <LuPencil size={20} />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-slate-800">Chỉnh sửa thành viên</h3>
                    <p className="text-[12.5px] text-slate-500">
                      Cập nhật họ tên, địa chỉ email và phân quyền hệ thống.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                  onClick={() => setEditingMember(null)}
                >
                  <IoClose size={22} />
                </button>
              </div>

              {/* Lỗi cảnh báo */}
              {editError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                  ⚠️ {editError}
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="mt-[20px] flex flex-col gap-[16px]">
                {/* Họ và tên */}
                <div className="flex w-full flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-slate-700">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="rounded-[10px] border border-slate-200 px-[12px] py-[10px] text-[13.5px] outline-none focus:border-main focus:ring-1 focus:ring-main"
                  />
                </div>

                {/* Email */}
                <div className="flex w-full flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-slate-700">Địa chỉ Email *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full rounded-[10px] border border-slate-200 py-[10px] pl-[12px] pr-[40px] text-[13.5px] outline-none focus:border-main focus:ring-1 focus:ring-main"
                    />
                    <IoMailOutline className="absolute right-[12px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Vai trò */}
                <div className="flex w-full flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold text-slate-700">Vai trò phân quyền</label>
                  <div className="grid grid-cols-2 gap-[12px]">
                    <label
                      className={`flex cursor-pointer items-center gap-[10px] rounded-[10px] border px-[12px] py-[10px] text-[13.5px] transition ${
                        editRole === "user"
                          ? "border-main bg-indigo-50/60 font-semibold text-main"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="editRole"
                        checked={editRole === "user"}
                        onChange={() => setEditRole("user")}
                        className="h-[16px] w-[16px] accent-main"
                      />
                      <span>👤 Thành viên (User)</span>
                    </label>

                    <label
                      className={`flex cursor-pointer items-center gap-[10px] rounded-[10px] border px-[12px] py-[10px] text-[13.5px] transition ${
                        editRole === "admin"
                          ? "border-main bg-indigo-50/60 font-semibold text-main"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="editRole"
                        checked={editRole === "admin"}
                        onChange={() => setEditRole("admin")}
                        className="h-[16px] w-[16px] accent-main"
                      />
                      <span>👑 Quản trị viên (Admin)</span>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-[10px] border-t border-slate-100 pt-[18px] mt-2">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="cursor-pointer rounded-[10px] border border-slate-200 px-[16px] py-[9px] text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-[10px] bg-main px-[18px] py-[9px] text-[13px] font-semibold text-white hover:bg-main/90 transition shadow-sm flex items-center gap-1.5"
                  >
                    <LuCheck size={16} />
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ============================================================ */}
      {/* 3. MODAL: ĐẶT LẠI MẬT KHẨU                                   */}
      {/* ============================================================ */}
      {resettingPasswordMember &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-[480px] rounded-[20px] bg-white p-[28px] shadow-2xl border border-slate-100">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <LuKey size={20} />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-slate-800">Đặt lại mật khẩu</h3>
                    <p className="text-[12.5px] text-slate-500">
                      Cấp mật khẩu mới cho thành viên:{" "}
                      <strong className="text-slate-700">{resettingPasswordMember.name}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                  onClick={() => setResettingPasswordMember(null)}
                >
                  <IoClose size={22} />
                </button>
              </div>

              {/* Thông tin tài khoản */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col gap-1 text-slate-600">
                <div>
                  <strong>Tài khoản:</strong> {resettingPasswordMember.name}
                </div>
                <div>
                  <strong>Email:</strong> {resettingPasswordMember.email}
                </div>
              </div>

              <form onSubmit={handleConfirmResetPassword} className="mt-[20px] flex flex-col gap-[16px]">
                {/* Mật khẩu mới */}
                <div className="flex w-full flex-col gap-[6px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-slate-700">Mật khẩu mới *</label>
                    <button
                      type="button"
                      onClick={() =>
                        setResetNewPass(`Pass@${Math.floor(1000 + Math.random() * 9000)}!`)
                      }
                      className="cursor-pointer text-[12px] font-semibold text-main hover:underline"
                    >
                      Tạo ngẫu nhiên
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showResetPass ? "text" : "password"}
                      value={resetNewPass}
                      onChange={(e) => setResetNewPass(e.target.value)}
                      required
                      placeholder="Nhập mật khẩu mới..."
                      className="w-full rounded-[10px] border border-slate-200 py-[10px] pl-[12px] pr-[40px] text-[13.5px] outline-none focus:border-main focus:ring-1 focus:ring-main font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPass((prev) => !prev)}
                      className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                    >
                      {showResetPass ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                    </button>
                  </div>
                  <p className="text-[11.5px] text-slate-400">
                    Sau khi lưu, thành viên có thể dùng mật khẩu này để đăng nhập ngay lập tức.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-[10px] border-t border-slate-100 pt-[18px] mt-2">
                  <button
                    type="button"
                    onClick={() => setResettingPasswordMember(null)}
                    className="cursor-pointer rounded-[10px] border border-slate-200 px-[16px] py-[9px] text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-[10px] bg-amber-600 hover:bg-amber-700 px-[18px] py-[9px] text-[13px] font-semibold text-white transition shadow-sm flex items-center gap-1.5"
                  >
                    <LuLock size={15} />
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ============================================================ */}
      {/* 4. MODAL: XÁC NHẬN XÓA THÀNH VIÊN                            */}
      {/* ============================================================ */}
      {deletingMember &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-[460px] rounded-[20px] bg-white p-[28px] shadow-2xl border border-slate-100">
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                  <LuTrash2 size={24} />
                </div>
                <div>
                  <h3 className="text-[19px] font-bold text-slate-800">Xóa thành viên khỏi nhóm</h3>
                  <p className="text-xs text-slate-500">Hành động này không thể hoàn tác.</p>
                </div>
              </div>

              <div className="mt-4 p-3.5 bg-red-50/70 border border-red-200 rounded-xl text-slate-700 text-xs flex flex-col gap-1.5">
                <span>
                  Bạn có chắc chắn muốn xóa thành viên{" "}
                  <strong className="text-red-600">{deletingMember.name}</strong> (
                  <code className="text-slate-600 font-medium">{deletingMember.email}</code>) khỏi
                  danh sách?
                </span>
                <span className="text-slate-500 text-[11.5px]">
                  Tài khoản này sẽ không thể đăng nhập hoặc nhận nhiệm vụ nữa.
                </span>
              </div>

              <div className="flex justify-end gap-[10px] border-t border-slate-100 pt-[18px] mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingMember(null)}
                  className="cursor-pointer rounded-[10px] border border-slate-200 px-[16px] py-[9px] text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="cursor-pointer rounded-[10px] bg-red-600 hover:bg-red-700 px-[18px] py-[9px] text-[13px] font-semibold text-white transition shadow-sm"
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
