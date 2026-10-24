"use client";

import { useEffect, useState, useMemo } from "react";
import { Client } from "@stomp/stompjs";
import {
  LuChevronDown,
  LuPencil,
  LuSearch,
  LuTrash2,
  LuUserPlus,
  LuUsers,
  LuLoader,
} from "react-icons/lu";
import { toast, Toaster } from "sonner";
import { memberService, Member } from "@/src/app/services/memberService";
import { CreateMemberModal } from "./CreateMemberModal";
import { EditMemberModal } from "./EditMemberModal";
import { DeleteMemberModal } from "./DeleteMemberModal";

// Bảng màu avatar luân phiên
const AVATAR_COLORS = [
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
];

export default function MemberListPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);

  // 1. Tải danh sách thành viên động từ CSDL
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await memberService.getAll();
      if (res.code === "success" && Array.isArray(res.data)) {
        setMembers(res.data);
      } else {
        toast.error(res.message || "Không thể tải danh sách thành viên!");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi kết nối máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Tải danh sách ban đầu từ API
    fetchMembers();

    // 2. Kết nối WebSocket STOMP để nhận dữ liệu Real-time
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // Lắng nghe thêm mới thành viên qua Socket
        stompClient.subscribe("/topic/members", (message) => {
          try {
            const newMember: Member = JSON.parse(message.body);
            if (newMember && newMember.id) {
              setMembers((prev) => [newMember, ...prev.filter((m) => m.id !== newMember.id)]);
              toast.info(`Thành viên mới vừa được cấp tài khoản: ${newMember.fullName}`);
            }
          } catch (e) {
            console.error("[WS CREATE ERROR]", e);
          }
        });

        // Lắng nghe chỉnh sửa thông tin thành viên (Real-time)
        stompClient.subscribe("/topic/members/updated", (message) => {
          try {
            const updatedMember: Member = JSON.parse(message.body);
            if (updatedMember && updatedMember.id) {
              setMembers((prev) =>
                prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
              );
              toast.info(`Thông tin của "${updatedMember.fullName}" vừa được cập nhật.`);
            }
          } catch (e) {
            console.error("[WS UPDATE ERROR]", e);
          }
        });

        // Lắng nghe xóa thành viên (Real-time)
        stompClient.subscribe("/topic/members/deleted", (message) => {
          try {
            const deletedId = Number(message.body);
            if (deletedId) {
              setMembers((prev) => prev.filter((m) => m.id !== deletedId));
              toast.info("Một tài khoản thành viên vừa bị xóa khỏi hệ thống.");
            }
          } catch (e) {
            console.error("[WS DELETE ERROR]", e);
          }
        });
      },
      onStompError: (frame) => {
        console.error("[STOMP ERROR]", frame.headers["message"]);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  // 2. Callback cập nhật Real-time khi cấp tài khoản mới thành công
  const handleMemberCreated = (newMember: Member) => {
    setMembers((prev) => [newMember, ...prev.filter((m) => m.id !== newMember.id)]);
  };

  // 3. Callback cập nhật Real-time khi chỉnh sửa thành viên thành công
  const handleMemberUpdated = (updatedMember: Member) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
  };

  // 4. Callback cập nhật Real-time khi xóa thành viên thành công
  const handleMemberDeleted = (deletedId: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== deletedId));
  };

  // Hàm chuẩn hóa chuỗi tiếng Việt (bỏ dấu) để tìm kiếm thông minh
  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  // 3. Lọc danh sách theo tìm kiếm (Tên hoặc Email) và vai trò
  const filteredMembers = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();
    const normalizedSearch = removeAccents(cleanSearch);

    return members.filter((m) => {
      // Tìm theo Họ và tên (hỗ trợ cả có dấu và không dấu)
      const name = (m.fullName || "").toLowerCase();
      const normalizedName = removeAccents(name);
      const matchName = name.includes(cleanSearch) || normalizedName.includes(normalizedSearch);

      // Tìm theo Email
      const email = (m.email || "").toLowerCase();
      const matchEmail = email.includes(cleanSearch);

      // Khớp tên HOẶC email
      const matchSearch = !cleanSearch || matchName || matchEmail;

      // Khớp vai trò
      const matchRole =
        roleFilter === "ALL" ||
        (m.role && m.role.toUpperCase() === roleFilter.toUpperCase());

      return matchSearch && matchRole;
    });
  }, [members, searchTerm, roleFilter]);

  // Sinh chữ cái đại diện (Initials)
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Định dạng ngày tham gia
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Mới tham gia";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="task-list w-full pb-12">
        {/* ── Tiêu đề & Nút Thêm ─────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-text">Quản lý Thành viên</h1>
            <p className="text-xs text-slate-500 mt-1">
              Tổng số tài khoản: <span className="font-semibold text-main">{members.length}</span> thành viên
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-main px-4 text-xs font-semibold text-white shadow-sm hover:bg-main/90 transition"
          >
            <LuUserPlus size={16} />+ Cấp tài khoản mới
          </button>
        </div>

        {/* ── Bảng danh sách thành viên ───────────────────────────── */}
        <div className="mt-6 w-full overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0px_4px_16px_0px_#1018280A]">
          {/* Header bảng & Bộ lọc động */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[#F1F5F9]">
            <h2 className="text-base font-bold text-text">Danh sách tài khoản trong nhóm</h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Ô tìm kiếm */}
              <label className="box flex h-[40px] w-full sm:w-[260px] items-center gap-2 rounded-[10px] border border-[#E2E8F0] px-3">
                <LuSearch size={16} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên hoặc email..."
                  className="w-full bg-transparent text-xs text-text outline-none placeholder:text-slate-400"
                />
              </label>

              {/* Lọc vai trò */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="box h-[40px] w-[160px] appearance-none rounded-[10px] border border-[#E2E8F0] bg-white pl-3 pr-8 text-xs text-[#475569] outline-none cursor-pointer"
                >
                  <option value="ALL">Tất cả vai trò</option>
                  <option value="ADMIN">Quản trị viên</option>
                  <option value="USER">Thành viên</option>
                </select>
                <LuChevronDown
                  size={16}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="w-full overflow-x-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <LuLoader className="animate-spin text-2xl text-main" />
                <span className="text-xs">Đang tải danh sách thành viên từ CSDL...</span>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                <LuUsers className="text-3xl text-slate-300" />
                <span className="text-sm font-medium">Không tìm thấy thành viên nào phù hợp</span>
              </div>
            ) : (
              <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                    <th className="w-[32%] px-5 py-3.5">Thành viên</th>
                    <th className="w-[24%] px-4 py-3.5">Email</th>
                    <th className="w-[16%] px-4 py-3.5">Số điện thoại</th>
                    <th className="w-[14%] px-4 py-3.5">Vai trò</th>
                    <th className="w-[14%] px-4 py-3.5 text-center">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F1F5F9] text-sm text-text">
                  {filteredMembers.map((m, idx) => {
                    const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                    const isAdmin = m.role?.toLowerCase() === "admin";

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/70 transition-colors animate-in fade-in duration-150">
                        {/* Tên & Avatar */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${color.bg} ${color.text}`}
                            >
                              {getInitials(m.fullName)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-semibold text-text truncate">
                                <span>{m.fullName}</span>
                              </div>
                              <p className="text-[11px] text-[#94A3B8]">
                                Tham gia {formatDate(m.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3.5 font-mono text-xs text-[#475569] truncate">
                          {m.email}
                        </td>

                        {/* Số điện thoại */}
                        <td className="px-4 py-3.5 font-mono text-xs text-[#475569]">
                          {m.phone || "—"}
                        </td>

                        {/* Vai trò */}
                        <td className="px-4 py-3.5">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-main">
                              Quản trị viên
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                              Thành viên
                            </span>
                          )}
                        </td>

                        {/* Thao tác (Sửa / Xóa) */}
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2 text-slate-500">
                            <button
                              type="button"
                              onClick={() => setEditingMember(m)}
                              className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-main transition cursor-pointer"
                              title="Chỉnh sửa thông tin"
                            >
                              <LuPencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingMember(m)}
                              className="rounded-lg p-1.5 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                              title="Xóa tài khoản"
                            >
                              <LuTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal Cấp tài khoản mới */}
      <CreateMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleMemberCreated}
      />

      {/* Modal Chỉnh sửa thành viên */}
      <EditMemberModal
        isOpen={!!editingMember}
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSuccess={handleMemberUpdated}
      />

      {/* Modal Xác nhận xóa thành viên */}
      <DeleteMemberModal
        isOpen={!!deletingMember}
        member={deletingMember}
        onClose={() => setDeletingMember(null)}
        onSuccess={handleMemberDeleted}
      />
    </>
  );
}
