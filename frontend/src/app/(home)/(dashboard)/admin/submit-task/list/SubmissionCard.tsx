"use client";

import { useState } from "react";
import {
  LuCheck,
  LuRotateCcw,
  LuDownload,
  LuFileText,
  LuClock,
  LuX,
  LuTriangleAlert,
  LuLoader,
  LuSend,
} from "react-icons/lu";
import {
  API_BASE,
  STATUS_BADGE,
  STATUS_LABEL,
  SubmissionItem,
  SubmissionStatus,
  getAvatarColor,
} from "./types";

interface SubmissionCardProps {
  submission: SubmissionItem;
  onStatusChange: (id: number, newStatus: SubmissionStatus, message: string) => void;
  onError: (message: string) => void;
}

export default function SubmissionCard({
  submission,
  onStatusChange,
  onError,
}: SubmissionCardProps) {
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingResubmit, setLoadingResubmit] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [resubmitReason, setResubmitReason] = useState("");

  const isApproved = submission.status === "approved";
  const avatar = getAvatarColor(submission.submittedByEmail);
  const badge = STATUS_BADGE[submission.status] || STATUS_BADGE.submitted;

  // Lấy thông tin admin hiện tại nếu có
  const getAdminId = () => {
    try {
      const stored = localStorage.getItem("taskflow_current_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.userId || null;
      }
    } catch {
      // bỏ qua
    }
    return null;
  };

  // ── 1. Admin duyệt hoàn thành ──────────────────────────────────────────
  const handleApprove = async () => {
    if (isApproved || loadingApprove) return;
    setLoadingApprove(true);
    try {
      const adminId = getAdminId();
      const url = adminId
        ? `${API_BASE}/api/submissions/${submission.id}/approve?adminId=${adminId}`
        : `${API_BASE}/api/submissions/${submission.id}/approve`;

      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.code === "success") {
        onStatusChange(
          submission.id,
          "approved",
          `Đã duyệt hoàn thành bài nộp của ${submission.submittedByName}!`,
        );
      } else {
        onError(data.message || "Không thể duyệt bài nộp này.");
      }
    } catch {
      onError("Lỗi kết nối tới máy chủ khi duyệt hoàn thành.");
    } finally {
      setLoadingApprove(false);
    }
  };

  // ── 2. Admin gửi yêu cầu nộp lại kèm lý do ────────────────────────────
  const handleConfirmResubmit = async () => {
    if (loadingResubmit) return;
    setLoadingResubmit(true);
    try {
      const adminId = getAdminId();
      const url = adminId
        ? `${API_BASE}/api/submissions/${submission.id}/resubmit?adminId=${adminId}`
        : `${API_BASE}/api/submissions/${submission.id}/resubmit`;

      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: resubmitReason.trim() }),
      });
      const data = await res.json();
      if (data.code === "success") {
        setShowResubmitModal(false);
        setResubmitReason("");
        onStatusChange(
          submission.id,
          "resubmit_requested",
          `Đã gửi yêu cầu nộp lại kèm thông báo email tới ${submission.submittedByName}.`,
        );
      } else {
        onError(data.message || "Không thể gửi yêu cầu nộp lại.");
      }
    } catch {
      onError("Lỗi kết nối tới máy chủ khi yêu cầu nộp lại.");
    } finally {
      setLoadingResubmit(false);
    }
  };

  // ── 3. Tải tệp đính kèm bài nộp ────────────────────────────────────────
  const handleDownload = async () => {
    if (loadingDownload) return;
    setLoadingDownload(true);
    try {
      const downloadEndpoint = `${API_BASE}/api/submissions/${submission.id}/download`;
      const res = await fetch(downloadEndpoint, { credentials: "include" });

      if (!res.ok) {
        throw new Error("Tệp không tồn tại hoặc đã bị xóa khỏi hệ thống.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        submission.originalFileName || `submission-${submission.id}.dat`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      onError(err.message || "Không thể tải tệp tin đính kèm.");
    } finally {
      setLoadingDownload(false);
    }
  };

  return (
    <>
      <article className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div>
          {/* Header bài nộp */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatar.bg} ${avatar.text}`}
              >
                {submission.submittedByInitials ||
                  submission.submittedByName?.charAt(0) ||
                  "U"}
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">
                  {submission.submittedByName}
                </h4>
                <p className="flex items-center gap-1 text-[11px] text-[#64748B]">
                  <LuClock size={12} />
                  Nộp lúc: {submission.submittedAt}
                </p>
              </div>
            </div>

            {/* Badge trạng thái */}
            <span className={badge.wrapper}>
              <span className={badge.dot} />
              {STATUS_LABEL[submission.status] || submission.status}
            </span>
          </div>

          {/* Thông tin Task */}
          <div className="mt-3.5">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-main">
                {submission.taskCode}
              </span>
              {submission.taskCategory && (
                <span className="text-[11px] font-medium text-slate-400">
                  · {submission.taskCategory}
                </span>
              )}
            </div>
            <h5 className="mt-1 text-sm font-semibold text-text">
              {submission.taskTitle}
            </h5>
            {submission.deadline && (
              <p className="mt-0.5 text-[11px] text-slate-400">
                Hạn nộp: {submission.deadline}
              </p>
            )}
          </div>

          {/* Tệp đính kèm */}
          {submission.originalFileName ? (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-100 text-main">
                  <LuFileText size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-xs font-semibold text-text"
                    title={submission.originalFileName}
                  >
                    {submission.originalFileName}
                  </p>
                  {submission.fileSize && (
                    <p className="text-[11px] text-[#64748B]">
                      {submission.fileSize}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={loadingDownload}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-indigo-50 hover:text-main cursor-pointer disabled:opacity-50"
                title="Tải xuống tệp tin"
              >
                {loadingDownload ? (
                  <LuLoader className="animate-spin text-main text-xs" />
                ) : (
                  <LuDownload size={14} />
                )}
              </button>
            </div>
          ) : null}

          {/* Ghi chú của thành viên */}
          {submission.note ? (
            <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs">
              <span className="font-semibold text-[#475569]">
                Ghi chú của thành viên:{" "}
              </span>
              <span className="text-[#64748B]">{submission.note}</span>
            </div>
          ) : null}

          {/* Lý do / Phản hồi yêu cầu nộp lại từ Admin */}
          {submission.adminFeedback ? (
            <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50/70 p-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-rose-700">
                <LuTriangleAlert size={13} className="shrink-0" />
                <span>Phản hồi yêu cầu nộp lại:</span>
              </div>
              <p className="mt-1 text-slate-700 leading-relaxed pl-4 font-normal">
                {submission.adminFeedback}
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer hành động */}
        <div className="mt-4 border-t border-[#F1F5F9] pt-3.5">
          <div className="flex items-center gap-2.5">
            {/* Nút Duyệt hoàn thành */}
            <button
              type="button"
              onClick={handleApprove}
              disabled={isApproved || loadingApprove}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white transition ${
                isApproved
                  ? "bg-slate-300 cursor-not-allowed text-slate-500"
                  : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              } disabled:opacity-75`}
            >
              {loadingApprove ? (
                <LuLoader className="animate-spin text-white text-xs" />
              ) : (
                <LuCheck size={14} />
              )}
              {isApproved ? "Đã hoàn thành" : "Duyệt hoàn thành"}
            </button>

            {/* Nút Yêu cầu nộp lại */}
            <button
              type="button"
              onClick={() => setShowResubmitModal(true)}
              disabled={loadingResubmit}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 cursor-pointer disabled:opacity-50"
            >
              {loadingResubmit ? (
                <LuLoader className="animate-spin text-rose-600 text-xs" />
              ) : (
                <LuRotateCcw size={14} />
              )}
              Yêu cầu nộp lại
            </button>
          </div>
        </div>
      </article>

      {/* Modal nhập lý do yêu cầu nộp lại */}
      {showResubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-600">
                  <LuTriangleAlert size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-text">
                    Yêu cầu nộp lại bài làm
                  </h3>
                  <p className="text-xs text-slate-500">
                    [{submission.taskCode}] {submission.submittedByName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowResubmitModal(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <LuX size={16} />
              </button>
            </div>

            {/* Content Modal */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lý do / Phản hồi yêu cầu chỉnh sửa:
              </label>
              <textarea
                value={resubmitReason}
                onChange={(e) => setResubmitReason(e.target.value)}
                placeholder="Nhập lý do chi tiết hoặc các điểm thành viên cần hoàn thiện lại..."
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-text outline-none placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-1 focus:ring-rose-400"
              />
              <p className="mt-1.5 text-[11px] text-slate-500">
                Hệ thống sẽ gửi thông báo Real-time và Email trực tiếp tới hòm thư của {submission.submittedByName}.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResubmitModal(false)}
                disabled={loadingResubmit}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmResubmit}
                disabled={loadingResubmit}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
              >
                {loadingResubmit ? (
                  <LuLoader className="animate-spin text-white text-xs" />
                ) : (
                  <LuSend size={13} />
                )}
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
