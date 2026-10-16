@echo off
:: ============================================================
:: Script khởi động TaskFlow Backend – Windows Authentication
:: Chạy file này thay vì gõ lệnh thủ công
:: ============================================================

SET JAVA_HOME=C:\Program Files\Java\jdk-22
SET BACKEND_DIR=%~dp0

echo ============================================
echo  TaskFlow Backend – SQL Server Express
echo  Windows Authentication
echo ============================================
echo.

:: Kiểm tra Java
IF NOT EXIST "%JAVA_HOME%\bin\java.exe" (
    echo [LOI] Khong tim thay Java tai: %JAVA_HOME%
    echo Hay cap nhat JAVA_HOME trong file nay cho dung
    pause
    exit /b 1
)

:: Bước 1: Download dependencies và tìm DLL
echo [1/3] Checking dependencies...
call "%BACKEND_DIR%mvnw.cmd" dependency:resolve -q

:: Bước 2: Tìm và copy mssql-jdbc_auth DLL vào JRE lib
echo [2/3] Setting up Windows Authentication DLL...
SET MSSQL_JAR=%USERPROFILE%\.m2\repository\com\microsoft\sqlserver\mssql-jdbc\12.6.1.jre11\mssql-jdbc-12.6.1.jre11.jar
SET AUTH_DLL_DIR=%BACKEND_DIR%auth-dll

:: Giải nén DLL từ jar nếu chưa có
IF NOT EXIST "%AUTH_DLL_DIR%\mssql-jdbc_auth-12.6.1.x64.dll" (
    mkdir "%AUTH_DLL_DIR%" 2>nul
    powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead('%MSSQL_JAR%'); $entry = $zip.Entries | Where-Object { $_.Name -like '*auth*x64*' }; if($entry){ [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, '%AUTH_DLL_DIR%\mssql-jdbc_auth-12.6.1.x64.dll', $true); Write-Host 'DLL extracted' }; $zip.Dispose()"
)

:: Copy DLL vào JRE path
IF EXIST "%AUTH_DLL_DIR%\mssql-jdbc_auth-12.6.1.x64.dll" (
    copy /Y "%AUTH_DLL_DIR%\mssql-jdbc_auth-12.6.1.x64.dll" "%JAVA_HOME%\bin\" >nul 2>&1
    echo [OK] Windows Auth DLL da duoc cai dat
) ELSE (
    echo [CANH BAO] Khong tim thay auth DLL - Windows Auth co the khong hoat dong
    echo Tham khao: https://docs.microsoft.com/sql/connect/jdbc/building-the-connection-url
)

:: Bước 3: Chạy Spring Boot
echo [3/3] Starting Spring Boot backend...
echo.
echo Backend dang khoi dong tai: http://localhost:8080
echo Nhan Ctrl+C de dung
echo.
call "%BACKEND_DIR%mvnw.cmd" spring-boot:run

pause
