"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuCamera,
  LuCalendar,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuInfo,
  LuLock,
  LuMail,
  LuPhone,
  LuShieldAlert,
  LuShieldCheck,
  LuUser,
  LuMapPin,
  LuX,
} from "react-icons/lu";

interface UserData {
  fullName: string;
  email: string;
  role?: string;
  avatar?: string;
  dob?: string;
  isDobLocked?: boolean;
  phone?: string;
  address?: string;
  isAddressLocked?: boolean;
  lastAvatarChangedDate?: string;
  lastNameChangedDate?: string;
}

// Danh sách dữ liệu mẫu địa chỉ hành chính Việt Nam đa dạng
const VIETNAM_ADDRESS_DATA = [
  "131, Ấp 1, Xã Hiệp Phước, Huyện Nhơn Trạch, Tỉnh Đồng Nai",
  "131, Ấp 1, Xã Long Phước, Huyện Long Hồ, Tỉnh Vĩnh Long",
  "131, Ấp 1, Xã An Phước, Huyện Mang Thít, Tỉnh Vĩnh Long",
  "131, Ấp 1, Xã Hiệp Phước, Huyện Nhà Bè, TP. Hồ Chí Minh",
  "131, Ấp 1, Xã Tân Nhựt, Huyện Bình Chánh, TP. Hồ Chí Minh",
  "131, Đường số 1, Phường An Khánh, TP. Thủ Đức, TP. Hồ Chí Minh",
  "131, Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
  "131, Đường Cách Mạng Tháng 8, Phường 5, Quận Tân Bình, TP. Hồ Chí Minh",
  "131, Đường Lê Duẩn, Phường Thạch Thang, Quận Hải Châu, TP. Đà Nẵng",
  "131, Phố Huế, Phường Ngô Thì Nhậm, Quận Hai Bà Trưng, TP. Hà Nội",
  "1, Ấp 1, Xã Tân Hạnh, Huyện Long Hồ, Tỉnh Vĩnh Long",
  "1, Đường Trần Hưng Đạo, Phường 1, TP. Vĩnh Long, Tỉnh Vĩnh Long",
  "12, Ấp 1, Xã Bình Hưng, Huyện Bình Chánh, TP. Hồ Chí Minh",
  "15, Ấp 2, Xã Hiệp Phước, Huyện Nhơn Trạch, Tỉnh Đồng Nai",
  "18, Đường Lạch Tray, Phường Lạch Tray, Quận Ngô Quyền, TP. Hải Phòng",
  "21, Ấp 3, Xã An Phú Tây, Huyện Bình Chánh, TP. Hồ Chí Minh",
  "27, Đường 30 Tháng 4, Phường An Phú, Quận Ninh Kiều, TP. Cần Thơ",
  "45, Ấp 2, Xã Tân Thạnh Đông, Huyện Củ Chi, TP. Hồ Chí Minh",
  "54, Đường Nguyễn Văn Cừ, Phường An Hòa, Quận Ninh Kiều, TP. Cần Thơ",
  "72, Ấp 1, Xã Vĩnh Lộc B, Huyện Bình Chánh, TP. Hồ Chí Minh",
  "78, Đại lộ Bình Dương, Phường Phú Hòa, TP. Thủ Dầu Một, Tỉnh Bình Dương",
  "88, Ấp 3, Xã Phú Xuân, Huyện Nhà Bè, TP. Hồ Chí Minh",
  "89, Đường Nguyễn Trãi, Phường 2, TP. Vĩnh Long, Tỉnh Vĩnh Long",
  "99, Đường Võ Nguyên Giáp, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, TP. Đà Nẵng",
  "101, Ấp Mỹ Hòa, Xã Mỹ Khánh, Huyện Phong Điền, TP. Cần Thơ",
  "105, Ấp 1, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP. Hồ Chí Minh",
  "112, Đường Hoàng Diệu, Phường 12, Quận 4, TP. Hồ Chí Minh",
  "120, Đường Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
  "135, Ấp 2, Xã Phước Kiển, Huyện Nhà Bè, TP. Hồ Chí Minh",
  "140, Đường Hoàng Hoa Thám, Phường Thụy Khuê, Quận Tây Hồ, TP. Hà Nội",
  "150, Đường Quang Trung, Phường 10, Quận Gò Vấp, TP. Hồ Chí Minh",
  "155, Đường Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, TP. Đà Nẵng",
  "168, Đường Phạm Văn Đồng, Phường Hiệp Bình Chánh, TP. Thủ Đức, TP. Hồ Chí Minh",
  "182, Ấp 5, Xã Đông Thạnh, Huyện Hóc Môn, TP. Hồ Chí Minh",
  "200, Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, TP. Hà Nội",
  "210, Đường Phan Chu Trinh, Phường Vạn Thạnh, TP. Nha Trang, Tỉnh Khánh Hòa",
  "215, Đường Hai Bà Trưng, Phường Tân Định, Quận 1, TP. Hồ Chí Minh",
  "222, Đường Lê Lợi, Phường Phú Hội, TP. Huế, Tỉnh Thừa Thiên Huế",
  "245, Đường Hùng Vương, Phường Tiền An, TP. Bắc Ninh, Tỉnh Bắc Ninh",
  "250, Phố Kim Mã, Phường Kim Mã, Quận Ba Đình, TP. Hà Nội",
  "300, Đường Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh",
  "312, Đường Trần Phú, Phường Lộc Thọ, TP. Nha Trang, Tỉnh Khánh Hòa",
  "350, Đường Hùng Vương, Phường 9, Quận 5, TP. Hồ Chí Minh",
  "500, Đường Cộng Hòa, Phường 13, Quận Tân Bình, TP. Hồ Chí Minh",
];

const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

export default function UserProfilePage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserData>({
    fullName: "Nguyễn Võ Anh Kiệt",
    email: "kiet.nguyen@taskflow.vn",
    role: "user",
    dob: "",
    isDobLocked: false,
    address: "",
    isAddressLocked: false,
    phone: "",
  });

  // State chỉnh sửa form
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [showAddressList, setShowAddressList] = useState(false);
  const addressContainerRef = useRef<HTMLDivElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newAvatarSelected, setNewAvatarSelected] = useState<string | null>(null);

  // State Ngày / Tháng / Năm sinh & Lịch (Calendar)
  const [dayVal, setDayVal] = useState("27");
  const [monthVal, setMonthVal] = useState("04");
  const [yearVal, setYearVal] = useState("2005");
  const [calYear, setCalYear] = useState(2005);
  const [calMonth, setCalMonth] = useState(3); // 0-indexed: 3 = Tháng 4
  const [showCalendar, setShowCalendar] = useState(false);

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  // Modal thông báo thành công
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Lỗi & thông báo
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy ngày hôm nay định dạng YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();

  // Kiểm tra điều kiện giới hạn 1 ngày 1 lần
  const isAvatarLockedToday = currentUser.lastAvatarChangedDate === todayStr;
  const isNameLockedToday = currentUser.lastNameChangedDate === todayStr;

  // Số điện thoại chỉ được nhập 1 lần: nếu đã có phone lưu thì khóa vĩnh viễn
  const isPhoneLockedForever = Boolean(currentUser.phone && currentUser.phone.trim() !== "");

  // Ngày sinh chỉ được đặt 1 lần và khóa vĩnh viễn (chỉ Admin mới sửa/mở khóa được)
  const isDobLockedForever = Boolean(currentUser.isDobLocked);

  // Địa chỉ chỉ được đặt 1 lần và khóa vĩnh viễn (chỉ Admin mới sửa/mở khóa được)
  const isAddressLockedForever = Boolean(currentUser.isAddressLocked);

  // Lọc gợi ý địa chỉ thông minh
  const getFilteredAddresses = () => {
    const raw = addressInput.trim();
    if (!raw) return VIETNAM_ADDRESS_DATA.slice(0, 8);
    const query = removeVietnameseTones(raw);
    const tokens = query.split(/[\s,]+/).filter((t) => t.length > 0);
    const matches = VIETNAM_ADDRESS_DATA.filter((addr) => {
      const norm = removeVietnameseTones(addr);
      return tokens.every((token) => norm.includes(token));
    });
    return matches.slice(0, 15);
  };

  const filteredAddresses = getFilteredAddresses();

  // Đóng lịch và dropdown địa chỉ khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (
        addressContainerRef.current &&
        !addressContainerRef.current.contains(event.target as Node)
      ) {
        setShowAddressList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tải thông tin người dùng từ localStorage
  const loadProfileData = () => {
    if (typeof window === "undefined") return;

    const curStr = localStorage.getItem("taskflow_current_user");
    let baseUser: UserData = {
      fullName: "Nguyễn Võ Anh Kiệt",
      email: "kiet.nguyen@taskflow.vn",
      role: "user",
      dob: "",
      isDobLocked: false,
      address: "",
      isAddressLocked: false,
      phone: "",
    };

    if (curStr) {
      try {
        const parsed = JSON.parse(curStr);
        baseUser = { ...baseUser, ...parsed };
      } catch {}
    }

    // Đọc từ điển ngày sinh taskflow_user_dobs
    try {
      const dStr = localStorage.getItem("taskflow_user_dobs");
      if (dStr) {
        const dobMap = JSON.parse(dStr);
        if (dobMap[baseUser.email.toLowerCase()]) {
          const entry = dobMap[baseUser.email.toLowerCase()];
          baseUser.dob = entry.dob || baseUser.dob || "";
          baseUser.isDobLocked = entry.isLocked ?? baseUser.isDobLocked;
        }
      }
    } catch {}

    // Đọc từ điển địa chỉ taskflow_user_addresses
    try {
      const aStr = localStorage.getItem("taskflow_user_addresses");
      if (aStr) {
        const addrMap = JSON.parse(aStr);
        if (addrMap[baseUser.email.toLowerCase()]) {
          const entry = addrMap[baseUser.email.toLowerCase()];
          baseUser.address = entry.address || baseUser.address || "";
          baseUser.isAddressLocked = entry.isLocked ?? baseUser.isAddressLocked;
        }
      }
    } catch {}

    // Tìm thông tin chi tiết từ taskflow_users
    try {
      const usersStr = localStorage.getItem("taskflow_users");
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const matched = users.find(
          (u: { email: string }) => u.email.toLowerCase() === baseUser.email.toLowerCase()
        );
        if (matched) {
          baseUser = {
            ...baseUser,
            dob: matched.dob || baseUser.dob || "",
            isDobLocked: matched.isDobLocked ?? baseUser.isDobLocked,
            phone: matched.phone || baseUser.phone || "",
            address: matched.address || baseUser.address || "",
            isAddressLocked: matched.isAddressLocked ?? baseUser.isAddressLocked,
            lastAvatarChangedDate: matched.lastAvatarChangedDate || baseUser.lastAvatarChangedDate,
            lastNameChangedDate: matched.lastNameChangedDate || baseUser.lastNameChangedDate,
            avatar: matched.avatar || baseUser.avatar,
          };
        }
      }
    } catch {}

    // Đọc số điện thoại từ taskflow_user_phones
    try {
      const pStr = localStorage.getItem("taskflow_user_phones");
      if (pStr) {
        const phoneMap = JSON.parse(pStr);
        if (phoneMap[baseUser.email.toLowerCase()]) {
          baseUser.phone = phoneMap[baseUser.email.toLowerCase()];
        }
      }
    } catch {}

    setCurrentUser(baseUser);
    setNameInput(baseUser.fullName);
    setPhoneInput(baseUser.phone || "");
    setAddressInput(baseUser.address || "");

    // Khởi tạo ngày / tháng / năm cho ô nhập
    if (baseUser.dob) {
      const parts = baseUser.dob.split("/");
      if (parts.length === 3) {
        setDayVal(parts[0]);
        setMonthVal(parts[1]);
        setYearVal(parts[2]);
        const parsedM = parseInt(parts[1], 10);
        const parsedY = parseInt(parts[2], 10);
        if (!isNaN(parsedM) && parsedM >= 1 && parsedM <= 12) setCalMonth(parsedM - 1);
        if (!isNaN(parsedY) && parsedY >= 1900) setCalYear(parsedY);
      }
    } else {
      setDayVal("");
      setMonthVal("");
      setYearVal("");
    }

    if (baseUser.avatar) {
      setAvatarPreview(baseUser.avatar);
    }
  };

  // Đọc thông tin từ localStorage khi tải trang & lắng nghe cập nhật thời gian thực
  useEffect(() => {
    loadProfileData();

    const handleProfileSync = () => loadProfileData();
    window.addEventListener("taskflow_profile_updated", handleProfileSync);
    window.addEventListener("storage", handleProfileSync);

    return () => {
      window.removeEventListener("taskflow_profile_updated", handleProfileSync);
      window.removeEventListener("storage", handleProfileSync);
    };
  }, []);

  // Tính chữ cái đại diện avatar (chữ cái đầu của TÊN GỌI)
  const getInitials = (name: string) => {
    if (!name) return "K";
    const parts = name.trim().split(/\s+/);
    const lastName = parts[parts.length - 1];
    return lastName ? lastName.charAt(0).toUpperCase() : "K";
  };

  // Xử lý chọn ảnh đại diện (.PNG, .JPG, .JPEG)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isAvatarLockedToday) {
      setErrorMsg("🔒 Bạn đã thay đổi ảnh đại diện hôm nay. Quy định tối đa 1 lần / ngày!");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng (.PNG, .JPG, .JPEG)
    const validExtensions = [".png", ".jpg", ".jpeg"];
    const fileName = file.name.toLowerCase();
    const isValidFormat = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidFormat) {
      setErrorMsg("⚠️ Định dạng ảnh không hợp lệ! Hệ thống chỉ chấp nhận định dạng .PNG, .JPG hoặc .JPEG.");
      return;
    }

    // Giới hạn kích thước tối đa 3MB
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg("⚠️ Dung lượng ảnh vượt quá 3MB! Vui lòng chọn ảnh nhẹ hơn.");
      return;
    }

    // Đọc ảnh và tạo preview base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setNewAvatarSelected(result);
    };
    reader.readAsDataURL(file);
  };

  // Lưu thông tin cá nhân khi bấm Xác nhận
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setErrorMsg("Họ và tên không được để trống!");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Kiểm tra số điện thoại nếu nhập lần đầu
    let finalPhone = currentUser.phone || "";
    if (!isPhoneLockedForever && phoneInput.trim()) {
      const cleanPhone = phoneInput.trim().replace(/\s+/g, "");
      if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(cleanPhone)) {
        setErrorMsg("Số điện thoại không đúng định dạng (Ví dụ: 0912345678)!");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      finalPhone = cleanPhone;
    }

    // Kiểm tra Ngày / Tháng / Năm sinh nếu nhập lần đầu
    let finalDob = currentUser.dob || "";
    let isDobNowLocked = currentUser.isDobLocked || false;

    if (!isDobLockedForever) {
      if (dayVal || monthVal || yearVal) {
        const d = parseInt(dayVal, 10);
        const m = parseInt(monthVal, 10);
        const y = parseInt(yearVal, 10);

        if (isNaN(d) || d < 1 || d > 31) {
          setErrorMsg("Ngày sinh không hợp lệ (từ 01 đến 31)!");
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        if (isNaN(m) || m < 1 || m > 12) {
          setErrorMsg("Tháng sinh không hợp lệ (từ 01 đến 12)!");
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const currentYear = new Date().getFullYear();
        if (isNaN(y) || y < 1920 || y > currentYear) {
          setErrorMsg(`Năm sinh không hợp lệ (từ 1920 đến ${currentYear})!`);
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        finalDob = `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
        isDobNowLocked = true; // Khóa vĩnh viễn sau lần lưu đầu tiên
      }
    }

    // Kiểm tra Địa chỉ thường trú nếu nhập lần đầu hoặc khi được Admin mở khóa
    let finalAddress = currentUser.address || "";
    let isAddressNowLocked = currentUser.isAddressLocked || false;

    if (!isAddressLockedForever) {
      if (addressInput.trim()) {
        finalAddress = addressInput.trim();
        isAddressNowLocked = true; // Khóa vĩnh viễn sau khi lưu
      }
    }

    // Kiểm tra xem có thay đổi Tên không
    const isNameChanged = trimmedName !== currentUser.fullName;
    if (isNameChanged && isNameLockedToday) {
      setErrorMsg("🔒 Tên người dùng đã được cập nhật hôm nay. Bạn không thể đổi thêm trong ngày!");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Kiểm tra xem có thay đổi Avatar không
    const isAvatarChanged = Boolean(newAvatarSelected && newAvatarSelected !== currentUser.avatar);
    if (isAvatarChanged && isAvatarLockedToday) {
      setErrorMsg("🔒 Bạn đã thay đổi ảnh đại diện hôm nay. Không thể đổi thêm trong ngày!");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSaving(true);

    try {
      // Chuẩn bị dữ liệu cập nhật
      const updatedUser: UserData = {
        ...currentUser,
        fullName: trimmedName,
        phone: finalPhone,
        dob: finalDob,
        isDobLocked: isDobNowLocked,
        address: finalAddress,
        isAddressLocked: isAddressNowLocked,
        avatar: newAvatarSelected ? newAvatarSelected : currentUser.avatar,
        lastAvatarChangedDate: isAvatarChanged ? todayStr : currentUser.lastAvatarChangedDate,
        lastNameChangedDate: isNameChanged ? todayStr : currentUser.lastNameChangedDate,
      };

      // 1. Cập nhật taskflow_current_user
      localStorage.setItem("taskflow_current_user", JSON.stringify(updatedUser));

      // 2. Cập nhật từ điển ngày sinh taskflow_user_dobs
      if (finalDob) {
        try {
          const dStr = localStorage.getItem("taskflow_user_dobs");
          const dobMap = dStr ? JSON.parse(dStr) : {};
          dobMap[updatedUser.email.toLowerCase()] = {
            dob: finalDob,
            isLocked: isDobNowLocked,
          };
          localStorage.setItem("taskflow_user_dobs", JSON.stringify(dobMap));
        } catch {}
      }

      // 3. Cập nhật từ điển địa chỉ taskflow_user_addresses
      if (finalAddress) {
        try {
          const aStr = localStorage.getItem("taskflow_user_addresses");
          const addrMap = aStr ? JSON.parse(aStr) : {};
          addrMap[updatedUser.email.toLowerCase()] = {
            address: finalAddress,
            isLocked: isAddressNowLocked,
          };
          localStorage.setItem("taskflow_user_addresses", JSON.stringify(addrMap));
        } catch {}
      }

      // 4. Cập nhật từ điển số điện thoại taskflow_user_phones
      if (finalPhone) {
        try {
          const pStr = localStorage.getItem("taskflow_user_phones");
          const phoneMap = pStr ? JSON.parse(pStr) : {};
          phoneMap[updatedUser.email.toLowerCase()] = finalPhone;
          localStorage.setItem("taskflow_user_phones", JSON.stringify(phoneMap));
        } catch {}
      }

      // 5. Cập nhật taskflow_users
      try {
        const usersStr = localStorage.getItem("taskflow_users");
        let users = [];
        if (usersStr) {
          try { users = JSON.parse(usersStr); } catch {}
        }
        const idx = users.findIndex(
          (u: { email: string }) => u.email.toLowerCase() === updatedUser.email.toLowerCase()
        );
        if (idx !== -1) {
          users[idx].fullName = updatedUser.fullName;
          users[idx].phone = updatedUser.phone;
          users[idx].dob = updatedUser.dob;
          users[idx].isDobLocked = updatedUser.isDobLocked;
          users[idx].address = updatedUser.address;
          users[idx].isAddressLocked = updatedUser.isAddressLocked;
          users[idx].avatar = updatedUser.avatar;
          users[idx].lastAvatarChangedDate = updatedUser.lastAvatarChangedDate;
          users[idx].lastNameChangedDate = updatedUser.lastNameChangedDate;
        } else {
          users.push({
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            dob: updatedUser.dob,
            isDobLocked: updatedUser.isDobLocked,
            address: updatedUser.address,
            isAddressLocked: updatedUser.isAddressLocked,
            avatar: updatedUser.avatar,
            role: updatedUser.role || "user",
            lastAvatarChangedDate: updatedUser.lastAvatarChangedDate,
            lastNameChangedDate: updatedUser.lastNameChangedDate,
            createdAt: new Date().toISOString(),
          });
        }
        localStorage.setItem("taskflow_users", JSON.stringify(users));
      } catch {}

      // 6. Cập nhật taskflow_members_list đồng bộ số điện thoại, ngày sinh & địa chỉ sang Admin
      try {
        const membersStr = localStorage.getItem("taskflow_members_list");
        let members = membersStr ? JSON.parse(membersStr) : [];
        const mIdx = members.findIndex(
          (m: { email: string }) => m.email.toLowerCase() === updatedUser.email.toLowerCase()
        );
        if (mIdx !== -1) {
          members[mIdx].name = updatedUser.fullName;
          members[mIdx].initials = getInitials(updatedUser.fullName);
          members[mIdx].phone = updatedUser.phone;
          members[mIdx].dob = updatedUser.dob;
          members[mIdx].address = updatedUser.address;
          members[mIdx].isDobLocked = updatedUser.isDobLocked;
          members[mIdx].isAddressLocked = updatedUser.isAddressLocked;
        } else {
          members.push({
            name: updatedUser.fullName,
            initials: getInitials(updatedUser.fullName),
            email: updatedUser.email,
            phone: updatedUser.phone,
            dob: updatedUser.dob,
            address: updatedUser.address,
            isDobLocked: updatedUser.isDobLocked,
            isAddressLocked: updatedUser.isAddressLocked,
            admin: updatedUser.role === "admin",
            tasks: 0,
            joined: "Tham gia gần đây",
            color: "bg-indigo-100 text-main",
          });
        }
        localStorage.setItem("taskflow_members_list", JSON.stringify(members));
      } catch {}

      // Phát sự kiện cập nhật profile để Header và các component cập nhật tức thì (0ms latency)
      window.dispatchEvent(
        new CustomEvent("taskflow_profile_updated", {
          detail: {
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            phone: updatedUser.phone,
            dob: updatedUser.dob,
            address: updatedUser.address,
          },
        })
      );
      window.dispatchEvent(new Event("taskflow_members_updated"));

      setCurrentUser(updatedUser);
      setNewAvatarSelected(null);
      setSuccessMsg("✓ Cập nhật thông tin cá nhân thành công!");
      setShowSuccessModal(true);
    } catch {
      setErrorMsg("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  // Tính toán các ngày cho lịch (Calendar)
  const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(calYear, calMonth, 1).getDay() + 6) % 7; // Thứ 2 = 0, CN = 6
  const prevMonthDaysCount = new Date(calYear, calMonth, 0).getDate();

  const prevDays = Array.from(
    { length: firstDayOfWeek },
    (_, i) => prevMonthDaysCount - firstDayOfWeek + 1 + i
  );
  const currentDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const totalCells = firstDayOfWeek + daysInCurrentMonth;
  const nextDaysCount = (7 - (totalCells % 7)) % 7;
  const nextDays = Array.from({ length: nextDaysCount }, (_, i) => i + 1);

  // Chọn ngày trên lịch
  const handleSelectDay = (d: number) => {
    const formattedDay = String(d).padStart(2, "0");
    const formattedMonth = String(calMonth + 1).padStart(2, "0");
    const formattedYear = String(calYear);

    setDayVal(formattedDay);
    setMonthVal(formattedMonth);
    setYearVal(formattedYear);
    setShowCalendar(false);
  };

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

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb & Tiêu đề */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/user/task/list" className="hover:text-main transition">
              Không gian làm việc
            </Link>
            <LuChevronRight size={14} />
            <span className="text-slate-700">Hồ sơ cá nhân</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Thông tin cá nhân
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý thông tin tài khoản, ảnh đại diện và hồ sơ định danh của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Thông báo lỗi & thành công ở đầu trang */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <LuShieldAlert size={18} className="shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-red-700 p-1 cursor-pointer"
            >
              <LuX size={16} />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <LuCheck size={18} className="shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg(null)}
              className="text-emerald-400 hover:text-emerald-700 p-1 cursor-pointer"
            >
              <LuX size={16} />
            </button>
          </div>
        )}

        {/* Form chỉnh sửa */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Ảnh đại diện & Thông tin cơ bản */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-800 pb-4 border-b border-slate-100">
              Ảnh đại diện & Định danh
            </h2>

            <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Vùng Avatar */}
              <div className="relative group shrink-0">
                <div className="h-28 w-28 rounded-full ring-4 ring-slate-100 shadow-md bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-bold text-3xl grid place-items-center overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={currentUser.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(nameInput || currentUser.fullName)}</span>
                  )}
                </div>

                {/* Nút bấm tải ảnh */}
                <button
                  type="button"
                  disabled={isAvatarLockedToday}
                  onClick={() => fileInputRef.current?.click()}
                  title={
                    isAvatarLockedToday
                      ? "Đã đổi hôm nay (Tối đa 1 lần/ngày)"
                      : "Thay đổi ảnh đại diện (.PNG, .JPG, .JPEG)"
                  }
                  className={`absolute bottom-0 right-0 p-2.5 rounded-full text-white shadow-lg transition-transform ${
                    isAvatarLockedToday
                      ? "bg-slate-400 cursor-not-allowed opacity-80"
                      : "bg-main hover:scale-105 cursor-pointer hover:bg-main/90"
                  }`}
                >
                  <LuCamera size={16} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png, .jpg, .jpeg, image/png, image/jpeg"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>

              {/* Hướng dẫn quy định ảnh đại diện */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-bold text-slate-800 text-base">Ảnh hồ sơ thành viên</h3>
                  {isAvatarLockedToday ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      🔒 Đã đổi hôm nay (Khóa đến ngày mai)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Có thể đổi ảnh (1 lần/ngày)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Chỉ chấp nhận các định dạng ảnh: <strong>.PNG</strong>, <strong>.JPG</strong>, hoặc <strong>.JPEG</strong>. Dung lượng tối đa: <strong>3MB</strong>.
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-slate-400 justify-center sm:justify-start">
                  <span>• Cập nhật có hiệu lực ngay lập tức trên thanh Header.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Thông tin chi tiết */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-800 pb-4 border-b border-slate-100">
              Chi tiết tài khoản & Thông tin định danh
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ và tên */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Họ và tên *
                  </label>
                  {isNameLockedToday && (
                    <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                      <LuLock size={12} />
                      Đã đổi hôm nay
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={isNameLockedToday}
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Nhập họ và tên đầy đủ..."
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none transition ${
                      isNameLockedToday
                        ? "border-slate-200 bg-slate-100/80 text-slate-500 cursor-not-allowed"
                        : "border-slate-200 bg-white text-slate-800 focus:border-main focus:ring-1 focus:ring-main"
                    }`}
                  />
                  <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
                <p className="text-[11px] text-slate-400">
                  {isNameLockedToday ? (
                    <span className="text-amber-600">
                      🔒 Bạn đã đổi họ tên hôm nay. Quy định tối đa 1 lần / ngày.
                    </span>
                  ) : (
                    "💡 Có thể thay đổi họ tên (Quy định tối đa 1 lần / ngày)."
                  )}
                </p>
              </div>

              {/* Email (CỐ ĐỊNH, KHÔNG ĐỔI) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Địa chỉ Gmail (Định danh tài khoản)
                  </label>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <LuLock size={12} />
                    Cố định
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    readOnly
                    value={currentUser.email}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100/80 py-2.5 pl-9 pr-8 text-sm text-slate-500 cursor-not-allowed select-none font-mono"
                  />
                  <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <LuLock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                </div>
                <p className="text-[11px] text-slate-400">
                  🔒 Địa chỉ Gmail định danh tài khoản, không thể thay đổi theo chính sách bảo mật.
                </p>
              </div>

              {/* Ngày / tháng / năm sinh (CHỈ ĐẶT 1 LẦN, LIA CHUỘT RA LỊCH, GÕ THÁNG/NĂM TỰ CHUYỂN LỊCH) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Ngày / tháng / năm sinh
                  </label>
                  {isDobLockedForever ? (
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                      <LuShieldCheck size={12} />
                      Đã xác thực
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-600 font-semibold">
                      Chỉ đặt 1 lần duy nhất!
                    </span>
                  )}
                </div>

                {/* Khung nhập Ngày/Tháng/Năm & Container Lịch */}
                <div
                  ref={calendarContainerRef}
                  className="relative"
                  onMouseEnter={() => {
                    if (!isDobLockedForever) setShowCalendar(true);
                  }}
                >
                  <div
                    className={`w-full rounded-xl border flex items-center justify-between px-3 py-2 text-sm transition ${
                      isDobLockedForever
                        ? "border-slate-200 bg-slate-100/80 text-slate-500 cursor-not-allowed select-none"
                        : "border-slate-200 bg-white text-slate-800 focus-within:border-main focus-within:ring-2 focus-within:ring-main/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <LuCalendar
                        className={isDobLockedForever ? "text-slate-400" : "text-main"}
                        size={17}
                      />

                      {isDobLockedForever ? (
                        <span className="font-mono text-slate-600 text-sm font-medium">
                          {currentUser.dob || "Chưa thiết lập"}
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 font-mono text-sm text-slate-700">
                          {/* Ô nhập Ngày */}
                          <input
                            ref={dayRef}
                            type="text"
                            maxLength={2}
                            value={dayVal}
                            placeholder="DD"
                            onFocus={() => setShowCalendar(true)}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setDayVal(val);
                              if (val.length === 2 && monthRef.current) {
                                monthRef.current.focus();
                              }
                            }}
                            className="w-7 text-center outline-none bg-transparent placeholder:text-slate-300 font-semibold"
                          />
                          <span className="text-slate-300">/</span>

                          {/* Ô nhập Tháng (Tự động chuyển lịch sang tháng tương ứng) */}
                          <input
                            ref={monthRef}
                            type="text"
                            maxLength={2}
                            value={monthVal}
                            placeholder="MM"
                            onFocus={() => setShowCalendar(true)}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setMonthVal(val);
                              // Yêu cầu 1: Khi gõ tháng (ví dụ 05), lịch tự động chuyển sang tháng 5
                              if (val) {
                                const m = parseInt(val, 10);
                                if (m >= 1 && m <= 12) {
                                  setCalMonth(m - 1);
                                }
                              }
                              if (val.length === 2 && yearRef.current) {
                                yearRef.current.focus();
                              }
                            }}
                            className="w-7 text-center outline-none bg-transparent placeholder:text-slate-300 font-semibold text-main"
                          />
                          <span className="text-slate-300">/</span>

                          {/* Ô nhập Năm (Tự động chuyển lịch sang năm tương ứng) */}
                          <input
                            ref={yearRef}
                            type="text"
                            maxLength={4}
                            value={yearVal}
                            placeholder="YYYY"
                            onFocus={() => setShowCalendar(true)}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setYearVal(val);
                              // Yêu cầu 1: Khi gõ năm (ví dụ 2000), lịch tự động chuyển sang năm 2000
                              if (val.length === 4) {
                                const y = parseInt(val, 10);
                                if (y >= 1900 && y <= 2099) {
                                  setCalYear(y);
                                }
                              }
                            }}
                            className="w-12 text-center outline-none bg-transparent placeholder:text-slate-300 font-semibold"
                          />
                        </div>
                      )}
                    </div>

                    {isDobLockedForever ? (
                      <LuLock className="text-slate-400" size={14} />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCalendar((prev) => !prev)}
                        className="text-xs text-main font-semibold hover:underline cursor-pointer px-1 py-0.5"
                      >
                        {showCalendar ? "Đóng" : "Chọn lịch"}
                      </button>
                    )}
                  </div>

                  {/* Dropdown Lịch (Calendar) */}
                  {showCalendar && !isDobLockedForever && (
                    <div className="absolute left-0 top-full mt-2 z-40 w-full sm:w-[320px] rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                        >
                          <LuChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-1.5">
                          {/* Dropdown chọn Tháng */}
                          <select
                            value={calMonth}
                            onChange={(e) => setCalMonth(parseInt(e.target.value, 10))}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 bg-white outline-none cursor-pointer"
                          >
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i} value={i}>
                                Tháng {i + 1}
                              </option>
                            ))}
                          </select>

                          {/* Dropdown chọn Năm */}
                          <select
                            value={calYear}
                            onChange={(e) => setCalYear(parseInt(e.target.value, 10))}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 bg-white outline-none cursor-pointer"
                          >
                            {Array.from({ length: 90 }, (_, i) => 2026 - i).map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                        >
                          <LuChevronRight size={16} />
                        </button>
                      </div>

                      {/* Thứ trong tuần */}
                      <div className="grid grid-cols-7 gap-1 text-center py-2 text-[11px] font-semibold text-slate-400">
                        <span>T2</span>
                        <span>T3</span>
                        <span>T4</span>
                        <span>T5</span>
                        <span>T6</span>
                        <span>T7</span>
                        <span className="text-red-500">CN</span>
                      </div>

                      {/* Lưới các ngày trong tháng */}
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {/* Ngày tháng trước */}
                        {prevDays.map((d, i) => (
                          <div
                            key={`prev-${i}`}
                            className="py-1.5 text-slate-300 font-mono select-none"
                          >
                            {d}
                          </div>
                        ))}

                        {/* Ngày tháng hiện tại */}
                        {currentDays.map((d) => {
                          const isSelected =
                            dayVal === String(d).padStart(2, "0") &&
                            monthVal === String(calMonth + 1).padStart(2, "0") &&
                            yearVal === String(calYear);

                          return (
                            <button
                              key={`cur-${d}`}
                              type="button"
                              onClick={() => handleSelectDay(d)}
                              className={`py-1.5 rounded-lg font-mono font-medium transition cursor-pointer ${
                                isSelected
                                  ? "bg-main text-white font-bold shadow-xs"
                                  : "text-slate-700 hover:bg-indigo-50 hover:text-main"
                              }`}
                            >
                              {d}
                            </button>
                          );
                        })}

                        {/* Ngày tháng sau */}
                        {nextDays.map((d, i) => (
                          <div
                            key={`next-${i}`}
                            className="py-1.5 text-slate-300 font-mono select-none"
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Mẹo: Lia chuột vào khung để mở lịch</span>
                        <button
                          type="button"
                          onClick={() => setShowCalendar(false)}
                          className="text-main font-semibold hover:underline cursor-pointer"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  {isDobLockedForever ? (
                    <span className="text-slate-500 font-medium">
                      🔒 Ngày tháng năm sinh đã được lưu và khóa bảo mật. Chỉ <strong>Quản trị viên (Admin)</strong> mới có quyền chỉnh sửa.
                    </span>
                  ) : (
                    "⚠️ Lưu ý: Bạn chỉ có thể thiết lập ngày sinh một lần duy nhất. Sau khi bấm xác nhận, ngày sinh sẽ bị khóa vĩnh viễn."
                  )}
                </p>
              </div>

              {/* Số điện thoại (Chỉ nhập 1 lần, chỉ Admin mới sửa được) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Số điện thoại liên hệ
                  </label>
                  {isPhoneLockedForever ? (
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                      <LuShieldCheck size={12} />
                      Đã xác thực
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-600 font-semibold">
                      Chỉ nhập 1 lần duy nhất!
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    disabled={isPhoneLockedForever}
                    readOnly={isPhoneLockedForever}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Nhập số điện thoại (Ví dụ: 0912345678)"
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-8 text-sm outline-none transition ${
                      isPhoneLockedForever
                        ? "border-slate-200 bg-slate-100/80 text-slate-600 cursor-not-allowed select-none font-mono"
                        : "border-slate-200 bg-white text-slate-800 focus:border-main focus:ring-1 focus:ring-main"
                    }`}
                  />
                  <LuPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  {isPhoneLockedForever && (
                    <LuLock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  {isPhoneLockedForever ? (
                    <span className="text-slate-500 font-medium">
                      🔒 Số điện thoại đã được lưu và khóa bảo mật. Chỉ <strong>Quản trị viên (Admin)</strong> mới có quyền chỉnh sửa.
                    </span>
                  ) : (
                    "⚠️ Lưu ý quan trọng: Bạn chỉ có thể nhập số điện thoại một lần duy nhất. Sau khi lưu, ô này sẽ bị khóa vĩnh viễn."
                  )}
                </p>
              </div>

              {/* Địa chỉ thường trú / Khu vực */}
              <div
                ref={addressContainerRef}
                onMouseEnter={() => {
                  if (!isAddressLockedForever) setShowAddressList(true);
                }}
                className="flex flex-col gap-1.5 md:col-span-2 relative"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Địa chỉ thường trú / Khu vực (Số đường, Ấp/Xã, Huyện, Tỉnh/Thành)
                  </label>
                  {isAddressLockedForever ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <LuShieldCheck size={13} />
                      Đã xác thực
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Chỉ đặt 1 lần duy nhất!
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    disabled={isAddressLockedForever}
                    readOnly={isAddressLockedForever}
                    value={isAddressLockedForever ? (currentUser.address || "Chưa thiết lập") : addressInput}
                    onChange={(e) => {
                      if (!isAddressLockedForever) {
                        setAddressInput(e.target.value);
                        setShowAddressList(true);
                      }
                    }}
                    onFocus={() => {
                      if (!isAddressLockedForever) setShowAddressList(true);
                    }}
                    placeholder="Gõ số nhà, tên đường, ấp, xã, huyện, tỉnh/thành..."
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-9 text-sm outline-none transition ${
                      isAddressLockedForever
                        ? "border-slate-200 bg-slate-100/80 text-slate-600 cursor-not-allowed select-none font-medium"
                        : "border-slate-200 bg-white text-slate-800 focus:border-main focus:ring-1 focus:ring-main hover:border-slate-300"
                    }`}
                  />
                  <LuMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  {isAddressLockedForever && (
                    <LuLock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  )}

                  {/* Dropdown danh sách gợi ý địa chỉ */}
                  {!isAddressLockedForever && showAddressList && (
                    <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <LuMapPin className="text-main" size={14} />
                          <span>Danh sách địa chỉ chuẩn (Số đường, Ấp/Xã, Huyện, Tỉnh/Thành)</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {filteredAddresses.length} gợi ý
                        </span>
                      </div>

                      <div className="mt-2 max-h-56 overflow-y-auto divide-y divide-slate-50 text-xs">
                        {filteredAddresses.length > 0 ? (
                          filteredAddresses.map((addr, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setAddressInput(addr);
                                setShowAddressList(false);
                              }}
                              className="w-full text-left py-2 px-2.5 hover:bg-indigo-50 hover:text-main rounded-lg transition flex items-start gap-2 group cursor-pointer"
                            >
                              <LuMapPin
                                size={14}
                                className="text-slate-400 group-hover:text-main mt-0.5 shrink-0"
                              />
                              <span className="text-slate-700 group-hover:text-main leading-relaxed">
                                {addr}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-center text-slate-500">
                            <p className="text-xs">Không có gợi ý có sẵn khớp hoàn toàn.</p>
                            {addressInput.trim() && (
                              <button
                                type="button"
                                onClick={() => setShowAddressList(false)}
                                className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-main font-semibold text-xs hover:bg-indigo-100 transition cursor-pointer"
                              >
                                Sử dụng địa chỉ tự nhập: &quot;{addressInput}&quot;
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Mẹo: Gõ &quot;1&quot;, &quot;131&quot;, &quot;ấp 1&quot;, &quot;vĩnh long&quot; để lọc địa chỉ nhanh</span>
                        <button
                          type="button"
                          onClick={() => setShowAddressList(false)}
                          className="text-main font-semibold hover:underline cursor-pointer"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  {isAddressLockedForever ? (
                    <span className="text-slate-500 font-medium">
                      🔒 Địa chỉ thường trú đã được lưu và khóa bảo mật. Chỉ <strong>Quản trị viên (Admin)</strong> mới có quyền mở khóa.
                    </span>
                  ) : (
                    "⚠️ Lưu ý: Bạn chỉ có thể thiết lập địa chỉ thường trú một lần duy nhất. Sau khi bấm xác nhận, địa chỉ sẽ bị khóa vĩnh viễn."
                  )}
                </p>
              </div>
            </div>

            {/* Thông báo cập nhật thành công bên dưới form */}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium flex items-center gap-2">
                <LuCheck size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <LuInfo size={16} className="text-main shrink-0" />
                <span>
                  Các thông tin cho phép chỉnh sửa sẽ được lưu ngay sau khi bạn bấm <strong>Xác nhận</strong>.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/user/task/list")}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Quay lại Task
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-main px-6 py-2.5 text-xs font-bold text-white hover:bg-main/90 transition shadow-sm cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  <LuCheck size={16} />
                  {isSaving ? "Đang lưu..." : "Xác nhận thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Thông Báo Cập Nhật Thành Công */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] rounded-3xl bg-white p-6 shadow-2xl text-center flex flex-col items-center border border-slate-100 animate-in zoom-in-95 duration-200">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-4 shadow-inner">
                <LuCheck />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Cập nhật thành công!
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Thông tin cá nhân và ảnh đại diện đã được lưu và đồng bộ toàn bộ hệ thống ngay lập tức mà không cần tải lại trang.
              </p>

              {/* Tóm tắt thông tin vừa đổi */}
              <div className="mt-4 w-full rounded-2xl bg-slate-50 p-3.5 border border-slate-200/70 text-left flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-bold text-base grid place-items-center shrink-0 overflow-hidden ring-2 ring-pink-100">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(currentUser.fullName)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800 text-sm truncate">
                    {currentUser.fullName}
                  </div>
                  <div className="text-slate-400 text-xs truncate">{currentUser.email}</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentUser.dob && (
                      <div className="text-slate-600 text-[11px] font-medium flex items-center gap-1 font-mono">
                        <span>🎂</span> {currentUser.dob}
                      </div>
                    )}
                    {currentUser.phone && (
                      <div className="text-emerald-700 text-[11px] font-medium flex items-center gap-1">
                        <LuShieldCheck size={13} />
                        <span>SĐT: {currentUser.phone} (Đã khóa)</span>
                      </div>
                    )}
                    {currentUser.address && (
                      <div className="text-slate-600 text-[11px] font-medium flex items-center gap-1 truncate w-full">
                        <span>📍</span> <span className="truncate">{currentUser.address} (Đã khóa)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Ở lại trang
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push("/user/task/list");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-main text-white text-xs font-bold hover:bg-main/90 transition text-center shadow-sm cursor-pointer"
                >
                  Về trang Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
