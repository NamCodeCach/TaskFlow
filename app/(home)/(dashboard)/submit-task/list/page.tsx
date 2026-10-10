export default function BaiNopList() {
  return (
    <div className="flex-1 ">
      <h1 className="text-2xl font-bold text-text">Bài nộp</h1>
      <p className="mt-1 text-slate-500">Xem tài liệu, phản hồi và ghi nhận kết quả của nhóm.</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <label className="flex w-44 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
            <input
              type="text"
              placeholder="Tìm bài nộp..."
              className="w-full bg-transparent placeholder:text-slate-400 focus:outline-none"
            />
            <svg
              className="h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </label>
          <select className="w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
            <option>Người nộp</option>
            <option>Nguyễn Thùy Linh</option>
            <option>Trần Quang Minh</option>
          </select>
        </div>
      </div>

      {/* list submit task user */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-500">
                TL
              </span>
              <div>
                <p className="font-semibold text-slate-800">Nguyễn Thùy Linh</p>
                <p className="text-xs text-slate-400">Đã nộp lúc 03/10/2026 · 10:15</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>Đã nộp
            </span>
          </div>
          <p className="mt-5 text-xs font-semibold text-indigo-600">TF-105 · Thiết kế</p>
          <h2 className="mt-1 text-lg font-bold text-text">Bộ bài đăng mạng xã hội</h2>
          <p className="mt-1 text-xs text-slate-500">Hạn nộp: 04/10/2026 · 17:00</p>

          <p className="mt-4 text-xs font-medium text-slate-400">Ghi chú của thành viên</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Em đã hoàn thiện 6 mẫu bài đăng. Nhờ anh xem giúp phần màu sắc và nội dung.
          </p>
          <a
            href="#"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600"
          >
            Mở trên Drive
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>

          <div className="mt-4 flex gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l5 5 9-10" />
              </svg>
              Hoàn thành
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
              </svg>
              Yêu cầu nộp lại
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                QM
              </span>
              <div>
                <p className="font-semibold text-slate-800">Trần Quang Minh</p>
                <p className="text-xs text-slate-400">Đã nộp lúc 03/10/2026 · 09:10</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>Đã nộp
            </span>
          </div>
          <p className="mt-5 text-xs font-semibold text-indigo-600">TF-107 · Báo cáo</p>
          <h2 className="mt-1 text-lg font-bold text-text">Báo cáo hiệu quả tháng 9</h2>
          <p className="mt-1 text-xs text-slate-500">Hạn nộp: 04/10/2026 · 17:00</p>

          <p className="mt-4 text-xs font-medium text-slate-400">Ghi chú của thành viên</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Báo cáo đã bổ sung số liệu của tất cả các kênh và đề xuất cho tháng tới.
          </p>
          <a
            href="#"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600"
          >
            Mở trên Drive
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>

          <div className="mt-4 flex gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l5 5 9-10" />
              </svg>
              Hoàn thành
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
              </svg>
              Yêu cầu nộp lại
            </button>
          </div>
        </article>
      </div>
      {/* End list submit task user */}

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-700">
        <svg
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        Khi bạn đánh dấu Hoàn thành, thành viên sẽ nhận được thông báo. Cần chỉnh sửa? Hãy chọn Yêu
        cầu nộp lại.
      </div>
      <p className="mt-6 text-xs text-slate-400">
        Tất cả bài nộp được lưu an toàn trên Drive của nhóm.
      </p>
    </div>
  );
}
