-- ============================================================
-- taskflow_db_setup.sql
-- Dữ liệu test cho TaskFlow – chạy trong SSMS
-- ============================================================

USE taskflow_db;
GO

-- Đảm bảo có cột timestamps đại diện tên tìm kiếm và cột updated_at
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'timestamps')
    ALTER TABLE users ADD timestamps VARCHAR(150) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'updated_at')
    ALTER TABLE users ADD updated_at DATETIME2 NULL CONSTRAINT DF_users_updated_at DEFAULT GETDATE();
GO

-- ============================================================
-- 1. USER MẪU (Đầy đủ Admin và User với timestamps tìm kiếm)
-- ============================================================

-- Admin
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'nam.nguyen@taskflow.vn')
    INSERT INTO users (full_name, email, password, role, phone, dob, address,
                       is_dob_locked, is_address_locked, must_change_password, timestamps, created_at, updated_at)
    VALUES (N'Lê Trần Hoàng Nam', 'nam.nguyen@taskflow.vn', 'n0QfX/Sdsldw3GgmbBj0mg==',
            'admin', '0901234567', '01/01/1995', N'Hà Nội', 0, 0, 0, 'le-tran-hoang-nam', GETDATE(), GETDATE());
ELSE
    UPDATE users SET full_name = N'Lê Trần Hoàng Nam', password = 'n0QfX/Sdsldw3GgmbBj0mg==', role = 'admin', timestamps = 'le-tran-hoang-nam', updated_at = GETDATE() WHERE email = 'nam.nguyen@taskflow.vn';

-- User Kiệt
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'kiet.nguyen@taskflow.vn')
    INSERT INTO users (full_name, email, password, role, phone, dob, address,
                       is_dob_locked, is_address_locked, must_change_password, timestamps, created_at, updated_at)
    VALUES (N'Nguyễn Võ Anh Kiệt', 'kiet.nguyen@taskflow.vn', 'n0QfX/Sdsldw3GgmbBj0mg==',
            'user', '0912345678', '15/05/1998', N'TP. Hồ Chí Minh', 0, 0, 0, 'nguyen-vo-anh-kiet', GETDATE(), GETDATE());
ELSE
    UPDATE users SET full_name = N'Nguyễn Võ Anh Kiệt', password = 'n0QfX/Sdsldw3GgmbBj0mg==', role = 'user', timestamps = 'nguyen-vo-anh-kiet', updated_at = GETDATE() WHERE email = 'kiet.nguyen@taskflow.vn';

-- User Linh
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'linh.nguyen@taskflow.vn')
    INSERT INTO users (full_name, email, password, role, phone, dob, address,
                       is_dob_locked, is_address_locked, must_change_password, timestamps, created_at, updated_at)
    VALUES (N'Nguyễn Thùy Linh', 'linh.nguyen@taskflow.vn', '97pEDlmAc2o1HKHbeUAXcw==',
            'user', NULL, NULL, NULL, 0, 0, 0, 'nguyen-thuy-linh', GETDATE(), GETDATE());
ELSE
    UPDATE users SET full_name = N'Nguyễn Thùy Linh', password = '97pEDlmAc2o1HKHbeUAXcw==', role = 'user', timestamps = 'nguyen-thuy-linh', updated_at = GETDATE() WHERE email = 'linh.nguyen@taskflow.vn';

-- User Minh
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'minh.tran@taskflow.vn')
    INSERT INTO users (full_name, email, password, role, phone, dob, address,
                       is_dob_locked, is_address_locked, must_change_password, timestamps, created_at, updated_at)
    VALUES (N'Trần Quang Minh', 'minh.tran@taskflow.vn', '97pEDlmAc2o1HKHbeUAXcw==',
            'user', NULL, NULL, NULL, 0, 0, 0, 'tran-quang-minh', GETDATE(), GETDATE());
ELSE
    UPDATE users SET full_name = N'Trần Quang Minh', password = '97pEDlmAc2o1HKHbeUAXcw==', role = 'user', timestamps = 'tran-quang-minh', updated_at = GETDATE() WHERE email = 'minh.tran@taskflow.vn';

-- ============================================================
-- 2. TASK MẪU
-- ============================================================

IF NOT EXISTS (SELECT 1 FROM tasks WHERE task_code = 'TF-105')
    INSERT INTO tasks (task_code, title, category, deadline, status, created_at)
    VALUES ('TF-105', N'Bộ bài đăng mạng xã hội', N'Thiết kế',
            '2026-10-04 17:00:00', 'active', GETDATE());

IF NOT EXISTS (SELECT 1 FROM tasks WHERE task_code = 'TF-107')
    INSERT INTO tasks (task_code, title, category, deadline, status, created_at)
    VALUES ('TF-107', N'Báo cáo hiệu quả tháng 9', N'Báo cáo',
            '2026-10-04 17:00:00', 'active', GETDATE());

-- ============================================================
-- 3. SUBMISSION MẪU (dùng biến để tự lấy ID, không hardcode)
-- ============================================================

DECLARE @userLinh  BIGINT = (SELECT id FROM users WHERE email = 'linh.nguyen@taskflow.vn');
DECLARE @userMinh  BIGINT = (SELECT id FROM users WHERE email = 'minh.tran@taskflow.vn');
DECLARE @task105   BIGINT = (SELECT id FROM tasks  WHERE task_code = 'TF-105');
DECLARE @task107   BIGINT = (SELECT id FROM tasks  WHERE task_code = 'TF-107');

-- Submission 1: Linh nộp TF-105 – trạng thái "Đã nộp"
IF NOT EXISTS (SELECT 1 FROM submissions WHERE task_id = @task105 AND submitted_by_id = @userLinh)
    INSERT INTO submissions
        (task_id, submitted_by_id, note,
         file_path, original_file_name, file_size,
         status, submitted_at, reviewed_at, reviewed_by_id)
    VALUES
        (@task105, @userLinh,
         N'Em đã hoàn thiện 6 mẫu bài đăng. Nhờ anh xem giúp phần màu sắc và nội dung.',
         'uploads/submissions/sample/bai-dang-mxh.zip',
         'bai-dang-mxh.zip', '2.3 MB',
         'submitted', '2026-10-03 10:15:00', NULL, NULL);

-- Submission 2: Minh nộp TF-107 – trạng thái "Đã nộp"
IF NOT EXISTS (SELECT 1 FROM submissions WHERE task_id = @task107 AND submitted_by_id = @userMinh)
    INSERT INTO submissions
        (task_id, submitted_by_id, note,
         file_path, original_file_name, file_size,
         status, submitted_at, reviewed_at, reviewed_by_id)
    VALUES
        (@task107, @userMinh,
         N'Báo cáo đã bổ sung số liệu của tất cả các kênh và đề xuất cho tháng tới.',
         'uploads/submissions/sample/bao-cao-t9.pdf',
         'bao-cao-t9.pdf', '1.1 MB',
         'submitted', '2026-10-03 09:10:00', NULL, NULL);

-- ============================================================
-- KIỂM TRA KẾT QUẢ SAU KHI CHẠY
-- ============================================================

SELECT
    id, full_name, email, timestamps AS [dai_dien_tim_kiem], role
FROM users;
GO
