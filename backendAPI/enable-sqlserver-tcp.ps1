# ============================================================
# Script bật TCP/IP cho SQL Server Express
# Chạy với quyền Administrator
# ============================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Bật TCP/IP cho SQL Server Express" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Kiểm tra đang chạy với quyền Admin chưa
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "[LOI] Cần chạy với quyền Administrator!" -ForegroundColor Red
    Write-Host "Nhấp chuột phải vào PowerShell → 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

Write-Host "[OK] Đang chạy với quyền Administrator" -ForegroundColor Green

# --- Bước 1: Bật TCP/IP ---
Write-Host "`n[1/4] Bật TCP/IP protocol..." -ForegroundColor Yellow
try {
    $wmi = [wmiclass]"\\.\root\Microsoft\SqlServer\ComputerManagement16:ServerNetworkProtocol"
    $tcp = $wmi.GetInstances() | Where-Object { $_.ProtocolName -eq "Tcp" -and $_.InstanceName -eq "SQLEXPRESS" }
    $result = $tcp.SetEnable()
    if ($result.ReturnValue -eq 0) {
        Write-Host "[OK] TCP/IP đã được bật!" -ForegroundColor Green
    } else {
        Write-Host "[WARN] SetEnable result: $($result.ReturnValue)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[LOI] $($_)" -ForegroundColor Red
}

# --- Bước 2: Đặt port 1433 ---
Write-Host "`n[2/4] Đặt static port 1433..." -ForegroundColor Yellow
try {
    $regTcp = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp\IPAll"
    Set-ItemProperty -Path $regTcp -Name "TcpPort" -Value "1433"
    Set-ItemProperty -Path $regTcp -Name "TcpDynamicPorts" -Value ""
    Write-Host "[OK] Static port 1433 đã được set!" -ForegroundColor Green
} catch {
    Write-Host "[LOI] $($_)" -ForegroundColor Red
}

# --- Bước 3: Bật SQL Server Browser ---
Write-Host "`n[3/4] Bật SQL Server Browser..." -ForegroundColor Yellow
try {
    Set-Service -Name "SQLBrowser" -StartupType Automatic
    Start-Service -Name "SQLBrowser"
    Write-Host "[OK] SQL Server Browser đã chạy!" -ForegroundColor Green
} catch {
    Write-Host "[WARN] $($_)" -ForegroundColor Yellow
}

# --- Bước 4: Restart SQL Server ---
Write-Host "`n[4/4] Restart SQL Server Express..." -ForegroundColor Yellow
try {
    Restart-Service -Name "MSSQL`$SQLEXPRESS" -Force
    Start-Sleep -Seconds 5
    $status = Get-Service -Name "MSSQL`$SQLEXPRESS"
    Write-Host "[OK] SQL Server Express: $($status.Status)" -ForegroundColor Green
} catch {
    Write-Host "[LOI] $($_)" -ForegroundColor Red
}

# --- Kiểm tra kết quả ---
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Kiểm tra port 1433..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
$tcpTest = Test-NetConnection -ComputerName localhost -Port 1433 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($tcpTest) {
    Write-Host "[SUCCESS] Port 1433 đang lắng nghe - SQL Server sẵn sàng!" -ForegroundColor Green
    Write-Host "`nBây giờ hãy chạy backend:" -ForegroundColor Cyan
    Write-Host '  $env:JAVA_HOME = "C:\Program Files\Java\jdk-22"' -ForegroundColor White
    Write-Host "  .\mvnw.cmd spring-boot:run" -ForegroundColor White
} else {
    Write-Host "[WARN] Port 1433 chưa sẵn sàng. Chờ thêm và thử lại." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Nhấn Enter để thoát"
