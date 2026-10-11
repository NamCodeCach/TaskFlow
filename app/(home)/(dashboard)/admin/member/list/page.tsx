import { BiChevronDown, BiRadio, BiSearch } from "react-icons/bi";
import { BsShieldCheck } from "react-icons/bs";
import { FaUserSecret } from "react-icons/fa6";
import { LuListChecks } from "react-icons/lu";

const members = [
  {
    name: "Nguyễn Hoàng Nam",
    initials: "HN",
    email: "nam.nguyen@taskflow.vn",
    admin: true,
    online: true,
    tasks: 0,
    joined: "Bạn · Tham gia 01/10/2026",
    color: "bg-indigo-100 text-main",
  },
  {
    name: "Nguyễn Thùy Linh",
    initials: "TL",
    email: "linh.nguyen@taskflow.vn",
    admin: false,
    online: true,
    tasks: 4,
    joined: "Tham gia 01/10/2026",
    color: "bg-rose-100 text-rose-600",
  },
  {
    name: "Trần Quang Minh",
    initials: "QM",
    email: "minh.tran@taskflow.vn",
    admin: false,
    online: false,
    tasks: 2,
    joined: "Tham gia 01/10/2026",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Lê Gia Huy",
    initials: "GH",
    email: "huy.le@taskflow.vn",
    admin: false,
    online: true,
    tasks: 1,
    joined: "Tham gia 01/10/2026",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "Phạm Ngọc Anh",
    initials: "NA",
    email: "anh.pham@taskflow.vn",
    admin: false,
    online: false,
    tasks: 1,
    joined: "Tham gia 01/10/2026",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function ThanhVien() {
  return (
    <div className="min-h-screen bg-slate-100 text-[13px] text-slate-900">
      <div className="w-full">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-[26px] font-bold tracking-tight">Thành viên</h1>
          <button className="rounded-[10px] bg-main px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-indigo-700">
            + Thêm thành viên
          </button>
        </header>

        {/* Stats */}
        <section className="my-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Tổng thành viên</span>
              <FaUserSecret size={18} className="text-main" />
            </div>
            <div className="my-4 text-[28px] font-bold">5</div>
            <p className="text-[11px] text-slate-500">1 quản trị viên · 4 thành viên</p>
          </div>

          {/* <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Đang online</span>
              <BiRadio size={18} className="text-main" />
            </div>
            <div className="my-4 text-[28px] font-bold">3</div>
            <p className="text-[11px] text-slate-500">Sẵn sàng cộng tác cùng bạn</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Task đã giao</span>
              <LuListChecks size={18} className="text-main" />
            </div>
            <div className="my-4 text-[28px] font-bold">8</div>
            <p className="text-[11px] text-slate-500">4 thành viên đang nhận task</p>
          </div> */}
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 pt-5">
            <h2 className="text-sm font-bold">Đội ngũ sáng tạo</h2>
            <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Tìm tên hoặc Email..."
                  className="h-[38px] w-full rounded-[9px] border border-slate-200 pl-3 pr-9 text-[13px] placeholder:text-slate-400 sm:w-[230px]"
                />
                <BiSearch
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
              <div className="relative">
                <select className="h-[38px] w-[150px] appearance-none rounded-[9px] border border-slate-200 bg-white pl-3 pr-8 text-[13px] text-slate-600">
                  <option>Tất cả vai trò</option>
                  <option>Quản trị viên</option>
                  <option>Thành viên</option>
                </select>
                <BiChevronDown
                  size={16}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left overflow-auto">
              <thead>
                <tr className="bg-slate-50 text-[11.5px] text-slate-500">
                  <th className="px-5 py-3 font-medium">Tên</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Vai trò</th>
                  <th className="px-5 py-3 font-medium">Trực tuyến</th>
                  <th className="px-5 py-3 font-medium">Số task</th>
                  <th className="px-5 py-3 font-medium">•••</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.email} className="border-t border-slate-100">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative grid h-[34px] w-[34px] place-items-center rounded-full text-[11px] font-bold ${m.color}`}
                        >
                          {m.initials}
                          <span
                            className={`absolute -bottom-px -right-px h-2 w-2 rounded-full border-2 border-white ${m.online ? "bg-green-500" : "bg-slate-400"}`}
                          />
                        </div>
                        <div>
                          <div className="text-[12.5px] font-semibold">{m.name}</div>
                          <div className="mt-0.5 text-[10.5px] text-slate-500">{m.joined}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{m.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${m.admin ? "bg-indigo-100 text-main" : "bg-slate-100 text-slate-500"}`}
                      >
                        {m.admin ? "Quản trị viên" : "Thành viên"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11.5px] ${m.online ? "text-emerald-700" : "text-slate-500"}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${m.online ? "bg-emerald-600" : "bg-slate-400"}`}
                        />
                        {m.online ? "Trực tuyến" : "Ngoại tuyến"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[12.5px] font-bold">{m.tasks}</td>
                    <td className="px-5 py-3.5">
                      <button className="rounded-md px-2 py-1 tracking-wider text-slate-500 hover:bg-slate-100">
                        •••
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-wrap justify-between gap-2 border-t border-slate-100 px-5 py-4 text-[11.5px] text-slate-500">
            <span>Hiển thị 5 trên 5 thành viên</span>
            <span>Số task bao gồm tất cả trạng thái</span>
          </footer>
        </section>

        <p className="mx-1 mt-4 flex items-center gap-2 text-[11.5px] text-slate-500">
          <BsShieldCheck size={14} />
          Quản trị viên có thể giao task, duyệt bài nộp và quản lý thành viên.
        </p>
      </div>
    </div>
  );
}
