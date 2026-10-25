@echo off
if exist "%~dp0backend\run-backend.cmd" (
    cd /d "%~dp0backend"
) else if exist "%~dp0backendAPI\run-backend.cmd" (
    cd /d "%~dp0backendAPI"
)
call run-backend.cmd
