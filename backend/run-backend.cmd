@echo off
:: ============================================================
:: Script khởi động TaskFlow Backend – Windows Authentication (No Password)
:: ============================================================

setlocal enabledelayedexpansion
SET "BACKEND_DIR=%~dp0"

echo ============================================
echo   TaskFlow Backend - SQL Server Express
echo   Windows Authentication (Khong can Password)
echo ============================================
echo.

:: 1. Kiem tra va dat JAVA_HOME
IF NOT EXIST "%JAVA_HOME%\bin\java.exe" (
    IF EXIST "C:\Program Files\Java\jdk-21.0.12.1\bin\java.exe" (
        SET "JAVA_HOME=C:\Program Files\Java\jdk-21.0.12.1"
    ) ELSE IF EXIST "C:\Program Files\Java\latest\bin\java.exe" (
        SET "JAVA_HOME=C:\Program Files\Java\latest"
    ) ELSE (
        FOR /D %%D IN ("C:\Program Files\Java\jdk-21*") DO (
            IF EXIST "%%D\bin\java.exe" SET "JAVA_HOME=%%D"
        )
    )
)

IF NOT EXIST "%JAVA_HOME%\bin\java.exe" (
    echo [LOI] Khong tim thay JDK 21 tai: %JAVA_HOME%
    echo Vui long kiem tra lai duong dan Java.
    pause
    exit /b 1
)

SET "PATH=%JAVA_HOME%\bin;%PATH%"
echo [OK] Su dung Java tai: %JAVA_HOME%

:: 2. Thiet lap auth-dll cho Windows Authentication
SET "AUTH_DLL_DIR=%BACKEND_DIR%auth-dll"
IF NOT EXIST "%AUTH_DLL_DIR%" mkdir "%AUTH_DLL_DIR%" 2>nul

IF NOT EXIST "%AUTH_DLL_DIR%\mssql-jdbc_auth-12.6.1.x64.dll" (
    IF EXIST "%BACKEND_DIR%..\mssql-jdbc_auth\x64\mssql-jdbc_auth-12.6.1.x64.dll" (
        copy /Y "%BACKEND_DIR%..\mssql-jdbc_auth\x64\mssql-jdbc_auth-12.6.1.x64.dll" "%AUTH_DLL_DIR%\" >nul
    )
)

IF EXIST "%AUTH_DLL_DIR%\mssql-jdbc_auth-12.6.1.x64.dll" (
    copy /Y "%AUTH_DLL_DIR%\mssql-jdbc_auth-12.6.1.x64.dll" "%JAVA_HOME%\bin\" >nul 2>&1
    echo [OK] Windows Authentication DLL da san sang!
) ELSE (
    echo [CANH BAO] Khong tim thay mssql-jdbc_auth-12.6.1.x64.dll!
)

:: 3. Kill process cu tren port 8080 (neu co) de tranh conflict
echo [INFO] Kiem tra port 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080 " ^| findstr "LISTENING"') do (
    echo [INFO] Dang tat process cu PID=%%a tren port 8080...
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 2 /nobreak >nul

:: 4. Khoi dong Spring Boot
echo.
echo [OK] Dang khoi dong Spring Boot Backend tai http://localhost:8080...
echo Nhan Ctrl+C de dung.
echo ============================================
echo.

call "%BACKEND_DIR%mvnw.cmd" spring-boot:run

pause
