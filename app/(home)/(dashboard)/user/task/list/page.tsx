export default function Page() {
  return (
    <div className="flex-1">
      <h1 className="text-2xl font-bold text-text">Xin chào, Thùy Linh 👋</h1>
      <p className="mt-1 text-sm text-slate-500">
        Bạn có 2 task cần xử lý. Cùng tạo nên một ngày làm việc hiệu quả!
      </p>

      {/* Tiến độ + ưu tiên */}
      {/* <section className="mt-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
        <div className="sm:w-1/3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text">Tiến độ của bạn</span>
            <span className="font-semibold text-main">1/4 task hoàn thành</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200">
            <div className="h-1.5 w-1/4 rounded-full bg-main" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-4 sm:border-l sm:border-slate-200 sm:pl-5">
          <div>
            <p className="text-xs font-semibold text-red-600">1 task quá hạn cần được ưu tiên</p>
            <p className="mt-1 text-xs text-slate-500">
              Cập nhật giao diện trang đích · Hạn nộp 02/10/2026
            </p>
          </div>
          <a href="#" aria-label="Xem task ưu tiên" className="text-slate-600 hover:text-text">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </section> */}

      {/* Tab + sắp xếp */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-main px-4 py-2 text-xs font-semibold text-white"
          >
            Tất cả <span className="ml-1 font-normal">4</span>
          </button>
          {/* <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-text"
          >
            Cần làm <span className="ml-1 font-normal text-slate-400">1</span>
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-text"
          >
            Đã nộp <span className="ml-1 font-normal text-slate-400">1</span>
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-text"
          >
            Hoàn thành <span className="ml-1 font-normal text-slate-400">1</span>
          </button> */}
        </div>
        <button type="button" className="inline-flex items-center gap-2 text-xs text-slate-500">
          Mới nhất trước
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" />
          </svg>
        </button>
      </div>

      {/* Danh sách task */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-main/10 text-main">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="13.5" cy="6.5" r="1" />
                  <circle cx="17.5" cy="10.5" r="1" />
                  <circle cx="8.5" cy="7.5" r="1" />
                  <circle cx="6.5" cy="12.5" r="1" />
                  <path d="M12 22a10 10 0 1 1 10-10c0 2.5-2 3-3.5 3H16a2 2 0 0 0-1.5 3.3c.6.7.5 3.7-2.5 3.7z" />
                </svg>
              </span>
              TF-108 · Thiết kế
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              Cần làm
            </span>
          </div>

          <h2 className="mt-4 text-lg font-bold text-text">Thiết kế banner</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Thiết kế banner cho chiến dịch tháng 10. Kích thước 1920 × 600 px, sử dụng bộ nhận diện
            thương hiệu.
          </p>

          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Hạn nộp: 05/10/2026 · 17:00
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-main/10 text-[10px] font-bold text-main">
                HN
              </span>
              Hoàng Nam giao
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-main px-4 py-2 text-xs font-semibold text-white focus-within:ring-2 focus-within:ring-main focus-within:ring-offset-2">
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              Nộp bài
              <input type="file" className="sr-only" />
            </label>
          </div>
        </article>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Hiển thị 4 task của bạn · Cập nhật theo thời gian thực.
      </p>
    </div>
  );
}
