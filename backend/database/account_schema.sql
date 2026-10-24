-- ============================================================
-- TaskFlow - Database Schema: Phân hệ Account (Tài khoản)
-- Hệ quản trị cơ sở dữ liệu: Microsoft SQL Server
-- ============================================================

USE taskflow_db;
GO

-- 1. TẠO BẢNG USERS (NẾU CHƯA CÓ)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        full_name NVARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL CONSTRAINT UQ_users_email UNIQUE,
        -- Mật khẩu lưu trữ dưới dạng chuỗi mã hóa đối xứng AES (Base64)
        -- Khi kiểm tra đăng nhập, hệ thống sẽ GIẢI MÃ chuỗi này ra để so khớp
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CONSTRAINT DF_users_role DEFAULT 'user', -- 'admin' hoặc 'user'
        phone VARCHAR(20) NULL,
        dob VARCHAR(20) NULL,
        address NVARCHAR(500) NULL,
        avatar NVARCHAR(MAX) NULL,
        last_avatar_changed_date VARCHAR(20) NULL,
        last_name_changed_date VARCHAR(20) NULL,
        is_dob_locked BIT NOT NULL CONSTRAINT DF_users_is_dob_locked DEFAULT 0,
        is_address_locked BIT NOT NULL CONSTRAINT DF_users_is_address_locked DEFAULT 0,
        must_change_password BIT NOT NULL CONSTRAINT DF_users_must_change_password DEFAULT 0,
        
        -- Trường timestamps: Chuỗi đại diện cho tên người dùng (dạng slug/không dấu) để tìm kiếm dễ dàng
        -- Ví dụ: "Lê Trần Hoàng Nam" -> "le-tran-hoang-nam"
        timestamps VARCHAR(150) NULL,

        -- Thời gian tạo và cập nhật
        created_at DATETIME2 NOT NULL CONSTRAINT DF_users_created_at DEFAULT GETDATE(),
        updated_at DATETIME2 NULL CONSTRAINT DF_users_updated_at DEFAULT GETDATE()
    );
END
ELSE
BEGIN
    -- Nếu cột timestamps chưa có thì thêm mới
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'timestamps')
    BEGIN
        ALTER TABLE users ADD timestamps VARCHAR(150) NULL;
    END

    -- Nếu cột updated_at chưa có thì thêm mới
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'updated_at')
    BEGIN
        ALTER TABLE users ADD updated_at DATETIME2 NULL CONSTRAINT DF_users_updated_at DEFAULT GETDATE();
    END
END
GO

-- 2. TẠO INDEX TỐI ƯU TRUY VẤN VÀ TÌM KIẾM
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_users_email' AND object_id = OBJECT_ID('users'))
BEGIN
    CREATE INDEX idx_users_email ON users(email);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_users_role' AND object_id = OBJECT_ID('users'))
BEGIN
    CREATE INDEX idx_users_role ON users(role);
END
GO

-- Index cho trường timestamps đại diện tên người dùng phục vụ tìm kiếm cực nhanh
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_users_timestamps' AND object_id = OBJECT_ID('users'))
BEGIN
    CREATE INDEX idx_users_timestamps ON users(timestamps);
END
GO

-- 3. DỮ LIỆU ĐỘNG MẪU (CHUẨN UTF-8 VỚI MẬT KHẨU MÃ HÓA AES VÀ TIMESTAMPS TÌM KIẾM)
-- 'Pass@123'  --> 'n0QfX/Sdsldw3GgmbBj0mg=='
-- '123456'    --> '97pEDlmAc2o1HKHbeUAXcw=='

-- Tài khoản Quản trị viên (Admin)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'nam.nguyen@taskflow.vn')
BEGIN
    INSERT INTO users (full_name, email, password, role, phone, dob, address, is_dob_locked, is_address_locked, must_change_password, timestamps, created_at, updated_at)
    VALUES (N'Lê Trần Hoàng Nam', 'nam.nguyen@taskflow.vn', 'n0QfX/Sdsldw3GgmbBj0mg==', 'admin', '0901234567', '01/01/1995', N'Hà Nội', 0, 0, 0, 'le-tran-hoang-nam', GETDATE(), GETDATE());
END
ELSE
BEGIN
    UPDATE users 
    SET full_name = N'Lê Trần Hoàng Nam',
        password = 'n0QfX/Sdsldw3GgmbBj0mg==',
        role = 'admin',
        timestamps = 'le-tran-hoang-nam',
        updated_at = GETDATE()
    WHERE email = 'nam.nguyen@taskflow.vn';
END

-- Tài khoản Thành viên 1 (User)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'kiet.nguyen@taskflow.vn')
BEGIN
    INSERT INTO users (full_name, email, password, role, phone, dob, address, is_dob_locked, is_address_locked, must_change_password, timestamps, created_at, updated_at)
    VALUES (N'Nguyễn Võ Anh Kiệt', 'kiet.nguyen@taskflow.vn', 'n0QfX/Sdsldw3GgmbBj0mg==', 'user', '0912345678', '15/05/1998', N'TP. Hồ Chí Minh', 0, 0, 0, 'nguyen-vo-anh-kiet', GETDATE(), GETDATE());
END
ELSE
BEGIN
    UPDATE users 
    SET full_name = N'Nguyễn Võ Anh Kiệt',
        password = 'n0QfX/Sdsldw3GgmbBj0mg==',
        role = 'user',
        timestamps = 'nguyen-vo-anh-kiet',
        updated_at = GETDATE()
    WHERE email = 'kiet.nguyen@taskflow.vn';
END

-- Tài khoản Thành viên 2 (User)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'linh.nguyen@taskflow.vn')
BEGIN
    INSERT INTO users (full_name, email, password, role, phone, dob, address, is_dob_locked, is_address_locked, must_change_password, timestamps, created_at, updated_at)
    VALUES (N'Nguyễn Thùy Linh', 'linh.nguyen@taskflow.vn', '97pEDlmAc2o1HKHbeUAXcw==', 'user', '0987654321', '20/10/2000', N'Đà Nẵng', 0, 0, 0, 'nguyen-thuy-linh', GETDATE(), GETDATE());
END
ELSE
BEGIN
    UPDATE users 
    SET full_name = N'Nguyễn Thùy Linh',
        password = '97pEDlmAc2o1HKHbeUAXcw==',
        role = 'user',
        timestamps = 'nguyen-thuy-linh',
        updated_at = GETDATE()
    WHERE email = 'linh.nguyen@taskflow.vn';
END

-- Tài khoản Thành viên 3 (User)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'minh.tran@taskflow.vn')
BEGIN
    INSERT INTO users (full_name, email, password, role, phone, dob, address, is_dob_locked, is_address_locked, must_change_password, timestamps, created_at, updated_at)
    VALUES (N'Trần Quang Minh', 'minh.tran@taskflow.vn', '97pEDlmAc2o1HKHbeUAXcw==', 'user', '0933445566', '12/08/1999', N'Hải Phòng', 0, 0, 0, 'tran-quang-minh', GETDATE(), GETDATE());
END
ELSE
BEGIN
    UPDATE users 
    SET full_name = N'Trần Quang Minh',
        password = '97pEDlmAc2o1HKHbeUAXcw==',
        role = 'user',
        timestamps = 'tran-quang-minh',
        updated_at = GETDATE()
    WHERE email = 'minh.tran@taskflow.vn';
END
GO

-- 4. TRUY VẤN KIỂM TRA TÀI KHOẢN SAU KHI CẬP NHẬT
SELECT id, full_name, email, timestamps AS [dai_dien_tim_kiem], role 
FROM users;
GO

