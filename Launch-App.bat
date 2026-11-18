@echo off
title KrishiChakra App Launcher
echo ======================================================================
echo   KrishiChakra - Smart Rural Machinery Sharing & Resilient Dispatch
echo ======================================================================
echo.
echo Launching application in browser...

:: Check for Google Chrome
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="file:///%~dp0index.html"
    exit
)

:: Check for Microsoft Edge
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="file:///%~dp0index.html"
    exit
)

:: Fallback to default browser
start "" "%~dp0index.html"
exit
