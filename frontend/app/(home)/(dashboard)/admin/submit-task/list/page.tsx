import Link from "next/link";
import {
  LuSearch,
  LuChevronDown,
  LuCheck,
  LuRotateCcw,
  LuDownload,
  LuFileText,
  LuClock,
  LuFilterX,
} from "react-icons/lu";

export type SubmissionStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

export interface Submission {
  id: number;
  taskCode: string;
  taskTitle: string;
  submitterName: string;
  submitterEmail: string;
  avatarBg?: string;
  avatarColor?: string;
  fileName: string;
  downloadUrl?: string;
  note: string;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewNote?: string | null;
}

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 1,
    taskCode: "TF-105",
    taskTitle: "Thiết kế bộ bài đăng mạng xã hội tháng 10",
    submitterName: "Nguyễn Thùy Linh",
    submitterEmail: "linh.nguyen@taskflow.vn",
    avatarBg: "bg-pink-100",
    avatarColor: "text-pink-600",
    fileName: "bai-dang-thang-10.zip",
    downloadUrl: "#",
    note: "Em đã hoàn thiện 6 mẫu bài đăng theo phong cách mới. Nhờ anh/chị duyệt giúp phần màu sắc và nội dung.",
    status: "SUBMITTED",
    submittedAt: "2026-10-20T10:15:00",
    reviewedAt: null,
    reviewedBy: null,
    reviewNote: null,
  },
  {
    id: 2,
    taskCode: "TF-107",
    taskTitle: "Báo cáo hiệu quả chiến dịch Marketing tháng 9",
    submitterName: "Trần Quang Minh",
    submitterEmail: "minh.tran@taskflow.vn",
    avatarBg: "bg-blue-100",
    avatarColor: "text-blue-600",
    fileName: "bao-cao-marketing-t9.docx",
    downloadUrl: "#",
    note: "Báo cáo đã tổng hợp số liệu chi tiết từ các kênh Facebook, Google Ads và TikTok, kèm theo đề xuất cho Q4.",
    status: "SUBMITTED",
    submittedAt: "2026-10-19T16:30:00",
    reviewedAt: null,
    reviewedBy: null,
    reviewNote: null,
  },
];

export default function AdminSubmitTaskListPage() {
  return (
    <>
      {/* Header trang */}
      <h3 className="text-[28px] font-bold text-text">Quản lý bài nộp</h3>

      {/* Filter bar */}
      <div className="mt-4 flex flex-wrap items-center gap-3 shadow-[0px_4px_16px_0px_#1018280A]">
        <label className="flex h-[42px] min-w-[260px] flex-1 items-center gap-2.5 rounded-[12px] border border-[#E2E8F0] px-4 text-[13px] bg-white">
          <LuSearch size={16} className="shrink-0 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên thành viên, mã task, tên task hoặc file..."
            className="w-full bg-transparent text-[13px] text-text outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="relative">
          <select className="h-[42px] w-[190px] cursor-pointer appearance-none rounded-[12px] border border-[#E2E8F0] bg-white px-4 pr-9 text-[13px] text-[#475569] outline-none">
            <option value="ALL">Tất cả trạng thái</option>
            <option value="SUBMITTED">Chờ duyệt</option>
            <option value="APPROVED">Hoàn thành</option>
            <option value="REJECTED">Yêu cầu nộp lại</option>
          </select>
          <LuChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <button
          type="button"
          className="flex h-[42px] cursor-pointer items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white px-4 text-xs font-semibold text-[#64748B] hover:bg-slate-50"
        >
          <LuFilterX size={14} />
          Đặt lại
        </button>
      </div>

      {/* Danh sách bài nộp */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {MOCK_SUBMISSIONS.map((sub) => (
          <article
            key={sub.id}
            className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              {/* Header bài nộp */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${sub.avatarBg} ${sub.avatarColor}`}
                  >
                    {sub.submitterName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">{sub.submitterName}</h4>
                    <p className="flex items-center gap-1 text-[11px] text-[#64748B]">
                      <LuClock size={12} />
                      Nộp lúc: {sub.submittedAt}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Chờ duyệt
                </span>
              </div>

              {/* Thông tin Task */}
              <div className="mt-3.5">
                <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-main">
                  {sub.taskCode}
                </span>
                <h5 className="mt-1 text-sm font-semibold text-text">{sub.taskTitle}</h5>
              </div>

              {/* Tệp đính kèm */}
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-100 text-main">
                    <LuFileText size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-text" title={sub.fileName}>
                      {sub.fileName}
                    </p>
                  </div>
                </div>

                <Link
                  href={`sub.downloadUrl`}
                  download={sub.fileName}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-indigo-50 hover:text-main cursor-pointer"
                  title="Tải xuống tệp tin"
                >
                  <LuDownload size={14} />
                </Link>
              </div>

              {/* Ghi chú của thành viên */}
              <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs">
                <span className="font-semibold text-[#475569]">Ghi chú của thành viên: </span>
                <span className="text-[#64748B]">{sub.note}</span>
              </div>
            </div>

            {/* Footer hành động */}
            <div className="mt-4 border-t border-[#F1F5F9] pt-3.5">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 cursor-pointer"
                >
                  <LuCheck size={14} />
                  Duyệt hoàn thành
                </button>

                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 cursor-pointer"
                >
                  <LuRotateCcw size={14} />
                  Yêu cầu nộp lại
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-5 text-xs text-[#94A3B8]">
        Hiển thị {MOCK_SUBMISSIONS.length} trên tổng số {MOCK_SUBMISSIONS.length} bài nộp.
      </p>
    </>
  );
}
