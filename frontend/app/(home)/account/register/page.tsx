"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaListCheck, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import {
  LuCalendar,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuLockKeyhole,
  LuMapPin,
  LuUser,
} from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";

// Danh sách các tỉnh / thành phố Việt Nam gợi ý
const VIETNAM_PROVINCES = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Bình Dương",
  "Đồng Nai",
  "Bà Rịa - Vũng Tàu",
  "Long An",
  "Tiền Giang",
  "Bến Tre",
  "Vĩnh Long",
  "Trà Vinh",
  "Hậu Giang",
  "Sóc Trăng",
  "Bạc Liêu",
  "Cà Mau",
  "Kiên Giang",
  "An Giang",
  "Đồng Tháp",
  "Tây Ninh",
  "Bình Phước",
  "Lâm Đồng",
  "Đắk Lắk",
  "Đắk Nông",
  "Gia Lai",
  "Kon Tum",
  "Khánh Hòa",
  "Ninh Thuận",
  "Bình Thuận",
  "Phú Yên",
  "Bình Định",
  "Quảng Ngãi",
  "Quảng Nam",
  "Thừa Thiên Huế",
  "Quảng Trị",
  "Quảng Bình",
  "Hà Tĩnh",
  "Nghệ An",
  "Thanh Hóa",
  "Ninh Bình",
  "Nam Định",
  "Thái Bình",
  "Hà Nam",
  "Hưng Yên",
  "Hải Dương",
  "Bắc Ninh",
  "Bắc Giang",
  "Vĩnh Phúc",
  "Phú Thọ",
  "Thái Nguyên",
  "Tuyên Quang",
  "Yên Bái",
  "Lào Cai",
  "Sơn La",
  "Hòa Bình",
  "Điện Biên",
  "Lai Châu",
  "Hà Giang",
  "Cao Bằng",
  "Bắc Kạn",
  "Lạng Sơn",
  "Quảng Ninh",
];

const DAYS_OF_WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export default function RegisterPage() {
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Phân tách ngày / tháng / năm có sẵn dạng __ / __ / ____
  const [dayVal, setDayVal] = useState("");
  const [monthVal, setMonthVal] = useState("");
  const [yearVal, setYearVal] = useState("");

  // Refs điều hướng giữa các ô ngày / tháng / năm
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Show / Hide password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calYear, setCalYear] = useState(2005);
  const [calMonth, setCalMonth] = useState(3); // 0-indexed: 3 = Tháng 4
  const [calDay, setCalDay] = useState<number | null>(27);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Address Dropdown states
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const addressRef = useRef<HTMLDivElement>(null);

  // Validation & Error states
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    dob?: string;
    address?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Chế độ Đăng ký tài khoản phụ liên kết
  const [isSubAccountMode, setIsSubAccountMode] = useState(false);
  const [parentAccountEmail, setParentAccountEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("subaccount") === "true") {
        setIsSubAccountMode(true);
        const parent = params.get("parent");
        if (parent) setParentAccountEmail(decodeURIComponent(parent));
      }
    }
  }, []);

  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Success modal
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Kiểm tra đúng 3 điều kiện: có chữ, có số, và ít nhất 1 ký tự đặc biệt
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasLetter && hasNumber && hasSpecialChar;

  // Đóng Calendar và Address Dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (addressRef.current && !addressRef.current.contains(event.target as Node)) {
        setShowAddressDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý khi gõ NGÀY
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setDayVal(val);
    if (errors.dob) setErrors((prev) => ({ ...prev, dob: undefined }));

    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 31) {
      setCalDay(num);
    } else if (val === "") {
      setCalDay(null);
    }

    // Tự động nhảy sang ô Tháng khi gõ đủ 2 số
    if (val.length === 2 && monthRef.current) {
      monthRef.current.focus();
    }
  };

  // Xử lý khi gõ THÁNG -> Lịch tự chuyển sang tháng đó ngay lập tức!
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setMonthVal(val);
    if (errors.dob) setErrors((prev) => ({ ...prev, dob: undefined }));

    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      // Chuyển lịch ngay sang tháng này! (ví dụ nhập 04 -> sang Tháng 4)
      setCalMonth(num - 1);
    }

    // Tự động nhảy sang ô Năm khi gõ đủ 2 số
    if (val.length === 2 && yearRef.current) {
      yearRef.current.focus();
    }
  };

  // Xử lý khi gõ NĂM -> Lịch tự chuyển sang năm đó ngay lập tức!
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setYearVal(val);
    if (errors.dob) setErrors((prev) => ({ ...prev, dob: undefined }));

    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1900 && num <= 2100) {
      // Chuyển lịch ngay sang năm này! (ví dụ nhập 2025 -> sang Năm 2025)
      setCalYear(num);
    }
  };

  // Điều hướng phím Backspace giữa các ô
  const handleDayKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowRight" && dayVal.length >= 1 && monthRef.current) {
      monthRef.current.focus();
    }
  };

  const handleMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && monthVal === "" && dayRef.current) {
      dayRef.current.focus();
    } else if (e.key === "ArrowLeft" && dayRef.current) {
      dayRef.current.focus();
    } else if (e.key === "ArrowRight" && monthVal.length >= 1 && yearRef.current) {
      yearRef.current.focus();
    }
  };

  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && yearVal === "" && monthRef.current) {
      monthRef.current.focus();
    } else if (e.key === "ArrowLeft" && monthRef.current) {
      monthRef.current.focus();
    }
  };

  // Chọn ngày từ Lịch
  const handleSelectDay = (day: number) => {
    setCalDay(day);
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = calMonth + 1 < 10 ? `0${calMonth + 1}` : `${calMonth + 1}`;
    setDayVal(formattedDay);
    setMonthVal(formattedMonth);
    setYearVal(`${calYear}`);
    setShowCalendar(false);
    if (errors.dob) setErrors((prev) => ({ ...prev, dob: undefined }));
  };

  // Tính số ngày trong tháng đang xem
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Ngày đầu tiên của tháng rơi vào thứ mấy (0 = CN, 1 = T2, ...)
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Điều chỉnh để T2 = 0, CN = 6
  };

  const daysInCurrentMonth = getDaysInMonth(calYear, calMonth);
  const firstDayIndex = getFirstDayOfMonth(calYear, calMonth);

  // Điều hướng lịch tháng trước / tháng sau
  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((prev) => prev - 1);
    } else {
      setCalMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((prev) => prev + 1);
    } else {
      setCalMonth((prev) => prev + 1);
    }
  };

  // Lọc địa chỉ theo từ khóa người dùng gõ
  const filteredProvinces = VIETNAM_PROVINCES.filter((item) =>
    item.toLowerCase().includes(address.toLowerCase())
  );

  // Xử lý nộp form đăng ký
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    }

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập địa chỉ Gmail";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Địa chỉ email không hợp lệ";
    }

    const fullDob = `${dayVal}/${monthVal}/${yearVal}`;
    if (!dayVal || !monthVal || !yearVal || yearVal.length < 4) {
      newErrors.dob = "Vui lòng nhập đầy đủ ngày / tháng / năm sinh (__ / __ / ____)";
    }

    if (!address.trim()) {
      newErrors.address = "Vui lòng chọn hoặc nhập địa chỉ";
    }

    if (!isPasswordValid) {
      newErrors.password =
        "Mật khẩu phải có chữ, số và ít nhất 1 ký tự đặc biệt (@, #, $, %, !...)";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setPasswordTouched(true);
      setConfirmPasswordTouched(true);
      return;
    }

    // Kiểm tra xem email đã tồn tại trong localStorage chưa
    try {
      const storedUsersStr = localStorage.getItem("taskflow_users");
      const users = storedUsersStr ? JSON.parse(storedUsersStr) : [];

      const isExist = users.some(
        (u: { email: string }) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (isExist) {
        setErrors({ email: "Email này đã được sử dụng. Vui lòng chọn email khác!" });
        return;
      }

      // Lưu tài khoản mới
      const newUser = {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        role: "user",
        dob: fullDob,
        address: address.trim(),
        password: password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("taskflow_users", JSON.stringify(users));

      // Nếu đang trong chế độ tạo tài khoản phụ cho tài khoản cha
      if (isSubAccountMode && parentAccountEmail) {
        const allSubsStr = localStorage.getItem("taskflow_sub_accounts");
        const allSubs = allSubsStr ? JSON.parse(allSubsStr) : {};
        const pKey = parentAccountEmail.toLowerCase();
        if (!allSubs[pKey]) allSubs[pKey] = [];
        allSubs[pKey].push({
          fullName: newUser.fullName,
          email: newUser.email,
          role: "user",
        });
        localStorage.setItem("taskflow_sub_accounts", JSON.stringify(allSubs));

        // Tự động thêm vào taskflow_members_list
        try {
          const membersStr = localStorage.getItem("taskflow_members_list");
          if (membersStr) {
            const mList = JSON.parse(membersStr);
            mList.push({
              name: newUser.fullName,
              initials: newUser.fullName.trim().split(/\s+/).pop()?.charAt(0).toUpperCase() || "K",
              email: newUser.email,
              admin: false,
              tasks: 0,
              joined: `Tham gia ${new Date().toLocaleDateString("vi-VN")}`,
              color: "bg-teal-100 text-teal-700",
            });
            localStorage.setItem("taskflow_members_list", JSON.stringify(mList));
          }
        } catch {}

        setRegisterSuccess(true);
        setTimeout(() => {
          router.push("/user/task/list?subaccount_added=success");
        }, 1800);
      } else {
        // Hiển thị modal đăng ký thành công và tự động chuyển về login
        setRegisterSuccess(true);
        setTimeout(() => {
          router.push("/account/login?registered=success");
        }, 1800);
      }
    } catch {
      alert("Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại!");
    }
  };

  return (
    <>
      <div className="my-[40px] md:my-[60px]">
        <div className="contain">
          <div className="flex flex-col mx-auto p-[28px] sm:p-[40px] max-w-[540px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-[0px_20px_60px_0px_#10182826]">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main text-lg text-white">
                <FaListCheck />
              </div>
              <span className="text-2xl font-bold text-text">TaskFlow</span>
            </div>

            <h3 className="text-[26px] sm:text-[28px] font-bold text-text text-center mt-[24px]">
              {isSubAccountMode ? "Tạo tài khoản phụ" : "Tạo tài khoản mới"}
            </h3>

            <p className="text-[14px] text-[#475569] text-center font-[400] mt-1">
              {isSubAccountMode
                ? `Liên kết tài khoản phụ với ${parentAccountEmail}`
                : "Điền thông tin bên dưới để bắt đầu quản lý công việc cùng nhóm."}
            </p>

            {/* Banner chế độ tài khoản phụ */}
            {isSubAccountMode && (
              <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-main font-medium flex items-center justify-between">
                <span>✨ Đang tạo tài khoản phụ cho: <strong>{parentAccountEmail}</strong></span>
                <Link href="/user/task/list" className="text-slate-500 hover:text-main text-[11px] underline">
                  Quay lại
                </Link>
              </div>
            )}

            {/* Form Register */}
            <form onSubmit={handleSubmit} className="mt-[24px] flex flex-col gap-[20px]">
              {/* Họ và tên */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[#475569] text-[14px] font-medium">Họ và tên</label>
                <div
                  className={`w-full flex items-center gap-2 border-[1px] ${
                    errors.fullName ? "border-red-500 bg-red-50/20" : "border-[#E2E8F0]"
                  } rounded-full px-[14px] py-[12px] transition focus-within:border-main focus-within:ring-2 focus-within:ring-main/20`}
                >
                  <LuUser className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    placeholder="Nguyễn Văn A"
                    className="w-full outline-none text-sm text-slate-700 bg-transparent"
                  />
                </div>
                {errors.fullName && (
                  <span className="text-red-500 text-[12px] pl-3 font-medium">
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* Gmail */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[#475569] text-[14px] font-medium">
                  Gmail (Tài khoản đăng nhập)
                </label>
                <div
                  className={`w-full flex items-center gap-2 border-[1px] ${
                    errors.email ? "border-red-500 bg-red-50/20" : "border-[#E2E8F0]"
                  } rounded-full px-[14px] py-[12px] transition focus-within:border-main focus-within:ring-2 focus-within:ring-main/20`}
                >
                  <MdOutlineEmail className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="nguyenvana@gmail.com"
                    className="w-full outline-none text-sm text-slate-700 bg-transparent"
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-[12px] pl-3 font-medium">{errors.email}</span>
                )}
              </div>

              {/* Ngày / Tháng / Năm sinh (Kèm Khung trống __ / __ / ____ và Lịch tự nhảy) */}
              <div className="flex flex-col gap-[6px] relative" ref={calendarRef}>
                <div className="flex items-center justify-between">
                  <label className="text-[#475569] text-[14px] font-medium">
                    Ngày / tháng / năm sinh
                  </label>
                  <span className="text-[12px] text-slate-400">Định dạng: Ngày / Tháng / Năm</span>
                </div>

                {/* Khung nhập có sẵn khoảng trống __ / __ / ____ */}
                <div
                  className={`w-full flex items-center justify-between border-[1px] ${
                    errors.dob ? "border-red-500 bg-red-50/20" : "border-[#E2E8F0]"
                  } rounded-full px-[14px] py-[10px] transition focus-within:border-main focus-within:ring-2 focus-within:ring-main/20 cursor-pointer`}
                  onClick={() => setShowCalendar(true)}
                >
                  <div className="flex items-center gap-2.5">
                    <LuCalendar className="text-gray-400 text-[18px] shrink-0" />

                    {/* 3 ô nhập ngày / tháng / năm kết nối với nhau */}
                    <div className="flex items-center text-sm font-semibold text-slate-800">
                      {/* Ngày */}
                      <input
                        ref={dayRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        value={dayVal}
                        onChange={handleDayChange}
                        onKeyDown={handleDayKeyDown}
                        onFocus={() => setShowCalendar(true)}
                        placeholder="__"
                        className="w-7 text-center outline-none bg-transparent placeholder:text-slate-400 text-main font-bold"
                      />
                      <span className="text-slate-400 font-bold px-0.5">/</span>

                      {/* Tháng -> Nhập 04 là Lịch lập tức nhảy sang Tháng 4! */}
                      <input
                        ref={monthRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        value={monthVal}
                        onChange={handleMonthChange}
                        onKeyDown={handleMonthKeyDown}
                        onFocus={() => setShowCalendar(true)}
                        placeholder="__"
                        className="w-7 text-center outline-none bg-transparent placeholder:text-slate-400 text-main font-bold"
                      />
                      <span className="text-slate-400 font-bold px-0.5">/</span>

                      {/* Năm -> Nhập 2025 là Lịch lập tức nhảy sang Năm 2025! */}
                      <input
                        ref={yearRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={yearVal}
                        onChange={handleYearChange}
                        onKeyDown={handleYearKeyDown}
                        onFocus={() => setShowCalendar(true)}
                        placeholder="____"
                        className="w-12 text-center outline-none bg-transparent placeholder:text-slate-400 text-main font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCalendar((prev) => !prev);
                    }}
                    className="text-xs text-main font-semibold px-2.5 py-1 rounded-full hover:bg-indigo-50 border border-indigo-100 transition"
                  >
                    {showCalendar ? "Đóng lịch" : "Chọn lịch"}
                  </button>
                </div>

                {errors.dob && (
                  <span className="text-red-500 text-[12px] pl-3 font-medium">{errors.dob}</span>
                )}

                {/* Popup Khung Lịch (Calendar) */}
                {showCalendar && (
                  <div className="absolute top-[102%] left-0 z-50 w-full sm:w-[340px] bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0px_10px_35px_0px_#1018281f] p-4 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header lịch: Chuyển tháng / năm */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                      >
                        <LuChevronLeft size={18} />
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Dropdown chọn tháng */}
                        <select
                          value={calMonth}
                          onChange={(e) => {
                            const newM = parseInt(e.target.value, 10);
                            setCalMonth(newM);
                            setMonthVal(newM + 1 < 10 ? `0${newM + 1}` : `${newM + 1}`);
                          }}
                          className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2 py-1 text-slate-700 outline-none"
                        >
                          {MONTHS.map((m, idx) => (
                            <option key={m} value={idx}>
                              {m}
                            </option>
                          ))}
                        </select>

                        {/* Dropdown chọn năm */}
                        <select
                          value={calYear}
                          onChange={(e) => {
                            const newY = parseInt(e.target.value, 10);
                            setCalYear(newY);
                            setYearVal(`${newY}`);
                          }}
                          className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2 py-1 text-slate-700 outline-none"
                        >
                          {Array.from({ length: 100 }, (_, i) => 2026 - i).map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                      >
                        <LuChevronRight size={18} />
                      </button>
                    </div>

                    {/* Thứ trong tuần */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-1">
                      {DAYS_OF_WEEK.map((d) => (
                        <span key={d} className="text-[11px] font-semibold text-slate-400 py-1">
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Lưới các ngày */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {/* Khoảng trống đầu tháng */}
                      {Array.from({ length: firstDayIndex }).map((_, idx) => (
                        <div key={`empty-${idx}`} />
                      ))}

                      {/* Các ngày trong tháng */}
                      {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day) => {
                        const isSelected = calDay === day;
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleSelectDay(day)}
                            className={`h-8 w-8 mx-auto text-xs rounded-full font-medium transition flex items-center justify-center ${
                              isSelected
                                ? "bg-main text-white font-bold shadow-sm"
                                : "text-slate-700 hover:bg-indigo-50 hover:text-main"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Chân lịch */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Lịch nhảy tức thì theo ngày/tháng/năm gõ</span>
                      <button
                        type="button"
                        onClick={() => setShowCalendar(false)}
                        className="text-main font-semibold hover:underline"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Địa chỉ (Kèm danh sách xổ xuống) */}
              <div className="flex flex-col gap-[6px] relative" ref={addressRef}>
                <label className="text-[#475569] text-[14px] font-medium">Địa chỉ</label>
                <div
                  className={`w-full flex items-center gap-2 border-[1px] ${
                    errors.address ? "border-red-500 bg-red-50/20" : "border-[#E2E8F0]"
                  } rounded-full px-[14px] py-[12px] transition focus-within:border-main focus-within:ring-2 focus-within:ring-main/20`}
                  onClick={() => setShowAddressDropdown(true)}
                >
                  <LuMapPin className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setShowAddressDropdown(true);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                    }}
                    onFocus={() => setShowAddressDropdown(true)}
                    placeholder="Chọn hoặc nhập tỉnh/thành phố..."
                    className="w-full outline-none text-sm text-slate-700 bg-transparent"
                  />
                  <span className="text-[11px] text-slate-400 shrink-0">▼</span>
                </div>
                {errors.address && (
                  <span className="text-red-500 text-[12px] pl-3 font-medium">
                    {errors.address}
                  </span>
                )}

                {/* Dropdown danh sách Địa chỉ */}
                {showAddressDropdown && (
                  <div className="absolute top-[102%] left-0 z-50 w-full max-h-[220px] overflow-y-auto bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0px_10px_35px_0px_#1018281f] p-2 animate-in fade-in duration-150">
                    <p className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                      Gợi ý Tỉnh / Thành phố
                    </p>
                    {filteredProvinces.length > 0 ? (
                      filteredProvinces.map((prov) => (
                        <button
                          key={prov}
                          type="button"
                          onClick={() => {
                            setAddress(prov);
                            setShowAddressDropdown(false);
                            if (errors.address)
                              setErrors((prev) => ({ ...prev, address: undefined }));
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition flex items-center justify-between ${
                            address === prov
                              ? "bg-indigo-50 font-semibold text-main"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>{prov}</span>
                          {address === prov && <LuCheck className="text-main" size={14} />}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-xs text-slate-400 text-center">
                        Không tìm thấy gợi ý, bạn có thể gõ trực tiếp địa chỉ này.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mật khẩu */}
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between">
                  <label className="text-[#475569] text-[14px] font-medium">Mật khẩu</label>
                  <span className="text-[11px] text-slate-400">Gồm chữ, số & ký tự đặc biệt</span>
                </div>

                <div
                  className={`w-full flex items-center gap-2 border-[1px] ${
                    passwordTouched && !isPasswordValid
                      ? "border-red-500 bg-red-50/20"
                      : passwordTouched && isPasswordValid
                      ? "border-emerald-500 bg-emerald-50/10"
                      : "border-[#E2E8F0]"
                  } rounded-full px-[14px] py-[12px] text-[#94A3B8] transition focus-within:border-main focus-within:ring-2 focus-within:ring-main/20`}
                >
                  <LuLockKeyhole className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordTouched(true);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full outline-none text-sm text-slate-700 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
                  </button>
                </div>

                {/* Thông báo đỏ khi chưa đủ điều kiện */}
                {passwordTouched && !isPasswordValid && (
                  <div className="text-red-500 text-[12px] pl-3 font-medium flex flex-col gap-0.5 mt-0.5">
                    <span>
                      ⚠️ Mật khẩu phải có chữ, số và ít nhất 1 ký tự đặc biệt (@, #, $, %, !...)
                    </span>
                    <div className="flex gap-3 text-[11px] mt-1 text-slate-500">
                      <span className={hasLetter ? "text-emerald-600 font-semibold" : "text-red-500"}>
                        {hasLetter ? "✓" : "✗"} Có chữ
                      </span>
                      <span className={hasNumber ? "text-emerald-600 font-semibold" : "text-red-500"}>
                        {hasNumber ? "✓" : "✗"} Có số
                      </span>
                      <span
                        className={
                          hasSpecialChar ? "text-emerald-600 font-semibold" : "text-red-500"
                        }
                      >
                        {hasSpecialChar ? "✓" : "✗"} Ký tự đặc biệt
                      </span>
                    </div>
                  </div>
                )}

                {/* Thông báo xanh khi mật khẩu đã đạt chuẩn */}
                {passwordTouched && isPasswordValid && (
                  <div className="text-emerald-600 text-[12px] pl-3 font-medium flex items-center gap-1.5 mt-0.5">
                    <span>✓ Mật khẩu hợp lệ (Đã có đủ chữ, số và ký tự đặc biệt)</span>
                  </div>
                )}
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[#475569] text-[14px] font-medium">
                  Nhập lại mật khẩu
                </label>
                <div
                  className={`w-full flex items-center gap-2 border-[1px] ${
                    confirmPasswordTouched && password !== confirmPassword
                      ? "border-red-500 bg-red-50/20"
                      : "border-[#E2E8F0]"
                  } rounded-full px-[14px] py-[12px] text-[#94A3B8] transition focus-within:border-main focus-within:ring-2 focus-within:ring-main/20`}
                >
                  <LuLockKeyhole className="text-gray-400 text-[18px] shrink-0" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordTouched(true);
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    onBlur={() => setConfirmPasswordTouched(true)}
                    placeholder="Xác nhận lại mật khẩu..."
                    className="w-full outline-none text-sm text-slate-700 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-gray-400 hover:text-slate-600 transition"
                  >
                    {showConfirmPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
                  </button>
                </div>
                {confirmPasswordTouched && password !== confirmPassword && (
                  <span className="text-red-500 text-[12px] pl-3 font-medium">
                    ⚠️ Mật khẩu nhập lại không khớp
                  </span>
                )}
              </div>

              {/* Nút Đăng ký */}
              <button
                type="submit"
                className="mt-2 flex justify-center items-center py-[14px] w-full bg-main rounded-[12px] text-white font-bold cursor-pointer opacity-100 hover:opacity-95 transition shadow-sm"
              >
                Đăng ký tài khoản
              </button>

              {/* Quay lại đăng nhập */}
              <div className="flex items-center justify-center text-[#475569] text-[14px] gap-[6px] flex-wrap">
                <span>Đã có tài khoản?</span>
                <Link href="/account/login" className="font-semibold text-main hover:underline">
                  Đăng nhập ngay
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal thông báo Đăng ký thành công */}
      {registerSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] rounded-[24px] bg-white p-[32px] text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold mb-4">
              <LuCheck size={32} />
            </div>
            <h4 className="text-xl font-bold text-text">Đăng ký thành công!</h4>
            <p className="mt-2 text-sm text-[#475569]">
              Tài khoản của bạn đã được khởi tạo. Đang chuyển về trang Đăng nhập...
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-main border-t-transparent" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
