import { CiCalendar } from "react-icons/ci";
import { FaSortAmountDown } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";

interface Task {
  id: number;
  taskCode: string;
  title: string;
  description: string;
  status: string;
  category: string;
  deadline: string | null;
  createdByEmail: string;
}

const DEMO_TASKS: Task[] = [
  {
    id: 1,
    taskCode: "TF-108",
    title: "Thiết kế banner",
    description:
      "Thiết kế banner cho chiến dịch tháng 10. Kích thước 1920 × 600 px, sử dụng bộ nhận diện thương hiệu.",
    status: "TODO",
    category: "Thiết kế",
    deadline: "05/10/2026 17:00",
    createdByEmail: "nam.nguyen@taskflow.vn",
  },
  {
    id: 2,
    taskCode: "TF-109",
    title: "Viết báo cáo Q4",
    description: "Tổng hợp số liệu và viết báo cáo tổng kết quý 4 năm 2026.",
    status: "TODO",
    category: "Báo cáo",
    deadline: "15/10/2026 17:00",
    createdByEmail: "nam.nguyen@taskflow.vn",
  },
];

export default function UserTaskListPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-text">Xin chào, Người dùng</h1>
      <p className="mt-1 text-sm text-slate-500">
        Bạn có 2 task cần xử lý. Cùng tạo nên một ngày làm việc hiệu quả!
      </p>

      {/* Tab filter */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg bg-main px-4 py-2 text-xs font-semibold text-white text-[13px]">
            Tất cả <span className="ml-1">2</span>
          </button>
          {/* Cần làm */}
          <button className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-text text-[13px]  ">
            Cần làm<span className="ml-1">2</span>
          </button>
          {/* Đã nộp */}
          <button className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-text text-[13px]  ">
            Đã nộp<span className="ml-1">2</span>
          </button>
          {/* Hoàn thành */}
          <button className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-text text-[13px]  ">
            Hoàn thành<span className="ml-1">2</span>
          </button>
        </div>
        <button type="button" className="inline-flex items-center gap-2 text-xs text-slate-500">
          Mới nhất trước
          <FaSortAmountDown />
        </button>
      </div>

      {/* Danh sách task */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {DEMO_TASKS.map((task) => (
          <article key={task.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-main/10 text-main">
                  <MdOutlineFileUpload />
                </span>
                {task.taskCode} · {task.category}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                Cần làm
              </span>
            </div>

            <h2 className="mt-4 text-lg font-bold text-text">{task.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{task.description}</p>

            <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <CiCalendar className="h-[17px] w-[17px] text-[#687386]" />
              Hạn nộp: {task.deadline}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-main/10 text-[10px] font-bold text-main">
                  {task.createdByEmail.substring(0, 2).toUpperCase()}
                </span>
                {task.createdByEmail.split("@")[0]} giao
              </div>

              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-main px-4 py-2 text-xs font-semibold text-white transition hover:bg-main/90"
              >
                <MdOutlineFileUpload className="h-[16px] w-[16px]" />
                Nộp bài
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Hiển thị 2 task của bạn · Cập nhật theo thời gian thực.
      </p>
    </>
  );
}
