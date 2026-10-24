"use client";

import { useState } from "react";
import {
  LuCheck,
  LuRotateCcw,
  LuDownload,
  LuFileText,
  LuClock,
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

  const isApproved = submission.status === "approved";
  const avatar = getAvatarColor(submission.submittedByEmail);
  const badge = STATUS_BADGE[submission.status] || STATUS_BADGE.submitted;

  // ── 1. Admin duyệt hoàn thành ──────────────────────────────────────────
  const handleApprove = async () => {
    if (isApproved || loadingApprove) return;
    setLoadingApprove(true);
    try {
      const res = await fetch(`${API_BASE}/api/submissions/${submission.id}/approve`, {
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

  // ── 2. Admin yêu cầu nộp lại ───────────────────────────────────────────
  const handleResubmit = async () => {
    if (loadingResubmit) return;
    setLoadingResubmit(true);
    try {
      const res = await fetch(`${API_BASE}/api/submissions/${submission.id}/resubmit`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.code === "success") {
        onStatusChange(
          submission.id,
          "resubmit_requested",
          `Đã gửi yêu cầu nộp lại cho ${submission.submittedByName}.`,
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
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
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
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <LuCheck size={14} />
            )}
            {isApproved ? "Đã hoàn thành" : "Duyệt hoàn thành"}
          </button>

          {/* Nút Yêu cầu nộp lại */}
          <button
            type="button"
            onClick={handleResubmit}
            disabled={loadingResubmit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 cursor-pointer disabled:opacity-50"
          >
            {loadingResubmit ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
            ) : (
              <LuRotateCcw size={14} />
            )}
            Yêu cầu nộp lại
          </button>
        </div>
      </div>
    </article>
  );
}
