@echo off
setlocal EnableDelayedExpansion
title Nothing for Surface
:: ============================================================
::  NOTHING FOR SURFACE  -  one-click Windows 11 conversion
::
::  What this does (all reversible in Settings > Personalization):
::    1. Dark mode, apps + system
::    2. Nothing-red accent (#D71921), kept OFF Start/taskbar
::    3. Rings wallpaper from the kit
::    4. Installs Rainmeter via winget (if missing)
::    5. Downloads the latest NThing-UI .rmskin and opens its
::       installer - you just click Install
::
::  SmartScreen on first run: More info > Run anyway.
:: ============================================================
echo.
echo   NOTHING FOR SURFACE
echo   -------------------
echo.

:: ---- 1. Dark mode -------------------------------------------------
echo   [1/5] Dark mode...
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v AppsUseLightTheme /t REG_DWORD /d 0 /f >nul
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v SystemUsesLightTheme /t REG_DWORD /d 0 /f >nul

:: ---- 2. Nothing-red accent, off the taskbar -----------------------
:: AccentColorMenu / AccentColor are ABGR dwords: #D71921 -> FF2119D7.
:: AccentPalette is 8 RGBA stops light->dark around the accent.
:: ColorPrevalence=0 keeps red off Start/taskbar (the one-red-element rule).
echo   [2/5] Nothing-red accent...
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Accent" /v AccentPalette /t REG_BINARY /d FBE3E4FFF5B7BAFFEE8A8FFFE75D64FFD71921FFB0141BFF8A1015FF630B0FFF /f >nul
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Accent" /v AccentColorMenu /t REG_DWORD /d 0xFF2119D7 /f >nul
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Accent" /v StartColorMenu /t REG_DWORD /d 0xFF1B14B0 /f >nul
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v ColorPrevalence /t REG_DWORD /d 0 /f >nul
reg add "HKCU\SOFTWARE\Microsoft\Windows\DWM" /v AccentColor /t REG_DWORD /d 0xFF2119D7 /f >nul
reg add "HKCU\SOFTWARE\Microsoft\Windows\DWM" /v ColorPrevalence /t REG_DWORD /d 0 /f >nul

:: ---- 3. Wallpaper -------------------------------------------------
echo   [3/5] Rings wallpaper...
set "WALL=%~dp0..\wallpapers\nothing-rings-surface-2196x1464.png"
if not exist "%WALL%" set "WALL=%~dp0nothing-rings-surface-2196x1464.png"
if exist "%WALL%" (
    copy /y "%WALL%" "%APPDATA%\nothing-wallpaper.png" >nul
    > "%TEMP%\nothing-wall.ps1" (
        echo $sig = 'using System.Runtime.InteropServices; public class W { [DllImport("user32.dll", CharSet=CharSet.Auto^)] public static extern int SystemParametersInfo(int a, int b, string c, int d^); }'
        echo Add-Type -TypeDefinition $sig
        echo [W]::SystemParametersInfo(20, 0, "$env:APPDATA\nothing-wallpaper.png", 3^) ^| Out-Null
    )
    powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\nothing-wall.ps1"
) else (
    echo         wallpaper PNG not found next to the kit - skipped
)

:: Restart Explorer so dark mode + accent apply everywhere
echo         restarting Explorer to apply...
taskkill /f /im explorer.exe >nul 2>&1
start explorer.exe

:: ---- 4. Rainmeter -------------------------------------------------
echo   [4/5] Rainmeter...
winget list --id Rainmeter.Rainmeter >nul 2>&1
if errorlevel 1 (
    winget install -e --id Rainmeter.Rainmeter --accept-source-agreements --accept-package-agreements
) else (
    echo         already installed
)

:: ---- 5. NThing-UI latest release ---------------------------------
:: https://github.com/Runixe786/NThing-UI - NothingOS widgets, taskbar,
:: Start menu, power menu. Free basic, PRO optional. Alternative if you
:: want widgets only: https://github.com/GXX0T/NotWidgets
echo   [5/5] NThing-UI...
> "%TEMP%\nothing-nthing.ps1" (
    echo try {
    echo   $r = Invoke-RestMethod 'https://api.github.com/repos/Runixe786/NThing-UI/releases/latest'
    echo   $a = $r.assets ^| Where-Object { $_.name -like '*.rmskin' } ^| Select-Object -First 1
    echo   if ($a^) { $out = Join-Path $env:TEMP $a.name; Invoke-WebRequest $a.browser_download_url -OutFile $out; Start-Process $out }
    echo   else { Start-Process 'https://github.com/Runixe786/NThing-UI/releases/latest' }
    echo } catch { Start-Process 'https://github.com/Runixe786/NThing-UI/releases/latest' }
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\nothing-nthing.ps1"

echo.
echo   Done. Click Install in the NThing-UI dialog when it opens.
echo   Optional polish: TranslucentTB (Microsoft Store) if you keep the
echo   stock taskbar - skip it if NThing-UI's taskbar is on duty.
echo   Do NOT run Seelen UI / GlazeWM / Windhawk alongside NThing-UI -
echo   they fight over the same shell surfaces.
echo.
pause
