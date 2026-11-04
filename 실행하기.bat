@echo off
chcp 65001 > nul
title Workout Coach Server
cd /d "%~dp0"
node server.js
pause
