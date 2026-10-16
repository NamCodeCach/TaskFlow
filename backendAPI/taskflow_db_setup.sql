-- ============================================================
-- TaskFlow – SQL Server Database Setup Script
-- Chạy script này trong SSMS trước khi khởi động backend
-- ============================================================

-- 1. Tạo database (nếu chưa có)
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'taskflow_db')
BEGIN
    CREATE DATABASE taskflow_db
        COLLATE Vietnamese_CI_AS;
    PRINT 'Đã tạo database: taskflow_db';
END
ELSE
    PRINT 'Database taskflow_db đã tồn tại.';
GO

USE taskflow_db;
GO

-- ============================================================
-- 2. Bảng users – Tài khoản người dùng
-- (Spring Boot / Hibernate sẽ tự tạo bảng này qua JPA)
-- Script này chỉ để tham khảo cấu trúc và seed dữ liệu mẫu
-- ============================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
BEGIN
    CREATE TABLE users (
        id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
        full_name               NVARCHAR(100)   NOT NULL,
        email                   NVARCHAR(150)   NOT NULL UNIQUE,
        password                NVARCHAR(255)   NOT NULL,
        role                    NVARCHAR(20)    NOT NULL DEFAULT 'user',
        phone                   NVARCHAR(20),
        dob                     NVARCHAR(20),
        address                 NVARCHAR(500),
        avatar                  NVARCHAR(MAX),
        last_avatar_changed_date NVARCHAR(20),
        last_name_changed_date  NVARCHAR(20),
        is_dob_locked           BIT             NOT NULL DEFAULT 0,
        is_address_locked       BIT             NOT NULL DEFAULT 0,
        must_change_password    BIT             NOT NULL DEFAULT 0,
        created_at              DATETIME2       DEFAULT GETDATE()
    );
    PRINT 'Đã tạo bảng: users';
END
GO

-- ============================================================
-- 3. Bảng tasks – Công việc
-- ============================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tasks')
BEGIN
    CREATE TABLE tasks (
        id                  BIGINT IDENTITY(1,1) PRIMARY KEY,
        task_code           NVARCHAR(20),
        title               NVARCHAR(300)   NOT NULL,
        description         NVARCHAR(MAX),
        status              NVARCHAR(20)    NOT NULL DEFAULT 'TODO',
        category            NVARCHAR(100),
        deadline            DATETIME2,
        assigned_to_email   NVARCHAR(150),
        assigned_to_name    NVARCHAR(100),
        created_by_email    NVARCHAR(150),
        created_at          DATETIME2       DEFAULT GETDATE(),
        updated_at          DATETIME2       DEFAULT GETDATE()
    );
    PRINT 'Đã tạo bảng: tasks';
END
GO

-- ============================================================
-- 4. Bảng task_submissions – Bài nộp của user
-- ============================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'task_submissions')
BEGIN
    CREATE TABLE task_submissions (
        id                  BIGINT IDENTITY(1,1) PRIMARY KEY,
        task_code           NVARCHAR(20),
        task_title          NVARCHAR(300),
        submitter_email     NVARCHAR(150)   NOT NULL,
        submitter_name      NVARCHAR(100),
        file_name           NVARCHAR(300),
        stored_file_name    NVARCHAR(400),
        file_path           NVARCHAR(500),
        file_size           BIGINT,
        file_type           NVARCHAR(100),
        note                NVARCHAR(MAX),
        status              NVARCHAR(20)    NOT NULL DEFAULT 'SUBMITTED',
        submitted_at        DATETIME2       DEFAULT GETDATE(),
        reviewed_at         DATETIME2,
        reviewed_by_email   NVARCHAR(150),
        review_note         NVARCHAR(MAX)
    );
    PRINT 'Đã tạo bảng: task_submissions';
END
GO

-- ============================================================
-- 5. Bảng task_logs – Lịch sử hoạt động
-- ============================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'task_logs')
BEGIN
    CREATE TABLE task_logs (
        id          BIGINT IDENTITY(1,1) PRIMARY KEY,
        task_id     BIGINT,
        task_code   NVARCHAR(20),
        action      NVARCHAR(50)    NOT NULL,
        actor_email NVARCHAR(150),
        actor_name  NVARCHAR(100),
        note        NVARCHAR(MAX),
        timestamp   DATETIME2       DEFAULT GETDATE()
    );
    PRINT 'Đã tạo bảng: task_logs';
END
GO

-- ============================================================
-- 6. Seed dữ liệu mẫu – Tài khoản Admin & User mặc định
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'nam.nguyen@taskflow.vn')
BEGIN
    INSERT INTO users (full_name, email, password, role, must_change_password)
    VALUES (N'Lê Trần Hoàng Nam', 'nam.nguyen@taskflow.vn', 'Pass@123', 'admin', 0);
    PRINT 'Đã thêm tài khoản Admin: nam.nguyen@taskflow.vn';
END
GO

IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'kiet.nguyen@taskflow.vn')
BEGIN
    INSERT INTO users (full_name, email, password, role, must_change_password)
    VALUES (N'Nguyễn Võ Anh Kiệt', 'kiet.nguyen@taskflow.vn', 'Pass@123', 'user', 0);
    PRINT 'Đã thêm tài khoản User: kiet.nguyen@taskflow.vn';
END
GO

-- ============================================================
-- 7. Seed dữ liệu mẫu – Tasks
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM tasks WHERE task_code = 'TF-108')
BEGIN
    INSERT INTO tasks (task_code, title, description, status, category, deadline, assigned_to_email, assigned_to_name, created_by_email)
    VALUES (
        'TF-108',
        N'Thiết kế banner',
        N'Thiết kế banner cho chiến dịch tháng 10. Kích thước 1920 × 600 px, sử dụng bộ nhận diện thương hiệu.',
        'TODO',
        N'Thiết kế',
        '2026-10-05 17:00:00',
        'kiet.nguyen@taskflow.vn',
        N'Nguyễn Võ Anh Kiệt',
        'nam.nguyen@taskflow.vn'
    );
    PRINT 'Đã thêm task mẫu: TF-108';
END
GO

IF NOT EXISTS (SELECT 1 FROM tasks WHERE task_code = 'TF-109')
BEGIN
    INSERT INTO tasks (task_code, title, description, status, category, deadline, assigned_to_email, assigned_to_name, created_by_email)
    VALUES (
        'TF-109',
        N'Viết báo cáo Q4',
        N'Tổng hợp số liệu và viết báo cáo tổng kết quý 4 năm 2026.',
        'TODO',
        N'Báo cáo',
        '2026-10-15 17:00:00',
        'kiet.nguyen@taskflow.vn',
        N'Nguyễn Võ Anh Kiệt',
        'nam.nguyen@taskflow.vn'
    );
    PRINT 'Đã thêm task mẫu: TF-109';
END
GO

-- ============================================================
-- 8. Kiểm tra kết quả
-- ============================================================
SELECT 'users' AS [Table], COUNT(*) AS [Count] FROM users
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'task_submissions', COUNT(*) FROM task_submissions
UNION ALL
SELECT 'task_logs', COUNT(*) FROM task_logs;
GO

PRINT '=== Setup hoàn tất! ===';
