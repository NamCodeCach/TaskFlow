"use client";

import { useEffect, useState, useMemo } from "react";
import JustValidate from "just-validate";
import {
  LuX,
  LuCalendar,
  LuClock,
  LuFolder,
  LuLoader,
  LuSearch,
  LuSend,
  LuUsers,
  LuCheck,
} from "react-icons/lu";
import { toast } from "sonner";
import { taskService, TaskItem } from "@/src/app/services/taskService";
import { memberService, Member } from "@/src/app/services/memberService";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTask: TaskItem) => void;
}

const CATEGORY_OPTIONS = [
  "Thiết kế",
  "Báo cáo",
  "Phát triển",
  "Nội dung",
  "Marketing",
  "Nghiên cứu",
  "Kiểm thử",
  "Chung",
];

const AVATAR_COLORS = [
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
];

export const CreateTaskModal = ({ isOpen, onClose, onSuccess }: CreateTaskModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<number[]>([]);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [assigneeError, setAssigneeError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Thiết kế");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("17:00");

  // 1. Tải danh sách thành viên thực tế từ CSDL khi mở Modal
  useEffect(() => {
    if (!isOpen) return;

    const fetchMembers = async () => {
      try {
        const res = await memberService.getAll();
        if (res.code === "success" && Array.isArray(res.data)) {
          setMembers(res.data);
        }
      } catch (err: any) {
        console.error("Lỗi tải thành viên:", err);
      }
    };

    fetchMembers();
  }, [isOpen]);

  // Thiết lập hạn nộp mặc định là ngày mai 17:00
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const dd = String(tomorrow.getDate()).padStart(2, "0");
      setDeadlineDate(`${yyyy}-${mm}-${dd}`);
      setDeadlineTime("17:00");
      setSelectedAssigneeIds([]);
      setTitle("");
      setDescription("");
      setAssigneeError("");
    }
  }, [isOpen]);

  // 2. Tích hợp JustValidate cho Form
  useEffect(() => {
    if (!isOpen) return;

    const validator = new JustValidate("#form-create-task", {
      validateBeforeSubmitting: true,
    });

    validator
      .addField("#taskTitle", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập tiêu đề nhiệm vụ",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Tiêu đề phải có tối thiểu 3 ký tự",
        },
      ])
      .addField("#taskDeadlineDate", [
        {
          rule: "required",
          errorMessage: "Vui lòng chọn ngày hạn nộp",
        },
      ])
      .onSuccess(async () => {
        // Kiểm tra phân công ít nhất 1 thành viên
        if (selectedAssigneeIds.length === 0) {
          setAssigneeError("Vui lòng tích chọn ít nhất một thành viên để giao nhiệm vụ!");
          toast.warning("Vui lòng tích chọn ít nhất một thành viên để giao nhiệm vụ!");
          return;
        }

        setAssigneeError("");
        setIsLoading(true);

        const finalCategory = category === "OTHER" ? customCategory.trim() || "Chung" : category;
        const deadline = `${deadlineDate}T${deadlineTime || "17:00"}:00`;

        try {
          const res = await taskService.create({
            title: title.trim(),
            description: description.trim(),
            category: finalCategory,
            deadline: deadline,
            assigneeIds: selectedAssigneeIds,
          });

          if (res.code === "success" && res.data) {
            toast.success(
              `Đã tạo nhiệm vụ "${res.data.taskCode}" và gửi email thông báo tới ${selectedAssigneeIds.length} thành viên!`
            );
            onSuccess(res.data);
            onClose();
          } else {
            toast.error(res.message || "Tạo nhiệm vụ thất bại!");
          }
        } catch (err: any) {
          toast.error(err.message || "Không thể kết nối đến máy chủ!");
        } finally {
          setIsLoading(false);
        }
      });

    return () => {
      validator.destroy();
    };
  }, [
    isOpen,
    title,
    category,
    customCategory,
    description,
    deadlineDate,
    deadlineTime,
    selectedAssigneeIds,
    onClose,
    onSuccess,
  ]);

  // Toggle chọn 1 thành viên
  const toggleAssignee = (id: number) => {
    setSelectedAssigneeIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length > 0) setAssigneeError("");
      return next;
    });
  };

  // Chọn / Bỏ chọn tất cả
  const handleToggleAll = () => {
    if (selectedAssigneeIds.length === members.length) {
      setSelectedAssigneeIds([]);
      setAssigneeError("Vui lòng tích chọn ít nhất một thành viên để giao nhiệm vụ!");
    } else {
      setSelectedAssigneeIds(members.map((m) => m.id));
      setAssigneeError("");
    }
  };

  // Lọc danh sách thành viên trong modal theo từ khóa tìm kiếm
  const filteredMembers = useMemo(() => {
    const q = assigneeSearch.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.phone && m.phone.includes(q))
    );
  }, [members, assigneeSearch]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[620px] max-h-[92vh] overflow-y-auto rounded-[20px] bg-white p-6 md:p-8 shadow-2xl border border-slate-100">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
        >
          <LuX size={20} />
        </button>

        {/* Tiêu đề Modal */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Tạo nhiệm vụ mới</h2>
          <p className="text-xs text-slate-500 mt-1">
            Giao nhiệm vụ cho một hoặc nhiều thành viên. Hệ thống sẽ tự động gửi email thông báo kèm
            hạn nộp.
          </p>
        </div>

        <form id="form-create-task" autoComplete="off" className="space-y-5">
          {/* Tiêu đề */}
          <div>
            <label htmlFor="taskTitle" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tiêu đề nhiệm vụ <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-main transition-colors">
              <input
                type="text"
                id="taskTitle"
                name="taskTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Thiết kế banner chiến dịch Tết 2026..."
                disabled={isLoading}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Danh mục */}
          <div>
            <label htmlFor="taskCategory" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Danh mục công việc <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white">
                <LuFolder className="text-slate-400 shrink-0" size={17} />
                <select
                  id="taskCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="OTHER">Danh mục khác (tự nhập)...</option>
                </select>
              </div>

              {category === "OTHER" && (
                <input
                  type="text"
                  placeholder="Nhập danh mục..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-[180px] rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-main"
                />
              )}
            </div>
          </div>

          {/* Phân công cho nhiều thành viên */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Phân công thành viên <span className="text-red-500">*</span>
                <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-main">
                  Đã chọn: {selectedAssigneeIds.length} người
                </span>
              </label>

              <button
                type="button"
                onClick={handleToggleAll}
                className="text-xs text-main hover:underline font-medium cursor-pointer"
              >
                {selectedAssigneeIds.length === members.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button>
            </div>

            {/* Ô tìm kiếm thành viên */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-white">
                <LuSearch size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={assigneeSearch}
                  onChange={(e) => setAssigneeSearch(e.target.value)}
                  placeholder="Tìm thành viên theo tên hoặc email..."
                  className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Danh sách thành viên (cuộn) */}
              <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-100 p-1">
                {filteredMembers.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Không tìm thấy thành viên nào
                  </div>
                ) : (
                  filteredMembers.map((m, idx) => {
                    const isChecked = selectedAssigneeIds.includes(m.id);
                    const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                    return (
                      <div
                        key={m.id}
                        onClick={() => toggleAssignee(m.id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? "bg-indigo-50/80" : "hover:bg-slate-100/70"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Checkbox custom */}
                          <div
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                              isChecked
                                ? "bg-main border-main text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isChecked && <LuCheck size={12} strokeWidth={3} />}
                          </div>

                          {/* Avatar */}
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${color.bg} ${color.text}`}
                          >
                            {getInitials(m.fullName)}
                          </div>

                          {/* Thông tin */}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {m.fullName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono truncate">
                              {m.email}
                            </p>
                          </div>
                        </div>

                        {/* Badge vai trò */}
                        <span className="shrink-0 text-[10px] font-medium text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-100">
                          {m.role || "user"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {assigneeError && (
              <p className="text-xs text-red-500 mt-1 font-medium">{assigneeError}</p>
            )}
          </div>

          {/* Hạn nộp (Ngày + Giờ) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Hạn nộp (Deadline) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Ngày */}
              <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-main transition-colors">
                <LuCalendar className="text-slate-400 shrink-0" size={17} />
                <input
                  type="date"
                  id="taskDeadlineDate"
                  name="taskDeadlineDate"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none cursor-pointer"
                />
              </div>

              {/* Giờ */}
              <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-main transition-colors">
                <LuClock className="text-slate-400 shrink-0" size={17} />
                <input
                  type="time"
                  id="taskDeadlineTime"
                  name="taskDeadlineTime"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Mô tả chi tiết yêu cầu */}
          <div>
            <label htmlFor="taskDescription" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mô tả chi tiết yêu cầu công việc <span className="text-slate-400 font-normal">(Sẽ gửi trong email)</span>
            </label>
            <textarea
              id="taskDescription"
              name="taskDescription"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú mục tiêu, quy cách file, các lưu ý cần thực hiện..."
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-main resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Nút hành động */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-main px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-main/90 transition disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <LuLoader className="animate-spin text-sm" />
              ) : (
                <LuSend size={15} />
              )}
              <span>{isLoading ? "Đang tạo & gửi mail..." : "Tạo & Giao nhiệm vụ"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
